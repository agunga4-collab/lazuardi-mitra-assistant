
import React, { useState, useMemo } from 'react';
import { SchoolMitra } from '../types';
import { CHECKPOINT_COLORS } from '../constants';
import { Search, SortAsc, SortDesc, Filter, School as SchoolIcon } from 'lucide-react';
import { optimizeSchoolSorting } from '../services/geminiService';

interface CheckpointTrackerProps {
  schools: SchoolMitra[];
  onUpdateSchool: (school: SchoolMitra) => void;
}

const CheckpointTracker: React.FC<CheckpointTrackerProps> = ({ schools, onUpdateSchool }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof SchoolMitra, direction: 'asc' | 'desc'} | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const filteredSchools = useMemo(() => {
    let result = [...schools].filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [schools, searchTerm, sortConfig]);

  const requestSort = (key: keyof SchoolMitra) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getAiAdvice = async () => {
    setLoadingAi(true);
    try {
      const advice = await optimizeSchoolSorting(schools);
      setAiAdvice(advice);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari sekolah mitra..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={getAiAdvice}
          disabled={loadingAi}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          {loadingAi ? 'Menganalisa...' : 'Analisa Prioritas AI'}
        </button>
      </div>

      {aiAdvice && (
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="bg-purple-600 text-white p-2 rounded-lg shrink-0">
              <SchoolIcon size={20} />
            </div>
            <div>
              <h4 className="font-bold text-purple-900 mb-2 text-sm uppercase tracking-wide">Rekomendasi Prioritas AI</h4>
              <p className="text-sm text-purple-800 whitespace-pre-wrap leading-relaxed">{aiAdvice}</p>
              <button 
                onClick={() => setAiAdvice(null)}
                className="mt-3 text-xs font-bold text-purple-600 hover:text-purple-800"
              >
                Tutup Analisa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th onClick={() => requestSort('name')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 flex items-center gap-1">
                  Sekolah {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <SortAsc size={14}/> : <SortDesc size={14}/>)}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi</th>
                <th onClick={() => requestSort('studentCount')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600">
                  Jumlah Siswa
                </th>
                <th onClick={() => requestSort('checkpointStatus')} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600">
                  Status Checkpoint
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-800">{school.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{school.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{school.studentCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${CHECKPOINT_COLORS[school.checkpointStatus]}`}>
                      {school.checkpointStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      className="text-xs border rounded px-2 py-1 outline-none"
                      value={school.checkpointStatus}
                      onChange={(e) => onUpdateSchool({...school, checkpointStatus: e.target.value as any})}
                    >
                      <option value="Belum Terdaftar">Belum Terdaftar</option>
                      <option value="Terdaftar">Terdaftar</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CheckpointTracker;
