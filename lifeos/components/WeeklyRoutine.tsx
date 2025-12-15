import React, { useState } from 'react';
import { Clock, Edit2, Save } from 'lucide-react';

interface RoutineRow {
  id: string;
  hourLabel: string;
  sat: string;
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
}

const WeeklyRoutine: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Helper to generate initial state based on the provided logic
  const getInitialSchedule = (): RoutineRow[] => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const start = i.toString().padStart(2, '0');
      const end = ((i + 1) % 24).toString().padStart(2, '0');
      return `${start}:00 - ${end}:00`;
    });

    return hours.map((h, index) => {
      const hour = index; // 0 to 23
      let row: RoutineRow = {
        id: `h-${hour}`,
        hourLabel: h,
        sat: '', sun: '', mon: '', tue: '', wed: '', thu: '', fri: ''
      };

      // Apply Logic based on previous groups
      // Group 1 (Project): Sat, Mon, Thu
      // Group 2 (Uni): Tue, Wed, Fri
      // Group 3 (Rest): Sun

      // Sleeping Hours (22:00 - 05:00) -> 22, 23, 0, 1, 2, 3, 4
      if (hour >= 22 || hour < 5) {
        const sleep = '😴 نـــــــــوم';
        row.sat = row.sun = row.mon = row.tue = row.wed = row.thu = row.fri = sleep;
      }
      // 05:00 - 08:00
      else if (hour >= 5 && hour < 8) {
        const deepWork = '🧠 تعلّم عميق (3 ساعات)';
        const quiet = '☕ صباح هادئ + هوايات';
        
        row.sat = row.mon = row.thu = deepWork; // Project
        row.tue = row.wed = row.fri = deepWork; // Uni (Same routine)
        row.sun = quiet; // Rest
      }
      // 08:00 - 09:00
      else if (hour === 8) {
        const prep = 'استعداد + تنقل للعمل';
        const free = '(وقت حر / هواية)';
        
        row.sat = row.mon = row.thu = prep;
        row.tue = row.wed = row.fri = prep;
        row.sun = free;
      }
      // 09:00 - 14:00
      else if (hour >= 9 && hour < 14) {
        const work = '🏢 دوام العمل';
        const free = '(وقت حر)';
        
        row.sat = row.mon = row.thu = work;
        row.tue = row.wed = row.fri = work;
        row.sun = free;
      }
      // 14:00 - 15:00
      else if (hour === 14) {
        const read = '📖 قراءة يومية';
        const free = '(وقت حر)';
        
        row.sat = row.mon = row.thu = read;
        row.tue = row.wed = row.fri = read;
        row.sun = free;
      }
      // 15:00 - 16:00
      else if (hour === 15) {
        const eng = '🗣️ لغة إنجليزية';
        const free = '(وقت حر)';

        row.sat = row.mon = row.thu = eng;
        row.tue = row.wed = row.fri = eng;
        row.sun = free;
      }
      // 16:00 - 17:00
      else if (hour === 16) {
        // Special case from previous data
        row.sat = '💻 قراءة تقنية متخصصة';
        row.mon = row.thu = 'راحة'; // Implied from "/ راحة"
        row.tue = row.wed = row.fri = '⚡ قيلولة / راحة';
        row.sun = '💪 رياضة صارمة (15د)';
      }
      // 17:00 - 18:00
      else if (hour === 17) {
        row.sat = row.mon = row.thu = '🍽️ الوجبة الثانية';
        row.tue = row.wed = row.fri = '🍽️ الوجبة الثانية + انتقال';
        row.sun = '🍽️ الوجبة الثانية';
      }
      // 18:00 - 20:00
      else if (hour >= 18 && hour < 20) {
        row.sat = row.mon = row.thu = '🚀 مشروع الشركة الناشئة';
        row.tue = row.wed = row.fri = '🎓 دوام جامعة';
        row.sun = '(وقت حر / تجهيز)';
      }
      // 20:00 - 21:00
      else if (hour === 20) {
        row.sat = row.mon = row.thu = '🚀 تابع المشروع / تخطيط';
        row.tue = row.wed = row.fri = '🎓 دوام جامعة';
        row.sun = '(وقت حر)';
      }
      // 21:00 - 22:00
      else if (hour === 21) {
        row.sat = row.mon = row.thu = '🌙 روتين ما قبل النوم';
        row.tue = row.wed = row.fri = '🎓 عودة ونوم فوراً';
        row.sun = '🌙 روتين ما قبل النوم';
      }

      return row;
    });
  };

  const [schedule, setSchedule] = useState<RoutineRow[]>(getInitialSchedule);

  const handleUpdate = (id: string, field: keyof RoutineRow, value: string) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Render a cell helper
  const renderCell = (row: RoutineRow, field: keyof RoutineRow) => {
    const value = row[field];
    
    if (isEditing) {
      return (
        <textarea
          value={value}
          onChange={(e) => handleUpdate(row.id, field, e.target.value)}
          className="w-full h-full min-h-[50px] p-2 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-primary-500 outline-none resize-none"
          dir="auto"
        />
      );
    }

    if (!value) return <span className="text-slate-300">-</span>;

    const isSleep = value.includes('نـــــــــوم');
    const isWork = value.includes('دوام');
    const isProject = value.includes('مشروع') || value.includes('برمجة') || value.includes('تعلم');
    const isUni = value.includes('جامعة');
    
    let bgClass = '';
    if (isSleep) bgClass = 'bg-slate-50 text-slate-400 italic';
    else if (isWork) bgClass = 'bg-blue-50 text-blue-700';
    else if (isProject) bgClass = 'bg-indigo-50 text-indigo-700';
    else if (isUni) bgClass = 'bg-teal-50 text-teal-700';
    else bgClass = 'text-slate-700';

    return (
      <div className={`w-full h-full p-2 text-xs leading-tight rounded ${bgClass}`}>
        {value}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shadow-sm flex-shrink-0 flex justify-between items-center z-10">
        <div>
           <h1 className="text-xl font-bold text-slate-800">Weekly Schedule (24h)</h1>
           <p className="text-slate-500 text-xs mt-0.5">Full day breakdown. Empty cells represent free time.</p>
        </div>
        
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isEditing 
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {isEditing ? (
            <>
              <Save size={16} />
              <span>Save</span>
            </>
          ) : (
            <>
              <Edit2 size={16} />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
            <tr>
              <th className="p-3 border-b border-r border-slate-200 w-24 text-center text-xs font-bold text-slate-500 uppercase">
                <div className="flex items-center justify-center space-x-1">
                  <Clock size={14} />
                  <span>Time</span>
                </div>
              </th>
              <th className="p-3 border-b border-r border-slate-200 w-[13%] text-xs font-bold text-slate-700 bg-slate-50">Sat</th>
              <th className="p-3 border-b border-r border-slate-200 w-[13%] text-xs font-bold text-slate-700 bg-slate-50">Sun</th>
              <th className="p-3 border-b border-r border-slate-200 w-[13%] text-xs font-bold text-slate-700 bg-slate-50">Mon</th>
              <th className="p-3 border-b border-r border-slate-200 w-[13%] text-xs font-bold text-slate-700 bg-slate-50">Tue</th>
              <th className="p-3 border-b border-r border-slate-200 w-[13%] text-xs font-bold text-slate-700 bg-slate-50">Wed</th>
              <th className="p-3 border-b border-r border-slate-200 w-[13%] text-xs font-bold text-slate-700 bg-slate-50">Thu</th>
              <th className="p-3 border-b border-slate-200 w-[13%] text-xs font-bold text-slate-700 bg-slate-50">Fri</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schedule.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2 border-r border-slate-100 text-center text-[10px] font-mono font-medium text-slate-400 bg-slate-50/30">
                  {row.hourLabel}
                </td>
                <td className="p-1 border-r border-slate-100 align-top">{renderCell(row, 'sat')}</td>
                <td className="p-1 border-r border-slate-100 align-top">{renderCell(row, 'sun')}</td>
                <td className="p-1 border-r border-slate-100 align-top">{renderCell(row, 'mon')}</td>
                <td className="p-1 border-r border-slate-100 align-top">{renderCell(row, 'tue')}</td>
                <td className="p-1 border-r border-slate-100 align-top">{renderCell(row, 'wed')}</td>
                <td className="p-1 border-r border-slate-100 align-top">{renderCell(row, 'thu')}</td>
                <td className="p-1 align-top">{renderCell(row, 'fri')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyRoutine;