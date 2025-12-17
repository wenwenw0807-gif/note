import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie 
} from 'recharts';
import { DailyStats, Task } from '../types';
import { CheckCircle, Clock, TrendingUp, Activity } from 'lucide-react';

interface DashboardProps {
  stats: DailyStats[];
  todayTasks: Task[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ stats, todayTasks }) => {
  const completedCount = todayTasks.filter(t => t.completed).length;
  const totalCount = todayTasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const totalMinutesStudied = stats.reduce((acc, curr) => acc + curr.minutesStudied, 0);

  const pieData = [
    { name: '已完成', value: completedCount },
    { name: '剩余', value: totalCount - completedCount }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">已完成任务</p>
            <h3 className="text-2xl font-bold text-slate-800">{completedCount}/{totalCount}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">学习时长</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats[stats.length - 1]?.minutesStudied || 0}分钟</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">连续打卡</p>
            <h3 className="text-2xl font-bold text-slate-800">5 天</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">专注度</p>
            <h3 className="text-2xl font-bold text-slate-800">85%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">每周学习动态</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="minutesStudied" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Progress Ring */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-2 self-start w-full">今日目标</h3>
          <div className="relative h-48 w-48 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">{progress}%</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">完成</span>
            </div>
          </div>
          <p className="text-center text-slate-500 text-sm mt-4">
            你今天完成了 {totalCount} 个任务中的 {completedCount} 个。继续保持！
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;