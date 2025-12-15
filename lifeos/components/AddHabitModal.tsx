import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Domain, Habit } from '../types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Partial<Habit>) => void;
  initialData?: Partial<Habit>;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<Domain>(Domain.Personal);
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly'>('Daily');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setDomain(initialData?.domain || Domain.Personal);
      setFrequency(initialData?.frequency || 'Daily');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      domain,
      frequency,
    });
    onClose();
  };

  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";
  const selectClass = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Add New Habit</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Title Input */}
          <div>
            <label className={labelClass}>Habit Title</label>
            <input 
              autoFocus
              type="text" 
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-lg font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
              placeholder="e.g., Read 10 pages"
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

            {/* Frequency */}
            <div>
              <label className={labelClass}>Frequency</label>
              <select 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value as 'Daily' | 'Weekly')}
                className={selectClass}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 rounded-xl shadow-lg shadow-primary-500/30 flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={18} />
              <span>Start Habit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;