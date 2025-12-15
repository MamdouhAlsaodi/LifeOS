import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { Task } from '../types';

interface FocusTimerProps {
  tasks: Task[];
}

const FocusTimer: React.FC<FocusTimerProps> = ({ tasks }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [initialDuration, setInitialDuration] = useState(25 * 60);

  // Effect to update time when task selection changes
  useEffect(() => {
    if (selectedTaskId) {
      const task = tasks.find(t => t.id === selectedTaskId);
      const duration = (task?.pomodoroDuration || 25) * 60;
      setInitialDuration(duration);
      if (!isActive) {
        setTimeLeft(duration);
      }
    } else {
      setInitialDuration(25 * 60);
      if (!isActive) {
        setTimeLeft(25 * 60);
      }
    }
  }, [selectedTaskId, tasks]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = ((initialDuration - timeLeft) / initialDuration) * 100;
  const activeTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-ink-900 mb-2">Deep Focus Mode</h2>
        <p className="text-ink-500">Select a task, clear distractions, and execute.</p>
      </div>

      {/* Task Selector */}
      <div className="w-full mb-8">
        <div className="bg-surface-card p-4 rounded-xl shadow-sm border border-brand-50">
           <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Focus Target</label>
           <select 
            className="w-full p-2 bg-surface-main border border-brand-50 rounded-lg text-ink-900 outline-none focus:ring-2 focus:ring-brand-500"
            value={selectedTaskId || ''}
            onChange={(e) => setSelectedTaskId(e.target.value)}
           >
             <option value="">-- Freestyle Focus (25m) --</option>
             {tasks.filter(t => !t.completed).map(t => (
               <option key={t.id} value={t.id}>
                 {t.title} ({t.pomodoroDuration || 25}m • {t.completedPomodoros}/{t.estimatedPomodoros})
               </option>
             ))}
           </select>
        </div>
      </div>

      {/* Timer Circle */}
      <div className="relative w-80 h-80 flex items-center justify-center mb-8">
        {/* Background Circle */}
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="150"
            className="stroke-brand-50"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="160"
            cy="160"
            r="150"
            className="stroke-brand-500 transition-all duration-1000 ease-linear"
            strokeWidth="12"
            fill="none"
            strokeDasharray={2 * Math.PI * 150}
            strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-6xl font-mono font-bold text-ink-900">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${isActive ? 'bg-status-warning hover:bg-yellow-600' : 'bg-brand-500 hover:bg-brand-600'}`}
        >
          {isActive ? <Pause className="text-white w-8 h-8" /> : <Play className="text-white w-8 h-8 ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-12 h-12 rounded-full bg-brand-50 hover:bg-brand-100 flex items-center justify-center text-ink-500 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button 
          className="w-12 h-12 rounded-full bg-status-success/10 hover:bg-status-success/20 flex items-center justify-center text-status-success transition-colors"
          title="Mark Complete"
        >
          <CheckCircle className="w-5 h-5" />
        </button>
      </div>

      {activeTask && (
        <div className="mt-8 text-center animate-fade-in">
            <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-medium">
              Working on: {activeTask.title} ({activeTask.pomodoroDuration || 25}m Session)
            </span>
        </div>
      )}
    </div>
  );
};

export default FocusTimer;