import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const defaultSettings = {
  namaInstansi: 'SMAN 1 MENYUKE',
  penyelenggara: 'Dinas Pendidikan Provinsi Kalimantan Barat',
  jamMasuk: '06:00',
  batasTerlambat: '07:00',
};

export default function SettingsManager() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('app_settings', JSON.stringify(settings));
    setTimeout(() => {
      setLoading(false);
      toast.success('Pengaturan berhasil disimpan!');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Pengaturan Instansi</h2>
        <p className="text-sm text-slate-500">Konfigurasi parameter utama sistem presensi.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700 border-b border-slate-100 pb-2">Identitas Sekolah</h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase">Nama Instansi</label>
            <input
              type="text"
              name="namaInstansi"
              value={settings.namaInstansi}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm font-medium text-slate-900"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase">Penyelenggara</label>
            <input
              type="text"
              name="penyelenggara"
              value={settings.penyelenggara}
              onChange={handleChange}
              className="w-full p-2.5 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm font-medium text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="font-bold text-slate-700 border-b border-slate-100 pb-2">Aturan Waktu</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase">Jam Masuk (Normal)</label>
              <input
                type="time"
                name="jamMasuk"
                value={settings.jamMasuk}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm font-medium text-slate-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase">Batas Keterlambatan</label>
              <input
                type="time"
                name="batasTerlambat"
                value={settings.batasTerlambat}
                onChange={handleChange}
                className="w-full p-2.5 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm font-medium text-slate-900"
              />
            </div>
          </div>
          <p className="text-xs text-amber-600 font-medium bg-amber-50 p-2 rounded border border-amber-200">
            *Pegawai yang absen melewati Batas Keterlambatan akan otomatis ditandai "TERLAMBAT".
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded shadow transition-colors flex items-center gap-2 uppercase tracking-wide text-sm disabled:opacity-70"
          >
            {loading ? 'Menyimpan...' : <><Save size={18} /> Simpan Perubahan</>}
          </button>
        </div>
      </form>
    </div>
  );
}
