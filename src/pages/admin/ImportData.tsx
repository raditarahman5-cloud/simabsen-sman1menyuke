import { UploadCloud, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import ExcelJS from 'exceljs';

export default function ImportData() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // Generate and download a template Excel file
  const handleDownloadTemplate = async (e: React.MouseEvent) => {
    e.preventDefault();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template Guru');
    
    worksheet.columns = [
      { header: 'NIP', key: 'nip', width: 20 },
      { header: 'Nama', key: 'nama', width: 30 },
      { header: 'Jabatan', key: 'jabatan', width: 25 },
    ];
    
    // Styling the header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    
    // Add some sample data
    worksheet.addRow({ nip: '19800101', nama: 'Pak Budi, M.Pd', jabatan: 'Guru Matematika' });
    worksheet.addRow({ nip: '19900202', nama: 'Bu Eka, S.Pd', jabatan: 'Guru Bahasa Inggris' });
    
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Template_Impor_Guru.xlsx';
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) throw new Error('File tidak valid atau kosong');

      let importedCount = 0;
      const newTeachers: any[] = [];
      
      // Assume row 1 is header, start from row 2
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header
        
        const nip = row.getCell(1).text?.trim();
        const nama = row.getCell(2).text?.trim();
        const jabatan = row.getCell(3).text?.trim();
        
        if (nip && nama) {
          newTeachers.push({
            id: Math.random().toString(36).substr(2, 9),
            nip,
            nama,
            mata_pelajaran: jabatan || 'Guru'
          });
          importedCount++;
        }
      });

      if (importedCount === 0) {
        toast.error('Tidak ada data yang valid untuk diimpor. Pastikan format sesuai template.');
      } else {
        // --- MODE DUMMY ---
        const isDummy = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'taruh_url_anda_disini';
        if (isDummy) {
          const storedDummy = localStorage.getItem('dummy_teachers');
          const existingTeachers = storedDummy ? JSON.parse(storedDummy) : [];
          const updatedTeachers = [...existingTeachers, ...newTeachers];
          localStorage.setItem('dummy_teachers', JSON.stringify(updatedTeachers));
          toast.success(`Berhasil mengimpor ${importedCount} guru! (Disimpan di Mode Dummy)`);
        } else {
          toast.info(`Berhasil membaca ${importedCount} baris, namun simpan ke database belum diaktifkan.`);
        }
      }
    } catch (err) {
      toast.error('Gagal membaca file Excel. Pastikan file tidak rusak.');
    } finally {
      setLoading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Impor Data Massal</h2>
        <p className="text-sm text-slate-500">Unggah file Excel untuk menambahkan banyak data guru sekaligus.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl shadow-sm">
        <div 
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${loading ? 'bg-slate-100 opacity-70' : 'bg-slate-50 hover:bg-slate-100'}`}
        >
          <div className={`w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 transition-transform ${loading ? 'animate-pulse' : 'group-hover:scale-110'}`}>
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            {loading ? 'Memproses File...' : 'Klik untuk mengunggah file'}
          </h3>
          <p className="text-sm text-slate-500 mb-4">atau seret dan lepas file ke area ini</p>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-white px-3 py-1 rounded border border-slate-200 shadow-sm">
            Format yang didukung: .XLSX
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
            accept=".xlsx"
            className="hidden" 
          />
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <span className="font-bold block mb-1">Panduan Pengisian:</span>
            Pastikan file Excel Anda memiliki kolom dengan header yang tepat: <code className="bg-amber-100 px-1 rounded font-mono text-amber-900">NIP</code>, <code className="bg-amber-100 px-1 rounded font-mono text-amber-900">Nama</code>, dan <code className="bg-amber-100 px-1 rounded font-mono text-amber-900">Jabatan</code>. <button onClick={handleDownloadTemplate} className="text-blue-600 font-bold hover:underline">Unduh Template Disini</button>
          </div>
        </div>
      </div>
    </div>
  );
}
