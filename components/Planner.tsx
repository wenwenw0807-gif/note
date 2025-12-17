import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';
import { Plus, Trash2, Check, Sparkles, Loader2, Calendar, Clock } from 'lucide-react';
import { generateStudyPlan } from '../services/geminiService';

interface PlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Planner: React.FC<PlannerProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLevel, setUserLevel] = useState('中级 (Intermediate)');
  const [focusArea, setFocusArea] = useState('商务英语');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      category: TaskCategory.READING, // Default
      durationMinutes: 15,
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    const newTasks = await generateStudyPlan(userLevel, focusArea, 45);
    setTasks([...tasks, ...newTasks]);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-yellow-300" /> AI 学习助手
            </h2>
            <p className="text-indigo-100 opacity-90">根据你的水平自动生成个性化计划。</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center bg-white/10 p-2 rounded-lg">
             <select 
               value={userLevel}
               onChange={(e) => setUserLevel(e.target.value)}
               className="bg-transparent text-white border border-white/30 rounded px-2 py-1 text-sm focus:outline-none focus:border-white"
             >
               <option className="text-slate-800" value="初级 (Beginner)">初级</option>
               <option className="text-slate-800" value="中级 (Intermediate)">中级</option>
               <option className="text-slate-800" value="高级 (Advanced)">高级</option>
             </select>
             <select 
               value={focusArea}
               onChange={(e) => setFocusArea(e.target.value)}
               className="bg-transparent text-white border border-white/30 rounded px-2 py-1 text-sm focus:outline-none focus:border-white"
             >
               <option className="text-slate-800" value="综合英语">综合</option>
               <option className="text-slate-800" value="商务英语">商务</option>
               <option className="text-slate-800" value="旅游英语">旅游</option>
               <option className="text-slate-800" value="学术英语">学术</option>
             </select>
             <button 
              onClick={handleGeneratePlan}
              disabled={loading}
              className="bg-white text-indigo-600 px-4 py-1.5 rounded-md font-medium text-sm hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : '生成计划'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Input */}
        <div className="lg:col-span-3">
          <form onSubmit={handleAddTask} className="flex gap-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="手动添加新的学习任务..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
            />
            <button 
              type="submit"
              className="bg-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-lg shadow-violet-200"
            >
              <Plus size={20} /> 添加
            </button>
          </form>
        </div>

        {/* Task List */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Calendar size={20} className="text-slate-400"/> 今日计划
             </h3>
             <span className="text-sm text-slate-500">{tasks.filter(t => t.completed).length}/{tasks.length} 已完成</span>
           </div>
           
           <div className="divide-y divide-slate-100">
             {tasks.length === 0 ? (
               <div className="p-12 text-center text-slate-400">
                 今天还没有任务。使用 AI 助手或手动添加一个！
               </div>
             ) : (
               tasks.map((task) => (
                 <div key={task.id} className={`p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors ${task.completed ? 'bg-slate-50/50' : ''}`}>
                   <button 
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-slate-300 text-transparent hover:border-violet-500'
                    }`}
                   >
                     <Check size={14} />
                   </button>
                   
                   <div className="flex-1">
                     <p className={`font-medium text-slate-800 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                       {task.title}
                     </p>
                     <div className="flex gap-2 mt-1">
                       <span className={`text-xs px-2 py-0.5 rounded-full ${
                         task.category === TaskCategory.VOCABULARY ? 'bg-amber-100 text-amber-700' :
                         task.category === TaskCategory.GRAMMAR ? 'bg-red-100 text-red-700' :
                         task.category === TaskCategory.LISTENING ? 'bg-cyan-100 text-cyan-700' :
                         task.category === TaskCategory.SPEAKING ? 'bg-purple-100 text-purple-700' :
                         'bg-emerald-100 text-emerald-700'
                       }`}>
                         {task.category}
                       </span>
                       <span className="text-xs text-slate-400 flex items-center gap-1">
                         <Clock size={12} /> {task.durationMinutes} 分钟
                       </span>
                     </div>
                   </div>

                   <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;