export enum TaskCategory {
  VOCABULARY = '词汇',
  GRAMMAR = '语法',
  LISTENING = '听力',
  READING = '阅读',
  SPEAKING = '口语'
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  durationMinutes: number;
  completed: boolean;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  tasksCompleted: number;
  focusScore: number; // 0-100
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssessmentResult {
  score: number;
  total: number;
  feedback: string;
  timestamp: number;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
  totalSeconds: number;
}

export enum TimerPreset {
  POMODORO = '番茄钟 (25分钟)',
  SHORT_BREAK = '短休息 (5分钟)',
  LONG_BREAK = '长休息 (15分钟)',
  CUSTOM = '自定义'
}