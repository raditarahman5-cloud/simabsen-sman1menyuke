import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase/client';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react';

export default function AbsensiManager() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(dayjs().format('YYYY-MM-DD'));
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Dummy Mode flag
  const isDummy = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'taruh_url_anda_disini';

  useEffect(() => {
    fetchAttendance();
  }, [dateFilter]);

  const fetchAttendance = async () => {
    setLoading(true);
    if (isDummy) {
      setTimeout(() => {
        const storedAttend = localStorage.getItem('dummy_attendance');
        if (storedAttend) {
          const allAttend = JSON.parse(storedAttend);
          // Filter by dateFilter
          const filtered = allAttend.filter((a: any) => a.tanggal === dateFilter);
          setAttendance(filtered);
        } else {
          setAttendance([]);
        }
        setLoading(false);
      }, 500);
      return;
    }

    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        teachers (nip, nama)
      `)
      .eq('tanggal', dateFilter)
      .order('jam_masuk', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data absensi');
    } else {
      setAttendance(data || []);
    }
    setLoading(false);
  };

  const handleDateContainerClick = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (e) {
        // Fallback for browsers that don't support showPicker
        dateInputRef.current.focus();
      }
    }
  };

  const handleResetAttendance = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mereset seluruh data absensi (menjadi 0)? Tindakan ini tidak dapat dibatalkan.')) return;
    
    setLoading(true);
    if (isDummy) {
      localStorage.setItem('dummy_attendance', JSON.stringify([]));
      setAttendance([]);
      toast.success('Data absensi berhasil direset menjadi 0');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('attendance')
      .delete()
      .neq('id', 0);

    if (error) {
      toast.error('Gagal mereset data absensi');
    } else {
      setAttendance([]);
      toast.success('Data absensi berhasil direset menjadi 0');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Rekapitulasi Presensi</h2>
          <p className="text-sm text-slate-500">Pantau kehadiran pegawai secara real-time.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-slate-700 uppercase">Tanggal:</label>
            <div 
              onClick={handleDateContainerClick}
              className="relative cursor-pointer group"
            >
              <CalendarIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-700 transition-colors pointer-events-none" />
              <input 
                ref={dateInputRef}
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 p-2.5 w-[160px] border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none text-sm font-bold text-slate-900 shadow-sm cursor-pointer hover:border-slate-400 transition-colors"
              />
            </div>
          </div>
          <button 
            onClick={handleResetAttendance}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-bold uppercase transition-colors shadow-sm w-full sm:w-auto"
          >
            <Trash2 size={16} />
            Reset Data
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b border-slate-200">NIP</th>
                <th className="px-6 py-3 border-b border-slate-200">Nama Pegawai</th>
                <th className="px-6 py-3 border-b border-slate-200">Jam Masuk</th>
                <th className="px-6 py-3 border-b border-slate-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Tidak ada rekam presensi pada tanggal ini.</td></tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{record.teachers?.nip}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{record.teachers?.nama}</td>
                    <td className="px-6 py-4 text-slate-700 font-mono">{record.jam_masuk}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${
                        record.status_keterlambatan === 'TEPAT WAKTU' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {record.status_keterlambatan}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
