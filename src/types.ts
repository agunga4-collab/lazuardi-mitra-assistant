
export type TaskStatus = 'Selesai' | 'Proses' | 'Tertunda';

export interface DailyTask {
  id: string;
  timestamp: number;
  description: string;
  category: string;
  status: TaskStatus;
}

export interface SchoolMitra {
  id: string;
  name: string;
  location: string;
  checkpointStatus: 'Terdaftar' | 'Belum Terdaftar' | 'Selesai';
  studentCount: number;
  lastUpdate: number;
}

export interface AppState {
  tasks: DailyTask[];
  schools: SchoolMitra[];
}
