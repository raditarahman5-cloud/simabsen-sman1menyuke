import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export default function DashboardHome() {
  const [stats, setStats] = useState([
    { label: 'Total Pegawai', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Hadir Hari Ini', value: '0', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Terlambat', value: '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Tidak Hadir', value: '0', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ]);

  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    // Dynamic calculation from dummy mode
    const teachers = JSON.parse(localStorage.getItem('dummy_teachers') || '[]');
    const attendance = JSON.parse(localStorage.getItem('dummy_attendance') || '[]');
    const todayStr = dayjs().format('YYYY-MM-DD');

    const totalPegawai = teachers.length || 0;
    const todayAttendance = attendance.filter((a: any) => a.tanggal === todayStr);
    
    const hadirTepatWaktu = todayAttendance.filter((a: any) => a.status_keterlambatan === 'TEPAT WAKTU').length;
    const terlambat = todayAttendance.filter((a: any) => a.status_keterlambatan === 'TERLAMBAT').length;
    const totalHadir = hadirTepatWaktu + terlambat;
    const tidakHadir = totalPegawai > totalHadir ? totalPegawai - totalHadir : 0;

    setStats([
      { label: 'Total Pegawai', value: totalPegawai.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Hadir Hari Ini', value: hadirTepatWaktu.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Terlambat', value: terlambat.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Tidak Hadir', value: tidakHadir.toString(), icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    ]);

    // calculate weekly data (last 5 days)
    const newWeeklyData = [];
    for (let i = 4; i >= 0; i--) {
      const d = dayjs().subtract(i, 'day');
      const dStr = d.format('YYYY-MM-DD');
      const dayName = d.format('dddd');

      const dayAttend = attendance.filter((a: any) => a.tanggal === dStr);
      const dayHadir = dayAttend.filter((a: any) => a.status_keterlambatan === 'TEPAT WAKTU').length;
      const dayTerlambat = dayAttend.filter((a: any) => a.status_keterlambatan === 'TERLAMBAT').length;
      const dayTotalHadir = dayHadir + dayTerlambat;
      const dayAbsen = totalPegawai > dayTotalHadir ? totalPegawai - dayTotalHadir : 0;

      newWeeklyData.push({
        name: dayName,
        Hadir: dayHadir,
        Terlambat: dayTerlambat,
        Absen: dayAbsen
      });
    }
    setWeeklyData(newWeeklyData);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Ringkasan Sistem</h2>
        <p className="text-sm text-slate-500">Statistik kehadiran pegawai SMAN 1 Menyuke hari ini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[400px]">
        <h3 className="font-bold text-slate-700 mb-6 uppercase tracking-wider">Grafik Kehadiran Mingguan</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Hadir" stackId="a" fill="#16a34a" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Terlambat" stackId="a" fill="#d97706" />
              <Bar dataKey="Absen" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
