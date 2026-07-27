import { FileDown, FileSpreadsheet, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';

export default function LaporanManager() {
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const handleStartDateClick = () => {
    if (startDateRef.current) {
      try { startDateRef.current.showPicker(); }
      catch (e) { startDateRef.current.focus(); }
    }
  };

  const handleEndDateClick = () => {
    if (endDateRef.current) {
      try { endDateRef.current.showPicker(); }
      catch (e) { endDateRef.current.focus(); }
    }
  };

  // Get data dynamically based on mode
  const getExportData = () => {
    const isDummy = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'taruh_url_anda_disini';
    
    if (isDummy) {
      const storedAttend = localStorage.getItem('dummy_attendance');
      if (storedAttend) {
        const allAttend = JSON.parse(storedAttend);
        // Filter out dates outside the range
        return allAttend.filter((a: any) => 
          a.tanggal >= startDate && a.tanggal <= endDate
        ).map((a: any) => ({
          nip: a.teachers?.nip || '-',
          nama: a.teachers?.nama || '-',
          tanggal: a.tanggal,
          jam_masuk: a.jam_masuk,
          status: a.status_keterlambatan
        }));
      }
      return [];
    }
    
    // Fallback if no real DB connected yet
    return [
      { nip: '19800101', nama: 'Pak Akbar, S.M', tanggal: '2026-07-27', jam_masuk: '06:45:00', status: 'TEPAT WAKTU' },
      { nip: '19900202', nama: 'Pak Yanda, S.Pd', tanggal: '2026-07-27', jam_masuk: '07:20:00', status: 'TERLAMBAT' },
    ];
  };

  const handleExportPDF = () => {
    if (!startDate || !endDate) {
      toast.error('Silakan pilih rentang tanggal terlebih dahulu');
      return;
    }
    setLoading(true);
    
    setTimeout(() => {
      try {
        const exportData = getExportData();
        if (exportData.length === 0) {
          toast.error('Tidak ada data pada rentang tanggal tersebut');
          setLoading(false);
          return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Laporan Presensi Pegawai SMAN 1 Menyuke', 14, 20);
        doc.setFontSize(10);
        doc.text(`Periode: ${startDate} s/d ${endDate}`, 14, 28);
        
        const tableData = exportData.map((d: any, i: number) => [
          i + 1, d.nip, d.nama, d.tanggal, d.jam_masuk, d.status
        ]);
        
        autoTable(doc, {
          startY: 35,
          head: [['No', 'NIP', 'Nama Pegawai', 'Tanggal', 'Jam Masuk', 'Status']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [15, 23, 42] } // slate-900
        });
        
        doc.save(`Laporan_Presensi_${startDate}_${endDate}.pdf`);
        toast.success('File PDF berhasil diunduh');
      } catch (err) {
        console.error(err);
        toast.error('Gagal membuat file PDF');
      }
      setLoading(false);
    }, 800);
  };

  const handleExportExcel = async () => {
    if (!startDate || !endDate) {
      toast.error('Silakan pilih rentang tanggal terlebih dahulu');
      return;
    }
    setLoading(true);
    
    setTimeout(async () => {
      const exportData = getExportData();
      if (exportData.length === 0) {
        toast.error('Tidak ada data pada rentang tanggal tersebut');
        setLoading(false);
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Laporan Presensi');
      
      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'NIP', key: 'nip', width: 20 },
        { header: 'Nama Pegawai', key: 'nama', width: 30 },
        { header: 'Tanggal', key: 'tanggal', width: 15 },
        { header: 'Jam Masuk', key: 'jam_masuk', width: 15 },
        { header: 'Status', key: 'status', width: 20 }
      ];
      
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
      worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };
      
      exportData.forEach((d: any, i: number) => {
        worksheet.addRow({ no: i + 1, ...d });
      });
      
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `Laporan_Presensi_${startDate}_${endDate}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('File Excel berhasil diunduh');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Cetak Laporan</h2>
        <p className="text-sm text-slate-500">Ekspor data kehadiran ke dalam format PDF atau Excel.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl shadow-sm">
        <h3 className="font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">Filter Rentang Waktu</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase">Dari Tanggal</label>
            <div 
              onClick={handleStartDateClick}
              className="relative cursor-pointer group"
            >
              <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-700 transition-colors pointer-events-none" />
              <input 
                ref={startDateRef}
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 p-2.5 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm font-medium text-slate-900 cursor-pointer hover:border-slate-400"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase">Sampai Tanggal</label>
            <div 
              onClick={handleEndDateClick}
              className="relative cursor-pointer group"
            >
              <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-700 transition-colors pointer-events-none" />
              <input 
                ref={endDateRef}
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 p-2.5 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm font-medium text-slate-900 cursor-pointer hover:border-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <button 
            onClick={handleExportPDF}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <FileDown size={18} />
            Unduh PDF
          </button>
          <button 
            onClick={handleExportExcel}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <FileSpreadsheet size={18} />
            Unduh Excel
          </button>
        </div>
      </div>
    </div>
  );
}
