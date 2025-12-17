import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CalendarDays, BrainCircuit, Menu, X, BookOpen, Timer as TimerIcon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import Assessment from './components/Assessment';
import Timer from './components/Timer';
import { Task, DailyStats, TaskCategory } from './types';

// Mock Initial Data
const INITIAL_TASKS: Task[] = [
  { id: '1', title: '阅读 BBC 新闻文章', category: TaskCategory.READING, durationMinutes: 15, completed: true },
  { id: '2', title: '学习 10 个商务短语动词', category: TaskCategory.VOCABULARY, durationMinutes: 20, completed: false },
  { id: '3', title: '收听 6 Minute English 播客', category: TaskCategory.LISTENING, durationMinutes: 10, completed: false },
];

const MOCK_STATS: DailyStats[] = [
  { date: '周一', minutesStudied: 45, tasksCompleted: 3, focusScore: 80 },
  { date: '周二', minutesStudied: 30, tasksCompleted: 2, focusScore: 75 },
  { date: '周三', minutesStudied: 60, tasksCompleted: 5, focusScore: 90 },
  { date: '周四', minutesStudied: 20, tasksCompleted: 1, focusScore: 60 },
  { date: '周五', minutesStudied: 50, tasksCompleted: 4, focusScore: 85 },
  { date: '周六', minutesStudied: 90, tasksCompleted: 6, focusScore: 95 },
  { date: '周日', minutesStudied: 45, tasksCompleted: 3, focusScore: 88 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planner' | 'assessment' | 'timer'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lifted State
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // 请求通知权限
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // ESC键退出全屏
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const timerElement = document.querySelector('[data-timer-fullscreen="true"]');
        if (timerElement) {
          const event = new CustomEvent('exitFullscreen');
          timerElement.dispatchEvent(event);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={MOCK_STATS} todayTasks={tasks} />;
      case 'planner':
        return <Planner tasks={tasks} setTasks={setTasks} />;
      case 'assessment':
        return <Assessment />;
      case 'timer':
        return <Timer />;
      default:
        return <Dashboard stats={MOCK_STATS} todayTasks={tasks} />;
    }
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
        activeTab === id 
          ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 overflow-y-auto z-20">
        <div className="p-8 flex items-center gap-2">
           <div className="bg-violet-600 p-2 rounded-lg text-white">
             <BookOpen size={24} />
           </div>
           <h1 className="text-xl font-bold text-slate-800 tracking-tight">LinguaFlow</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem id="dashboard" label="仪表盘" icon={LayoutDashboard} />
          <NavItem id="planner" label="学习规划" icon={CalendarDays} />
          <NavItem id="timer" label="专注倒计时" icon={TimerIcon} />
          <NavItem id="assessment" label="技能自测" icon={BrainCircuit} />
        </nav>

        <div className="p-6">
          <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl p-4 text-white">
            <p className="text-xs font-medium opacity-80 mb-1">小贴士</p>
            <p className="text-sm font-medium leading-relaxed">
              持之以恒是关键。每天15分钟胜过每周一次2小时！
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white z-40 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="bg-violet-600 p-1.5 rounded-lg text-white">
                <BookOpen size={20} />
              </div>
              <h1 className="text-lg font-bold text-slate-800">LinguaFlow</h1>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} className="text-slate-400" />
            </button>
         </div>
         <nav className="p-4 space-y-2">
            <NavItem id="dashboard" label="仪表盘" icon={LayoutDashboard} />
            <NavItem id="planner" label="学习规划" icon={CalendarDays} />
            <NavItem id="timer" label="专注倒计时" icon={TimerIcon} />
            <NavItem id="assessment" label="技能自测" icon={BrainCircuit} />
         </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
           <button onClick={() => setIsMobileMenuOpen(true)}>
             <Menu size={24} className="text-slate-600" />
           </button>
           <span className="font-bold text-slate-800">
             {activeTab === 'dashboard' ? '仪表盘' :
              activeTab === 'planner' ? '学习规划' :
              activeTab === 'timer' ? '专注倒计时' :
              '技能自测'}
           </span>
           <div className="w-8" /> {/* Spacer */}
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Top Bar (Desktop) */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {activeTab === 'dashboard' && '欢迎回来，同学！👋'}
                {activeTab === 'planner' && '你的学习路线图 🗺️'}
                {activeTab === 'timer' && '专注学习时间 ⏰'}
                {activeTab === 'assessment' && '测试你的技能 🎯'}
              </h2>
              <p className="text-slate-500">
                {activeTab === 'dashboard' && "这是你今天的学习动态。"}
                {activeTab === 'planner' && "一步一个脚印，规划你的成功。"}
                {activeTab === 'timer' && "使用番茄工作法，提高学习专注度。"}
                {activeTab === 'assessment' && "利用 AI 发现差距并快速提升。"}
              </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                 <p className="text-sm font-bold text-slate-800">英语水平</p>
                 <p className="text-xs text-slate-500">中级 (B2)</p>
               </div>
               <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                 <img src="https://picsum.photos/100/100" alt="Avatar" className="h-full w-full object-cover" />
               </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;