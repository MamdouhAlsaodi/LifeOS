import React, { useState, useEffect } from 'react';
import { Domain, EisenhowerQuadrant, Habit, Task, ViewState } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DomainView from './components/DomainView';
import FocusTimer from './components/FocusTimer';
import AddTaskModal from './components/AddTaskModal';
import AddHabitModal from './components/AddHabitModal';
import PlanningSystem from './components/PlanningSystem';
import { INITIAL_HABITS, INITIAL_TASKS } from './services/mockData';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  // State Management (acting as the store)
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'DASHBOARD' });
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [modalDefaults, setModalDefaults] = useState<Partial<Task>>({});
  
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [habitModalDefaults, setHabitModalDefaults] = useState<Partial<Habit>>({});


  // Actions
  const handleMoveTask = (taskId: string, quadrant: EisenhowerQuadrant) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, quadrant } : t));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  // Reset All Data
  const handleResetData = () => {
    if (window.confirm("CRITICAL WARNING: This will delete ALL tasks and habits permanently. This action cannot be undone. Are you sure?")) {
      setTasks([]);
      setHabits([]);
    }
  };

  // Assign a task to a specific week string (e.g., "2026-W01") or null to unassign
  const handleAssignTaskToWeek = (taskId: string, weekId: string | undefined) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assignedWeek: weekId } : t));
  };
  
  const handleToggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isNowCompleted = !h.completedToday;
        return {
          ...h,
          completedToday: isNowCompleted,
          streak: isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  const toggleRecoveryMode = () => {
    setIsRecoveryMode(!isRecoveryMode);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Task Modal
  const openAddTask = (defaults: Partial<Task> = {}) => {
    setModalDefaults(defaults);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Edit Mode
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } as Task : t));
    } else {
      // Create Mode
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: taskData.title || 'Untitled Task',
        domain: taskData.domain || Domain.Personal,
        quadrant: taskData.quadrant || EisenhowerQuadrant.Do,
        energy: taskData.energy || 'Medium',
        priority: taskData.priority || 'P3',
        estimatedPomodoros: taskData.estimatedPomodoros || 1,
        completedPomodoros: 0,
        completed: false,
        createdAt: Date.now(),
        // Preserve assignedWeek if passed in defaults (e.g. creating task directly in a week view)
        assignedWeek: taskData.assignedWeek,
        targetYear: taskData.targetYear,
        targetQuarter: taskData.targetQuarter
      } as Task;
      setTasks(prev => [...prev, newTask]);
    }

    setIsTaskModalOpen(false);
    setModalDefaults({});
  };
  
  // Habit Modal
  const openAddHabit = (defaults: Partial<Habit> = {}) => {
    setHabitModalDefaults(defaults);
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      title: habitData.title || 'Untitled Habit',
      domain: habitData.domain || Domain.Personal,
      streak: 0,
      completedToday: false,
      frequency: habitData.frequency || 'Daily',
    };
    setHabits(prev => [...prev, newHabit]);
    setIsHabitModalOpen(false);
  };

  // Handle View Change & Mobile Sidebar logic
  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile when navigating
  };

  // Render Logic
  const renderContent = () => {
    switch (currentView.type) {
      case 'DASHBOARD':
        return <Dashboard tasks={tasks} habits={habits} onAddHabit={openAddHabit} onToggleHabit={handleToggleHabit} />;
      case 'DOMAIN':
        return (
          <DomainView 
            domain={currentView.domain} 
            tasks={tasks} 
            habits={habits} 
            onMoveTask={handleMoveTask}
            onAssignTaskToWeek={handleAssignTaskToWeek}
            onToggleTask={handleToggleTask}
            onAddTask={openAddTask}
            onEditTask={openAddTask}
            onDeleteTask={handleDeleteTask}
            onAddHabit={openAddHabit}
            onToggleHabit={handleToggleHabit}
          />
        );
      case 'FOCUS':
        return <FocusTimer tasks={tasks} />;
      case 'PLANNING':
        return (
          <PlanningSystem 
            tasks={tasks} 
            onAssignTaskToWeek={handleAssignTaskToWeek} 
            onAddTask={openAddTask}
            onEditTask={openAddTask}
            onDeleteTask={handleDeleteTask}
            scope="Global"
          />
        );
      default:
        return <div className="p-8">View Not Implemented Yet</div>;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`flex h-screen w-screen overflow-hidden transition-colors duration-500 bg-surface-main text-ink-900`}>
        
        <Sidebar 
          currentView={currentView} 
          onChangeView={handleViewChange} 
          onToggleRecovery={toggleRecoveryMode}
          isRecoveryMode={isRecoveryMode}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onResetData={handleResetData}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className={`flex-1 flex flex-col min-w-0 bg-surface-card m-0 md:m-2 md:rounded-2xl shadow-card border-x border-brand-50 md:border-y overflow-hidden relative transition-colors duration-500`}>
          
          {/* Mobile Header / Toggle */}
          <div className="md:hidden flex items-center p-4 border-b border-brand-50 bg-surface-card z-10">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 -ml-2 text-ink-500 hover:bg-brand-50 rounded-lg"
             >
                <Menu size={24} />
             </button>
             <span className="ml-3 font-bold text-lg text-ink-900">LifeOS</span>
          </div>

          {isRecoveryMode && (
            <div className="w-full bg-secondary-500 text-white text-center py-1 text-xs font-bold z-10 flex-shrink-0">
              RECOVERY MODE ACTIVE — FOCUS REDUCED TO ESSENTIALS
            </div>
          )}
          
          {renderContent()}
        </main>

        <AddTaskModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)} 
          onSave={handleSaveTask}
          initialData={modalDefaults}
        />
        
        <AddHabitModal
          isOpen={isHabitModalOpen}
          onClose={() => setIsHabitModalOpen(false)}
          onSave={handleSaveHabit}
          initialData={habitModalDefaults}
        />

      </div>
    </div>
  );
};

export default App;