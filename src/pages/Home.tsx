import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/id';
import { motion, AnimatePresence } from 'framer-motion';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('id');

export default function Home() {
  const [nip, setNip] = useState('');
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(dayjs().tz('Asia/Jakarta'));
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [settings, setSettings] = useState({
    namaInstansi: 'SMAN 1 MENYUKE',
    penyelenggara: 'Dinas Pendidikan Provinsi Kalimantan Barat',
    batasTerlambat: '07:00',
  });

  useEffect(() => {
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    const timer = setInterval(() => {
      setTime(dayjs().tz('Asia/Jakarta'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip) {
      toast.error('Silakan masukkan NIP');
      return;
    }

    setLoading(true);

    // --- MODE DUMMY ---
    // Aktif secara otomatis jika .env belum dipasang
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'taruh_url_anda_disini') {
      await new Promise(r => setTimeout(r, 600)); // Simulasi loading
      
      const defaultTeachers = [
        { id: '1', nip: '19800101', nama: 'Pak Akbar, S.M', mata_pelajaran: 'TU', foto: null },
        { id: '2', nip: '19900202', nama: 'Pak Yanda, S.Pd', mata_pelajaran: 'Guru BK', foto: null }
      ];
      
      let mockTeachers = defaultTeachers;
      const storedDummy = localStorage.getItem('dummy_teachers');
      if (storedDummy) mockTeachers = JSON.parse(storedDummy);
      else localStorage.setItem('dummy_teachers', JSON.stringify(defaultTeachers));
      
      const found = mockTeachers.find((t: any) => t.nip.trim() === nip.trim());
      if (found) {
        const todayStr = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD');
        const storedAttend = localStorage.getItem('dummy_attendance');
        const mockAttend = storedAttend ? JSON.parse(storedAttend) : [];
        const hasMockCheckedIn = mockAttend.find((a: any) => a.teacher_id === found.id && a.tanggal === todayStr);
        
        if (hasMockCheckedIn) {
          toast.warning('Pemberitahuan: Anda sudah melakukan absensi hari ini.');
          setHasCheckedIn(true);
        } else {
          setHasCheckedIn(false);
        }
        setTeacher(found);
      } else {
        toast.error('NIP Tidak Terdaftar', {
          style: { background: '#ef4444', color: '#fff', border: 'none' }
        });
        setTeacher(null);
      }
      setLoading(false);
      return;
    }
    // --- END MODE DUMMY ---

    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('nip', nip)
        .single();

      if (error || !data) {
        toast.error('NIP Tidak Terdaftar', {
          style: { background: '#ef4444', color: '#fff', border: 'none' }
        });
        setTeacher(null);
      } else {
        const today = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD');
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('*')
          .eq('teacher_id', data.id)
          .eq('tanggal', today)
          .single();

        if (attendanceData) {
          toast.warning('Pemberitahuan: Anda sudah melakukan absensi hari ini.');
          setHasCheckedIn(true);
        } else {
          setHasCheckedIn(false);
        }
        setTeacher(data);
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan');
    }
    setLoading(false);
  };

  const handleAttend = async () => {
    if (!teacher || hasCheckedIn) return;

    setLoading(true);
    const now = dayjs().tz('Asia/Jakarta');
    const today = now.format('YYYY-MM-DD');
    const dayName = now.format('dddd');
    const timeStr = now.format('HH:mm:ss');
    
    const [batasHour, batasMinute] = settings.batasTerlambat.split(':').map(Number);
    const limit = now.hour(batasHour).minute(batasMinute).second(0);
    const isLate = now.isAfter(limit);
    const status_keterlambatan = isLate ? 'TERLAMBAT' : 'TEPAT WAKTU';

    // --- MODE DUMMY ---
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'taruh_url_anda_disini') {
      await new Promise(r => setTimeout(r, 800)); // Simulasi loading server
      
      const newRecord = {
        id: Math.random().toString(36).substr(2, 9),
        teacher_id: teacher.id,
        tanggal: today,
        hari: dayName,
        jam_masuk: timeStr,
        status_hadir: 'HADIR',
        status_keterlambatan: status_keterlambatan,
        teachers: { nip: teacher.nip, nama: teacher.nama } // Helper for easy display in admin
      };
      
      const storedAttend = localStorage.getItem('dummy_attendance');
      const mockAttend = storedAttend ? JSON.parse(storedAttend) : [];
      mockAttend.push(newRecord);
      localStorage.setItem('dummy_attendance', JSON.stringify(mockAttend));
      
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-bold text-lg uppercase">ABSENSI BERHASIL</div>
          <div className="text-sm">Nama: {teacher.nama}</div>
          <div className="text-sm">NIP: {teacher.nip}</div>
          <div className="text-sm">Tanggal: {today}</div>
          <div className="text-sm">Jam: {timeStr}</div>
          <div className={`font-bold mt-1 ${isLate ? 'text-red-600' : 'text-green-600'}`}>
            Status: {status_keterlambatan}
          </div>
          <div className="text-xs text-blue-200 mt-2 italic">*Data disimpan di memori lokal (Mode Dummy)</div>
        </div>,
        { duration: 5000 }
      );
      
      setHasCheckedIn(true);
      setTimeout(() => {
        setTeacher(null);
        setNip('');
      }, 5000);
      setLoading(false);
      return;
    }
    // --- END MODE DUMMY ---

    try {
      const { error } = await supabase
        .from('attendance')
        .insert([
          {
            teacher_id: teacher.id,
            tanggal: today,
            hari: dayName,
            jam_masuk: timeStr,
            status_hadir: 'HADIR',
            status_keterlambatan: status_keterlambatan
          }
        ]);

      if (error) throw error;

      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-bold text-lg uppercase">ABSENSI BERHASIL</div>
          <div className="text-sm">Nama: {teacher.nama}</div>
          <div className="text-sm">NIP: {teacher.nip}</div>
          <div className="text-sm">Tanggal: {today}</div>
          <div className="text-sm">Jam: {timeStr}</div>
          <div className={`font-bold mt-1 ${isLate ? 'text-red-600' : 'text-green-600'}`}>
            Status: {status_keterlambatan}
          </div>
        </div>,
        { duration: 5000 }
      );
      
      setHasCheckedIn(true);
      setTimeout(() => {
        setTeacher(null);
        setNip('');
      }, 5000);

    } catch (err) {
      toast.error('Gagal menyimpan absensi');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Pemerintahan */}
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center p-1 shrink-0">
              {/* Placeholder for Logo */}
              <div className="w-full h-full rounded-full border-2 border-slate-900 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xs sm:text-sm">LOGO</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold uppercase tracking-wide">Sistem Presensi Pegawai</h1>
              <h2 className="text-sm sm:text-base text-slate-300 font-medium">{settings.namaInstansi}</h2>
              <p className="text-xs text-slate-400 hidden sm:block">{settings.penyelenggara}</p>
            </div>
          </div>
          <div className="text-center sm:text-right bg-slate-800/50 px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-slate-700/50">
            <div className="text-xs sm:text-sm text-slate-300 uppercase tracking-wider font-semibold mb-1">
              {time.format('dddd, DD MMMM YYYY')}
            </div>
            <div className="text-2xl sm:text-4xl font-bold font-mono text-amber-400">
              {time.format('HH:mm:ss')}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden"
        >
          <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.092 2.027-.273 3.016m-2.01 4.984c.15.286.307.566.47.842m-1.74-1.12c-.52 1.34-1.2 2.6-2.03 3.73M10.5 7h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              PORTAL PRESENSI
            </h3>
          </div>
          
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!teacher ? (
                <motion.form 
                  key="search-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSearch} 
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center">
                    <label htmlFor="nip" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                      Nomor Induk Pegawai (NIP)
                    </label>
                    <input 
                      id="nip"
                      type="text" 
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      placeholder="Masukkan NIP Anda"
                      className="w-full text-center text-xl sm:text-2xl p-4 border border-slate-300 rounded-lg focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 outline-none transition-all font-mono font-medium text-slate-800 placeholder-slate-400 bg-slate-50"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white uppercase tracking-wider font-bold py-4 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Mencari Data...</>
                    ) : (
                      'Proses Data'
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="teacher-card"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {teacher.foto ? (
                        <img src={teacher.foto} alt="Foto Profil" className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded shadow-sm border border-slate-300" />
                      ) : (
                        <div className="w-20 h-24 sm:w-24 sm:h-28 bg-slate-200 text-slate-500 rounded border border-slate-300 flex items-center justify-center text-4xl font-bold shrink-0 shadow-sm">
                          {teacher.nama.charAt(0)}
                        </div>
                      )}
                      
                      <div className="flex-1 text-center sm:text-left space-y-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase">{teacher.nama}</h3>
                          <p className="text-slate-600 font-mono text-sm mt-0.5">{teacher.nip}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="inline-flex items-center bg-white px-3 py-1.5 rounded text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm">
                            <span className="text-slate-400 mr-2 uppercase text-[10px]">Jabatan</span>
                            {teacher.mata_pelajaran}
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                              AKTIF
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => {
                        setTeacher(null);
                        setHasCheckedIn(false);
                      }}
                      className="w-full sm:w-1/3 bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-lg transition-all"
                    >
                      KEMBALI
                    </button>
                    <button 
                      onClick={handleAttend}
                      disabled={loading || hasCheckedIn}
                      className="w-full sm:w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> MEMPROSES...</>
                      ) : hasCheckedIn ? (
                        'SUDAH PRESENSI HARI INI'
                      ) : (
                        'REKAM PRESENSI SEKARANG'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center space-y-1">
        <p className="text-xs text-slate-500 font-medium">&copy; {new Date().getFullYear()} Sistem Presensi Kepegawaian - {settings.namaInstansi}</p>
        <p className="text-xs text-slate-400 font-medium">Jika ada kendala silakan hubungi Bantuan Teknis: <a href="https://wa.me/6289503230197" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">0895-0323-0197</a></p>
      </footer>
    </div>
  );
}
