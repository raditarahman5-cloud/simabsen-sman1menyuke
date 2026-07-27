import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';

export default function GuruManager() {
  const [gurus, setGurus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', nip: '', nama: '', mata_pelajaran: '' });
  
  // Dummy Mode flag
  const isDummy = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'taruh_url_anda_disini';

  useEffect(() => {
    fetchGurus();
  }, []);

  const defaultTeachers = [
    { id: '1', nip: '19800101', nama: 'Pak Akbar, S.M', mata_pelajaran: 'TU' },
    { id: '2', nip: '19900202', nama: 'Pak Yanda, S.Pd', mata_pelajaran: 'Guru BK' }
  ];

  const fetchGurus = async () => {
    setLoading(true);
    if (isDummy) {
      setTimeout(() => {
        const storedDummy = localStorage.getItem('dummy_teachers');
        if (storedDummy) {
          setGurus(JSON.parse(storedDummy));
        } else {
          setGurus(defaultTeachers);
          localStorage.setItem('dummy_teachers', JSON.stringify(defaultTeachers));
        }
        setLoading(false);
      }, 500);
      return;
    }

    const { data, error } = await supabase.from('teachers').select('*').order('nama', { ascending: true });
    if (error) {
      toast.error('Gagal mengambil data pegawai');
    } else {
      setGurus(data || []);
    }
    setLoading(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Yakin ingin menghapus data ${nama}?`)) {
      if (isDummy) {
        const updated = gurus.filter(g => g.id !== id);
        setGurus(updated);
        localStorage.setItem('dummy_teachers', JSON.stringify(updated));
        toast.success(`(Dummy) Data ${nama} berhasil dihapus.`);
        return;
      }
      // Actual Supabase deletion would go here
      toast.info('Penghapusan via database belum diaktifkan.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDummy) {
      let updated;
      if (formData.id) {
        // Edit Mode
        updated = gurus.map(g => g.id === formData.id ? { ...formData } : g);
        toast.success(`(Dummy) Data ${formData.nama} berhasil diperbarui.`);
      } else {
        // Add Mode
        const newId = Math.random().toString(36).substr(2, 9);
        updated = [...gurus, { ...formData, id: newId }];
        toast.success(`(Dummy) Data ${formData.nama} berhasil ditambahkan.`);
      }
      setGurus(updated);
      localStorage.setItem('dummy_teachers', JSON.stringify(updated));
      setIsModalOpen(false);
      setFormData({ id: '', nip: '', nama: '', mata_pelajaran: '' });
      return;
    }
    // Actual Supabase save would go here
    toast.info('Penyimpanan via database belum diaktifkan.');
  };

  const openModalForAdd = () => {
    setFormData({ id: '', nip: '', nama: '', mata_pelajaran: '' });
    setIsModalOpen(true);
  };

  const openModalForEdit = (guru: any) => {
    setFormData({ id: guru.id, nip: guru.nip, nama: guru.nama, mata_pelajaran: guru.mata_pelajaran });
    setIsModalOpen(true);
  };

  const filteredGurus = gurus.filter(g => 
    g.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.nip.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Kelola Data Pegawai</h2>
          <p className="text-sm text-slate-500">Manajemen data master guru dan tenaga kependidikan.</p>
        </div>
        <button 
          onClick={openModalForAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
        >
          <Plus size={16} /> Tambah Pegawai
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan NIP atau Nama..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b border-slate-200">NIP</th>
                <th className="px-6 py-3 border-b border-slate-200">Nama Pegawai</th>
                <th className="px-6 py-3 border-b border-slate-200">Jabatan / Mapel</th>
                <th className="px-6 py-3 border-b border-slate-200 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : filteredGurus.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Tidak ada data pegawai ditemukan.</td></tr>
              ) : (
                filteredGurus.map((guru) => (
                  <tr key={guru.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">{guru.nip}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{guru.nama}</td>
                    <td className="px-6 py-4 text-slate-600">{guru.mata_pelajaran}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openModalForEdit(guru)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(guru.id, guru.nama)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors" 
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD Pegawai */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 uppercase tracking-wide">
                {formData.id ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase">NIP</label>
                <input 
                  type="text" 
                  required
                  value={formData.nip}
                  onChange={(e) => setFormData({...formData, nip: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm font-medium text-slate-900"
                  placeholder="Contoh: 19800101"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase">Nama Lengkap & Gelar</label>
                <input 
                  type="text" 
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm font-medium text-slate-900"
                  placeholder="Contoh: Pak Akbar, S.M"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase">Jabatan / Mata Pelajaran</label>
                <input 
                  type="text" 
                  required
                  value={formData.mata_pelajaran}
                  onChange={(e) => setFormData({...formData, mata_pelajaran: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm font-medium text-slate-900"
                  placeholder="Contoh: TU"
                />
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded transition-colors text-sm uppercase"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded shadow-md transition-colors text-sm uppercase"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
