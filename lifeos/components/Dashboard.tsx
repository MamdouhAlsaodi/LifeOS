import React from 'react';
import { Task, Habit, Domain, Priority } from '../types';
import { CheckCircle, Flame, Target, Zap, Activity, Plus } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  habits: Habit[];
  onAddHabit: () => void;
  onToggleHabit: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, habits, onAddHabit, onToggleHabit }) => {
  const activeTasks = tasks.filter(t => !t.completed);
  const completedToday = tasks.filter(t => t.completed).length; // Mock logic for 'today'
  // Replaced Energy filter with Priority filter
  const priorityTasks = activeTasks.filter(t => t.priority === Priority.P1);
  
  const StatCard = ({ icon: Icon, label, value, bgClass, iconColor, subtext }: any) => (
    <div className="bg-surface-card p-5 rounded-xl shadow-soft border border-brand-50 flex items-start space-x-4">
      <div className={`p-3 rounded-lg ${bgClass}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <h3 className="text-2xl font-bold text-ink-900">{value}</h3>
        {subtext && <p className="text-xs text-brand-600 mt-1">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 overflow-y-auto h-full bg-surface-main/30">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900">Good Morning, Founder.</h1>
          <p className="text-ink-500 mt-1">Ready to execute? You have {activeTasks.length} pending tasks.</p>
        </div>
        <div className="md:text-right flex items-center md:block space-x-4 md:space-x-0">
           <span className="text-sm font-medium text-ink-500">Daily Score</span>
           <div className="text-3xl font-bold text-status-success">85</div>
        </div>
      </div>

      {/* Stats Grid - Using New Palette */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          icon={CheckCircle} 
          label="Tasks Completed" 
          value={completedToday} 
          bgClass="bg-green-50"
          iconColor="text-status-success"
          subtext="+20% from yesterday"
        />
        <StatCard 
          icon={Flame} 
          label="Habit Streak" 
          value="12 Days" 
          bgClass="bg-orange-50"
          iconColor="text-status-warning"
          subtext="Best: 24 days"
        />
        <StatCard 
          icon={Zap} 
          label="Focus Hours" 
          value="3.5h" 
          bgClass="bg-indigo-50"
          iconColor="text-brand-500"
          subtext="Goal: 6h"
        />
        <StatCard 
          icon={Activity} 
          label="Recovery Status" 
          value="Optimal" 
          bgClass="bg-teal-50"
          iconColor="text-secondary-500"
          subtext="Low stress detected"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Priority */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink-900">Critical Execution Queue (P1)</h2>
            <button className="text-sm text-brand-600 font-medium hover:text-brand-700">View Plan</button>
          </div>
          
          <div className="bg-surface-card rounded-xl shadow-card border border-brand-50 divide-y divide-gray-50 overflow-hidden">
            {priorityTasks.slice(0, 4).map(task => (
              <div key={task.id} className="p-4 flex items-center justify-between hover:bg-brand-50/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-1 h-12 rounded-full ${
                    task.domain === Domain.Programmer ? 'bg-brand-500' :
                    task.domain === Domain.Founder ? 'bg-accent-500' :
                    task.domain === Domain.Company ? 'bg-ink-500' :
                    task.domain === Domain.Personal ? 'bg-secondary-500' :
                    'bg-status-error'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-ink-900">{task.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-ink-500 mt-0.5">
                      <span className="bg-surface-main px-1.5 py-0.5 rounded border border-gray-100">{task.domain}</span>
                      <span>•</span>
                      <span>{task.estimatedPomodoros} x {task.pomodoroDuration || 25}m</span>
                    </div>
                  </div>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition-colors">
                  Start
                </button>
              </div>
            ))}
             {priorityTasks.length === 0 && (
                <div className="p-8 text-center text-ink-400">
                  All critical tasks completed. Great job!
                </div>
             )}
          </div>
        </div>

        {/* Habits Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink-900">Habit Stack</h2>
            <button 
              onClick={onAddHabit}
              className="p-1 hover:bg-gray-100 rounded text-ink-400 hover:text-brand-600 transition-colors"
              title="Add Habit"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="bg-surface-card rounded-xl shadow-soft border border-brand-50 p-4 space-y-3">
            {habits.length > 0 ? habits.map(habit => (
              <div 
                key={habit.id} 
                className="flex items-center justify-between group cursor-pointer hover:bg-surface-main p-2 rounded-lg transition-colors -mx-2"
                onClick={() => onToggleHabit(habit.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border ${
                    habit.completedToday 
                      ? 'bg-status-success border-status-success text-white' 
                      : 'bg-white border-gray-200 text-gray-300 group-hover:border-status-success/50'
                  }`}>
                    <CheckCircle size={16} className={habit.completedToday ? "opacity-100" : "opacity-0 group-hover:opacity-50"} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium transition-colors ${habit.completedToday ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
                      {habit.title}
                    </p>
                    <p className="text-[10px] text-ink-400">
                      {habit.streak} day streak
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-4">
                <p className="text-xs text-ink-400">No active habits.</p>
                <button onClick={onAddHabit} className="text-brand-600 text-xs font-medium mt-1">Start one now</button>
              </div>
            )}
          </div>
          
          <div className="bg-brand-900 rounded-xl p-6 text-white relative overflow-hidden shadow-card">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-brand-600 rounded-full opacity-50 blur-xl"></div>
            <h3 className="font-bold relative z-10">Quote of the Day</h3>
            <p className="text-brand-100 text-sm mt-2 relative z-10 italic">
              "Amateurs sit and wait for inspiration, the rest of us just get up and go to work."
            </p>
            <p className="text-xs text-brand-300 mt-2 relative z-10">- Stephen King</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;