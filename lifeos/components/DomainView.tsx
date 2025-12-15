import React, { useState, useMemo } from 'react';
import { Domain, EisenhowerQuadrant, Habit, Task } from '../types';
import EisenhowerMatrix from './EisenhowerMatrix';
import PlanningSystem from './PlanningSystem';
import { Plus, Eye, EyeOff, LayoutTemplate, Map } from 'lucide-react';

interface DomainViewProps {
  domain: Domain;
  tasks: Task[];
  habits: Habit[];
  onMoveTask: (taskId: string, quadrant: EisenhowerQuadrant) => void;
  onAssignTaskToWeek: (taskId: string, weekId: string | undefined) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (defaults?: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddHabit: (defaults?: Partial<Habit>) => void;
  onToggleHabit: (id: string) => void;
}

type ViewMode = 'EXECUTION' | 'ROADMAP';

const DomainView: React.FC<DomainViewProps> = ({ 
  domain, 
  tasks, 
  habits, 
  onMoveTask, 
  onAssignTaskToWeek,
  onToggleTask, 
  onAddTask, 
  onEditTask,
  onDeleteTask,
  onAddHabit, 
  onToggleHabit 
}) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('EXECUTION');

  const domainHabits = habits.filter(h => h.domain === domain);
  
  // Sorting and Filtering Logic
  const visibleTasks = useMemo(() => {
    // 1. Filter by Domain
    const filtered = tasks.filter(t => t.domain === domain);
    
    // 2. Sort Logic: Incomplete First, then by Created Date (Oldest First)
    const sorted = filtered.sort((a, b) => {
        // Primary Sort: Completion (Incomplete first)
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; 
        }
        // Secondary Sort: Date (Oldest first)
        return a.createdAt - b.createdAt;
    });

    // 3. Apply Show/Hide Completed Filter
    if (showCompleted) {
        return sorted;
    } else {
        return sorted.filter(t => !t.completed);
    }
  }, [tasks, domain, showCompleted]);


  // Helper for colors based on domain
  const getThemeColor = () => {
    switch(domain) {
      case Domain.Programmer: return 'text-blue-600 bg-blue-50 border-blue-200';
      case Domain.Founder: return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case Domain.Personal: return 'text-teal-600 bg-teal-50 border-teal-200';
      case Domain.Family: return 'text-pink-600 bg-pink-50 border-pink-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const themeClass = getThemeColor();

  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface-card">
      {/* Header */}
      <div className="px-4 py-4 md:px-8 md:py-6 border-b border-brand-50 flex flex-col md:flex-row md:justify-between md:items-center bg-surface-card flex-shrink-0 gap-4">
        <div>
           <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${themeClass}`}>
              Domain
            </span>
            <span className="text-ink-400 text-xs">•</span>
            <span className="text-ink-500 text-xs">{visibleTasks.length} Tasks</span>
           </div>
           <h1 className="text-2xl font-bold text-ink-900 mt-1">{domain} System</h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto pb-1 md:pb-0">
          {/* View Toggle for All Domains */}
          <div className="bg-brand-50 p-1 rounded-lg flex space-x-1 shrink-0">
            <button 
              onClick={() => setViewMode('EXECUTION')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'EXECUTION' 
                  ? 'bg-surface-card text-brand-700 shadow-sm' 
                  : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              <LayoutTemplate size={16} />
              <span className="hidden sm:inline">Execution</span>
            </button>
            <button 
              onClick={() => setViewMode('ROADMAP')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'ROADMAP' 
                  ? 'bg-surface-card text-brand-700 shadow-sm' 
                  : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              <Map size={16} />
              <span className="hidden sm:inline">Roadmap</span>
            </button>
          </div>

          {viewMode === 'EXECUTION' && (
            <button 
              onClick={() => setShowCompleted(!showCompleted)}
              className={`shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${showCompleted ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-surface-card text-ink-500 border-brand-50 hover:bg-surface-main'}`}
              title={showCompleted ? 'Hide Completed' : 'Show Completed'}
            >
              {showCompleted ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="hidden lg:inline">{showCompleted ? 'Hide Completed' : 'Show Completed'}</span>
            </button>
          )}

          <button 
            onClick={() => onAddTask({ domain })}
            className="shrink-0 flex items-center space-x-2 px-4 py-2 bg-brand-900 text-white rounded-lg hover:bg-brand-700 text-sm font-medium shadow-soft"
          >
             <Plus size={16} />
             <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-surface-main/30 relative">
        
        {viewMode === 'EXECUTION' ? (
          <div className="p-4 md:p-8">
            {/* Domain Habits */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-ink-500 uppercase tracking-wide">System Habits</h3>
                  <button 
                    onClick={() => onAddHabit({ domain })}
                    className="p-1.5 hover:bg-brand-50 rounded-md text-ink-400 hover:text-brand-600 transition-colors flex items-center space-x-1"
                  >
                    <Plus size={14} />
                    <span className="text-xs font-medium">Add Habit</span>
                  </button>
                </div>
                
                {domainHabits.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {domainHabits.map(habit => (
                      <div 
                        key={habit.id} 
                        className="bg-surface-card p-4 rounded-xl border border-brand-50 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
                        onClick={() => onToggleHabit(habit.id)}
                      >
                        <div className="flex flex-col">
                            <span className={`font-semibold transition-colors ${habit.completedToday ? 'text-ink-400 line-through' : 'text-ink-900'}`}>{habit.title}</span>
                            <span className="text-xs text-ink-400">Streak: {habit.streak} 🔥</span>
                        </div>
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${habit.completedToday ? 'bg-status-success border-status-success' : 'border-brand-100'}`}>
                            {habit.completedToday && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-brand-100 rounded-xl text-center bg-brand-50/50">
                      <p className="text-ink-400 text-sm mb-2">No habits tracked for the {domain} system yet.</p>
                      <button 
                        onClick={() => onAddHabit({ domain })}
                        className="text-brand-600 font-medium text-sm hover:underline"
                      >
                        Create your first {domain} habit
                      </button>
                  </div>
                )}
            </div>

            {/* Matrix View */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-ink-500 uppercase tracking-wide">Execution Matrix</h3>
              </div>
              <EisenhowerMatrix 
                tasks={visibleTasks} 
                onMoveTask={onMoveTask} 
                onToggleTask={onToggleTask}
                onAddTask={(defaults) => onAddTask({ ...defaults, domain })}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            </div>
          </div>
        ) : (
          <div className="h-full">
            {/* Embedded Planning System for This Domain */}
            <PlanningSystem 
              tasks={tasks.filter(t => t.domain === domain)} 
              onAssignTaskToWeek={onAssignTaskToWeek}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              scope={domain}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainView;