
import React, { useState, useEffect } from 'react';
import { DailyTask, SchoolMitra, AppState, TaskStatus } from './types';
import { NAV_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import TaskLogger from './components/TaskLogger';
import CheckpointTracker from './components/CheckpointTracker';
import AISummary from './components/AISummary';
import { User, Bell, Search, Settings } from 'lucide-react';

const INITIAL_SCHOOLS: SchoolMitra[] = [
  { id: '1', name: 'SD Lazuardi GCS', location: 'Cinere', checkpointStatus: 'Selesai', studentCount: 45, lastUpdate: Date.now() },
  { id: '2', name: 'SMP Lazuardi GCS', location: 'Cinere', checkpointStatus: 'Terdaftar', studentCount: 38, lastUpdate: Date.now() },
  { id: '3', name: 'SMA Lazuardi GCS', location: 'Cinere', checkpointStatus: 'Terdaftar', studentCount: 32, lastUpdate: Date.now() },
  { id: '4', name: 'Mitra Al-Abrar', location: 'Jakarta Selatan', checkpointStatus: 'Belum Terdaftar', studentCount: 28, lastUpdate: Date.now() },
  { id: '5', name: 'Mitra Cendekia', location: 'Depok', checkpointStatus: 'Belum Terdaftar', studentCount: 52, lastUpdate: Date.now() },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('lazuardi_app_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clear old tasks if the date is different
        const today = new Date().toDateString();
        const filteredTasks = parsed.tasks.filter((t: DailyTask) => 
          new Date(t.timestamp).toDateString() === today
        );
        return { ...parsed, tasks: filteredTasks };
      } catch (e) {
        return { tasks: [], schools: INITIAL_SCHOOLS };
      }
    }
    return { tasks: [], schools: INITIAL_SCHOOLS };
  });

  useEffect(() => {
    localStorage.setItem('lazuardi_app_state', JSON.stringify(state));
  }, [state]);

  const addTask = (taskData: Omit<DailyTask, 'id' | 'timestamp'>) => {
    const newTask: DailyTask = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, status } : t)
    }));
  };

  const updateSchool = (school: SchoolMitra) => {
    setState(prev => ({
      ...prev,
      schools: prev.schools.map(s => s.id === school.id ? school : s)
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={state} />;
      case 'tasks': return <TaskLogger tasks={state.tasks} onAddTask={addTask} onDeleteTask={deleteTask} onUpdateStatus={updateTaskStatus} />;
      case 'checkpoint': return <CheckpointTracker schools={state.schools} onUpdateSchool={updateSchool} />;
      case 'summary': return <AISummary tasks={state.tasks} />;
      default: return <Dashboard data={state} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <h1 className="text-xl font-bold tracking-tight text-blue-900">Mitra Office</h1>
          </div>
          
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Staff Mitra</p>
              <p className="text-[10px] text-gray-500">Lazuardi GCS Cinere</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-10 pb-24 lg:pb-10 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {NAV_ITEMS.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-gray-500 text-sm">Selamat bekerja, Staff Mitra Office.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition"><Bell size={20} /></button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition"><Settings size={20} /></button>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center z-50">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 ${
              activeTab === item.id ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
