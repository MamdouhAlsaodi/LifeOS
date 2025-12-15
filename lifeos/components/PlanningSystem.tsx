import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Edit2, Save, Target, Calendar, List, ArrowRight, ArrowLeft, Plus, ChevronLeft, ChevronRight, Trash2, ListPlus, Pencil } from 'lucide-react';
import { Task, Domain, EisenhowerQuadrant, Priority } from '../types';

interface PlanningSystemProps {
  tasks: Task[];
  onAssignTaskToWeek: (taskId: string, weekId: string | undefined) => void;
  onAddTask: (defaults?: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  scope?: Domain | 'Global';
}

type PlanTab = 'Year' | 'Quarter' | 'Week' | 'Day';

// --- Daily Schedule Sub-Component ---
interface RoutineRow {
  id: string;
  hourLabel: string;
  sat: string; sun: string; mon: string; tue: string; wed: string; thu: string; fri: string;
}

const DailySchedule: React.FC<{ focusedTasks: Task[] }> = ({ focusedTasks }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getInitialSchedule = (): RoutineRow[] => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const start = i.toString().padStart(2, '0');
      const end = ((i + 1) % 24).toString().padStart(2, '0');
      return `${start}:00 - ${end}:00`;
    });

    return hours.map((h, index) => {
       const hour = index;
       let row: RoutineRow = { id: `h-${hour}`, hourLabel: h, sat: '', sun: '', mon: '', tue: '', wed: '', thu: '', fri: '' };
       if (hour >= 22 || hour < 5) {
         row.sat = row.sun = row.mon = row.tue = row.wed = row.thu = row.fri = '😴 نـــــــــوم';
       }
       return row;
    });
  };

  const [schedule, setSchedule] = useState<RoutineRow[]>(getInitialSchedule);

  const handleUpdate = (id: string, field: keyof RoutineRow, value: string) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const renderCell = (row: RoutineRow, field: keyof RoutineRow) => {
    const value = row[field];
    if (isEditing) {
      return (
        <textarea
          value={value}
          onChange={(e) => handleUpdate(row.id, field, e.target.value)}
          className="w-full h-full min-h-[50px] p-2 bg-surface-card border border-brand-50 rounded text-xs focus:ring-1 focus:ring-brand-500 outline-none resize-none text-ink-900"
          dir="auto"
        />
      );
    }
    if (!value) return <span className="text-ink-400">-</span>;
    const isSleep = value.includes('نـــــــــوم');
    const isWork = value.includes('دوام') || value.includes('Work');
    let bgClass = isSleep ? 'bg-brand-50 text-ink-500 italic' : isWork ? 'bg-blue-50 text-blue-700' : 'text-ink-900 bg-brand-50/50';
    return <div className={`w-full h-full p-2 text-xs leading-tight rounded ${bgClass}`}>{value}</div>;
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-brand-50">
        <div className="px-6 py-3 border-b border-brand-50 flex justify-between items-center bg-surface-main">
          <h3 className="font-bold text-ink-500">Daily Execution Grid (Generic Routine)</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            {isEditing ? <><Save size={16}/><span>Save</span></> : <><Edit2 size={16}/><span>Edit</span></>}
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-surface-card">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead className="sticky top-0 bg-surface-main z-10 shadow-sm">
              <tr>
                <th className="p-2 w-20 text-center text-xs font-bold text-ink-400">Time</th>
                {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
                   <th key={d} className="p-2 w-[13%] text-xs font-bold text-ink-900">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {schedule.map((row) => (
                <tr key={row.id}>
                  <td className="p-2 border-r border-brand-50 text-center text-[10px] font-mono text-ink-400">{row.hourLabel}</td>
                  {['sat','sun','mon','tue','wed','thu','fri'].map((day: any) => (
                    <td key={day} className="p-1 border-r border-brand-50 align-top">{renderCell(row, day)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// --- Main Planning System Component ---

const PlanningSystem: React.FC<PlanningSystemProps> = ({ 
  tasks, 
  onAssignTaskToWeek, 
  onAddTask,
  onEditTask,
  onDeleteTask,
  scope = 'Global'
}) => {
  const [activeTab, setActiveTab] = useState<PlanTab>('Week');
  
  // Context State
  const [selectedYear, setSelectedYear] = useState(2026);
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [currentWeekNum, setCurrentWeekNum] = useState(1); // 1-52

  // --- Initial Data Factory based on Scope ---
  const getInitialData = (s: Domain | 'Global') => {
    switch(s) {
      case Domain.Programmer:
        return {
          vision: "Become a Senior Software Architect and build a high-performance, distributed system for millions of users.",
          goals: [
            { id: '1', text: "Master Rust & System Design" },
            { id: '2', text: "Launch Open Source Project (1k Stars)" },
            { id: '3', text: "Contribute to 5 Major Repos" }
          ],
          qGoals: {
            1: ["Complete Advanced Backend Course", "Build Custom DB Engine", "Refactor Legacy Codebase"],
            2: ["Deploy Microservices Architecture", "Write 10 Tech Articles", "Speak at a local meetup"],
          }
        };
      case Domain.Founder:
        return {
          vision: "Build a profitable, scalable product that solves real problems and achieves $10k MRR.",
          goals: [
            { id: '1', text: "Launch MVP to 100 users" },
            { id: '2', text: "Achieve Product-Market Fit" },
            { id: '3', text: "Hire first core team member" }
          ],
          qGoals: {
             1: ["Validate Idea with 50 Interviews", "Build Landing Page", "Develop Core Prototype"],
             2: ["Launch Beta", "Start Paid Marketing", "Iterate based on feedback"]
          }
        };
      case Domain.Company:
        return {
          vision: "Establish efficient operations, clear culture, and sustainable growth mechanisms.",
          goals: [
            { id: '1', text: "Automate Sales Pipeline" },
            { id: '2', text: "Complete Q3 Financial Audit" },
            { id: '3', text: "Refine Company Handbook" }
          ],
          qGoals: {
             1: ["Implement CRM", "Hire Sales Lead", "Draft SOPs"],
             2: ["Optimize Cloud Costs", "Quarterly Team Retreat"]
          }
        };
      case Domain.Family:
        return {
          vision: "Foster a loving, supportive, and adventurous family environment with deep connections.",
          goals: [
            { id: '1', text: "Plan Summer Europe Trip" },
            { id: '2', text: "Renovate Living Room" },
            { id: '3', text: "Weekly Quality Time Routine" }
          ],
          qGoals: {
             1: ["Research Trip Itinerary", "Start Weekend Hiking Habit"],
             2: ["Book Flights", "Host Family Reunion"]
          }
        };
      case Domain.Personal:
        return {
          vision: "Maintain peak physical health and continuous intellectual growth.",
          goals: [
            { id: '1', text: "Run a Marathon (Sub 4h)" },
            { id: '2', text: "Read 50 Books" },
            { id: '3', text: "Learn Spanish" }
          ],
          qGoals: {
             1: ["Run 10k Weekly", "Read 12 Books", "Complete Duolingo Unit 1"],
             2: ["Run Half-Marathon", "Join Book Club"]
          }
        };
      default: // Global
        return {
          vision: "Achieve financial independence and complete the LifeOS productivity system.",
          goals: [
            { id: '1', text: "Launch LifeOS MVP" },
            { id: '2', text: "Read 24 Books" },
            { id: '3', text: "Travel to 3 New Countries" }
          ],
          qGoals: {
            1: ["Complete Frontend Certification", "Build MVP Core Features", "Establish Deep Work Routine"],
            2: ["Launch Beta", "Get 100 Users", "Start Marketing"],
          }
        };
    }
  };

  const initialData = getInitialData(scope as Domain | 'Global');

  // Local State for Goals (Mock persistence - resets on scope change in this simplified version)
  const [yearVision, setYearVision] = useState(initialData.vision);
  const [yearGoals, setYearGoals] = useState<{id: string, text: string}[]>(initialData.goals);
  const [quarterGoalsMap, setQuarterGoalsMap] = useState<Record<number, string[]>>(initialData.qGoals);

  // Reset state when scope changes
  useEffect(() => {
    const newData = getInitialData(scope as Domain | 'Global');
    setYearVision(newData.vision);
    setYearGoals(newData.goals);
    setQuarterGoalsMap(newData.qGoals);
  }, [scope]);

  // Helper to determine Quarter from Week
  const getQuarterFromWeek = (week: number) => {
      if (week <= 13) return 1;
      if (week <= 26) return 2;
      if (week <= 39) return 3;
      return 4;
  };

  // Computed Properties
  const selectedWeekId = `${selectedYear}-W${currentWeekNum.toString().padStart(2, '0')}`;
  const selectedWeekQuarter = getQuarterFromWeek(currentWeekNum);

  // Filter Tasks
  const weeklyFocusTasks = tasks.filter(t => t.assignedWeek === selectedWeekId);
  
  const backlogTasks = useMemo(() => {
    return tasks.filter(t => {
      // 1. Basic Filters
      if (t.completed) return false;
      if (t.assignedWeek === selectedWeekId) return false; // Already in current week
      
      // 2. Filter by Year (if targetYear matches selectedYear OR if unassigned, default behavior)
      if (t.targetYear && t.targetYear !== selectedYear) return false;

      // 3. Filter by Quarter
      if (t.targetQuarter && t.targetQuarter !== selectedWeekQuarter) return false;
      
      // 4. Handle assignedWeek logic for Quarter view consistency
      if (t.assignedWeek) {
        const [yearStr, weekStr] = t.assignedWeek.split('-W');
        if (Number(yearStr) !== selectedYear) return false; 
        
        const assignedWeekNum = Number(weekStr);
        const assignedQuarter = getQuarterFromWeek(assignedWeekNum);
        return assignedQuarter === selectedWeekQuarter; 
      }
      
      return true;
    });
  }, [tasks, selectedWeekId, selectedYear, selectedWeekQuarter]);

  // Actions
  const addYearGoal = () => {
    setYearGoals([...yearGoals, { id: Date.now().toString(), text: "" }]);
  };

  const removeYearGoal = (id: string) => {
    setYearGoals(yearGoals.filter(g => g.id !== id));
  };

  const updateQuarterGoal = (q: number, index: number, value: string) => {
    const goals = [...(quarterGoalsMap[q] || [])];
    goals[index] = value;
    setQuarterGoalsMap({ ...quarterGoalsMap, [q]: goals });
  };
  
  const addQuarterGoal = (q: number) => {
    const goals = [...(quarterGoalsMap[q] || [])];
    goals.push(""); // Empty default
    setQuarterGoalsMap({ ...quarterGoalsMap, [q]: goals });
  };
  
  const removeQuarterGoal = (q: number, index: number) => {
    const goals = [...(quarterGoalsMap[q] || [])];
    goals.splice(index, 1);
    setQuarterGoalsMap({ ...quarterGoalsMap, [q]: goals });
  };

  const nextWeek = () => setCurrentWeekNum(prev => prev >= 52 ? 1 : prev + 1);
  const prevWeek = () => setCurrentWeekNum(prev => prev <= 1 ? 52 : prev - 1);


  const tabs: {id: PlanTab, icon: any, label: string}[] = [
    { id: 'Year', icon: Target, label: `Yearly ${scope === 'Global' ? 'Plan' : 'Roadmap'}` },
    { id: 'Quarter', icon: Calendar, label: 'Quarterly Strategy' },
    { id: 'Week', icon: List, label: 'Weekly Execution' },
    { id: 'Day', icon: Clock, label: 'Daily Routine' },
  ];

  const isDomainScope = scope !== 'Global';
  const domainForTask = isDomainScope ? (scope as Domain) : undefined;

  return (
    <div className="flex flex-col h-full bg-surface-card">
      {/* Navigation Tabs */}
      <div className="flex items-center px-6 pt-4 border-b border-brand-50 bg-surface-main space-x-1 justify-between">
        <div className="flex space-x-1">
            {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                ? 'bg-surface-card text-brand-600 border-t border-l border-r border-brand-50 shadow-sm relative top-[1px]' 
                : 'text-ink-500 hover:text-ink-900 hover:bg-brand-50'
                }`}
            >
                <tab.icon size={16} />
                <span>{tab.label}</span>
            </button>
            ))}
        </div>
        
        {/* Year Context Selector */}
        <div className="flex items-center space-x-2 pb-2">
            <span className="text-xs font-bold text-ink-400 uppercase">Planning Year:</span>
            <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-surface-card border border-brand-50 rounded text-sm font-bold text-ink-900 px-2 py-1 outline-none focus:border-brand-500"
            >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        
        {/* YEAR VIEW */}
        {activeTab === 'Year' && (
           <div className="p-8 max-w-4xl mx-auto overflow-y-auto h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-8">
                 <h2 className="text-2xl font-bold text-ink-900 mb-2">
                    {scope !== 'Global' ? `${scope} North Star` : `${selectedYear} Vision`}
                 </h2>
                 <p className="text-ink-500 mb-4">
                    {scope !== 'Global' ? `What is the ultimate outcome for your ${scope} domain this year?` : 'What is the ultimate outcome you are driving towards?'}
                 </p>
                 <textarea 
                    value={yearVision}
                    onChange={(e) => setYearVision(e.target.value)}
                    className="w-full h-32 p-4 bg-brand-50/50 border border-brand-100 rounded-xl text-ink-900 text-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none shadow-sm"
                    placeholder="Describe your vision..."
                 />
              </div>
              <div>
                 <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-ink-900">Key Milestones</h2>
                    <button 
                        onClick={addYearGoal}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-surface-main hover:bg-brand-50 text-ink-500 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={16} />
                        <span>Add Milestone</span>
                    </button>
                 </div>
                 <div className="space-y-3">
                    {yearGoals.map((g, i) => (
                        <div key={g.id} className="flex items-center space-x-3 p-4 bg-surface-card border border-brand-50 rounded-xl shadow-sm group hover:border-brand-500 transition-colors">
                             <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-ink-500 font-bold">{i+1}</div>
                             <input 
                                value={g.text} 
                                onChange={(e) => {
                                    const newGoals = [...yearGoals];
                                    newGoals[i].text = e.target.value;
                                    setYearGoals(newGoals);
                                }}
                                className="flex-1 text-ink-900 font-medium bg-transparent outline-none placeholder:text-ink-400"
                                placeholder="Enter milestone..."
                                autoFocus={g.text === ""}
                             />
                             <button
                                onClick={() => onAddTask({ title: g.text, priority: Priority.P1, domain: domainForTask })} 
                                className="flex items-center space-x-1 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-100"
                                title="Create actionable task from this milestone"
                             >
                                <ListPlus size={14} />
                                <span>Create Task</span>
                             </button>

                             <button 
                                onClick={() => removeYearGoal(g.id)}
                                className="text-ink-400 hover:text-status-error opacity-0 group-hover:opacity-100 transition-all"
                             >
                                <Trash2 size={18} />
                             </button>
                        </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* QUARTER VIEW */}
        {activeTab === 'Quarter' && (
            <div className="flex h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Quarter Tabs Side */}
                <div className="w-64 bg-surface-main border-r border-brand-50 p-4 space-y-2">
                    <h3 className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-4 px-2">Select Quarter</h3>
                    {[1, 2, 3, 4].map(q => (
                        <button
                            key={q}
                            onClick={() => setCurrentQuarter(q)}
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                                currentQuarter === q 
                                ? 'bg-surface-card shadow-sm text-brand-600 border border-brand-50' 
                                : 'text-ink-500 hover:bg-brand-50'
                            }`}
                        >
                            Q{q} {selectedYear}
                        </button>
                    ))}
                    
                    <div className="mt-8 px-4 py-4 bg-brand-50/50 rounded-xl border border-brand-100">
                        <h4 className="text-xs font-bold text-brand-600 uppercase tracking-wide mb-2">Year Vision</h4>
                        <p className="text-xs text-brand-900 italic">"{yearVision}"</p>
                    </div>
                </div>

                {/* Quarter Editor */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-3xl">
                        <h2 className="text-2xl font-bold text-ink-900 mb-2">Q{currentQuarter} Strategy</h2>
                        <p className="text-ink-500 mb-6">Break down your yearly vision into actionable objectives for this quarter.</p>
                        
                        <div className="space-y-4">
                            {(quarterGoalsMap[currentQuarter] || []).map((g, i) => (
                                <div key={i} className="group relative flex items-center">
                                    <div className="flex-1 relative">
                                        <div className="p-4 bg-surface-card border border-brand-50 rounded-lg shadow-sm hover:border-brand-500 transition-colors">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-ink-400 uppercase">Objective {i+1}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    value={g}
                                                    onChange={(e) => updateQuarterGoal(currentQuarter, i, e.target.value)}
                                                    className="w-full font-semibold text-ink-900 outline-none placeholder:text-ink-400 bg-transparent"
                                                    placeholder="Enter objective..."
                                                    autoFocus={g === ""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-2 ml-3 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => onAddTask({ title: g, priority: Priority.P2, domain: domainForTask })}
                                            className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100"
                                            title="Create Task from Objective"
                                        >
                                            <ListPlus size={18} />
                                        </button>
                                        <button 
                                            onClick={() => removeQuarterGoal(currentQuarter, i)}
                                            className="p-2 text-ink-400 hover:text-status-error hover:bg-brand-50 rounded-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            onClick={() => addQuarterGoal(currentQuarter)}
                            className="mt-6 w-full py-3 border-2 border-dashed border-brand-100 rounded-xl text-ink-500 font-medium hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 transition-all flex items-center justify-center space-x-2"
                        >
                            <Plus size={18} />
                            <span>Add Quarterly Objective</span>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* WEEK VIEW */}
        {activeTab === 'Week' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Week Selector Toolbar */}
                <div className="px-6 py-3 bg-surface-card border-b border-brand-50 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center space-x-4">
                         <div className="flex items-center bg-brand-50 rounded-lg p-1">
                            <button onClick={prevWeek} className="p-1 hover:bg-surface-card rounded shadow-sm transition-all"><ChevronLeft size={16}/></button>
                            <span className="w-32 text-center font-mono font-bold text-sm text-ink-900">
                                Week {currentWeekNum} <span className="text-ink-400 font-normal">(Q{getQuarterFromWeek(currentWeekNum)})</span>
                            </span>
                            <button onClick={nextWeek} className="p-1 hover:bg-surface-card rounded shadow-sm transition-all"><ChevronRight size={16}/></button>
                         </div>
                         <div className="h-6 w-px bg-brand-50"></div>
                         <select 
                            value={currentWeekNum}
                            onChange={(e) => setCurrentWeekNum(Number(e.target.value))}
                            className="text-sm border-none bg-transparent outline-none text-ink-500 font-medium cursor-pointer hover:text-ink-900"
                         >
                            {Array.from({length: 52}, (_, i) => i + 1).map(w => {
                                const q = getQuarterFromWeek(w);
                                return (
                                    <option key={w} value={w}>Jump to Week {w} (Q{q})</option>
                                );
                            })}
                         </select>
                    </div>
                    <div className="text-sm font-bold text-ink-400">{selectedYear}</div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Backlog Organized by Quadrant ("Strip") */}
                    <div className="w-1/2 border-r border-brand-50 overflow-y-auto bg-surface-main/50 flex flex-col">
                        <div className="p-4 border-b border-brand-50 flex items-center justify-between bg-surface-card/50 backdrop-blur-sm sticky top-0 z-10">
                            <h3 className="text-lg font-bold text-ink-900 flex items-center">
                                <List size={20} className="mr-2 text-ink-400"/>
                                Q{selectedWeekQuarter} Backlog
                            </h3>
                            <button 
                                onClick={() => onAddTask({ targetQuarter: selectedWeekQuarter, targetYear: selectedYear, domain: domainForTask })}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-surface-card border border-brand-100 rounded-lg text-xs font-bold text-ink-500 hover:bg-surface-main shadow-sm"
                            >
                                <Plus size={14} />
                                <span>New Task</span>
                            </button>
                        </div>
                        
                        <div className="flex-1 p-4 space-y-6">
                            {/* Render Backlog grouped by Quadrant */}
                            {[EisenhowerQuadrant.Do, EisenhowerQuadrant.Decide, EisenhowerQuadrant.Delegate, EisenhowerQuadrant.Delete].map(quad => {
                                const quadTasks = backlogTasks.filter(t => t.quadrant === quad);
                                
                                let colorClass = 'border-brand-50';
                                if(quad === EisenhowerQuadrant.Do) colorClass = 'border-status-error/30 bg-status-error/5';
                                if(quad === EisenhowerQuadrant.Decide) colorClass = 'border-brand-500/30 bg-brand-500/5';
                                if(quad === EisenhowerQuadrant.Delegate) colorClass = 'border-status-warning/30 bg-status-warning/5';

                                return (
                                    <div key={quad} className={`rounded-xl border ${colorClass} p-3`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold uppercase text-ink-500">{quad}</span>
                                            <span className="text-[10px] bg-surface-card px-2 py-0.5 rounded-full border border-brand-50 text-ink-400">{quadTasks.length}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {quadTasks.length === 0 && <p className="text-[10px] text-ink-400 italic pl-1">No tasks.</p>}
                                            {quadTasks.map(task => (
                                                <div key={task.id} className="bg-surface-card p-3 rounded-lg shadow-sm border border-brand-50 flex items-center justify-between group hover:border-brand-500 transition-all relative">
                                                    <div>
                                                        <p className="font-medium text-sm text-ink-900">{task.title}</p>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${task.domain === Domain.Programmer ? 'bg-brand-500' : 'bg-ink-400'}`}>{task.domain}</span>
                                                            <span className="text-xs text-ink-400">{task.priority}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Hover Actions */}
                                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3">
                                                        <button 
                                                            onClick={() => onEditTask(task)}
                                                            className="p-1 text-ink-400 hover:text-brand-600 rounded"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => onDeleteTask(task.id)}
                                                            className="p-1 text-ink-400 hover:text-status-error rounded"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => onAssignTaskToWeek(task.id, selectedWeekId)}
                                                            className="p-1 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 ml-2"
                                                            title={`Move to Week ${currentWeekNum}`}
                                                        >
                                                            <ArrowRight size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => onAddTask({ quadrant: quad, targetQuarter: selectedWeekQuarter, targetYear: selectedYear, domain: domainForTask })}
                                                className="w-full py-1.5 text-xs text-ink-400 hover:bg-surface-card hover:text-ink-500 rounded border border-transparent hover:border-brand-50 transition-all flex items-center justify-center space-x-1"
                                            >
                                                <Plus size={12} />
                                                <span>Add {quad} Task</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Weekly Sprint */}
                    <div className="w-1/2 p-6 overflow-y-auto bg-surface-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-brand-700 flex items-center">
                                <Target size={20} className="mr-2"/>
                                Week {currentWeekNum} Focus
                                <span className="ml-2 text-xs bg-brand-100 px-2 py-0.5 rounded-full text-brand-700">{weeklyFocusTasks.length}</span>
                            </h3>
                            <button 
                                onClick={() => onAddTask({ assignedWeek: selectedWeekId, domain: domainForTask })}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 shadow-sm"
                            >
                                <Plus size={14} />
                                <span>Add to Week</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {weeklyFocusTasks.length === 0 && (
                                <div className="p-8 text-center border-2 border-dashed border-brand-100 rounded-xl">
                                    <p className="text-ink-400 text-sm">No tasks planned for {selectedWeekId}.<br/>Drag tasks from backlog or create new ones.</p>
                                </div>
                            )}
                            {weeklyFocusTasks.map(task => (
                                <div key={task.id} className="bg-brand-50/50 p-4 rounded-xl shadow-sm border border-brand-100 flex items-center justify-between group relative">
                                    <button 
                                        onClick={() => onAssignTaskToWeek(task.id, undefined)}
                                        className="p-2 bg-surface-card text-ink-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:text-status-error hover:bg-brand-50"
                                        title="Remove from Sprint"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                    <div className="text-right">
                                        <p className="font-medium text-brand-900">{task.title}</p>
                                        <div className="flex items-center justify-end space-x-2 mt-1">
                                            <span className="text-xs text-brand-600">{task.estimatedPomodoros * (task.pomodoroDuration || 25)}m</span>
                                            <span className="text-[10px] bg-surface-card border border-brand-100 text-brand-600 px-1.5 py-0.5 rounded">{task.quadrant}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${task.domain === Domain.Programmer ? 'bg-brand-500' : 'bg-ink-400'}`}>{task.domain}</span>
                                        </div>
                                    </div>
                                    
                                     {/* Hover Actions (Edit/Delete) */}
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                                         <button 
                                            onClick={() => onEditTask(task)}
                                            className="p-1 text-brand-400 hover:text-brand-700 rounded"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button 
                                            onClick={() => onDeleteTask(task.id)}
                                            className="p-1 text-brand-400 hover:text-status-error rounded"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* DAY VIEW (Schedule) */}
        {activeTab === 'Day' && (
            <div className="h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <DailySchedule focusedTasks={weeklyFocusTasks} />
            </div>
        )}

      </div>
    </div>
  );
};

export default PlanningSystem;