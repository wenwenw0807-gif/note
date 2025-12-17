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