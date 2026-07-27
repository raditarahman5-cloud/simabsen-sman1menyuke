import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { LayoutDashboard, Users, Clock, FileText, Upload, Settings, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

import DashboardHome from './admin/DashboardHome';
import GuruManager from './admin/GuruManager';
import AbsensiManager from './admin/AbsensiManager';
import LaporanManager from './admin/LaporanManager';
import ImportData from './admin/ImportData';
import SettingsManager from './admin/SettingsManager';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    // --- MODE DUMMY ---
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'taruh_url_anda_disini') {
      toast.success('Sesi Mode Dummy diakhiri');
      navigate('/admin/login');
      return;
    }
    // --- END MODE DUMMY ---

    await supabase.auth.signOut();
    toast.success('Sesi diakhiri');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Ringkasan', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Data Pegawai', path: '/admin/guru', icon: Users },
    { name: 'Rekap Presensi', path: '/admin/absensi', icon: Clock },
    { name: 'Laporan', path: '/admin/laporan', icon: FileText },
    { name: 'Impor Data', path: '/admin/import', icon: Upload },
    { name: 'Pengaturan', path: '/admin/pengaturan', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b-4 border-amber-500 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full border border-slate-900 flex items-center justify-center">
              <span className="text-slate-900 font-bold text-[10px]">LOGO</span>
            </div>
          </div>
          <h2 className="text-base font-bold uppercase tracking-wider">PANEL ADMIN</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-20 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl md:shadow-none
      `}>
        <div className="p-6 border-b border-slate-800 hidden md:block border-t-4 border-amber-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 shrink-0">
              <div className="w-full h-full rounded-full border-2 border-slate-900 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-[10px]">LOGO</span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider leading-tight">PANEL ADMIN</h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">SMAN 1 Menyuke</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-4 md:mt-0">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Menu Utama</div>
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-slate-800 text-white border-l-2 border-amber-500 shadow-sm' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-amber-500' : 'text-slate-500'} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm bg-red-500/10 text-red-400 font-bold rounded border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors uppercase tracking-wider"
          >
            <LogOut size={16} />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-68px)] md:h-screen overflow-hidden bg-slate-50">
        <header className="bg-white border-b border-slate-200 py-4 px-6 sm:px-8 shadow-sm flex items-center justify-between shrink-0 hidden md:flex">
          <h1 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
            {navItems.find(i => location.pathname.includes(i.path))?.name || 'Dashboard'}
          </h1>
          <div className="text-sm font-medium text-slate-500">
            Sistem Informasi Manajemen Presensi
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 min-h-full">
            <Routes>
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="guru" element={<GuruManager />} />
              <Route path="absensi" element={<AbsensiManager />} />
              <Route path="laporan" element={<LaporanManager />} />
              <Route path="import" element={<ImportData />} />
              <Route path="pengaturan" element={<SettingsManager />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
