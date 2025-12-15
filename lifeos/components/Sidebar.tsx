import React from 'react';
import { 
  LayoutDashboard, 
  Code, 
  User, 
  Rocket, 
  Building2, 
  Users, 
  Target, 
  Timer,
  RefreshCw,
  Brain,
  Moon,
  Sun,
  Trash2,
  X
} from 'lucide-react';
import { Domain, ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onToggleRecovery: () => void;
  isRecoveryMode: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onResetData: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  onToggleRecovery, 
  isRecoveryMode,
  isDarkMode,
  onToggleDarkMode,
  onResetData,
  isOpen,
  onClose
}) => {
  
  const navItemClass = (isActive: boolean) => `
    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group
    ${isActive 
      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30' 
      : 'text-ink-500 hover:bg-brand-50 hover:text-brand-700 dark:hover:text-white dark:hover:bg-brand-50/10'}
  `;

  const isDomainActive = (d: Domain) => currentView.type === 'DOMAIN' && currentView.domain === d;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface-card border-r border-brand-50 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-brand-900 dark:text-brand-100 tracking-tight">LifeOS</span>
          </div>
          <button onClick={onClose} className="md:hidden text-ink-400 hover:text-ink-900">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          
          {/* Core */}
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Core</p>
            <div 
              onClick={() => onChangeView({ type: 'DASHBOARD' })}
              className={navItemClass(currentView.type === 'DASHBOARD')}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </div>
            <div 
              onClick={() => onChangeView({ type: 'FOCUS' })}
              className={navItemClass(currentView.type === 'FOCUS')}
            >
              <Timer size={20} />
              <span className="font-medium">Focus Zone</span>
            </div>
            <div 
              onClick={() => onChangeView({ type: 'PLANNING', interval: 'Daily' })}
              className={navItemClass(currentView.type === 'PLANNING')}
            >
              <Target size={20} />
              <span className="font-medium">Planning</span>
            </div>
          </div>

          {/* Domains */}
          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Domains</p>
            
            <div 
              onClick={() => onChangeView({ type: 'DOMAIN', domain: Domain.Programmer })}
              className={navItemClass(isDomainActive(Domain.Programmer))}
            >
              <Code size={20} />
              <span className="font-medium">Programmer</span>
            </div>

            <div 
              onClick={() => onChangeView({ type: 'DOMAIN', domain: Domain.Founder })}
              className={navItemClass(isDomainActive(Domain.Founder))}
            >
              <Rocket size={20} />
              <span className="font-medium">Founder</span>
            </div>

            <div 
              onClick={() => onChangeView({ type: 'DOMAIN', domain: Domain.Company })}
              className={navItemClass(isDomainActive(Domain.Company))}
            >
              <Building2 size={20} />
              <span className="font-medium">Company</span>
            </div>

            <div 
              onClick={() => onChangeView({ type: 'DOMAIN', domain: Domain.Personal })}
              className={navItemClass(isDomainActive(Domain.Personal))}
            >
              <User size={20} />
              <span className="font-medium">Personal</span>
            </div>

            <div 
              onClick={() => onChangeView({ type: 'DOMAIN', domain: Domain.Family })}
              className={navItemClass(isDomainActive(Domain.Family))}
            >
              <Users size={20} />
              <span className="font-medium">Family</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-brand-50 space-y-2">
          {/* Night Mode Toggle */}
          <button 
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-brand-50 bg-surface-main text-ink-500 hover:bg-brand-50 transition-colors"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm font-medium">
              {isDarkMode ? 'Light Mode' : 'Night Mode'}
            </span>
          </button>

          {/* Recovery Mode */}
          <button 
            onClick={onToggleRecovery}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border transition-colors ${
              isRecoveryMode 
              ? 'bg-status-warning/10 border-status-warning text-status-warning' 
              : 'bg-surface-main border-brand-50 text-ink-500 hover:bg-brand-50'
            }`}
          >
            <RefreshCw size={16} />
            <span className="text-sm font-medium">
              {isRecoveryMode ? 'Exit Recovery' : 'Recovery Mode'}
            </span>
          </button>

          {/* Reset Data */}
          <button 
            onClick={onResetData}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-status-error/30 text-status-error hover:bg-status-error/10 transition-colors"
          >
            <Trash2 size={16} />
            <span className="text-sm font-medium">Reset System</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;