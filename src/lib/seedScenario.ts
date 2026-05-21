/**
 * Zenith - The Life Tracker
 * Demo Senaryosu - Asıl Koray Alma (Bilgisayar Mühendisliği 1. Sınıf)
 * Her modül ekran görüntüsü alınabilecek şekilde dolu veri içerir.
 */

import type {
  PlannerEvent,
  ModuleState,
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
  return `${prefix}_seed_${idCounter}`;
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────

function buildEvents(): PlannerEvent[] {
  const events: PlannerEvent[] = [];

  // ── Geçmiş tamamlanmış görevler (14 gün) ─────────────────────────────────

  for (let d = -14; d <= -8; d++) {
    const date = shiftDate(d);

    events.push({
      id: genId('ev'),
      name: 'Sabah Koşusu',
      date, startTime: '07:00', endTime: '07:45',
      importance: 'medium', completed: true,
      postponeCount: 0, postponeHistory: [], originalDate: date,
      subTasks: [], parentId: null, kind: 'task', category: 'health',
    });

    if (d % 2 === 0) {
      events.push({
        id: genId('ev'),
        name: 'Veri Yapıları Ders Çalışması',
        date, startTime: '10:00', endTime: '12:00',
        importance: 'high', completed: true,
        postponeCount: 0, postponeHistory: [], originalDate: date,
        subTasks: [], parentId: null, kind: 'task', category: 'study',
      });
    }

    events.push({
      id: genId('ev'),
      name: 'Fizik-1 Problem Seti',
      date, startTime: '14:00', endTime: '15:30',
      importance: 'high', completed: d < -10,
      postponeCount: 0, postponeHistory: [], originalDate: date,
      subTasks: [], parentId: null, kind: 'task', category: 'study',
    });
  }

  // ── Ertelenmiş görevler — Erteleme Analizi için ───────────────────────────

  const erteleme1Id = genId('ev');
  events.push({
    id: erteleme1Id,
    name: 'Lineer Cebir Ödevi',
    date: shiftDate(-3),
    startTime: '10:00', endTime: '12:00',
    importance: 'high', completed: false,
    postponeCount: 3,
    postponeHistory: [
      { from: shiftDate(-10), to: shiftDate(-7), reason: 'no_energy', timestamp: Date.now() - 864000000 },
      { from: shiftDate(-7),  to: shiftDate(-5), reason: 'too_big',   timestamp: Date.now() - 604800000 },
      { from: shiftDate(-5),  to: shiftDate(-3), reason: 'no_time',   timestamp: Date.now() - 432000000 },
    ],
    originalDate: shiftDate(-10),
    subTasks: [], parentId: null, kind: 'task', category: 'study',
  });

  const erteleme2Id = genId('ev');
  events.push({
    id: erteleme2Id,
    name: 'Zenith Projesi — Rapor Yazımı',
    date: shiftDate(-1),
    startTime: '15:00', endTime: '17:00',
    importance: 'high', completed: false,
    postponeCount: 4,
    postponeHistory: [
      { from: shiftDate(-8), to: shiftDate(-6), reason: 'dont_know',   timestamp: Date.now() - 691200000 },
      { from: shiftDate(-6), to: shiftDate(-4), reason: 'no_energy',   timestamp: Date.now() - 518400000 },
      { from: shiftDate(-4), to: shiftDate(-2), reason: 'priorities',  timestamp: Date.now() - 345600000 },
      { from: shiftDate(-2), to: shiftDate(-1), reason: 'too_big',     timestamp: Date.now() - 172800000 },
    ],
    originalDate: shiftDate(-8),
    subTasks: [], parentId: null, kind: 'task', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Diş Hekimi Randevusu',
    date: shiftDate(-6),
    startTime: '11:00', endTime: '12:00',
    importance: 'medium', completed: false,
    postponeCount: 2,
    postponeHistory: [
      { from: shiftDate(-13), to: shiftDate(-9), reason: 'priorities', timestamp: Date.now() - 1123200000 },
      { from: shiftDate(-9),  to: shiftDate(-6), reason: 'no_time',    timestamp: Date.now() - 777600000 },
    ],
    originalDate: shiftDate(-13),
    subTasks: [], parentId: null, kind: 'event', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Portfolio Güncelleme',
    date: shiftDate(-4),
    startTime: '19:00', endTime: '20:30',
    importance: 'low', completed: false,
    postponeCount: 2,
    postponeHistory: [
      { from: shiftDate(-9), to: shiftDate(-6), reason: 'no_energy', timestamp: Date.now() - 777600000 },
      { from: shiftDate(-6), to: shiftDate(-4), reason: 'other',     timestamp: Date.now() - 518400000 },
    ],
    originalDate: shiftDate(-9),
    subTasks: [], parentId: null, kind: 'task', category: 'work',
  });

  // ── Geçmiş haftadan bazı tamamlanmış görevler ─────────────────────────────

  events.push({
    id: genId('ev'),
    name: 'Algoritma Ödev Teslimi',
    date: shiftDate(-7), startTime: '23:00', endTime: '23:59',
    importance: 'high', completed: true,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(-7),
    subTasks: [], parentId: null, kind: 'task', category: 'study',
  });

  events.push({
    id: genId('ev'),
    name: 'Arkadaşlarla Kahve',
    date: shiftDate(-5), startTime: '16:00', endTime: '17:30',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(-5),
    subTasks: [], parentId: null, kind: 'event', category: 'personal',
  });

  events.push({
    id: genId('ev'),
    name: 'Fitness — Pull Day (Sırt/Biseps)',
    date: shiftDate(-5), startTime: '18:30', endTime: '20:00',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(-5),
    subTasks: [], parentId: null, kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Hukuka Giriş Ders Notu',
    date: shiftDate(-4), startTime: '13:00', endTime: '14:30',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(-4),
    subTasks: [], parentId: null, kind: 'task', category: 'study',
  });

  events.push({
    id: genId('ev'),
    name: 'Haftalık Alışveriş',
    date: shiftDate(-3), startTime: '11:00', endTime: '12:00',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(-3),
    subTasks: [], parentId: null, kind: 'task', category: 'personal',
  });

  events.push({
    id: genId('ev'),
    name: 'Fitness — Leg Day',
    date: shiftDate(-3), startTime: '18:00', endTime: '19:30',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(-3),
    subTasks: [], parentId: null, kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Python Kurs — Bölüm 5',
    date: shiftDate(-2), startTime: '20:00', endTime: '21:30',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(-2),
    subTasks: [], parentId: null, kind: 'task', category: 'study',
  });

  events.push({
    id: genId('ev'),
    name: 'Zenith — UI Test & Bug Fix',
    date: shiftDate(-2), startTime: '14:00', endTime: '17:00',
    importance: 'high', completed: true,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(-2),
    subTasks: [], parentId: null, kind: 'task', category: 'work',
  });

  // ── Bugün ─────────────────────────────────────────────────────────────────

  const today = shiftDate(0);

  events.push({
    id: genId('ev'),
    name: 'Sabah Meditasyonu & Odaklanma',
    date: today, startTime: '08:30', endTime: '09:00',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [], originalDate: today,
    subTasks: [], parentId: null, kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Veri Yapıları — Linked List Uygulaması',
    date: today, startTime: '10:00', endTime: '12:30',
    importance: 'high', completed: false,
    postponeCount: 1,
    postponeHistory: [
      { from: shiftDate(-1), to: today, reason: 'no_energy', timestamp: Date.now() - 86400000 },
    ],
    originalDate: shiftDate(-1),
    subTasks: [], parentId: null, kind: 'task', category: 'study',
  });

  events.push({
    id: genId('ev'),
    name: 'Zenith — AI Widget Entegrasyonu',
    date: today, startTime: '14:00', endTime: '17:00',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: today,
    subTasks: [], parentId: null, kind: 'task', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Fitness — Push Day (Göğüs/Triceps)',
    date: today, startTime: '18:30', endTime: '20:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: today,
    subTasks: [], parentId: null, kind: 'task', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Akşam Kitap Okuma',
    date: today, startTime: '21:00', endTime: '22:00',
    importance: 'low', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: today,
    subTasks: [], parentId: null, kind: 'task', category: 'personal',
  });

  // ── Gelecek 7 gün ─────────────────────────────────────────────────────────

  events.push({
    id: genId('ev'),
    name: 'Fizik-1 Vize Sınavı',
    date: shiftDate(3), startTime: '10:00', endTime: '12:00',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(3),
    subTasks: [], parentId: null, kind: 'event', category: 'study',
  });

  events.push({
    id: genId('ev'),
    name: 'Fizik-1 Son Tekrar',
    date: shiftDate(2), startTime: '09:00', endTime: '12:00',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(2),
    subTasks: [], parentId: null, kind: 'task', category: 'study',
  });

  events.push({
    id: genId('ev'),
    name: 'Zenith Proje Sunumu',
    date: shiftDate(5), startTime: '13:00', endTime: '14:00',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(5),
    subTasks: [], parentId: null, kind: 'event', category: 'work',
  });

  events.push({
    id: genId('ev'),
    name: 'Lineer Cebir Ödev Teslimi',
    date: shiftDate(4), startTime: '23:59', endTime: '23:59',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(4),
    subTasks: [], parentId: null, kind: 'task', category: 'study',
    allDay: true,
  });

  events.push({
    id: genId('ev'),
    name: 'Umut\'un Doğum Günü Kutlaması',
    date: shiftDate(10), startTime: '19:00', endTime: '22:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(10),
    subTasks: [], parentId: null, kind: 'event', category: 'personal',
  });

  events.push({
    id: genId('ev'),
    name: 'Diş Hekimi Yeni Randevusu',
    date: shiftDate(7), startTime: '10:00', endTime: '11:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(7),
    subTasks: [], parentId: null, kind: 'event', category: 'health',
  });

  events.push({
    id: genId('ev'),
    name: 'Python Kurs — Bölüm 6 & 7',
    date: shiftDate(6), startTime: '20:00', endTime: '22:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(6),
    subTasks: [], parentId: null, kind: 'task', category: 'study',
  });

  // ── Hedefler (allDay) ─────────────────────────────────────────────────────

  events.push({
    id: genId('ev'),
    name: 'Macbook Pro Tasarruf Hedefi',
    date: shiftDate(60), startTime: '00:00', endTime: '00:00',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [], originalDate: shiftDate(60),
    subTasks: [], parentId: null, kind: 'goal', category: 'personal',
    allDay: true,
  });

  return events;
}

// ─── MODULES ──────────────────────────────────────────────────────────────────

function buildModules(): ModuleState {
  const today = shiftDate(0);

  // ── İlaçlar ───────────────────────────────────────────────────────────────

  const buildTakenLog = (days: number, freq: string[]): Record<string, string[]> => {
    const log: Record<string, string[]> = {};
    for (let d = -days; d <= 0; d++) {
      if (Math.random() > 0.15) {
        log[shiftDate(d)] = [...freq];
      }
    }
    return log;
  };

  const medicines = [
    {
      id: genId('med'),
      name: 'Lansor',
      dosage: '30mg',
      frequency: ['Sabah'],
      days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      duration: 28, boxSize: 28, remaining: 11,
      startDate: shiftDate(-17),
      takenLog: buildTakenLog(17, ['Sabah']),
    },
    {
      id: genId('med'),
      name: 'B12 Vitamini',
      dosage: '1000mcg',
      frequency: ['Öğle'],
      days: ['Pzt', 'Çar', 'Cum'],
      duration: 60, boxSize: 60, remaining: 42,
      startDate: shiftDate(-18),
      takenLog: buildTakenLog(18, ['Öğle']),
    },
    {
      id: genId('med'),
      name: 'Omega-3',
      dosage: '1000mg',
      frequency: ['Sabah', 'Akşam'],
      days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      duration: 90, boxSize: 90, remaining: 74,
      startDate: shiftDate(-16),
      takenLog: buildTakenLog(16, ['Sabah', 'Akşam']),
    },
    {
      id: genId('med'),
      name: 'D3 Vitamini',
      dosage: '2000 IU',
      frequency: ['Akşam'],
      days: ['Pzt', 'Çar', 'Cum'],
      duration: 60, boxSize: 60, remaining: 54,
      startDate: shiftDate(-6),
      takenLog: buildTakenLog(6, ['Akşam']),
    },
  ];

  // ── Su ────────────────────────────────────────────────────────────────────

  const waterLog: Record<string, { total: number; entries: { amount: number; time: string }[] }> = {};
  const waterAmounts = [2200, 1800, 2500, 1400, 2800, 2100, 1950, 2600, 1700, 2400, 2300, 1600, 1900, 1550];
  for (let d = -13; d <= 0; d++) {
    const amount = waterAmounts[d + 13];
    const entries = [];
    let remaining = amount;
    const times = ['08:30', '10:00', '12:30', '15:00', '17:30', '20:00'];
    for (const t of times) {
      if (remaining <= 0) break;
      const sip = Math.min(remaining, Math.floor(Math.random() * 200 + 200));
      entries.push({ amount: sip, time: t });
      remaining -= sip;
    }
    waterLog[shiftDate(d)] = { total: amount, entries };
  }

  const water = {
    height: 180,
    weight: 75,
    age: 19,
    gender: 'male' as const,
    dailyGoal: 2500,
    log: waterLog,
  };

  // ── Spor ──────────────────────────────────────────────────────────────────

  const progId = genId('prog');
  const exIds = {
    bench:    genId('ex'),
    shoulder: genId('ex'),
    tricep:   genId('ex'),
    pullup:   genId('ex'),
    row:      genId('ex'),
    bicep:    genId('ex'),
    squat:    genId('ex'),
    legpress: genId('ex'),
    calf:     genId('ex'),
  };

  const gymProgram = {
    id: progId,
    name: 'Engineering Fitness — PPL',
    exercises: [
      { id: exIds.bench,    name: 'Bench Press',      muscle: 'Göğüs',  sets: 4, reps: 8,  day: 'Pzt' },
      { id: exIds.shoulder, name: 'Shoulder Press',   muscle: 'Omuz',   sets: 3, reps: 10, day: 'Pzt' },
      { id: exIds.tricep,   name: 'Tricep Pushdown',  muscle: 'Triseps',sets: 3, reps: 12, day: 'Pzt' },
      { id: exIds.pullup,   name: 'Pull-Up',          muscle: 'Sırt',   sets: 4, reps: 8,  day: 'Çar' },
      { id: exIds.row,      name: 'Barbell Row',      muscle: 'Sırt',   sets: 3, reps: 10, day: 'Çar' },
      { id: exIds.bicep,    name: 'Bicep Curl',       muscle: 'Biseps', sets: 3, reps: 12, day: 'Çar' },
      { id: exIds.squat,    name: 'Squat',            muscle: 'Bacak',  sets: 4, reps: 8,  day: 'Cum' },
      { id: exIds.legpress, name: 'Leg Press',        muscle: 'Bacak',  sets: 3, reps: 12, day: 'Cum' },
      { id: exIds.calf,     name: 'Calf Raise',       muscle: 'Baldır', sets: 3, reps: 15, day: 'Cum' },
    ],
  };

  // Son 4 haftada Pzt/Çar/Cum günlerini bul ve log ekle
  const exerciseLog: Record<string, boolean> = {};
  const dowExMap: Record<number, string[]> = {
    1: [exIds.bench, exIds.shoulder, exIds.tricep],   // Pzt
    3: [exIds.pullup, exIds.row, exIds.bicep],         // Çar
    5: [exIds.squat, exIds.legpress, exIds.calf],      // Cum
  };

  for (let d = -28; d <= -2; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dow = date.getDay();
    const dateStr = formatDate(date);
    const exList = dowExMap[dow];
    if (!exList) continue;
    // %80 ihtimalle gitmiş
    if (Math.random() < 0.80) {
      exList.forEach(exId => { exerciseLog[`${exId}_${dateStr}`] = true; });
    }
  }

  const gym = {
    programs: [gymProgram],
    activeProgram: progId,
    exerciseLog,
  };

  // ── Doğum Günleri ─────────────────────────────────────────────────────────

  const birthdays = [
    {
      id: genId('bday'),
      name: 'Umut Yalçın',
      date: shiftDate(10),
      giftPlanned: true,
      giftIdea: 'Mekanik Klavye',
      giftPrice: 850,
      giftBought: false,
    },
    {
      id: genId('bday'),
      name: 'Mustafa Furkan',
      date: shiftDate(3),
      giftPlanned: false,
      giftIdea: '',
      giftBought: false,
    },
    {
      id: genId('bday'),
      name: 'Annem',
      date: shiftDate(45),
      giftPlanned: true,
      giftIdea: 'Çiçek & Çikolata',
      giftPrice: 350,
      giftBought: false,
    },
    {
      id: genId('bday'),
      name: 'Babam',
      date: shiftDate(-5),
      giftPlanned: true,
      giftIdea: 'Kemer',
      giftPrice: 400,
      giftBought: true,
    },
  ];

  // ── Bütçe ─────────────────────────────────────────────────────────────────

  const expenses = [
    { id: genId('exp'), name: 'Kira',                  amount: 8500,  category: 'Fatura',   date: shiftDate(-20) },
    { id: genId('exp'), name: 'Elektrik & Su',         amount: 420,   category: 'Fatura',   date: shiftDate(-18) },
    { id: genId('exp'), name: 'İnternet',              amount: 280,   category: 'Fatura',   date: shiftDate(-17) },
    { id: genId('exp'), name: 'Spotify Premium',       amount: 40,    category: 'Eğlence',  date: shiftDate(-15) },
    { id: genId('exp'), name: 'Netflix',               amount: 85,    category: 'Eğlence',  date: shiftDate(-15) },
    { id: genId('exp'), name: 'Haftalık Market',       amount: 650,   category: 'Yiyecek',  date: shiftDate(-14) },
    { id: genId('exp'), name: 'Gym Üyeliği',           amount: 750,   category: 'Sağlık',   date: shiftDate(-13) },
    { id: genId('exp'), name: 'Kahve (Starbucks)',     amount: 95,    category: 'Yiyecek',  date: shiftDate(-12) },
    { id: genId('exp'), name: 'Ders Kitabı — Fizik',  amount: 320,   category: 'Diğer',    date: shiftDate(-11) },
    { id: genId('exp'), name: 'Ulaşım (İstanbulkart)',amount: 200,   category: 'Ulaşım',   date: shiftDate(-10) },
    { id: genId('exp'), name: 'Yemek (Arkadaşlarla)', amount: 185,   category: 'Yiyecek',  date: shiftDate(-9)  },
    { id: genId('exp'), name: 'Tişört (Mavi)',         amount: 220,   category: 'Giyim',    date: shiftDate(-8)  },
    { id: genId('exp'), name: 'Eczane — İlaçlar',     amount: 175,   category: 'Sağlık',   date: shiftDate(-7)  },
    { id: genId('exp'), name: 'Haftalık Market',       amount: 580,   category: 'Yiyecek',  date: shiftDate(-7)  },
    { id: genId('exp'), name: 'Sinema',                amount: 120,   category: 'Eğlence',  date: shiftDate(-6)  },
    { id: genId('exp'), name: 'Kuaför',                amount: 80,    category: 'Kişisel',  date: shiftDate(-5)  },
    { id: genId('exp'), name: 'Kargo (Amazon)',        amount: 45,    category: 'Diğer',    date: shiftDate(-4)  },
    { id: genId('exp'), name: 'Kahve & Sandviç',       amount: 85,    category: 'Yiyecek',  date: shiftDate(-3)  },
    { id: genId('exp'), name: 'Spor Eldiveni',         amount: 190,   category: 'Sağlık',   date: shiftDate(-2)  },
    { id: genId('exp'), name: 'Kahve (Bugün)',         amount: 55,    category: 'Yiyecek',  date: today          },
  ];

  const shoppingLists = [
    {
      id: genId('shop'),
      name: 'Haftalık Market',
      date: today,
      items: [
        { text: 'Süt (2L)', checked: true },
        { text: 'Yumurta', checked: true },
        { text: 'Ekmek', checked: false },
        { text: 'Tavuk Göğsü', checked: false },
        { text: 'Makarna', checked: false },
        { text: 'Zeytinyağı', checked: true },
        { text: 'Muz', checked: false },
      ],
    },
    {
      id: genId('shop'),
      name: 'Eczane',
      date: shiftDate(2),
      items: [
        { text: 'Lansor (yeni kutu)', checked: false },
        { text: 'Omega-3 (yeni kutu)', checked: false },
      ],
    },
  ];

  const budget = {
    income: 20000,
    expenses,
    shoppingLists,
  };

  // ── Uyku ──────────────────────────────────────────────────────────────────

  const sleepData = [
    { sleep: '00:30', wake: '07:45', dur: 7.25 },
    { sleep: '23:45', wake: '07:30', dur: 7.75 },
    { sleep: '01:00', wake: '08:00', dur: 7.0  },
    { sleep: '02:30', wake: '09:00', dur: 6.5  },
    { sleep: '00:00', wake: '07:00', dur: 7.0  },
    { sleep: '23:30', wake: '07:15', dur: 7.75 },
    { sleep: '01:30', wake: '08:30', dur: 7.0  },
    { sleep: '03:00', wake: '09:30', dur: 6.5  },
    { sleep: '00:15', wake: '07:30', dur: 7.25 },
    { sleep: '23:00', wake: '06:45', dur: 7.75 },
    { sleep: '01:00', wake: '07:00', dur: 6.0  },
    { sleep: '00:30', wake: '07:00', dur: 6.5  },
    { sleep: '23:45', wake: '07:30', dur: 7.75 },
    { sleep: '02:00', wake: '08:00', dur: 6.0  },
  ];

  const sleepLogs = sleepData.map((s, i) => ({
    id: genId('slp'),
    date: shiftDate(-(sleepData.length - 1 - i)),
    sleepTime: s.sleep,
    wakeTime:  s.wake,
    duration:  s.dur,
  }));

  const sleep = { logs: sleepLogs, goalMin: 7, goalMax: 9 };

  // ── Hedefler ──────────────────────────────────────────────────────────────

  const goals = [
    { id: genId('goal'), name: 'Macbook Pro 16" Almak',    target: 50000, current: 18500, unit: '₺',  step: 1000, icon: '💻' },
    { id: genId('goal'), name: 'Python Öğrenmek',           target: 100,   current: 45,   unit: '%',  step: 5,    icon: '🐍' },
    { id: genId('goal'), name: '5 km Koşu',                 target: 5,     current: 3.2,  unit: 'km', step: 0.5,  icon: '🏃' },
    { id: genId('goal'), name: 'Kitap Okuma (Bu Yıl)',      target: 20,    current: 7,    unit: 'kitap', step: 1, icon: '📚' },
    { id: genId('goal'), name: 'Acil Durum Fonu',           target: 30000, current: 8500, unit: '₺',  step: 500,  icon: '🏦' },
  ];

  // ── Ders / Çalışma ────────────────────────────────────────────────────────

  const subjects = [
    { id: 'sub_ds',   name: 'Veri Yapıları',  color: '#6366f1', resources: [] },
    { id: 'sub_phys', name: 'Fizik-1',        color: '#f87171', resources: [] },
    { id: 'sub_math', name: 'Lineer Cebir',   color: '#f59e0b', resources: [] },
    { id: 'sub_py',   name: 'Python & Proje', color: '#10b981', resources: [] },
  ];

  const rawSessions = [
    { daysAgo: 14, subjectId: 'sub_phys', duration: 90,  topic: 'Kinematik',           questions: 12 },
    { daysAgo: 13, subjectId: 'sub_ds',   duration: 120, topic: 'Diziler & Bağlı Liste',questions: 8  },
    { daysAgo: 12, subjectId: 'sub_math', duration: 60,  topic: 'Matris İşlemleri',    questions: 15 },
    { daysAgo: 11, subjectId: 'sub_py',   duration: 90,  topic: 'OOP Temelleri',       questions: 0  },
    { daysAgo: 10, subjectId: 'sub_phys', duration: 75,  topic: 'Newton Yasaları',     questions: 10 },
    { daysAgo: 9,  subjectId: 'sub_ds',   duration: 100, topic: 'Stack & Queue',       questions: 6  },
    { daysAgo: 8,  subjectId: 'sub_math', duration: 80,  topic: 'Determinant',         questions: 12 },
    { daysAgo: 7,  subjectId: 'sub_py',   duration: 120, topic: 'Zenith API Entegrasyonu', questions: 0 },
    { daysAgo: 6,  subjectId: 'sub_phys', duration: 90,  topic: 'İş & Enerji',         questions: 14 },
    { daysAgo: 5,  subjectId: 'sub_ds',   duration: 110, topic: 'Tree Yapıları',       questions: 7  },
    { daysAgo: 4,  subjectId: 'sub_math', duration: 60,  topic: 'Özdeğer & Özvektör', questions: 9  },
    { daysAgo: 3,  subjectId: 'sub_phys', duration: 95,  topic: 'Momentum',            questions: 11 },
    { daysAgo: 2,  subjectId: 'sub_py',   duration: 130, topic: 'Zenith AI Chat',      questions: 0  },
    { daysAgo: 1,  subjectId: 'sub_ds',   duration: 80,  topic: 'Graph Algoritmaları', questions: 5  },
    { daysAgo: 0,  subjectId: 'sub_phys', duration: 45,  topic: 'Vize Tekrarı',        questions: 20 },
  ];

  const sessions = rawSessions.map(s => ({
    date: shiftDate(-s.daysAgo),
    subjectId: s.subjectId,
    duration: s.duration,
    topic: s.topic,
    questions: s.questions,
  }));

  const study = { subjects, sessions };

  // ── Journal ───────────────────────────────────────────────────────────────

  const journalEntries: Record<string, JournalEntry> = {};

  const rawEntries = [
    {
      daysAgo: 13,
      title: 'Zenith Yolculuğu Başlıyor',
      content: 'Bugün Zenith projesinin temellerini attık. Vizyonumuz büyük: Hayatı tek bir noktadan yönetmek. Takım arkadaşlarımla ilk toplantımızı yaptık. Umut ve Furkan\'la çok iyi bir sinerji var, umarım bunu başarırız.',
      mood: 'amazing',
      gratitude: ['Yeni başlangıçlar', 'Teknoloji', 'Takım arkadaşları'],
      weather: '☀️ Güneşli',
      paperStyle: 'lined' as const,
      quote: 'Küçük adımlar büyük yolculukların başlangıcıdır.',
      color: '#dbeafe',
    },
    {
      daysAgo: 11,
      title: 'Zor Bir Gün',
      content: 'Fizik sınavı için çok stres altındayım. Lineer Cebir ödevini de erteledum, bu beni rahatsız ediyor. Ama akşam Umut\'la konuştuk, biraz rahatladım. Yarın daha erken kalkacağım.',
      mood: 'bad',
      gratitude: ['Arkadaşlar', 'Kahve', 'Bir sonraki gün'],
      weather: '🌧️ Yağmurlu',
      paperStyle: 'grid' as const,
      quote: 'Bu da geçer.',
      color: '#fef3c7',
    },
    {
      daysAgo: 9,
      title: 'Verimli Bir Hafta Ortası',
      content: 'Veri Yapıları Stack konusunu bitirdim. Sorular çok iyi geldi. Zenith\'in AI widget kısmı şekilleniyor. Akşam spor da yaptım, kendimi güzel hissediyorum.',
      mood: 'good',
      gratitude: ['Verimli çalışma', 'Spor', 'İyi uyku'],
      weather: '⛅ Parçalı bulutlu',
      paperStyle: 'lined' as const,
      color: '#dcfce7',
    },
    {
      daysAgo: 7,
      title: 'Algoritma Ödevi Teslim',
      content: 'Son dakikada yetiştirdim ama teslim ettim! Proje teslimlerinde bu son dakika stresinden kurtulmam lazım. Yarın bunu konuşacağız takımla. Yine de mutluyum, bitti.',
      mood: 'ok',
      gratitude: ['Başarıyla teslim', 'Dayanıklılık', 'Gece lambasının ışığı'],
      weather: '🌙 Geceleri serin',
      paperStyle: 'dots' as const,
      quote: 'Tamamlanan bir şey, mükemmel ama tamamlanmamış bir şeyden iyidir.',
      color: '#f3e8ff',
    },
    {
      daysAgo: 5,
      title: 'Arkadaşlarla Kahve',
      content: 'Uzun süredir görmediğim Furkan\'la buluştuk. Zenith\'i anlattım, çok heyecanlandı. Projenin potansiyelini görmesi beni de motive etti. Fitness de iyiydi, pull day\'i güzel geçirdim.',
      mood: 'amazing',
      gratitude: ['Arkadaşlık', 'Proje motivasyonu', 'Sağlıklı vücut'],
      weather: '☀️ Güneşli ve sıcak',
      paperStyle: 'blank' as const,
      quote: 'İnsan, çevresiyle büyür.',
      color: '#fce7f3',
    },
    {
      daysAgo: 3,
      title: 'Hafta Ortası Muhasebesi',
      content: 'Bu hafta erteleme konusunda kendime karşı dürüst olmam lazım. Lineer Cebir ödevi ve Zenith raporu hâlâ bekliyor. Yarın bunlara odaklanacağım. Su içmeyi de unutuyorum son zamanlarda.',
      mood: 'ok',
      gratitude: ['Dürüstlük', 'Temiz sayfa hakkı', 'Zenith uygulaması'],
      weather: '🌤️ Açık',
      paperStyle: 'lined' as const,
      color: '#fff7ed',
    },
    {
      daysAgo: 1,
      title: 'Vize Haftası Başlıyor',
      content: 'Yarın Fizik-1 vizesi için yoğun tekrar yaptım. AI widget\'ı da test ettik bugün, harika çalışıyor. Erteleme analizi özelliği gerçekten fark yaratıyor. Kendimi analiz etmek tuhaf ama yararlı.',
      mood: 'good',
      gratitude: ['Hazırlık', 'Takım çalışması', 'Teknoloji'],
      weather: '🌥️ Bulutlu',
      paperStyle: 'lined' as const,
      quote: 'Hazırlık, başarının yarısıdır.',
      color: '#dbeafe',
    },
    {
      daysAgo: 0,
      title: 'Bugün',
      content: 'Sabah meditasyonla güzel başladım. Veri Yapıları dersini bitirmeye çalışıyorum ama konsantrasyon biraz dağınık. Akşam spor var, ona çok enerji kaldı mı bilmiyorum. Yine de devam.',
      mood: 'ok',
      gratitude: ['Sabah sükûneti', 'Günlük plan', 'Zenith'],
      weather: '☀️ Güneşli',
      paperStyle: 'lined' as const,
      color: '#dcfce7',
    },
  ];

  rawEntries.forEach(e => {
    const date = shiftDate(-e.daysAgo);
    journalEntries[date] = {
      id: genId('jrn'),
      date,
      title: e.title,
      content: e.content,
      mood: e.mood,
      gratitude: e.gratitude,
      weather: e.weather,
      paperStyle: e.paperStyle,
      quote: e.quote,
      color: e.color,
    };
  });

  const journal = { entries: journalEntries };

  return {
    medicines,
    water,
    gym,
    birthdays,
    budget,
    sleep,
    goals,
    study,
    journal,
  };
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export function seedScenario() {
  idCounter = 0;
  const modules = buildModules();

  return {
    events: buildEvents(),
    modules,
    user: { name: 'Asıl Koray Alma' },
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
