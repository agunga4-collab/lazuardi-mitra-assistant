
import React, { useState } from 'react';
import { DailyTask } from '../types';
import { generateProfessionalSummary } from '../services/geminiService';
import { FileText, Sparkles, Copy, Check } from 'lucide-react';

interface AISummaryProps {
  tasks: DailyTask[];
}

const AISummary: React.FC<AISummaryProps> = ({ tasks }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (tasks.length === 0) return;
    setLoading(true);
    try {
      const res = await generateProfessionalSummary(tasks);
      setSummary(res || '');
    } catch (err) {
      console.error(err);
      setSummary('Gagal menghasilkan rangkuman. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles size={24} />
            </div>
            <h2 className="text-xl font-bold">Laporan Harian Profesional</h2>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || tasks.length === 0}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition disabled:opacity-50"
          >
            {loading ? 'Sedang Memproses...' : 'Buat Laporan Naratif'}
          </button>
        </div>
        <p className="text-blue-100 text-sm opacity-90 leading-relaxed">
          Ubah daftar pekerjaan harian Anda menjadi narasi laporan formal yang siap dikirim ke Management Lazuardi GCS menggunakan teknologi Gemini AI.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col relative overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
            <FileText size={16} />
            Hasil Laporan
          </div>
          {summary && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition"
            >
              {copied ? <Check size={14}/> : <Copy size={14} />}
              {copied ? 'Tersalin' : 'Salin Laporan'}
            </button>
          )}
        </div>
        
        <div className="p-8 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium">Merangkai kata-kata profesional...</p>
            </div>
          ) : summary ? (
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed italic font-serif text-lg">
                {summary}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <div className="bg-gray-50 p-6 rounded-full text-gray-300">
                <FileText size={64} />
              </div>
              <div className="max-w-xs">
                <p className="text-gray-500 font-medium">Belum ada laporan</p>
                <p className="text-sm text-gray-400">Klik "Buat Laporan Naratif" untuk memulai transformasi data Anda.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISummary;
