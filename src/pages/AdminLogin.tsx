import { useState } from 'react';
import { supabase } from '../supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- MODE DUMMY ---
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'taruh_url_anda_disini') {
      await new Promise(r => setTimeout(r, 800)); // Simulasi loading server
      if (email === 'admin@sman1menyuke.sch.id' && password === 'admin123') {
        toast.success('Login Mode Dummy Berhasil');
        navigate('/admin/dashboard');
      } else {
        toast.error('Email atau password salah (Mode Dummy: gunakan admin@sman1menyuke.sch.id / admin123)');
      }
      setLoading(false);
      return;
    }
    // --- END MODE DUMMY ---
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Email atau password salah');
      } else {
        toast.success('Login berhasil');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan sistem');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-900 text-white shadow-md border-b-4 border-amber-500 py-4 px-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Portal Administrator</h1>
        <h2 className="text-sm text-slate-300">Sistem Presensi SMAN 1 Menyuke</h2>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden"
        >
          <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 text-center">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Otentikasi Petugas</h3>
          </div>

          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Alamat Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="admin@sman1menyuke.sch.id"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Kata Sandi</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white uppercase tracking-wider font-bold py-3 rounded shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> MEMPROSES...</>
                ) : (
                  'MASUK KE SISTEM'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center">
        <p className="text-xs text-slate-500 font-medium">Halaman Khusus Administrator &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
