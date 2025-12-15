// Enums for core classification
export enum Domain {
  Personal = 'Personal',
  Programmer = 'Programmer',
  Founder = 'Founder',
  Company = 'Company',
  Family = 'Family',
}

export enum EnergyLevel {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum EisenhowerQuadrant {
  Do = 'Do', // Important & Urgent
  Decide = 'Decide', // Important & Not Urgent
  Delegate = 'Delegate', // Not Important & Urgent
  Delete = 'Delete', // Not Important & Not Urgent
}

export enum Priority {
  P1 = 'P1', // Critical
  P2 = 'P2', // High
  P3 = 'P3', // Normal
  P4 = 'P4', // Low
}

// Entities
export interface Task {
  id: string;
  title: string;
  domain: Domain;
  quadrant: EisenhowerQuadrant;
  // Energy Removed as per request, keeping optional for legacy data compatibility if needed
  energy?: EnergyLevel; 
  priority: Priority;
  completed: boolean;
  estimatedPomodoros: number;
  pomodoroDuration: number; // New field: Duration in minutes (25, 45, 60)
  completedPomodoros: number;
  createdAt: number;
  dueDate?: number; // Optional
  assignedWeek?: string; // Format: "YYYY-W##" (e.g., "2026-W01")
  targetYear?: number; // New: For broad planning
  targetQuarter?: number; // New: 1, 2, 3, 4
}

export interface Habit {
  id: string;
  title: string;
  domain: Domain;
  streak: number;
  completedToday: boolean;
  frequency: 'Daily' | 'Weekly';
}

export interface PomodoroSession {
  id: string;
  taskId?: string; // Can be a freestyle focus
  domain: Domain;
  startTime: number;
  durationMinutes: number;
  completed: boolean;
}

// View State Types
export type ViewState = 
  | { type: 'DASHBOARD' }
  | { type: 'DOMAIN'; domain: Domain }
  | { type: 'PLANNING'; interval: 'Daily' | 'Weekly' | 'Quarterly' }
  | { type: 'FOCUS' }
  | { type: 'REVIEW' };