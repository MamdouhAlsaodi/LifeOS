import React, { useState, useEffect } from 'react';
import { X, Check, Clock, Calendar } from 'lucide-react';
import { Domain, EisenhowerQuadrant, Priority, Task } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Partial<Task>;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<Domain>(Domain.Personal);
  const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>(EisenhowerQuadrant.Do);
  const [priority, setPriority] = useState<Priority>(Priority.P3);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [pomodoroDuration, setPomodoroDuration] = useState(25);
  
  // New Planning Fields
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());
  const [targetQuarter, setTargetQuarter] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setDomain(initialData?.domain || Domain.Personal);
      setQuadrant(initialData?.quadrant || EisenhowerQuadrant.Do);
      setPriority(initialData?.priority || Priority.P3);
      setEstimatedPomodoros(initialData?.estimatedPomodoros || 1);
      setPomodoroDuration(initialData?.pomodoroDuration || 25);
      setTargetYear(initialData?.targetYear || new Date().getFullYear());
      setTargetQuarter(initialData?.targetQuarter);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: initialData?.id, // Important: Pass ID back to allow updates
      title,
      domain,
      quadrant,
      priority,
      estimatedPomodoros,
      pomodoroDuration,
      assignedWeek: initialData?.assignedWeek, // Preserve assigned week if passed
      targetYear,
      targetQuarter
    });
    onClose();
  };

  const labelClass = "block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5";
  const selectClass = "w-full p-2.5 bg-surface-main border border-brand-50 rounded-lg text-ink-900 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-surface-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-brand-50">
        <div className="px-6 py-4 border-b border-brand-50 flex justify-between items-center bg-surface-main/50">
          <h2 className="text-lg font-bold text-ink-900">{initialData?.id ? 'Edit Task' : 'Add New Task'}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-main rounded-full text-ink-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Title Input */}
          <div>
            <label className={labelClass}>Task Title</label>
            <input 
              autoFocus
              type="text" 
              className="w-full p-3 bg-surface-card border border-brand-50 rounded-xl text-lg font-medium text-ink-900 placeholder:text-ink-400 outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Domain */}
            <div>
              <label className={labelClass}>Domain</label>
              <select 
                value={domain} 
                onChange={(e) => setDomain(e.target.value as Domain)}
                className={selectClass}
              >
                {Object.values(Domain).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Quadrant */}
            <div>
              <label className={labelClass}>Matrix Quadrant</label>
              <select 
                value={quadrant} 
                onChange={(e) => setQuadrant(e.target.value as EisenhowerQuadrant)}
                className={selectClass}
              >
                {Object.values(EisenhowerQuadrant).map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            
            {/* Priority */}
            <div>
              <label className={labelClass}>Priority</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value as Priority)}
                className={selectClass}
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Session Duration */}
            <div>
              <label className={labelClass}>Session Duration</label>
              <div className="relative">
                <select 
                    value={pomodoroDuration} 
                    onChange={(e) => setPomodoroDuration(Number(e.target.value))}
                    className={selectClass}
                >
                    <option value={25}>25 Minutes (Standard)</option>
                    <option value={45}>45 Minutes (Deep Work)</option>
                    <option value={60}>60 Minutes (Long Focus)</option>
                </select>
                <Clock className="absolute right-3 top-3 text-ink-400" size={16} />
              </div>
            </div>
          </div>
          
          {/* Horizon Planning (Year/Quarter) */}
          <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-50">
             <div className="flex items-center space-x-2 mb-2">
                <Calendar size={14} className="text-brand-500" />
                <span className="text-xs font-bold text-brand-700 uppercase">Planning Horizon</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-[10px] font-semibold text-ink-500 mb-1 block">Year</label>
                   <select 
                      value={targetYear}
                      onChange={(e) => setTargetYear(Number(e.target.value))}
                      className="w-full p-2 bg-surface-card border border-brand-50 rounded text-sm text-ink-900 outline-none"
                   >
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                      <option value={2027}>2027</option>
                   </select>
                </div>
                <div>
                   <label className="text-[10px] font-semibold text-ink-500 mb-1 block">Quarter</label>
                   <select 
                      value={targetQuarter || ''}
                      onChange={(e) => setTargetQuarter(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full p-2 bg-surface-card border border-brand-50 rounded text-sm text-ink-900 outline-none"
                   >
                      <option value="">General Backlog</option>
                      <option value={1}>Q1 (Jan-Mar)</option>
                      <option value={2}>Q2 (Apr-Jun)</option>
                      <option value={3}>Q3 (Jul-Sep)</option>
                      <option value={4}>Q4 (Oct-Dec)</option>
                   </select>
                </div>
             </div>
          </div>

          {/* Pomodoro Estimation */}
          <div>
            <label className={labelClass}>Estimated Sessions (Count)</label>
            <div className="flex items-center space-x-4">
              <input 
                type="range" 
                min="1" 
                max="8" 
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(parseInt(e.target.value))}
                className="flex-1 h-2 bg-brand-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <span className="w-12 text-center font-bold text-ink-900 bg-surface-main py-1 rounded-md border border-brand-50">
                {estimatedPomodoros}
              </span>
            </div>
            <p className="text-xs text-ink-400 mt-2 text-right">
                Total Time: ~{(estimatedPomodoros * pomodoroDuration) / 60} hours
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-ink-500 hover:bg-surface-main rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-lg shadow-brand-500/30 flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={18} />
              <span>{initialData?.id ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;