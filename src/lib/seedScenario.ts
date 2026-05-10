/**
 * Test senaryosu üretici.
 *
 * `seedScenario()` çağrılınca:
 *   - "bugün" referans alınarak 14 gün geçmiş + bugün + 7 gün gelecek aralığında
 *     gerçekçi bir görev/etkinlik dağılımı üretir
 *   - Tamamlanmış / tamamlanmamış / kronik ertelenmiş örnekler içerir
 *   - Tüm modüller (ilaç, su, spor, doğum günü, bütçe, uyku, hedefler) için
 *     örnek veri içerir → tüm overlay'lerde içerik gözükür
 *
 * Her çağrıda timestamp tabanlı stabil ID'ler üretilir (collision yok).
 */

import type {
  PlannerEvent,
  ModuleState,
  User,
  PostponeHistory,
} from '@/types';
import { formatDate } from '@/lib/dateUtils';

// Yardımcı: bugünden N gün önceki/sonraki tarihi YYYY-MM-DD döndürür
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

function ph(from: string, to: string, reason: string, daysAgo = 0): PostponeHistory {
  return { from, to, reason, timestamp: Date.now() - daysAgo * 86_400_000 };
}

function buildEvents(): PlannerEvent[] {
  const events: PlannerEvent[] = [];

  // ============ GEÇMİŞ 14 GÜN ============
  // Tamamlanma oranı yüksek, ama 2-3 tane kronik ertelenmiş ve birkaç eksik

  events.push({
    id: genId('ev'),
    name: 'Sabah koşusu',
    date: shiftDate(-14),
    startTime: '07:00', endTime: '07:45',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-14),
    subTasks: [], parentId: null,
    kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Q2 inceleme toplantısı',
    date: shiftDate(-13),
    startTime: '14:00', endTime: '15:30',
    importance: 'high', completed: true,
    postponeCount: 1,
    postponeHistory: [ph(shiftDate(-15), shiftDate(-13), 'unexpected', 13)],
    originalDate: shiftDate(-15),
    subTasks: [], parentId: null,
    kind: 'event', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Doktor kontrolü',
    date: shiftDate(-12),
    startTime: '10:30', endTime: '11:30',
    importance: 'high', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-12),
    subTasks: [], parentId: null,
    kind: 'event', category: 'health',
  });

  // KRONİK ERTELENMİŞ (3+) — hâlâ tamamlanmamış
  events.push({
    id: genId('ev'),
    name: 'Çeyrek sonu raporu',
    date: shiftDate(-3),
    startTime: '09:00', endTime: '12:00',
    importance: 'high', completed: false,
    postponeCount: 4,
    postponeHistory: [
      ph(shiftDate(-11), shiftDate(-9), 'tired', 11),
      ph(shiftDate(-9), shiftDate(-7), 'overload', 9),
      ph(shiftDate(-7), shiftDate(-5), 'unexpected', 7),
      ph(shiftDate(-5), shiftDate(-3), 'lazy', 5),
    ],
    originalDate: shiftDate(-11),
    subTasks: [], parentId: null,
    kind: 'task', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Spor antrenmanı',
    date: shiftDate(-10),
    startTime: '18:00', endTime: '19:30',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-10),
    subTasks: [], parentId: null,
    kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Kitap okuma — "Atomic Habits"',
    date: shiftDate(-9),
    startTime: '', endTime: '',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-9),
    subTasks: [], parentId: null,
    kind: 'task', category: 'study',
    allDay: true, estimatedMin: 60,
  });

  events.push({
    id: genId('ev'),
    name: 'Vergi beyannamesi',
    date: shiftDate(-8),
    startTime: '15:00', endTime: '17:00',
    importance: 'high', completed: false,
    postponeCount: 1,
    postponeHistory: [ph(shiftDate(-10), shiftDate(-8), 'lazy', 10)],
    originalDate: shiftDate(-10),
    subTasks: [], parentId: null,
    kind: 'task', category: 'personal',
  });

  events.push({
    id: genId('ev'),
    name: 'Kahvaltı buluşması',
    date: shiftDate(-7),
    startTime: '09:30', endTime: '11:00',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-7),
    subTasks: [], parentId: null,
    kind: 'event', category: 'personal',
  });

  events.push({
    id: genId('ev'),
    name: 'Proje sunumu',
    date: shiftDate(-6),
    startTime: '11:00', endTime: '12:30',
    importance: 'high', completed: true,
    postponeCount: 1,
    postponeHistory: [ph(shiftDate(-7), shiftDate(-6), 'unexpected', 7)],
    originalDate: shiftDate(-7),
    subTasks: [], parentId: null,
    kind: 'event', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Yoga seansı',
    date: shiftDate(-5),
    startTime: '07:00', endTime: '08:00',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-5),
    subTasks: [], parentId: null,
    kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Aile yemeği',
    date: shiftDate(-4),
    startTime: '20:00', endTime: '22:30',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-4),
    subTasks: [], parentId: null,
    kind: 'event', category: 'personal',
  });

  // 2 KEZ ERTELENMİŞ — hâlâ tamamlanmamış
  events.push({
    id: genId('ev'),
    name: 'Online React kursu',
    date: shiftDate(-3),
    startTime: '20:00', endTime: '21:30',
    importance: 'medium', completed: false,
    postponeCount: 2,
    postponeHistory: [
      ph(shiftDate(-7), shiftDate(-5), 'tired', 7),
      ph(shiftDate(-5), shiftDate(-3), 'overload', 5),
    ],
    originalDate: shiftDate(-7),
    subTasks: [], parentId: null,
    kind: 'task', category: 'study',
  });

  events.push({
    id: genId('ev'),
    name: 'Fatura ödemeleri',
    date: shiftDate(-2),
    startTime: '', endTime: '',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-2),
    subTasks: [], parentId: null,
    kind: 'task', category: 'personal',
    allDay: true, estimatedMin: 30,
  });

  events.push({
    id: genId('ev'),
    name: 'Haftalık planlama',
    date: shiftDate(-1),
    startTime: '17:00', endTime: '18:00',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-1),
    subTasks: [], parentId: null,
    kind: 'task', category: 'work',
  });

  // ============ BUGÜN ============
  events.push({
    id: genId('ev'),
    name: 'Sabah meditasyonu',
    date: shiftDate(0),
    startTime: '', endTime: '',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'task', category: 'health',
    allDay: true, estimatedMin: 15,
  });

  events.push({
    id: genId('ev'),
    name: 'Stand-up toplantı',
    date: shiftDate(0),
    startTime: '09:00', endTime: '09:30',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'event', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'E-postaları yanıtla',
    date: shiftDate(0),
    startTime: '10:00', endTime: '11:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'task', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Müşteri öğle yemeği',
    date: shiftDate(0),
    startTime: '12:30', endTime: '14:00',
    importance: 'high', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'event', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Blog yazısı taslağı',
    date: shiftDate(0),
    startTime: '16:00', endTime: '18:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'task', category: 'study',
  });

  // ============ GELECEK 7 GÜN ============
  events.push({
    id: genId('ev'),
    name: 'Diş hekimi randevusu',
    date: shiftDate(1),
    startTime: '14:00', endTime: '15:00',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(1),
    subTasks: [], parentId: null,
    kind: 'event', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Spor salonu',
    date: shiftDate(2),
    startTime: '18:30', endTime: '20:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(2),
    subTasks: [], parentId: null,
    kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Ekip retrospektif',
    date: shiftDate(2),
    startTime: '15:00', endTime: '16:30',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(2),
    subTasks: [], parentId: null,
    kind: 'event', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Kitap kulübü',
    date: shiftDate(3),
    startTime: '19:00', endTime: '21:00',
    importance: 'low', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(3),
    subTasks: [], parentId: null,
    kind: 'event', category: 'personal',
  });

  events.push({
    id: genId('ev'),
    name: 'Hediye al — Anneye',
    date: shiftDate(5),
    startTime: '', endTime: '',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(5),
    subTasks: [], parentId: null,
    kind: 'task', category: 'personal',
    allDay: true, estimatedMin: 60,
  });

  events.push({
    id: genId('ev'),
    name: 'Sunum hazırlığı',
    date: shiftDate(7),
    startTime: '10:00', endTime: '13:00',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(7),
    subTasks: [], parentId: null,
    kind: 'task', category: 'work',
  });

  return events;
}

function buildModules(): ModuleState {
  // Su logu — son 7 gün
  const waterLog: ModuleState['water']['log'] = {};
  for (let i = -6; i <= 0; i++) {
    const date = shiftDate(i);
    const total = i === 0 ? 1500 : 1800 + Math.round(Math.random() * 600);
    waterLog[date] = {
      total,
      entries: [
        { amount: 500, time: '08:30' },
        { amount: 500, time: '12:00' },
        { amount: total - 1000, time: '17:30' },
      ],
    };
  }

  // Uyku logları — son 7 gün
  const sleepLogs: ModuleState['sleep']['logs'] = [];
  for (let i = -6; i <= -1; i++) {
    const date = shiftDate(i);
    const sleepHour = 23 + Math.floor(Math.random() * 2); // 23-00
    const sleepTime = `${String(sleepHour % 24).padStart(2, '0')}:${Math.random() > 0.5 ? '30' : '00'}`;
    const wakeHour = 7;
    const wakeTime = `${String(wakeHour).padStart(2, '0')}:${Math.random() > 0.5 ? '15' : '30'}`;
    const duration = 7.5 + Math.random();
    sleepLogs.push({
      id: genId('sleep'),
      date,
      sleepTime,
      wakeTime,
      duration: Math.round(duration * 10) / 10,
    });
  }

  return {
    medicines: [
      {
        id: genId('med'),
        name: 'D Vitamini',
        dosage: '1000 IU',
        frequency: ['Sabah'],
        days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        duration: 60,
        boxSize: 30,
        remaining: 22,
        startDate: shiftDate(-8),
        takenLog: {
          [shiftDate(-1)]: ['Sabah'],
          [shiftDate(-2)]: ['Sabah'],
          [shiftDate(0)]: ['Sabah'],
        },
      },
      {
        id: genId('med'),
        name: 'Magnezyum',
        dosage: '300 mg',
        frequency: ['Akşam'],
        days: ['Pzt', 'Çar', 'Cum'],
        duration: 30,
        boxSize: 60,
        remaining: 48,
        startDate: shiftDate(-12),
        takenLog: {
          [shiftDate(-1)]: ['Akşam'],
          [shiftDate(-3)]: ['Akşam'],
        },
      },
    ],
    water: {
      height: 178,
      weight: 75,
      age: 28,
      gender: 'male',
      dailyGoal: 2500,
      log: waterLog,
    },
    gym: {
      programs: [
        {
          id: genId('prog'),
          name: 'Push/Pull/Legs',
          exercises: [
            { id: genId('ex'), name: 'Bench Press', muscle: 'Göğüs', sets: 4, reps: 8, day: 'Pzt' },
            { id: genId('ex'), name: 'Incline DB Press', muscle: 'Göğüs', sets: 3, reps: 10, day: 'Pzt' },
            { id: genId('ex'), name: 'Lat Pulldown', muscle: 'Sırt', sets: 4, reps: 10, day: 'Çar' },
            { id: genId('ex'), name: 'Barbell Row', muscle: 'Sırt', sets: 4, reps: 8, day: 'Çar' },
            { id: genId('ex'), name: 'Squat', muscle: 'Bacak', sets: 5, reps: 5, day: 'Cum' },
            { id: genId('ex'), name: 'Romanian Deadlift', muscle: 'Bacak', sets: 3, reps: 10, day: 'Cum' },
          ],
        },
      ],
      activeProgram: null, // ilk programın id'sini aşağıda set ediyoruz
      exerciseLog: {},
    },
    birthdays: [
      {
        id: genId('bday'),
        name: 'Anne',
        date: shiftDate(5),
        giftPlanned: true,
        giftIdea: 'El yapımı kart + favori parfüm',
        giftPrice: 600,
        giftBuyBy: shiftDate(4),
      },
      {
        id: genId('bday'),
        name: 'Ahmet (kardeş)',
        date: shiftDate(18),
        giftPlanned: false,
      },
      {
        id: genId('bday'),
        name: 'Elif',
        date: shiftDate(40),
        giftPlanned: false,
      },
    ],
    budget: {
      income: 35000,
      expenses: [
        { id: genId('exp'), name: 'Kira', amount: 12000, category: 'Kira', date: shiftDate(-5) },
        { id: genId('exp'), name: 'Market', amount: 2400, category: 'Yiyecek', date: shiftDate(-3) },
        { id: genId('exp'), name: 'Elektrik', amount: 850, category: 'Faturalar', date: shiftDate(-2) },
        { id: genId('exp'), name: 'İnternet', amount: 420, category: 'Faturalar', date: shiftDate(-2) },
        { id: genId('exp'), name: 'Sinema', amount: 250, category: 'Eğlence', date: shiftDate(-7) },
        { id: genId('exp'), name: 'Yakıt', amount: 1500, category: 'Ulaşım', date: shiftDate(-4) },
      ],
      shoppingLists: [
        {
          id: genId('shop'),
          name: 'Hafta sonu marketi',
          date: shiftDate(0),
          items: [
            { text: 'Süt 2L', checked: true },
            { text: 'Tam buğday ekmek', checked: true },
            { text: 'Yumurta (15)', checked: false },
            { text: 'Domates 1kg', checked: false },
            { text: 'Yoğurt', checked: false },
          ],
        },
      ],
    },
    sleep: {
      logs: sleepLogs,
      goalMin: 7,
      goalMax: 9,
    },
    goals: [
      {
        id: genId('goal'),
        name: 'Yılda 24 kitap',
        target: 24,
        current: 9,
        unit: 'kitap',
        step: 1,
        icon: '📚',
      },
      {
        id: genId('goal'),
        name: 'Tatil için birikim',
        target: 50000,
        current: 18500,
        unit: '₺',
        step: 1000,
        icon: '✈️',
      },
      {
        id: genId('goal'),
        name: 'Haftalık antrenman',
        target: 4,
        current: 2,
        unit: 'gün',
        step: 1,
        icon: '💪',
      },
    ],
  };
}

export interface SeedScenario {
  user: User;
  events: PlannerEvent[];
  modules: ModuleState;
}

export function seedScenario(): SeedScenario {
  const events = buildEvents();
  const modules = buildModules();

  // Aktif programı ilk programa bağla
  if (modules.gym.programs[0]) {
    modules.gym.activeProgram = modules.gym.programs[0].id;
    // Birkaç egzersiz log'u ekle (log key biçimi: `${exerciseId}_${dateStr}`)
    const today = shiftDate(0);
    const exIds = modules.gym.programs[0].exercises.slice(0, 2).map(e => e.id);
    exIds.forEach(eid => {
      modules.gym.exerciseLog[`${eid}_${today}`] = true;
    });
  }

  return {
    user: { name: 'Test Kullanıcı' },
    events,
    modules,
  };
}

export function emptyModuleState(): ModuleState {
  return {
    medicines: [],
    water: { height: 0, weight: 0, age: 0, gender: 'male', dailyGoal: 2500, log: {} },
    gym: { programs: [], activeProgram: null, exerciseLog: {} },
    birthdays: [],
    budget: { income: 0, expenses: [], shoppingLists: [] },
    sleep: { logs: [], goalMin: 7, goalMax: 9 },
    goals: [],
  };
}
