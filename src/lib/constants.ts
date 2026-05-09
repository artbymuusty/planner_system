export const DAYS_TR = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
export const DAYS_SHORT = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
export const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

export const START_HOUR = 8;
export const END_HOUR = 23;
export const HOUR_HEIGHT = 60;

export const POSTPONE_REASON_LABELS: Record<string, string> = {
  too_big: '😰 Çok büyük',
  no_time: '⏰ Zaman yok',
  dont_know: '🤷 Nereden başlasam',
  no_energy: '😴 Enerji yok',
  priorities: '🔄 Öncelik değişti',
  other: '📝 Diğer',
};

// --- Görev türü (kind) ---
import type { EventKind, EventCategory } from '@/types';

export const EVENT_KIND_LABELS: Record<EventKind, string> = {
  event: '📅 Etkinlik',
  task: '✓ Görev',
  goal: '🎯 Hedef',
};

export const EVENT_KIND_HINTS: Record<EventKind, string> = {
  event: 'Sabit saatli randevu / toplantı',
  task: 'Yapılacak iş — saat opsiyonel',
  goal: 'Büyük hedef — alt görevleri olur',
};

// --- Kategori ---
export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  personal: 'Kişisel',
  work: 'İş',
  study: 'Okul',
  health: 'Sağlık',
  other: 'Diğer',
};

export const EVENT_CATEGORY_ICONS: Record<EventCategory, string> = {
  personal: '👤',
  work: '💼',
  study: '📚',
  health: '🩺',
  other: '🏷️',
};

export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  personal: '#6366f1',
  work: '#0ea5e9',
  study: '#a855f7',
  health: '#10b981',
  other: '#64748b',
};

// --- Tahmini süre seçenekleri (Aşama 2 AddEventModal için) ---
export const ESTIMATED_MIN_OPTIONS: { value: number; label: string }[] = [
  { value: 15, label: '15 dk' },
  { value: 30, label: '30 dk' },
  { value: 60, label: '1 saat' },
  { value: 120, label: '2 saat' },
  { value: 240, label: '4 saat' },
];

// --- Tekrar paterni etiketleri ---
export const RECURRENCE_LABELS = {
  daily: 'Her gün',
  weekdays: 'Hafta içi',
  weekly: 'Haftalık',
} as const;

export const GYM_TEMPLATES = [
  {
    name: 'Push/Pull/Legs',
    exercises: [
      { day: 'Pzt', name: 'Bench Press', muscle: 'Göğüs', sets: 4, reps: 8 },
      { day: 'Pzt', name: 'Shoulder Press', muscle: 'Omuz', sets: 3, reps: 10 },
      { day: 'Pzt', name: 'Tricep Pushdown', muscle: 'Triseps', sets: 3, reps: 12 },
      { day: 'Çar', name: 'Pull-Up', muscle: 'Sırt', sets: 4, reps: 8 },
      { day: 'Çar', name: 'Barbell Row', muscle: 'Sırt', sets: 3, reps: 10 },
      { day: 'Çar', name: 'Bicep Curl', muscle: 'Biseps', sets: 3, reps: 12 },
      { day: 'Cum', name: 'Squat', muscle: 'Bacak', sets: 4, reps: 8 },
      { day: 'Cum', name: 'Leg Press', muscle: 'Bacak', sets: 3, reps: 12 },
      { day: 'Cum', name: 'Calf Raise', muscle: 'Baldır', sets: 3, reps: 15 },
    ],
  },
  {
    name: 'Full Body',
    exercises: [
      { day: 'Pzt', name: 'Squat', muscle: 'Bacak', sets: 3, reps: 10 },
      { day: 'Pzt', name: 'Push-Up', muscle: 'Göğüs', sets: 3, reps: 12 },
      { day: 'Pzt', name: 'Dumbbell Row', muscle: 'Sırt', sets: 3, reps: 10 },
      { day: 'Çar', name: 'Deadlift', muscle: 'Sırt/Bacak', sets: 3, reps: 8 },
      { day: 'Çar', name: 'Overhead Press', muscle: 'Omuz', sets: 3, reps: 10 },
      { day: 'Cum', name: 'Lunge', muscle: 'Bacak', sets: 3, reps: 12 },
      { day: 'Cum', name: 'Plank', muscle: 'Core', sets: 3, reps: 30 },
    ],
  },
  {
    name: 'Upper/Lower',
    exercises: [
      { day: 'Pzt', name: 'Bench Press', muscle: 'Göğüs', sets: 4, reps: 8 },
      { day: 'Pzt', name: 'Pull-Up', muscle: 'Sırt', sets: 3, reps: 10 },
      { day: 'Sal', name: 'Squat', muscle: 'Bacak', sets: 4, reps: 8 },
      { day: 'Sal', name: 'Leg Curl', muscle: 'Bacak', sets: 3, reps: 12 },
      { day: 'Per', name: 'Shoulder Press', muscle: 'Omuz', sets: 3, reps: 10 },
      { day: 'Per', name: 'Barbell Row', muscle: 'Sırt', sets: 4, reps: 8 },
      { day: 'Cum', name: 'Deadlift', muscle: 'Sırt', sets: 4, reps: 6 },
      { day: 'Cum', name: 'Leg Press', muscle: 'Bacak', sets: 3, reps: 12 },
    ],
  },
];
