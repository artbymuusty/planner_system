export interface PostponeHistory {
  from: string;
  to: string;
  reason: string;
  timestamp: number;
}

/**
 * Bir öğenin türü.
 * - event: Sabit saatli randevu/toplantı (eski "etkinlik" davranışı, default)
 * - task : Yapılacak iş — saat opsiyonel; tahmini süresi olabilir
 * - goal : Büyük hedef container'ı — alt görevleri (parentId ile) bağlanır
 */
export type EventKind = 'event' | 'task' | 'goal';

/**
 * Görev/etkinlik kategorisi.
 * Sidebar'daki "Takvimlerim" filtreleri bu alana bağlanacak (Aşama 5).
 */
export type EventCategory = 'personal' | 'work' | 'study' | 'health' | 'other';

export type RecurrencePattern = 'daily' | 'weekdays' | 'weekly';

export interface Recurrence {
  pattern: RecurrencePattern;
  /** Opsiyonel bitiş tarihi (YYYY-MM-DD). Yoksa süresiz. */
  until?: string;
}

export interface PlannerEvent {
  id: string;
  name: string;
  /** Opsiyonel açıklama — özellikle hedeflerde detay vermek için. */
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  importance: 'high' | 'medium' | 'low';
  completed: boolean;
  postponeCount: number;
  postponeHistory: PostponeHistory[];
  originalDate: string;
  subTasks: string[];
  parentId: string | null;
  parentName?: string;
  /** Modül kaynaklı event'ler için işaret (ör: 'birthday', 'medicine'). */
  moduleType?: string;

  // --- YENİ alanlar (Aşama 1) -------------------------------------------
  /** Öğenin türü. Eski kayıtlarda yoksa migration 'event' atar. */
  kind: EventKind;
  /** Kategori. Eski kayıtlarda yoksa migration 'personal' atar. */
  category: EventCategory;
  /** Tahmini süre (dakika). Slot ile bağımsız — saatsiz görevlerde anlamlı. */
  estimatedMin?: number;
  /** Saat seçilmediyse true → saatsiz görev "all-day shelf"de gösterilir. */
  allDay?: boolean;
  /** Tekrar paterni — ayarlandıysa render zamanında çoğaltılır. */
  recurrence?: Recurrence;
  /** Tekrarlayan görevin hangi tarihlerde tamamlandığı (YYYY-MM-DD). */
  completedDates?: string[];
}

export interface User {
  name: string;
}

export interface PlannerState {
  currentWeekStart: Date;
  events: PlannerEvent[];
  user: User | null;
  deleteMode: boolean;
  pendingDeleteId: string | null;
  pendingReaddEvent: PlannerEvent | null;
  pendingSplitEvent: PlannerEvent | null;
  selectedImportance: 'high' | 'medium' | 'low';
}

// Module types
export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string[];
  days: string[];
  duration: number;
  boxSize: number;
  remaining: number;
  startDate: string;
  takenLog: Record<string, string[]>;
}

export interface WaterLog {
  total: number;
  entries: { amount: number; time: string }[];
}

export interface WaterState {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  dailyGoal: number;
  log: Record<string, WaterLog>;
}

export interface GymExercise {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: number;
  day: string;
  completed?: boolean;
}

export interface GymProgram {
  id: string;
  name: string;
  exercises: GymExercise[];
}

export interface GymState {
  programs: GymProgram[];
  activeProgram: string | null;
  exerciseLog: Record<string, boolean>;
}

export interface Birthday {
  id: string;
  name: string;
  date: string;
  giftPlanned: boolean;
  giftIdea?: string;
  giftPrice?: number;
  giftBuyBy?: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  date: string;
  items: { text: string; checked: boolean }[];
}

export interface BudgetState {
  income: number;
  expenses: Expense[];
  shoppingLists: ShoppingList[];
}

export interface SleepLog {
  id: string;
  date: string;
  sleepTime: string;
  wakeTime: string;
  duration: number;
}

export interface SleepState {
  logs: SleepLog[];
  goalMin: number;
  goalMax: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  step: number;
  icon: string;
}

export interface ModuleState {
  medicines: Medicine[];
  water: WaterState;
  gym: GymState;
  birthdays: Birthday[];
  budget: BudgetState;
  sleep: SleepState;
  goals: Goal[];
}

// Weekly Tracker types
export interface WeeklyHabit {
  id: string;
  name: string;
  /** Hangi günlerde tamamlandı — key: "YYYY-MM-DD" */
  completedDays: Record<string, boolean>;
}

export interface WeeklyTodo {
  id: string;
  text: string;
  completed: boolean;
}

export type ActiveModule = 'medicine' | 'water' | 'gym' | 'birthday' | 'budget' | 'sleep' | 'goals' | 'statistics' | null;
export type ActiveModal = 'login' | 'addEvent' | 'delete' | 'postpone' | 'split' | null;
