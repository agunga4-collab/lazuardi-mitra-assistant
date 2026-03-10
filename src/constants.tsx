
import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  School, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export const CATEGORIES = [
  'Administrasi',
  'Komunikasi Sekolah',
  'Logistik Checkpoint',
  'Data Entry',
  'Rapat/Koordinasi',
  'Lainnya'
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'tasks', label: 'Laporan Harian', icon: <ClipboardList size={20} /> },
  { id: 'checkpoint', label: 'Checkpoint Test', icon: <School size={20} /> },
  { id: 'summary', label: 'Summary AI', icon: <FileText size={20} /> },
];

export const STATUS_COLORS = {
  'Selesai': 'bg-green-100 text-green-700 border-green-200',
  'Proses': 'bg-blue-100 text-blue-700 border-blue-200',
  'Tertunda': 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export const CHECKPOINT_COLORS = {
  'Terdaftar': 'bg-purple-100 text-purple-700 border-purple-200',
  'Belum Terdaftar': 'bg-gray-100 text-gray-700 border-gray-200',
  'Selesai': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};
