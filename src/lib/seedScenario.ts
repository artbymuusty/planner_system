/**
 * Zenith - The Life Tracker
 * Demo Senaryosu - Asıl Koray Alma (Bilgisayar Mühendisliği 1. Sınıf)
 */

import type {
  PlannerEvent,
  ModuleState,
  User,
  PostponeHistory,
  JournalEntry,
} from '@/types';
import { formatDate } from '@/lib/dateUtils';

function shiftDate(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

let idCounter = 0;
function genId(prefix: string): string {
  idCounter++;
  return `${prefix}_${Date.now().toString(36)}_${idCounter}`;
}

function buildEvents(): PlannerEvent[] {
  const events: PlannerEvent[] = [];
  const today = shiftDate(0);

  events.push({
    id: genId('ev'),
    name: 'Sabah Meditasyonu & Odaklanma',
    date: today, startTime: '08:30', endTime: '09:00',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: today,
    subTasks: [], parentId: null,
    kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Veri Yapıları - Linked List Uygulaması',
    date: today, startTime: '10:00', endTime: '12:30',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: today,
    subTasks: [], parentId: null,
    kind: 'task', category: 'study',
  });

  events.push({
    id: genId('ev'),
    name: 'Zenith Projesi - AI Widget Entegrasyonu',
    date: today, startTime: '14:00', endTime: '17:00',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: today,
    subTasks: [], parentId: null,
    kind: 'task', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Fitness - Push Day (Göğüs/Triceps)',
    date: today, startTime: '18:30', endTime: '20:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: today,
    subTasks: [], parentId: null,
    kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Fizik-1 Vize Sınavı',
    date: shiftDate(3), startTime: '10:00', endTime: '12:00',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(3),
    subTasks: [], parentId: null,
    kind: 'event', category: 'study',
  });

  return events;
}

function buildModules(): ModuleState {
  const today = shiftDate(0);
  const journalEntries: Record<string, JournalEntry> = {};

  journalEntries[shiftDate(-1)] = {
    id: genId('jrn'),
    date: shiftDate(-1),
    title: 'Zenith Yolculuğu Başlıyor',
    content: 'Bugün Zenith projesinin temellerini attık. Vizyonumuz büyük: Hayatı tek bir noktadan yönetmek. Takım arkadaşlarımla ilk toplantımızı yaptık.',
    mood: 'amazing',
    gratitude: ['Yeni başlangıçlar', 'Teknoloji', 'Umut Yalçın & Mustafa Furkan'],
    weather: '☀️ Güneşli',
    paperStyle: 'lined',
    quote: 'Küçük adımlar büyük yolculukların başlangıcıdır.',
    color: '#dbeafe',
  };

  return {
    medicines: [
      { id: genId('med'), name: 'Lansor', dosage: '30mg', frequency: ['Sabah'], days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'], duration: 28, boxSize: 28, remaining: 14, startDate: shiftDate(-14), takenLog: {} },
      { id: genId('med'), name: 'B12 Vitamini', dosage: '1000mcg', frequency: ['Öğle'], days: ['Pzt', 'Çar', 'Cum'], duration: 60, boxSize: 60, remaining: 45, startDate: shiftDate(-15), takenLog: {} },
    ],
    water: { height: 180, weight: 75, age: 19, gender: 'male', dailyGoal: 2500, log: { [today]: { total: 1550, entries: [] } } },
    gym: {
      programs: [{ id: genId('prog'), name: 'Engineering Fitness', exercises: [{ id: genId('ex'), name: 'Bench Press', muscle: 'Chest', sets: 4, reps: 8, day: 'Pzt' }] }],
      activeProgram: null,
      exerciseLog: {},
    },
    birthdays: [{ id: genId('bday'), name: 'Umut Yalçın', date: shiftDate(10), giftPlanned: true, giftIdea: 'Mekanik Klavye', giftBought: false }],
    budget: { 
      income: 20000, 
      expenses: [
        { id: genId('exp'), name: 'Kahve', amount: 85, category: 'Yiyecek', date: today },
        { id: genId('exp'), name: 'Spotify', amount: 40, category: 'Eğlence', date: shiftDate(-5) }
      ], 
      shoppingLists: [{ id: genId('shop'), name: 'Haftalık Market', date: today, items: [{ text: 'Süt', checked: true }, { text: 'Yumurta', checked: false }] }] 
    },
    sleep: { logs: [], goalMin: 7, goalMax: 9 },
    goals: [
      { id: genId('goal'), name: 'Macbook Pro 16" Almak', target: 50000, current: 18500, unit: '₺', step: 1000, icon: '💻' },
      { id: genId('goal'), name: 'Python Öğrenmek', target: 100, current: 45, unit: '%', step: 5, icon: '🐍' }
    ],
    study: { subjects: [{ id: 'sub_ds', name: 'Veri Yapıları', color: '#6366f1', resources: [] }, { id: 'sub_phys', name: 'Fizik-1', color: '#f87171', resources: [] }], sessions: [] },
    journal: { entries: journalEntries },
  };
}

export function seedScenario() {
  const modules = buildModules();
  // İlk programı aktif yap
  if (modules.gym.programs[0]) modules.gym.activeProgram = modules.gym.programs[0].id;

  return {
    events: buildEvents(),
    modules: modules,
    user: { id: 'user_koray', name: 'Asıl Koray Alma', email: 'koray@zenith.ai', avatar: null }
  };
}

export function emptyModuleState(): ModuleState {
  return {
    medicines: [],
    water: { height: 180, weight: 75, age: 19, gender: 'male', dailyGoal: 2500, log: {} },
    gym: { programs: [], activeProgram: null, exerciseLog: {} },
    birthdays: [],
    budget: { income: 0, expenses: [], shoppingLists: [] },
    sleep: { logs: [], goalMin: 7, goalMax: 9 },
    goals: [],
    study: { sessions: [], subjects: [] },
    journal: { entries: {} },
  };
}
