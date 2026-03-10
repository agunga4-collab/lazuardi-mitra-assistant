
import React from 'react';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  data: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = {
    totalTasks: data.tasks.length,
    completedTasks: data.tasks.filter(t => t.status === 'Selesai').length,
    pendingTasks: data.tasks.filter(t => t.status === 'Proses').length,
    totalSchools: data.schools.length,
    checkpointReady: data.schools.filter(s => s.checkpointStatus === 'Terdaftar').length,
  };

  const chartData = [
    { name: 'Selesai', count: stats.completedTasks, color: '#10B981' },
    { name: 'Proses', count: stats.pendingTasks, color: '#3B82F6' },
    { name: 'Tertunda', count: data.tasks.filter(t => t.status === 'Tertunda').length, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tugas Selesai</p>
            <p className="text-2xl font-bold text-gray-800">{stats.completedTasks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Dalam Proses</p>
            <p className="text-2xl font-bold text-gray-800">{stats.pendingTasks}</p>
          </div>
        </div>
        <div className="bg-purple-100 p-6 rounded-xl border border-purple-100 shadow-sm flex items-center space-x-4">
          <div className="bg-purple-200 p-3 rounded-lg text-purple-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Sekolah Terdaftar</p>
            <p className="text-2xl font-bold text-gray-800">{stats.checkpointReady} / {stats.totalSchools}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik Tugas Harian</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#F9FAFB'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Terakhir</h3>
          <div className="space-y-4">
            {data.tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0">
                <div className={`mt-1 w-2 h-2 rounded-full ${task.status === 'Selesai' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-800 line-clamp-1">{task.description}</p>
                  <p className="text-xs text-gray-400">{new Date(task.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {data.tasks.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-10">Belum ada aktivitas hari ini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
