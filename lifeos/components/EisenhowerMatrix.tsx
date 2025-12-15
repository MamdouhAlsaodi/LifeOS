import React from 'react';
import { EisenhowerQuadrant, Task } from '../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onMoveTask: (taskId: string, quadrant: EisenhowerQuadrant) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (defaults?: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ 
  tasks, 
  onMoveTask, 
  onToggleTask, 
  onAddTask,
  onEditTask,
  onDeleteTask
}) => {

  const Quadrant = ({ 
    title, 
    type, 
    items, 
    colorClass 
  }: { 
    title: string; 
    type: EisenhowerQuadrant; 
    items: Task[]; 
    colorClass: string;
  }) => (
    <div className={`flex flex-col h-full bg-surface-card rounded-xl border ${colorClass} shadow-sm overflow-hidden`}>
      <div className={`px-4 py-3 border-b flex justify-between items-center ${colorClass.replace('border-', 'bg-').replace('-200', '-50/50').replace('status-', '').replace('brand-', '')}`}>
        <h3 className="font-semibold text-sm text-ink-900 uppercase tracking-wide">{title}</h3>
        <span className="text-xs font-bold text-ink-500 bg-surface-card px-2 py-1 rounded-full">{items.length}</span>
      </div>
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {items.map(task => (
          <div key={task.id} className="group bg-surface-card border border-brand-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                 <button 
                  onClick={() => onToggleTask(task.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-brand-500 border-brand-500' : 'border-ink-400 hover:border-brand-500'}`}
                >
                  {task.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                </button>
                <span className={`text-sm font-medium ${task.completed ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
                  {task.title}
                </span>
              </div>
            </div>
            
            {/* Quick Actions (Hover) */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
              <button 
                onClick={() => onEditTask(task)}
                className="p-1 text-ink-400 hover:text-brand-600 rounded hover:bg-brand-50 transition-colors"
                title="Edit Task"
              >
                <Pencil size={14} />
              </button>
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="p-1 text-ink-400 hover:text-status-error rounded hover:bg-status-error/10 transition-colors"
                title="Delete Task"
              >
                <Trash2 size={14} />
              </button>
              
              {/* Quadrant Mover */}
              <select 
                value={task.quadrant}
                onChange={(e) => onMoveTask(task.id, e.target.value as EisenhowerQuadrant)}
                className="ml-1 text-xs bg-surface-main border border-brand-50 rounded px-1 py-0.5 outline-none cursor-pointer text-ink-900"
              >
                {Object.values(EisenhowerQuadrant).map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div className="mt-2 flex items-center space-x-2">
              <span className="text-[10px] bg-surface-main text-ink-500 px-1.5 py-0.5 rounded border border-brand-50">
                 {(task.pomodoroDuration || 25)}m / Session
              </span>
              <span className="text-[10px] text-ink-400 flex items-center">
                 {task.completedPomodoros}/{task.estimatedPomodoros} Poms
              </span>
            </div>
          </div>
        ))}
        <button 
          onClick={() => onAddTask({ quadrant: type })}
          className="w-full py-2 border border-dashed border-brand-100 rounded-lg text-ink-400 text-sm hover:bg-surface-main transition-colors flex items-center justify-center space-x-1"
        >
          <Plus size={14} />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );

  const q1 = tasks.filter(t => t.quadrant === EisenhowerQuadrant.Do);
  const q2 = tasks.filter(t => t.quadrant === EisenhowerQuadrant.Decide);
  const q3 = tasks.filter(t => t.quadrant === EisenhowerQuadrant.Delegate);
  const q4 = tasks.filter(t => t.quadrant === EisenhowerQuadrant.Delete);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-140px)] min-h-[600px]">
      <Quadrant title="Do (Urgent & Important)" type={EisenhowerQuadrant.Do} items={q1} colorClass="border-status-error/30" />
      <Quadrant title="Decide (Not Urgent & Important)" type={EisenhowerQuadrant.Decide} items={q2} colorClass="border-brand-500/30" />
      <Quadrant title="Delegate (Urgent & Not Important)" type={EisenhowerQuadrant.Delegate} items={q3} colorClass="border-status-warning/30" />
      <Quadrant title="Delete (Not Urgent & Not Important)" type={EisenhowerQuadrant.Delete} items={q4} colorClass="border-brand-50" />
    </div>
  );
};

export default EisenhowerMatrix;