/**
 * Test senaryosu üretici — 3 AYLIK kapsamlı sürüm.
 *
 * `seedScenario()` çağrılınca:
 *   - "bugün" referans alınarak 60 gün geçmiş + bugün + 30 gün gelecek
 *     aralığında zengin, gerçekçi bir veri üretir
 *   - Tüm event türleri (event/task/goal), tüm kategoriler, tüm önem seviyeleri,
 *     allDay görevler, tahmini süreli görevler, tekrarlayan görevler,
 *     1x/2x/4x ertelenmiş görevler dahil
 *   - Tüm modüller (ilaç, su, spor, doğum günü, bütçe, uyku, hedefler, ders/pomodoro
 *     ve YENİ Anı Kütüphanem/journal) için 3 aya yayılmış örnek veri içerir
 *
 * Her çağrıda timestamp tabanlı stabil ID'ler üretilir (collision yok).
 */

import type {
  PlannerEvent,
  ModuleState,
  User,
  PostponeHistory,
  JournalEntry,
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

/** Belirli bir günün haftanın hangi günü olduğunu döndürür (0=Pazar..6=Cumartesi) */
function dayOfWeek(daysFromToday: number): number {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.getDay();
}

// ======================================================================
//                              EVENTS
// ======================================================================
function buildEvents(): PlannerEvent[] {
  const events: PlannerEvent[] = [];

  // ---------- TEKRARLAYAN HAFTA İÇİ TOPLANTILAR (geçmiş 60 gün) ----------
  // Her Pazartesi: Stand-up (sabah)
  // Her Çarşamba: Tasarım toplantısı
  // Her Cuma: Retrospektif
  for (let i = -60; i <= 0; i++) {
    const dow = dayOfWeek(i);
    if (dow === 1) {
      events.push({
        id: genId('ev'),
        name: 'Stand-up toplantı',
        date: shiftDate(i),
        startTime: '09:00', endTime: '09:30',
        importance: 'medium', completed: i < 0,
        postponeCount: 0, postponeHistory: [],
        originalDate: shiftDate(i),
        subTasks: [], parentId: null,
        kind: 'event', category: 'work',
      });
    }
    if (dow === 3) {
      events.push({
        id: genId('ev'),
        name: 'Tasarım toplantısı',
        date: shiftDate(i),
        startTime: '14:00', endTime: '15:00',
        importance: 'medium', completed: i < 0,
        postponeCount: 0, postponeHistory: [],
        originalDate: shiftDate(i),
        subTasks: [], parentId: null,
        kind: 'event', category: 'work',
      });
    }
    if (dow === 5) {
      events.push({
        id: genId('ev'),
        name: 'Haftalık retrospektif',
        date: shiftDate(i),
        startTime: '16:30', endTime: '17:30',
        importance: 'low', completed: i < 0,
        postponeCount: 0, postponeHistory: [],
        originalDate: shiftDate(i),
        subTasks: [], parentId: null,
        kind: 'event', category: 'work',
      });
    }
  }

  // ---------- SPOR (her Pzt/Çar/Cum akşamı) ----------
  for (let i = -60; i <= 30; i++) {
    const dow = dayOfWeek(i);
    if ([1, 3, 5].includes(dow)) {
      // Geçmiştekilerin %85'i tamamlanmış
      const isPast = i < 0;
      const completed = isPast && Math.random() > 0.15;
      events.push({
        id: genId('ev'),
        name: dow === 1 ? 'Spor — Push Day' : dow === 3 ? 'Spor — Pull Day' : 'Spor — Leg Day',
        date: shiftDate(i),
        startTime: '18:30', endTime: '20:00',
        importance: 'medium', completed,
        postponeCount: 0, postponeHistory: [],
        originalDate: shiftDate(i),
        subTasks: [], parentId: null,
        kind: 'task', category: 'health',
      });
    }
  }

  // ---------- GEÇMİŞ — ÇEŞİTLİ TEK SEFERLİK ETKİNLİKLER ----------
  const pastEvents: Array<Partial<PlannerEvent> & { offset: number }> = [
    { offset: -58, name: 'Yıl başı ekip yemeği', startTime: '20:00', endTime: '23:00', importance: 'medium', kind: 'event', category: 'work', completed: true },
    { offset: -55, name: 'Yıllık sağlık kontrolü', startTime: '10:00', endTime: '11:30', importance: 'high', kind: 'event', category: 'health', completed: true },
    { offset: -52, name: 'Vergi danışmanı görüşmesi', startTime: '15:00', endTime: '16:00', importance: 'high', kind: 'event', category: 'personal', completed: true },
    { offset: -48, name: 'Q1 hedef belirleme', startTime: '13:00', endTime: '14:30', importance: 'high', kind: 'event', category: 'work', completed: true },
    { offset: -45, name: 'Doğum günü partisi — Ali', startTime: '19:00', endTime: '23:00', importance: 'low', kind: 'event', category: 'personal', completed: true },
    { offset: -40, name: 'Diş hekimi kontrolü', startTime: '11:00', endTime: '12:00', importance: 'high', kind: 'event', category: 'health', completed: true },
    { offset: -35, name: 'Konser — Pera', startTime: '21:00', endTime: '23:30', importance: 'low', kind: 'event', category: 'personal', completed: true },
    { offset: -28, name: 'Müşteri sunumu', startTime: '11:00', endTime: '12:30', importance: 'high', kind: 'event', category: 'work', completed: true },
    { offset: -22, name: 'Hafta sonu kaçamak — Ayvalık', startTime: '', endTime: '', importance: 'medium', kind: 'event', category: 'personal', completed: true, allDay: true },
    { offset: -18, name: 'Online eğitim — TypeScript', startTime: '20:00', endTime: '22:00', importance: 'medium', kind: 'task', category: 'study', completed: true },
    { offset: -14, name: 'Aile yemeği', startTime: '20:00', endTime: '22:30', importance: 'medium', kind: 'event', category: 'personal', completed: true },
    { offset: -10, name: 'Berber', startTime: '17:00', endTime: '18:00', importance: 'low', kind: 'event', category: 'personal', completed: true },
    { offset: -7, name: 'Kahvaltı buluşması', startTime: '09:30', endTime: '11:00', importance: 'low', kind: 'event', category: 'personal', completed: true },
    { offset: -4, name: 'Aile yemeği', startTime: '20:00', endTime: '22:30', importance: 'medium', kind: 'event', category: 'personal', completed: true },
    { offset: -1, name: 'Haftalık planlama', startTime: '17:00', endTime: '18:00', importance: 'medium', kind: 'task', category: 'work', completed: true },
  ];

  pastEvents.forEach(p => {
    events.push({
      id: genId('ev'),
      name: p.name!,
      date: shiftDate(p.offset),
      startTime: p.startTime ?? '',
      endTime: p.endTime ?? '',
      importance: (p.importance as PlannerEvent['importance']) || 'medium',
      completed: !!p.completed,
      postponeCount: 0, postponeHistory: [],
      originalDate: shiftDate(p.offset),
      subTasks: [], parentId: null,
      kind: (p.kind as PlannerEvent['kind']) || 'event',
      category: (p.category as PlannerEvent['category']) || 'personal',
      allDay: p.allDay,
      estimatedMin: p.allDay ? 90 : undefined,
    });
  });

  // ---------- ALL-DAY GÖREVLER (geçmişe yayılı) ----------
  events.push({
    id: genId('ev'),
    name: 'Kitap okuma — Atomic Habits',
    date: shiftDate(-50), startTime: '', endTime: '',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-50),
    subTasks: [], parentId: null,
    kind: 'task', category: 'study',
    allDay: true, estimatedMin: 90,
  });
  events.push({
    id: genId('ev'),
    name: 'Ev temizliği',
    date: shiftDate(-30), startTime: '', endTime: '',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-30),
    subTasks: [], parentId: null,
    kind: 'task', category: 'personal',
    allDay: true, estimatedMin: 120,
  });
  events.push({
    id: genId('ev'),
    name: 'Fatura ödemeleri',
    date: shiftDate(-2), startTime: '', endTime: '',
    importance: 'medium', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(-2),
    subTasks: [], parentId: null,
    kind: 'task', category: 'personal',
    allDay: true, estimatedMin: 30,
  });

  // ---------- KRONİK ERTELENMİŞ GÖREVLER (Problem 3 senaryosu) ----------
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

  // ---------- HEDEF (goal) + alt görevler ----------
  const goalId = genId('ev');
  events.push({
    id: goalId,
    name: '🎯 Hedef: Yarı maraton koşusu',
    description: 'Üç ay sonunda 21K koşabilmek için aşamalı plan.',
    date: shiftDate(60),
    startTime: '', endTime: '',
    importance: 'high', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(60),
    subTasks: [], parentId: null,
    kind: 'goal', category: 'health',
    allDay: true,
  });
  // Alt görevler
  ['5K rahat koşu', '10K bitir', '15K uzun koşu', 'Tempo antrenmanı'].forEach((name, idx) => {
    events.push({
      id: genId('ev'),
      name,
      date: shiftDate(7 + idx * 7),
      startTime: '07:00', endTime: '08:00',
      importance: 'medium', completed: false,
      postponeCount: 0, postponeHistory: [],
      originalDate: shiftDate(7 + idx * 7),
      subTasks: [], parentId: goalId,
      parentName: '🎯 Hedef: Yarı maraton koşusu',
      kind: 'task', category: 'health',
    });
  });

  // ---------- BUGÜN ----------
  events.push({
    id: genId('ev'),
    name: 'Sabah meditasyonu',
    date: shiftDate(0), startTime: '', endTime: '',
    importance: 'low', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'task', category: 'health',
    allDay: true, estimatedMin: 15,
  });
  events.push({
    id: genId('ev'),
    name: 'E-postaları yanıtla',
    date: shiftDate(0), startTime: '10:00', endTime: '11:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'task', category: 'work',
  });
  events.push({
    id: genId('ev'),
    name: 'Müşteri öğle yemeği',
    date: shiftDate(0), startTime: '12:30', endTime: '14:00',
    importance: 'high', completed: true,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'event', category: 'work',
  });
  events.push({
    id: genId('ev'),
    name: 'Pomodoro — Matematik (Türev)',
    date: shiftDate(0), startTime: '15:00', endTime: '17:00',
    importance: 'medium', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'task', category: 'study',
  });
  events.push({
    id: genId('ev'),
    name: 'Blog yazısı taslağı',
    date: shiftDate(0), startTime: '20:00', endTime: '21:30',
    importance: 'low', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'task', category: 'study',
  });

  // ---------- GELECEK 30 GÜN ----------
  const futureEvents: Array<Partial<PlannerEvent> & { offset: number }> = [
    { offset: 1, name: 'Diş hekimi randevusu', startTime: '14:00', endTime: '15:00', importance: 'high', kind: 'event', category: 'health' },
    { offset: 2, name: 'Ekip retrospektif', startTime: '15:00', endTime: '16:30', importance: 'medium', kind: 'event', category: 'work' },
    { offset: 3, name: 'Kitap kulübü', startTime: '19:00', endTime: '21:00', importance: 'low', kind: 'event', category: 'personal' },
    { offset: 4, name: 'Hediye al — Anneye', startTime: '', endTime: '', importance: 'medium', kind: 'task', category: 'personal', allDay: true },
    { offset: 7, name: 'Müşteri sunumu hazırlığı', startTime: '10:00', endTime: '13:00', importance: 'high', kind: 'task', category: 'work' },
    { offset: 8, name: 'Müşteri sunumu', startTime: '11:00', endTime: '12:30', importance: 'high', kind: 'event', category: 'work' },
    { offset: 12, name: 'Yıllık göz kontrolü', startTime: '16:00', endTime: '17:00', importance: 'medium', kind: 'event', category: 'health' },
    { offset: 14, name: 'Tiyatro — Hamlet', startTime: '20:00', endTime: '22:30', importance: 'low', kind: 'event', category: 'personal' },
    { offset: 18, name: 'Yarıyıl ders sınavı', startTime: '10:00', endTime: '12:00', importance: 'high', kind: 'event', category: 'study' },
    { offset: 21, name: 'Ev sahibiyle görüşme', startTime: '18:00', endTime: '19:00', importance: 'medium', kind: 'event', category: 'personal' },
    { offset: 25, name: 'Hafta sonu kampı', startTime: '', endTime: '', importance: 'medium', kind: 'event', category: 'personal', allDay: true },
    { offset: 28, name: 'Yıllık performans değerlendirme', startTime: '14:00', endTime: '15:30', importance: 'high', kind: 'event', category: 'work' },
  ];
  futureEvents.forEach(p => {
    events.push({
      id: genId('ev'),
      name: p.name!,
      date: shiftDate(p.offset),
      startTime: p.startTime ?? '', endTime: p.endTime ?? '',
      importance: (p.importance as PlannerEvent['importance']) || 'medium',
      completed: false,
      postponeCount: 0, postponeHistory: [],
      originalDate: shiftDate(p.offset),
      subTasks: [], parentId: null,
      kind: (p.kind as PlannerEvent['kind']) || 'event',
      category: (p.category as PlannerEvent['category']) || 'personal',
      allDay: p.allDay,
      estimatedMin: p.allDay ? 240 : undefined,
    });
  });

  // ---------- TEKRARLAYAN GÖREV ÖRNEĞİ (recurrence) ----------
  events.push({
    id: genId('ev'),
    name: 'Günlük yazma',
    date: shiftDate(0), startTime: '', endTime: '',
    importance: 'low', completed: false,
    postponeCount: 0, postponeHistory: [],
    originalDate: shiftDate(0),
    subTasks: [], parentId: null,
    kind: 'task', category: 'personal',
    allDay: true, estimatedMin: 10,
    recurrence: { pattern: 'daily', until: shiftDate(30) },
    completedDates: [shiftDate(-1), shiftDate(-2), shiftDate(-3), shiftDate(-5)],
  });

  return events;
}

// ======================================================================
//                              MODULES
// ======================================================================
function buildModules(): ModuleState {
  // -------- SU LOGU — son 60 gün --------
  const waterLog: ModuleState['water']['log'] = {};
  for (let i = -60; i <= 0; i++) {
    const date = shiftDate(i);
    // Bazı günler atlanmış (hayata uygun): %15 ihtimal log yok
    if (Math.random() < 0.15 && i !== 0) continue;
    const total = i === 0 ? 1500 : 1700 + Math.round(Math.random() * 900);
    waterLog[date] = {
      total,
      entries: [
        { amount: 500, time: '08:30' },
        { amount: 500, time: '12:00' },
        { amount: 400, time: '15:30' },
        { amount: Math.max(100, total - 1400), time: '19:30' },
      ],
    };
  }

  // -------- UYKU LOGU — son 60 gün --------
  const sleepLogs: ModuleState['sleep']['logs'] = [];
  for (let i = -60; i <= -1; i++) {
    if (Math.random() < 0.1) continue; // bazı günler unutulmuş
    const date = shiftDate(i);
    const sleepHour = 22 + Math.floor(Math.random() * 3); // 22-00
    const sleepTime = `${String(sleepHour % 24).padStart(2, '0')}:${Math.random() > 0.5 ? '30' : '00'}`;
    const wakeHour = 6 + Math.floor(Math.random() * 2);
    const wakeTime = `${String(wakeHour).padStart(2, '0')}:${Math.random() > 0.5 ? '15' : '45'}`;
    const duration = 6.5 + Math.random() * 2;
    sleepLogs.push({
      id: genId('sleep'),
      date,
      sleepTime,
      wakeTime,
      duration: Math.round(duration * 10) / 10,
    });
  }

  // -------- DERS / POMODORO SESSIONS — 3 aya yayılı --------
  const studySessions: ModuleState['study']['sessions'] = [];
  const studySubjectIds = ['sub_math', 'sub_phys', 'sub_eng', 'sub_chem'];
  const studyTopics: Record<string, string[]> = {
    sub_math: ['Türev', 'İntegral', 'Limit', 'Diziler', 'Olasılık'],
    sub_phys: ['Vektörler', 'Hareket', 'Enerji', 'Optik', 'Elektrik'],
    sub_eng: ['Reading', 'Listening', 'Writing essay', 'Vocabulary', 'Grammar'],
    sub_chem: ['Atomik yapı', 'Bağlar', 'Asit-baz', 'Termokimya'],
  };
  for (let i = -60; i <= 0; i++) {
    if (Math.random() < 0.4) continue; // her gün çalışılmamış
    const subjectId = studySubjectIds[Math.floor(Math.random() * studySubjectIds.length)];
    const topics = studyTopics[subjectId];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const duration = [25, 50, 75, 100, 120][Math.floor(Math.random() * 5)];
    const questions = Math.round(duration / 3);
    studySessions.push({
      date: shiftDate(i),
      duration,
      subjectId,
      topic,
      questions,
    });
  }

  // -------- SPOR — exercise log (son 60 gün, %75 doluluk) --------
  const gymExerciseLog: ModuleState['gym']['exerciseLog'] = {};
  // Programdaki egzersiz id'leri aşağıda üretilir; geçmiş günler için
  // yer tutucu bir map oluşturmuyoruz — gerçek id'ler mount sonrası set edilir.
  // (Aşağıda buildModules() çıktısında programdaki ilk 3 egzersiz için son 30
  // gün rastgele log set edilir.)

  // -------- BÜTÇE — 3 aya yayılı giderler --------
  const expenseTemplate: Array<{ name: string; amount: number; category: string; daysBack: number }> = [
    // Aylık tekrar eden sabit giderler — 3 ay
    { name: 'Kira', amount: 12000, category: 'Kira', daysBack: 60 },
    { name: 'Kira', amount: 12000, category: 'Kira', daysBack: 30 },
    { name: 'Kira', amount: 12000, category: 'Kira', daysBack: 1 },
    { name: 'Elektrik', amount: 820, category: 'Faturalar', daysBack: 55 },
    { name: 'Elektrik', amount: 910, category: 'Faturalar', daysBack: 25 },
    { name: 'Elektrik', amount: 870, category: 'Faturalar', daysBack: 2 },
    { name: 'İnternet', amount: 420, category: 'Faturalar', daysBack: 55 },
    { name: 'İnternet', amount: 420, category: 'Faturalar', daysBack: 25 },
    { name: 'İnternet', amount: 420, category: 'Faturalar', daysBack: 2 },
    { name: 'Su', amount: 220, category: 'Faturalar', daysBack: 50 },
    { name: 'Su', amount: 245, category: 'Faturalar', daysBack: 20 },
    // Yiyecek/market
    { name: 'Market', amount: 2400, category: 'Yiyecek', daysBack: 58 },
    { name: 'Market', amount: 1850, category: 'Yiyecek', daysBack: 50 },
    { name: 'Market', amount: 2100, category: 'Yiyecek', daysBack: 42 },
    { name: 'Market', amount: 2680, category: 'Yiyecek', daysBack: 35 },
    { name: 'Market', amount: 1950, category: 'Yiyecek', daysBack: 28 },
    { name: 'Market', amount: 2300, category: 'Yiyecek', daysBack: 21 },
    { name: 'Market', amount: 2150, category: 'Yiyecek', daysBack: 14 },
    { name: 'Market', amount: 2520, category: 'Yiyecek', daysBack: 7 },
    { name: 'Market', amount: 2400, category: 'Yiyecek', daysBack: 3 },
    // Eğlence/dışarı
    { name: 'Sinema', amount: 250, category: 'Eğlence', daysBack: 45 },
    { name: 'Konser', amount: 850, category: 'Eğlence', daysBack: 35 },
    { name: 'Restoran — birthday', amount: 1200, category: 'Eğlence', daysBack: 45 },
    { name: 'Sinema', amount: 280, category: 'Eğlence', daysBack: 12 },
    // Ulaşım
    { name: 'Yakıt', amount: 1500, category: 'Ulaşım', daysBack: 50 },
    { name: 'Yakıt', amount: 1450, category: 'Ulaşım', daysBack: 30 },
    { name: 'Yakıt', amount: 1600, category: 'Ulaşım', daysBack: 10 },
    { name: 'Otopark', amount: 180, category: 'Ulaşım', daysBack: 18 },
    // Sağlık
    { name: 'Eczane', amount: 380, category: 'Sağlık', daysBack: 40 },
    { name: 'Spor salonu üyelik', amount: 600, category: 'Sağlık', daysBack: 30 },
    // Diğer
    { name: 'Kitap', amount: 220, category: 'Diğer', daysBack: 25 },
    { name: 'Hediye — Ali', amount: 450, category: 'Diğer', daysBack: 45 },
  ];
  const expenses = expenseTemplate.map(e => ({
    id: genId('exp'),
    name: e.name,
    amount: e.amount,
    category: e.category,
    date: shiftDate(-e.daysBack),
  }));

  // -------- JOURNAL — Anı Kütüphanem (3 aya yayılmış 18 entry) --------
  const journalEntries: Record<string, JournalEntry> = {};
  const moods = ['amazing', 'good', 'neutral', 'bad'];
  const weatherList = ['☀️ Güneşli', '⛅ Parçalı bulutlu', '☁️ Bulutlu', '🌧️ Yağmurlu', '❄️ Karlı'];
  const paperStyles: Array<JournalEntry['paperStyle']> = ['lined', 'grid', 'blank', 'dots'];
  const colors = ['#fef3c7', '#fce7f3', '#dbeafe', '#dcfce7', '#fae8ff', '#fff7ed'];
  const quotes = [
    'Yapabileceğine inan, yarı yolu zaten gitmişsin demektir.',
    'Bugün dünden bir adım daha iyi.',
    'Küçük adımlar büyük yolculukların başlangıcıdır.',
    'Sabır acı bir tohumdur ama tatlı bir meyve verir.',
    'Hayat denen bu yolculukta küçük anların kıymetini bil.',
    'Düştüğün yerden kalkarken dünü değil yarını düşün.',
  ];
  const journalSeed: Array<{ offset: number; title: string; content: string; mood: string; gratitude: string[]; location?: string }> = [
    { offset: -58, title: 'Yeni döneme başlangıç', content: 'Bu sabah erken kalktım ve gün çok verimli geçti. Yeni hedefler belirledim, kendime söz verdim: Bu çeyreği farklı yaşayacağım.', mood: 'amazing', gratitude: ['Sabahın sessizliği', 'Sıcacık kahve', 'Annemin sesi'], location: 'Ev' },
    { offset: -52, title: 'Vergi danışmanı sonrası', content: 'Stresli bir gündü ama hallettim. Akşam yürüyüşe çıktım, kafamı topladım.', mood: 'neutral', gratitude: ['İşin bitmesi', 'Akşam serinliği'], location: 'Beşiktaş' },
    { offset: -45, title: 'Ali\'nin doğum günü', content: 'Çok güzel bir geceydi. Eski arkadaşlarla bir araya geldik. Yıllar geçse de aynı sıcaklık.', mood: 'amazing', gratitude: ['Eski dostlar', 'Kahkahalar', 'Doğum günü pastası'], location: 'Karaköy' },
    { offset: -40, title: 'Yorgun bir gün', content: 'Bugün hiç enerjim yoktu. Belki de bu duyguyu kabullenmek lazım, her gün aynı olmaz.', mood: 'bad', gratitude: ['Sıcak bir duş', 'Erken yatak'] },
    { offset: -35, title: 'Konser akşamı', content: 'Müzik ruhun gıdası dedikleri buymuş. Dans ettim, şarkı söyledim. Kendimi uzun zamandır olmadığım kadar canlı hissettim.', mood: 'amazing', gratitude: ['Canlı müzik', 'Şehir manzarası', 'Spontane planlar'], location: 'Pera' },
    { offset: -30, title: 'Dingin bir Pazar', content: 'Sabah uzun bir koşu yaptım, sonra kitap okudum. Hiçbir şey yapmamak da bazen çok şey yapmaktır.', mood: 'good', gratitude: ['Boş takvim', 'Park', 'Atomic Habits'], location: 'Maçka Parkı' },
    { offset: -25, title: 'İş yoğunluğu', content: 'Sunum çok iyi geçti ama sonrasında bitkin düştüm. Yarın tatil günü olarak işaretliyorum.', mood: 'neutral', gratitude: ['Ekibin desteği', 'Müşterinin gülümsemesi'] },
    { offset: -22, title: 'Ayvalık günleri', content: 'Denizin sesi her şeyi siliyor. Bu kaçamak çok gerekliydi. Akşam yemeğinde balık ve şarap.', mood: 'amazing', gratitude: ['Deniz', 'Özgürlük hissi', 'İyi yemek'], location: 'Ayvalık' },
    { offset: -18, title: 'TypeScript öğreniyorum', content: 'Generics konusu kafamı karıştırdı ama yavaş yavaş oturuyor. Öğrenmek hâlâ heyecan verici.', mood: 'good', gratitude: ['Öğrenmek', 'Çevrimiçi topluluklar'] },
    { offset: -14, title: 'Aile yemeği', content: 'Annemin köftesi kadarı yok dünyada. Babamla uzun süre konuştuk. Bu anlar paha biçilmez.', mood: 'amazing', gratitude: ['Annemin yemeği', 'Babamla sohbet', 'Kardeşimin esprileri'], location: 'Ev' },
    { offset: -10, title: 'Berber sonrası', content: 'Yeni bir saç, yeni bir başlangıç gibi geliyor insana. Bu hafta daha düzenli olacağım.', mood: 'good', gratitude: ['Bakımlı hissetmek'] },
    { offset: -7, title: 'Kahvaltı buluşması', content: 'Eski iş arkadaşımla görüştüm. Hayatın bizi farklı yerlere savurması ne tuhaf. Yine de bağ kalıyor.', mood: 'good', gratitude: ['Uzun sohbetler', 'Sıcak menemen'], location: 'Bebek' },
    { offset: -5, title: 'Spor sonrası', content: 'Antrenman boyunca her şeyi unuttum. Vücudun iyileştirici gücü.', mood: 'good', gratitude: ['Sağlıklı vücut', 'Müziksiz koşu'] },
    { offset: -3, title: 'Çeyrek raporu hâlâ duruyor', content: 'Yine erteledim. Kendime sinirleniyorum. Yarın mutlaka.', mood: 'bad', gratitude: ['Kendime karşı dürüst olmak'] },
    { offset: -2, title: 'Faturalar tamam', content: 'Küçük şeyler kafamı çok meşgul ediyordu, bitince rahatladım. Ufak görevleri biriktirme dersi alındı.', mood: 'neutral', gratitude: ['Liste tamamlamak'] },
    { offset: -1, title: 'Haftalık planlama', content: 'Pomodoro tekniği gerçekten işe yarıyor. Kütüphane sayfasındaki yeni odak modu fırtına gibi.', mood: 'amazing', gratitude: ['Pomodoro', 'Sessiz akşam', 'Plan yapmak'] },
    { offset: 0, title: 'Bugünün notu', content: 'Hâlâ yazılacak şeyler var ama gün şimdiden iyi başladı. Meditasyon her zaman doğru cevap.', mood: 'good', gratitude: ['Sabah meditasyonu', 'Temiz başlangıç'] },
  ];
  journalSeed.forEach((j, idx) => {
    const date = shiftDate(j.offset);
    journalEntries[date] = {
      id: genId('jrn'),
      date,
      title: j.title,
      content: j.content,
      mood: j.mood,
      gratitude: j.gratitude,
      weather: weatherList[idx % weatherList.length],
      location: j.location,
      paperStyle: paperStyles[idx % paperStyles.length],
      quote: quotes[idx % quotes.length],
      color: colors[idx % colors.length],
    };
  });

  return {
    medicines: [
      {
        id: genId('med'),
        name: 'D Vitamini',
        dosage: '1000 IU',
        frequency: ['Sabah'],
        days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        duration: 90,
        boxSize: 90,
        remaining: 35,
        startDate: shiftDate(-55),
        takenLog: (() => {
          const log: Record<string, string[]> = {};
          for (let i = -55; i <= 0; i++) {
            if (Math.random() > 0.15) log[shiftDate(i)] = ['Sabah'];
          }
          return log;
        })(),
      },
      {
        id: genId('med'),
        name: 'Magnezyum',
        dosage: '300 mg',
        frequency: ['Akşam'],
        days: ['Pzt', 'Çar', 'Cum'],
        duration: 60,
        boxSize: 60,
        remaining: 28,
        startDate: shiftDate(-40),
        takenLog: (() => {
          const log: Record<string, string[]> = {};
          for (let i = -40; i <= 0; i++) {
            const dow = dayOfWeek(i);
            if ([1, 3, 5].includes(dow) && Math.random() > 0.2) {
              log[shiftDate(i)] = ['Akşam'];
            }
          }
          return log;
        })(),
      },
      {
        id: genId('med'),
        name: 'Omega-3',
        dosage: '1000 mg',
        frequency: ['Öğle'],
        days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'],
        duration: 60,
        boxSize: 60,
        remaining: 42,
        startDate: shiftDate(-20),
        takenLog: (() => {
          const log: Record<string, string[]> = {};
          for (let i = -20; i <= 0; i++) {
            const dow = dayOfWeek(i);
            if ([1, 2, 3, 4, 5].includes(dow) && Math.random() > 0.25) {
              log[shiftDate(i)] = ['Öğle'];
            }
          }
          return log;
        })(),
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
            { id: genId('ex'), name: 'Tricep Pushdown', muscle: 'Kol', sets: 3, reps: 12, day: 'Pzt' },
            { id: genId('ex'), name: 'Lat Pulldown', muscle: 'Sırt', sets: 4, reps: 10, day: 'Çar' },
            { id: genId('ex'), name: 'Barbell Row', muscle: 'Sırt', sets: 4, reps: 8, day: 'Çar' },
            { id: genId('ex'), name: 'Bicep Curl', muscle: 'Kol', sets: 3, reps: 12, day: 'Çar' },
            { id: genId('ex'), name: 'Squat', muscle: 'Bacak', sets: 5, reps: 5, day: 'Cum' },
            { id: genId('ex'), name: 'Romanian Deadlift', muscle: 'Bacak', sets: 3, reps: 10, day: 'Cum' },
            { id: genId('ex'), name: 'Calf Raise', muscle: 'Bacak', sets: 4, reps: 15, day: 'Cum' },
          ],
        },
        {
          id: genId('prog'),
          name: 'Yoga & Mobilite',
          exercises: [
            { id: genId('ex'), name: 'Sun Salutation', muscle: 'Tüm vücut', sets: 3, reps: 5, day: 'Sal' },
            { id: genId('ex'), name: 'Warrior Flow', muscle: 'Bacak', sets: 2, reps: 8, day: 'Per' },
            { id: genId('ex'), name: 'Hip Opener', muscle: 'Kalça', sets: 3, reps: 10, day: 'Per' },
          ],
        },
      ],
      activeProgram: null, // mount sonrası set edilir
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
        giftBought: false,
      },
      {
        id: genId('bday'),
        name: 'Ahmet (kardeş)',
        date: shiftDate(18),
        giftPlanned: true,
        giftIdea: 'Bluetooth kulaklık',
        giftPrice: 1500,
        giftBought: false,
      },
      {
        id: genId('bday'),
        name: 'Elif',
        date: shiftDate(40),
        giftPlanned: false,
      },
      {
        id: genId('bday'),
        name: 'Baba',
        date: shiftDate(72),
        giftPlanned: true,
        giftIdea: 'Kol saati',
        giftPrice: 2500,
        giftBought: false,
      },
      {
        id: genId('bday'),
        name: 'Ali (en yakın arkadaş)',
        date: shiftDate(-45),
        giftPlanned: true,
        giftIdea: 'Vinyl plak — Pink Floyd',
        giftPrice: 450,
        giftBought: true,
      },
    ],
    budget: {
      income: 35000,
      expenses,
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
            { text: 'Yoğurt 1kg', checked: false },
            { text: 'Tavuk göğsü', checked: false },
          ],
        },
        {
          id: genId('shop'),
          name: 'Eczane',
          date: shiftDate(-2),
          items: [
            { text: 'D vitamini', checked: true },
            { text: 'Ağrı kesici', checked: true },
            { text: 'Vitamin B12', checked: true },
          ],
        },
        {
          id: genId('shop'),
          name: 'Yarıyıl alışverişi',
          date: shiftDate(7),
          items: [
            { text: 'Yeni defter', checked: false },
            { text: 'Kalem seti', checked: false },
            { text: 'Post-it', checked: false },
            { text: 'Klasör', checked: false },
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
        current: 3,
        unit: 'gün',
        step: 1,
        icon: '💪',
      },
      {
        id: genId('goal'),
        name: 'Yarı maraton hazırlığı',
        target: 21,
        current: 8,
        unit: 'km',
        step: 1,
        icon: '🏃',
      },
      {
        id: genId('goal'),
        name: 'Pomodoro toplam saat',
        target: 200,
        current: 73,
        unit: 'saat',
        step: 1,
        icon: '🍅',
      },
    ],
    study: {
      subjects: [
        { id: 'sub_math', name: 'Matematik', color: '#6366f1', resources: [] },
        { id: 'sub_phys', name: 'Fizik', color: '#f87171', resources: [] },
        { id: 'sub_eng', name: 'İngilizce', color: '#22c55e', resources: [] },
        { id: 'sub_chem', name: 'Kimya', color: '#f59e0b', resources: [] },
      ],
      sessions: studySessions,
    },
    journal: {
      entries: journalEntries,
    },
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

  // Aktif programı ilk programa bağla + son 30 gün rastgele exercise log üret
  if (modules.gym.programs[0]) {
    modules.gym.activeProgram = modules.gym.programs[0].id;
    const exIds = modules.gym.programs[0].exercises.slice(0, 6).map(e => e.id);
    for (let i = -30; i <= 0; i++) {
      const dow = dayOfWeek(i);
      if ([1, 3, 5].includes(dow)) {
        exIds.forEach(eid => {
          if (Math.random() > 0.2) {
            modules.gym.exerciseLog[`${eid}_${shiftDate(i)}`] = true;
          }
        });
      }
    }
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
    study: { sessions: [], subjects: [] },
    journal: { entries: {} },
  };
}
