
import React, { useState } from 'react';
import { DailyTask, TaskStatus } from '../types';
import { CATEGORIES, STATUS_COLORS } from '../constants';
import { Plus, Trash2, MessageSquare, Sparkles, X, Check } from 'lucide-react';
import { parseWhatsAppTasks } from '../services/geminiService';

interface TaskLoggerProps {
  tasks: DailyTask[];
  onAddTask: (task: Omit<DailyTask, 'id' | 'timestamp'>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

const TaskLogger: React.FC<TaskLoggerProps> = ({ tasks, onAddTask, onDeleteTask, onUpdateStatus }) => {
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [showWaInput, setShowWaInput] = useState(false);
  const [waText, setWaText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;
    onAddTask({ description: desc, category: cat, status: 'Selesai' });
    setDesc('');
  };

  const handleWaImport = async () => {
    if (!waText.trim()) return;
    setIsParsing(true);
    try {
      const parsedTasks = await parseWhatsAppTasks(waText);
      parsedTasks.forEach(task => {
        onAddTask({
          description: task.description || 'Pekerjaan tanpa deskripsi',
          category: task.category || CATEGORIES[0],
          status: (task.status as TaskStatus) || 'Selesai'
        });
      });
      setWaText('');
      setShowWaInput(false);
    } catch (err) {
      alert("Gagal memproses teks. Pastikan format teks cukup jelas.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Input Pekerjaan</h3>
          <button 
            onClick={() => setShowWaInput(!showWaInput)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition ${
              showWaInput ? 'bg-gray-100 text-gray-600' : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {showWaInput ? <X size={16} /> : <MessageSquare size={16} />}
            {showWaInput ? 'Tutup Impor' : 'Impor dari WhatsApp'}
          </button>
        </div>

        {showWaInput ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              value={waText}
              onChange={(e) => setWaText(e.target.value)}
              placeholder="Tempel pesan WhatsApp Anda di sini (contoh: 1. Input data SD Lazuardi, 2. Kirim email ke Mitra Abrar...)"
              className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-sm"
            />
            <div className="flex justify-end">
              <button
                onClick={handleWaImport}
                disabled={isParsing || !waText.trim()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 shadow-md shadow-green-100"
              >
                {isParsing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : <Sparkles size={18} />}
                {isParsing ? 'Menyusun Tabel...' : 'Proses dengan AI'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Apa yang Anda kerjakan?"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Tambah
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Jam</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pekerjaan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.length > 0 ? tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(task.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{task.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{task.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                      className={`px-3 py-1 rounded-full border text-xs font-semibold focus:outline-none ${STATUS_COLORS[task.status]}`}
                    >
                      <option value="Selesai">Selesai</option>
                      <option value="Proses">Proses</option>
                      <option value="Tertunda">Tertunda</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">
                    Belum ada tugas yang dicatat hari ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskLogger;
