'use client';

/**
 * Floating AI Asistan Widget'ı.
 *
 * Sağ alt köşede sabit duran bir balon/floating button → tıklanınca
 * framer-motion ile küçük bir chat paneli açılır. Konuşma geçmişi
 * `openaiChat()` üzerinden OpenAI'ye gönderilir (Settings'te kayıtlı key).
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Settings as SettingsIcon,
  AlertTriangle,
  Loader2,
  ImagePlus,
  Check,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { PlannerEvent, ModuleState, EventCategory, EventKind, Medicine, Expense } from '@/types';
import { openaiChat, openaiStatus } from '@/lib/openaiClient';
import {
  buildWeeklyPrompt,
  buildPostponePrompt,
  buildTomorrowPrompt,
  buildGoalsPrompt,
  buildHealthPrompt,
  buildPomodoroPrompt,
  buildBaseContext,
} from '@/lib/aiContext';
import { formatDate } from '@/lib/dateUtils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

/** Proaktif asistan mesajı — useProactiveAssistant hook'undan gelir */
export interface ProactiveMessageInput {
  id: string;
  text: string;
}

interface Props {
  /** Tıklandığında ayarlar overlay'ini aç */
  onOpenSettings?: () => void;
  /** Dışarıdan (proaktif sistem) gelen ek asistan mesajları. Yeni id'liler chat'e eklenir. */
  proactiveMessages?: ProactiveMessageInput[];
  /** Asistanın gerçek veri analizi yapabilmesi için */
  events: PlannerEvent[];
  modState: ModuleState;
  currentWeekStart: Date;
  /** Fotoğraf analizinden onaylanan öğeleri planner'a toplu ekler */
  onAddAiEvents?: (events: PlannerEvent[]) => void;
  /** Fotoğraf analizinden onaylanan ilaçları İlaçlarım modülüne ekler */
  onAddAiMedicines?: (medicines: Medicine[]) => void;
  onOpenMedicine?: () => void;
  /** Fotoğraf analizinden onaylanan fiş/fatura harcamalarını Bütçe modülüne ekler */
  onAddAiExpenses?: (expenses: Expense[]) => void;
  onOpenBudget?: () => void;
}

type PhotoPlanItem = {
  name: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  kind: EventKind;
  category: EventCategory;
  importance: PlannerEvent['importance'];
  estimatedMin?: number;
  allDay: boolean;
  sourceNote?: string;
};

type PhotoPlan = {
  summary: string;
  warnings: string[];
  items: PhotoPlanItem[];
  medicines: PhotoPlanMedicine[];
  expenses: PhotoPlanExpense[];
  sourceName?: string;
};

type MedicineFrequency = 'Sabah' | 'Öğle' | 'Akşam' | 'Gece';

type PhotoPlanMedicine = {
  name: string;
  dosage: string;
  frequency: MedicineFrequency[];
  countPerDose: number;
  boxSize: number;
  duration: number;
  sourceNote?: string;
};

type ExpenseCategory = 'Yiyecek' | 'Ulaşım' | 'Sağlık' | 'Eğlence' | 'Giyim' | 'Fatura' | 'Diğer';

type PhotoPlanExpense = {
  name: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  sourceNote?: string;
};

const SYSTEM_PREFIX =
  'Sen kullanıcının kişisel planlayıcı uygulamasındaki yardımcı bir asistansın. ' +
  'Türkçe, kısa, samimi ve net yanıt ver. Markdown kullanma; sade düz metin yaz. ' +
  'Bilmiyorsan dürüstçe söyle.';

const EVENT_KINDS: EventKind[] = ['event', 'task', 'goal'];
const EVENT_CATEGORIES: EventCategory[] = ['personal', 'work', 'study', 'health', 'other'];
const IMPORTANCE_LEVELS: PlannerEvent['importance'][] = ['high', 'medium', 'low'];
const EVENT_KIND_LABELS: Record<EventKind, string> = {
  event: 'Etkinlik',
  task: 'Görev',
  goal: 'Hedef',
};
const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  personal: 'Kişisel',
  work: 'İş',
  study: 'Okul',
  health: 'Sağlık',
  other: 'Diğer',
};
const IMPORTANCE_LABELS: Record<PlannerEvent['importance'], string> = {
  high: 'Yüksek',
  medium: 'Orta',
  low: 'Düşük',
};
const MEDICINE_FREQUENCIES: MedicineFrequency[] = ['Sabah', 'Öğle', 'Akşam', 'Gece'];
const EXPENSE_CATEGORIES: ExpenseCategory[] = ['Yiyecek', 'Ulaşım', 'Sağlık', 'Eğlence', 'Giyim', 'Fatura', 'Diğer'];
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

/**
 * Bir öneri çipi. `contextKey` doluysa tıklandığında kullanıcıya gösterilen
 * (display) metin kısa kalır AMA modele gönderilen prompt **gerçek verilerle**
 * zenginleştirilir. Böylece AI, kullanıcıya "nasıl analiz yaparsın" anlatmak
 * yerine doğrudan kendi verisine bakıp yanıt verir.
 */
interface SuggestedPrompt {
  emoji: string;
  label: string;
  /** Kullanıcının chat'inde "kullanıcı mesajı" olarak görünen metin */
  displayText: string;
  /** Hangi context builder kullanılacak. Yoksa sadece displayText gönderilir. */
  contextKey?: 'weekly' | 'postpone' | 'tomorrow' | 'goals' | 'health' | 'pomodoro' | 'tip' | 'motivation';
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { emoji: '📊', label: 'Haftalık özet', displayText: 'Bu haftamı analiz eder misin?', contextKey: 'weekly' },
  { emoji: '🔁', label: 'Erteleme analizi', displayText: 'En çok ertelediğim görevleri analiz eder misin?', contextKey: 'postpone' },
  { emoji: '📅', label: 'Yarın için plan', displayText: 'Yarın için verimli bir plan önerir misin?', contextKey: 'tomorrow' },
  { emoji: '🎯', label: 'Hedef ilerlemem', displayText: 'Hedeflerimde nasıl gidiyorum?', contextKey: 'goals' },
  { emoji: '💧', label: 'Sağlık özeti', displayText: 'Sağlık verilerimi (su/uyku/spor) değerlendirir misin?', contextKey: 'health' },
  { emoji: '🍅', label: 'Pomodoro önerisi', displayText: 'Bugün için pomodoro planı önerir misin?', contextKey: 'pomodoro' },
  { emoji: '💡', label: 'Verimlilik ipucu', displayText: 'Bana 3 pratik verimlilik ipucu verir misin?', contextKey: 'tip' },
  { emoji: '✨', label: 'Motivasyon', displayText: 'Bugün için kısa bir motivasyon yazar mısın?', contextKey: 'motivation' },
];

function buildPrompt(history: ChatMessage[], newUserText: string, baseContext?: string): string {
  const lines: string[] = [SYSTEM_PREFIX];
  if (baseContext) {
    lines.push('');
    lines.push(baseContext);
    lines.push(
      '↑ Yukarıda kullanıcının uygulamasından gelen GERÇEK güncel veri var. ' +
      'Soruyu cevaplarken bu veriye bak, somut isim ve sayı kullan. ' +
      'Eğer kullanıcı genel bir şey sorduysa bile yanıtı bu bağlamla zenginleştir.'
    );
  }
  lines.push('');
  history.forEach(m => {
    lines.push(m.role === 'user' ? `Kullanıcı: ${m.text}` : `Asistan: ${m.text}`);
  });
  lines.push(`Kullanıcı: ${newUserText}`);
  lines.push('Asistan:');
  return lines.join('\n');
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Fotoğraf okunamadı.'));
    reader.readAsDataURL(file);
  });
}

function parseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const candidate = fenced?.[1] ?? trimmed;
  return JSON.parse(candidate);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function pickString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function pickKind(value: unknown): EventKind {
  return EVENT_KINDS.includes(value as EventKind) ? value as EventKind : 'task';
}

function pickCategory(value: unknown): EventCategory {
  return EVENT_CATEGORIES.includes(value as EventCategory) ? value as EventCategory : 'personal';
}

function pickImportance(value: unknown): PlannerEvent['importance'] {
  return IMPORTANCE_LEVELS.includes(value as PlannerEvent['importance'])
    ? value as PlannerEvent['importance']
    : 'medium';
}

function pickDate(value: unknown): string {
  const raw = pickString(value);
  if (!DATE_RE.test(raw)) return formatDate(new Date());
  const parsed = new Date(`${raw}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? formatDate(new Date()) : raw;
}

function pickTime(value: unknown, fallback = ''): string {
  const raw = pickString(value);
  return TIME_RE.test(raw) ? raw : fallback;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minutesToTime(min: number): string {
  const bounded = Math.max(0, Math.min(23 * 60 + 59, min));
  return `${String(Math.floor(bounded / 60)).padStart(2, '0')}:${String(bounded % 60).padStart(2, '0')}`;
}

function normalizeEstimatedMin(value: unknown): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : 30;
  return Math.max(15, Math.min(480, n));
}

function normalizePositiveInt(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback;
  return Math.max(min, Math.min(max, n));
}

function normalizeMedicineFrequencies(value: unknown): MedicineFrequency[] {
  if (!Array.isArray(value)) return ['Sabah'];
  const freqs = value.filter((f): f is MedicineFrequency => MEDICINE_FREQUENCIES.includes(f as MedicineFrequency));
  return freqs.length > 0 ? freqs : ['Sabah'];
}

function normalizeExpenseCategory(value: unknown): ExpenseCategory {
  return EXPENSE_CATEGORIES.includes(value as ExpenseCategory) ? value as ExpenseCategory : 'Diğer';
}

function normalizeMoney(value: unknown): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.round(n * 100) / 100);
}

function normalizePhotoPlan(rawText: string, sourceName?: string): PhotoPlan {
  const parsed = parseJsonObject(rawText);
  if (!isRecord(parsed)) throw new Error('AI fotoğraf planı geçerli JSON dönmedi.');

  const rawItems = Array.isArray(parsed.items) ? parsed.items : [];
  const items: PhotoPlanItem[] = [];

  rawItems.filter(isRecord).forEach(item => {
    const name = pickString(item.name);
    if (!name || items.length >= 12) return;

    const kind = pickKind(item.kind);
    const estimatedMin = normalizeEstimatedMin(item.estimatedMin);
    const allDay = typeof item.allDay === 'boolean' ? item.allDay : !pickTime(item.startTime);
    const startTime = pickTime(item.startTime, '09:00');
    const fallbackEnd = minutesToTime(timeToMinutes(startTime) + estimatedMin);
    const endTime = pickTime(item.endTime, fallbackEnd);

    items.push({
      name,
      description: pickString(item.description) || undefined,
      date: pickDate(item.date),
      startTime,
      endTime: timeToMinutes(endTime) > timeToMinutes(startTime) ? endTime : fallbackEnd,
      kind,
      category: pickCategory(item.category),
      importance: pickImportance(item.importance),
      estimatedMin,
      allDay: kind === 'goal' ? true : allDay,
      sourceNote: pickString(item.sourceNote) || undefined,
    });
  });

  const rawMedicines = Array.isArray(parsed.medicines) ? parsed.medicines : [];
  const medicines: PhotoPlanMedicine[] = [];

  rawMedicines.filter(isRecord).forEach(med => {
    const name = pickString(med.name);
    if (!name || medicines.length >= 8) return;

    medicines.push({
      name,
      dosage: pickString(med.dosage, 'Dozaj belirtilmedi'),
      frequency: normalizeMedicineFrequencies(med.frequency),
      countPerDose: normalizePositiveInt(med.countPerDose, 1, 1, 8),
      boxSize: normalizePositiveInt(med.boxSize, 20, 1, 300),
      duration: normalizePositiveInt(med.duration, 10, 1, 365),
      sourceNote: pickString(med.sourceNote) || undefined,
    });
  });

  const rawExpenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
  const expenses: PhotoPlanExpense[] = [];

  rawExpenses.filter(isRecord).forEach(exp => {
    const name = pickString(exp.name);
    const amount = normalizeMoney(exp.amount);
    if (!name || amount <= 0 || expenses.length >= 20) return;

    expenses.push({
      name,
      amount,
      category: normalizeExpenseCategory(exp.category),
      date: pickDate(exp.date),
      sourceNote: pickString(exp.sourceNote) || undefined,
    });
  });

  const warnings = Array.isArray(parsed.warnings)
    ? parsed.warnings.map(w => pickString(w)).filter(Boolean).slice(0, 5)
    : [];

  const hasSomething = items.length > 0 || medicines.length > 0 || expenses.length > 0;

  return {
    summary: pickString(parsed.summary, hasSomething ? 'Fotoğraftan eklenebilir öğeler buldum.' : 'Fotoğrafta eklenecek net bir öğe bulamadım.'),
    warnings,
    items,
    medicines,
    expenses,
    sourceName,
  };
}

function buildVisionPlannerPrompt(
  baseContext: string,
  currentWeekStart: Date,
  editInstruction?: string,
  currentPlan?: PhotoPlan
): string {
  const today = formatDate(new Date());
  const weekStart = formatDate(currentWeekStart);
  const editBlock = editInstruction && currentPlan
    ? `\nMevcut taslak JSON:\n${JSON.stringify(currentPlan, null, 2)}\n\nKullanıcının düzenleme isteği: ${editInstruction}\nFotoğraf yoksa mevcut taslak üzerinden düzenle.`
    : '';

  return [
    'Sen bir planner uygulamasına fotoğraftan görev/etkinlik/hedef çıkaran asistansın.',
    `Bugünün tarihi: ${today}. Geçerli hafta başlangıcı: ${weekStart}.`,
    'Fotoğraftaki takvim, ders programı, yapılacaklar listesi, randevu, sınav, toplantı, hedef veya hatırlatma bilgilerini çıkar.',
    'El yazısı listelerde her satırı ayrı öğe olarak çıkar. Örn: "11 mayıs programlama ödevi" => date=2026-05-11, kind=task, category=study, allDay=true.',
    '"ödev", "ders", "sınav", "proje" gibi okul işleri category=study ve kind=task olmalı. "etkinlik", "buluşma", "randevu" gibi maddeler kind=event olmalı.',
    'Ay/gün yazılı ama yıl yoksa bugünün yılıyla yorumla; tarih bugün geçmişte kalıyorsa bir sonraki mantıklı yılı kullan.',
    'Fotoğrafta ilaç kutusu, reçete, prospektüs veya ilaç kullanım bilgisi varsa bunu items alanına görev olarak değil medicines alanına yaz.',
    'İlaç için ad, dozaj ve kullanım vakti çıkar. Kullanım vakti belirsizse frequency=["Sabah"], countPerDose=1, boxSize=20, duration=10 kullan ve warnings alanına belirsizliği ekle.',
    'Fotoğrafta fiş, fatura, ödeme slipi veya alışveriş toplamı varsa bunu items alanına değil expenses alanına yaz. Harcamayı Bütçe > Harcamalar için çıkar.',
    'Fişte toplam tutar netse tek expense üret: name mağaza/fiş açıklaması, amount toplam. Ürün kalemleri net ama toplam yoksa her okunabilir kalemi ayrı expense yap.',
    'Harcama kategorisini şu seçeneklerden seç: Yiyecek, Ulaşım, Sağlık, Eğlence, Giyim, Fatura, Diğer.',
    'Sadece uygulamaya eklenebilir somut öğeleri öner. Belirsiz metinleri uydurma; emin olmadığın tarih/saat için warnings alanına Türkçe not yaz.',
    'Tarih yoksa bugüne göre en yakın mantıklı yaklaşan tarihi YYYY-MM-DD formatında seç. Saat yoksa allDay=true yap, startTime/endTime için 09:00/09:30 kullan.',
    'kind seçimi: sabit saatli şeyler event, yapılacak işler task, büyük hedefler goal. category yalnızca personal/work/study/health/other olabilir.',
    'Aynı öğeyi tekrar üretme; mevcut planner verisinde zaten varsa tekrar önermemeye çalış.',
    '',
    baseContext,
    editBlock,
    '',
    'Yanıtı sadece istenen JSON şemasına uygun ver. Açıklama metni, markdown veya kod bloğu ekleme.',
  ].join('\n');
}

function makePlannerEvent(item: PhotoPlanItem, index: number): PlannerEvent {
  const date = pickDate(item.date);
  const startTime = item.startTime || '09:00';
  const estimatedMin = item.estimatedMin ?? Math.max(15, timeToMinutes(item.endTime || '09:30') - timeToMinutes(startTime));
  const endTime = item.endTime && timeToMinutes(item.endTime) > timeToMinutes(startTime)
    ? item.endTime
    : minutesToTime(timeToMinutes(startTime) + estimatedMin);

  return {
    id: `ai_${Date.now()}_${index}`,
    name: item.name.trim(),
    description: item.description,
    date,
    startTime,
    endTime,
    importance: item.importance,
    completed: false,
    postponeCount: 0,
    postponeHistory: [],
    originalDate: date,
    subTasks: [],
    parentId: null,
    kind: item.kind,
    category: item.category,
    estimatedMin: item.kind === 'task' ? estimatedMin : undefined,
    allDay: item.allDay || item.kind === 'goal' ? true : undefined,
  };
}

function makeEmptyPhotoPlanItem(): PhotoPlanItem {
  return {
    name: '',
    date: formatDate(new Date()),
    startTime: '09:00',
    endTime: '09:30',
    kind: 'task',
    category: 'personal',
    importance: 'medium',
    estimatedMin: 30,
    allDay: true,
  };
}

function makeEmptyPhotoPlanMedicine(): PhotoPlanMedicine {
  return {
    name: '',
    dosage: '',
    frequency: ['Sabah'],
    countPerDose: 1,
    boxSize: 20,
    duration: 10,
  };
}

function makeMedicine(med: PhotoPlanMedicine, index: number): Medicine {
  const boxSize = normalizePositiveInt(med.boxSize, 20, 1, 300);
  return {
    id: `ai_med_${Date.now()}_${index}`,
    name: med.name.trim(),
    dosage: med.dosage.trim() || 'Dozaj belirtilmedi',
    frequency: med.frequency.length ? med.frequency : ['Sabah'],
    days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    duration: normalizePositiveInt(med.duration, 10, 1, 365),
    boxSize,
    remaining: boxSize,
    countPerDose: normalizePositiveInt(med.countPerDose, 1, 1, 8),
    startDate: formatDate(new Date()),
    takenLog: {},
  };
}

function makeEmptyPhotoPlanExpense(): PhotoPlanExpense {
  return {
    name: '',
    amount: 0,
    category: 'Diğer',
    date: formatDate(new Date()),
  };
}

function makeExpense(expense: PhotoPlanExpense, index: number): Expense {
  return {
    id: `ai_exp_${Date.now()}_${index}`,
    name: expense.name.trim(),
    amount: normalizeMoney(expense.amount),
    category: expense.category,
    date: pickDate(expense.date),
  };
}

export default function AssistantWidget({
  onOpenSettings,
  proactiveMessages,
  events,
  modState,
  currentWeekStart,
  onAddAiEvents,
  onAddAiMedicines,
  onOpenMedicine,
  onAddAiExpenses,
  onOpenBudget,
}: Props) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const consumedProIdsRef = useRef<Set<string>>(new Set());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Selam 👋 Ben senin kişisel planlayıcı asistanınım. Bir şey sormak veya planlama konusunda yardım almak için yaz!',
      timestamp: Date.now(),
    },
  ]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [pendingPlan, setPendingPlan] = useState<PhotoPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const ensureOpenAIConfigured = async () => {
    const status = await openaiStatus().catch(() => ({ configured: false, model: '' }));
    setHasKey(status.configured);
    if (!status.configured) {
      setError('OpenAI API key tanımlı değil. Sunucuda .env OPENAI_API_KEY yoksa Ayarlar → API Key bölümünden ekleyebilirsin.');
    }
    return status.configured;
  };

  // Açılınca key kontrolü + odaklan + okunmamış sayacı sıfırla
  useEffect(() => {
    if (open) {
      openaiStatus()
        .then(status => setHasKey(status.configured))
        .catch(() => setHasKey(false));
      setError(null);
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  // Proaktif mesajları izle — yeni id'liler chat'e eklensin, kapalıysa badge artsın
  useEffect(() => {
    if (!proactiveMessages || proactiveMessages.length === 0) return;
    const fresh = proactiveMessages.filter(m => !consumedProIdsRef.current.has(m.id));
    if (fresh.length === 0) return;
    fresh.forEach(m => consumedProIdsRef.current.add(m.id));
    setMessages(prev => [
      ...prev,
      ...fresh.map(m => ({
        id: m.id,
        role: 'assistant' as const,
        text: m.text,
        timestamp: Date.now(),
      })),
    ]);
    if (!open) setUnread(u => u + fresh.length);
  }, [proactiveMessages, open]);

  // Yeni mesaj geldiğinde scroll en alta
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  // Component unmount olursa devam eden istek varsa iptal et
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  /**
   * Suggested prompt'larda kullanılan context anahtarına göre **modele gönderilecek**
   * tam prompt'u üretir. Burası sayesinde AI "nasıl analiz yaparsın" anlatmak
   * yerine doğrudan gerçek veriye bakıp cevap verir.
   */
  const buildContextPrompt = (key: SuggestedPrompt['contextKey']): string | null => {
    switch (key) {
      case 'weekly':
        return buildWeeklyPrompt(events, currentWeekStart);
      case 'postpone':
        return buildPostponePrompt(events);
      case 'tomorrow':
        return buildTomorrowPrompt(events);
      case 'goals':
        return buildGoalsPrompt(modState);
      case 'health':
        return buildHealthPrompt(modState);
      case 'pomodoro':
        return buildPomodoroPrompt(events, modState);
      case 'tip':
      case 'motivation':
      default:
        return null;
    }
  };

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || sending) return;

    if (!(await ensureOpenAIConfigured())) return;

    if (!file.type.startsWith('image/')) {
      setError('Lütfen PNG, JPG veya WebP gibi bir fotoğraf seç.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError('Fotoğraf çok büyük. En fazla 6 MB olan bir görsel yükle.');
      return;
    }

    setError(null);
    setPendingPlan(null);
    setEditingPlan(false);
    setDraft('');
    setMessages(prev => [
      ...prev,
      {
        id: `u_photo_${Date.now()}`,
        role: 'user',
        text: `📷 Fotoğraf yüklendi: ${file.name}`,
        timestamp: Date.now(),
      },
    ]);
    setSending(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const imageUrl = await fileToDataUrl(file);
      const prompt = buildVisionPlannerPrompt(
        buildBaseContext(events, modState),
        currentWeekStart
      );
      const res = await openaiChat(prompt, {
        images: [imageUrl],
        responseFormat: 'photo_planner_plan',
        signal: ctrl.signal,
      });
      const plan = normalizePhotoPlan(res.text, file.name);

      if (plan.items.length === 0 && plan.medicines.length === 0 && plan.expenses.length === 0) {
        setMessages(prev => [
          ...prev,
          {
            id: `a_photo_empty_${Date.now()}`,
            role: 'assistant',
            text: `${plan.summary}${plan.warnings.length ? `\nNot: ${plan.warnings.join(' ')}` : ''}`,
            timestamp: Date.now(),
          },
        ]);
        return;
      }

      setPendingPlan(plan);
      setEditingPlan(false);
      setMessages(prev => [
        ...prev,
        {
          id: `a_photo_${Date.now()}`,
          role: 'assistant',
          text: `Fotoğrafı inceledim. ${plan.items.length + plan.medicines.length + plan.expenses.length} öğe buldum. Eklemeden önce aşağıdaki taslağı kontrol et; istersen düzenleyebilirsin.`,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Fotoğraf analiz edilirken hata oluştu.';
      setError(msg);
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  };

  const refinePendingPlan = async (instruction: string) => {
    if (!pendingPlan || sending) return;
    if (!(await ensureOpenAIConfigured())) return;

    setError(null);
    setDraft('');
    setMessages(prev => [
      ...prev,
      {
        id: `u_edit_${Date.now()}`,
        role: 'user',
        text: instruction,
        timestamp: Date.now(),
      },
    ]);
    setSending(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const prompt = buildVisionPlannerPrompt(
        buildBaseContext(events, modState),
        currentWeekStart,
        instruction,
        pendingPlan
      );
      const res = await openaiChat(prompt, {
        responseFormat: 'photo_planner_plan',
        signal: ctrl.signal,
      });
      const nextPlan = normalizePhotoPlan(res.text, pendingPlan.sourceName);
      setPendingPlan(nextPlan);
      setEditingPlan(false);
      setMessages(prev => [
        ...prev,
        {
          id: `a_edit_${Date.now()}`,
          role: 'assistant',
          text: nextPlan.items.length + nextPlan.medicines.length + nextPlan.expenses.length > 0
            ? `Taslağı güncelledim. Şimdi ${nextPlan.items.length + nextPlan.medicines.length + nextPlan.expenses.length} öğe var; eklemeden önce tekrar kontrol et.`
            : 'Taslağı güncelledim ama eklenecek net bir öğe kalmadı.',
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Taslak düzenlenirken hata oluştu.';
      setError(msg);
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  };

  const handleApplyPendingPlan = () => {
    if (!pendingPlan || (pendingPlan.items.length === 0 && pendingPlan.medicines.length === 0 && pendingPlan.expenses.length === 0)) return;
    if (pendingPlan.items.length > 0 && !onAddAiEvents) {
      setError('AI önerilerini planner’a ekleme bağlantısı hazır değil.');
      return;
    }
    if (pendingPlan.medicines.length > 0 && !onAddAiMedicines) {
      setError('AI ilaç önerilerini İlaçlarım’a ekleme bağlantısı hazır değil.');
      return;
    }
    if (pendingPlan.expenses.length > 0 && !onAddAiExpenses) {
      setError('AI harcama önerilerini Bütçe’ye ekleme bağlantısı hazır değil.');
      return;
    }

    const validItems = pendingPlan.items.filter(item => item.name.trim());
    const validMedicines = pendingPlan.medicines.filter(med => med.name.trim());
    const validExpenses = pendingPlan.expenses.filter(exp => exp.name.trim() && exp.amount > 0);
    if (validItems.length === 0 && validMedicines.length === 0 && validExpenses.length === 0) {
      setError('Eklenecek en az bir öğenin adı olmalı.');
      return;
    }

    const newEvents = validItems.map(makePlannerEvent);
    const newMedicines = validMedicines.map(makeMedicine);
    const newExpenses = validExpenses.map(makeExpense);
    if (newEvents.length > 0) onAddAiEvents?.(newEvents);
    if (newMedicines.length > 0) {
      onAddAiMedicines?.(newMedicines);
      onOpenMedicine?.();
    }
    if (newExpenses.length > 0) {
      onAddAiExpenses?.(newExpenses);
      onOpenBudget?.();
    }
    setPendingPlan(null);
    setEditingPlan(false);
    setMessages(prev => [
      ...prev,
      {
        id: `a_apply_${Date.now()}`,
        role: 'assistant',
        text: `${[
          newEvents.length ? `${newEvents.length} planner öğesi` : '',
          newMedicines.length ? `${newMedicines.length} ilaç` : '',
          newExpenses.length ? `${newExpenses.length} harcama` : '',
        ].filter(Boolean).join(' ve ')} ekledim.`,
        timestamp: Date.now(),
      },
    ]);
  };

  const updatePendingPlanItem = (index: number, patch: Partial<PhotoPlanItem>) => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item, idx) => {
          if (idx !== index) return item;
          const next = { ...item, ...patch };
          if (patch.kind === 'goal') {
            next.allDay = true;
          }
          if (patch.startTime && (!next.endTime || timeToMinutes(next.endTime) <= timeToMinutes(patch.startTime))) {
            next.endTime = minutesToTime(timeToMinutes(patch.startTime) + (next.estimatedMin || 30));
          }
          return next;
        }),
      };
    });
  };

  const removePendingPlanItem = (index: number) => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return { ...prev, items: prev.items.filter((_, idx) => idx !== index) };
    });
  };

  const addPendingPlanItem = () => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return { ...prev, items: [...prev.items, makeEmptyPhotoPlanItem()] };
    });
    setEditingPlan(true);
  };

  const updatePendingPlanMedicine = (index: number, patch: Partial<PhotoPlanMedicine>) => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        medicines: prev.medicines.map((med, idx) => idx === index ? { ...med, ...patch } : med),
      };
    });
  };

  const togglePendingMedicineFrequency = (index: number, freq: MedicineFrequency) => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        medicines: prev.medicines.map((med, idx) => {
          if (idx !== index) return med;
          const next = med.frequency.includes(freq)
            ? med.frequency.filter(f => f !== freq)
            : [...med.frequency, freq];
          return { ...med, frequency: next.length ? next : ['Sabah'] };
        }),
      };
    });
  };

  const removePendingPlanMedicine = (index: number) => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return { ...prev, medicines: prev.medicines.filter((_, idx) => idx !== index) };
    });
  };

  const addPendingPlanMedicine = () => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return { ...prev, medicines: [...prev.medicines, makeEmptyPhotoPlanMedicine()] };
    });
    setEditingPlan(true);
  };

  const updatePendingPlanExpense = (index: number, patch: Partial<PhotoPlanExpense>) => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        expenses: prev.expenses.map((expense, idx) => idx === index ? { ...expense, ...patch } : expense),
      };
    });
  };

  const removePendingPlanExpense = (index: number) => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return { ...prev, expenses: prev.expenses.filter((_, idx) => idx !== index) };
    });
  };

  const addPendingPlanExpense = () => {
    setPendingPlan(prev => {
      if (!prev) return prev;
      return { ...prev, expenses: [...prev.expenses, makeEmptyPhotoPlanExpense()] };
    });
    setEditingPlan(true);
  };

  /**
   * Mesaj gönderir.
   * - `displayText`  : kullanıcının chat balonunda görünecek metin (kısa, doğal)
   * - `modelPrompt`  : modele gerçekten gidecek prompt (verili context dahil)
   * Boş bırakılırsa tüm bağlam textarea draft'tan alınır ve aynı metin
   * hem ekrana hem modele gider.
   */
  const handleSend = async (displayText?: string, modelPrompt?: string) => {
    const userText = (displayText ?? draft).trim();
    if (!userText || sending) return;

    if (pendingPlan && !displayText && !modelPrompt) {
      await refinePendingPlan(userText);
      return;
    }

    if (!(await ensureOpenAIConfigured())) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setDraft('');
    setSending(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      // Suggested prompt'lar için zaten context dahil edilmiş tam prompt geldi.
      // Serbest yazılan metinler için hafif "her zaman" context'ini ekle ki
      // kullanıcı "haftamı özetle" gibi yazsa bile model boş tahminle değil
      // gerçek verisiyle yanıt versin.
      let prompt: string;
      if (modelPrompt) {
        // Suggested prompt — modelPrompt zaten kendi context'ini içeriyor.
        // Kısa bir geçmişe bağla (önceki konuşma turları varsa) — ama tek seferde
        // büyütmemek için son 4 mesajı dahil et.
        const recent = messages.slice(-4);
        const histLines: string[] = [];
        if (recent.length > 0) {
          histLines.push('');
          histLines.push('Önceki konuşma:');
          recent.forEach(m => {
            histLines.push(m.role === 'user' ? `Kullanıcı: ${m.text}` : `Asistan: ${m.text}`);
          });
        }
        prompt = `${modelPrompt}${histLines.join('\n')}`;
      } else {
        // Serbest mesaj: hafif context + tüm geçmiş
        const baseCtx = buildBaseContext(events, modState);
        prompt = buildPrompt(messages, userText, baseCtx);
      }

      const res = await openaiChat(prompt, { signal: ctrl.signal });
      const reply = (res.text || '').trim() || '(boş yanıt)';
      setMessages(prev => [
        ...prev,
        { id: `a_${Date.now()}`, role: 'assistant', text: reply, timestamp: Date.now() },
      ]);
    } catch (err) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(msg);
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  };

  /** Önerilen prompt çipinden tetiklenen gönderim — context'i otomatik üretir */
  const handleSuggestedClick = (p: SuggestedPrompt) => {
    const modelPrompt = buildContextPrompt(p.contextKey) ?? p.displayText;
    handleSend(p.displayText, modelPrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* === Floating Trigger Button === */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="trigger"
            type="button"
            className="assistant-fab"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            whileHover={{ scale: 1.08, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Yardımcıyı aç"
          >
            <MessageCircle size={22} strokeWidth={2.4} />
            <span className="assistant-fab-pulse" />
            {unread > 0 && (
              <motion.span
                className="assistant-fab-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                aria-label={`${unread} yeni mesaj`}
              >
                {unread > 9 ? '9+' : unread}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* === Chat Panel === */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="assistant-panel"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            role="dialog"
            aria-label="AI Asistan"
          >
            {/* Header */}
            <div className="assistant-header">
              <div className="assistant-header-left">
                <motion.div
                  className="assistant-avatar"
                  animate={{ rotate: [0, 8, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop' }}
                >
                  <Sparkles size={16} />
                </motion.div>
                <div>
                  <div className="assistant-title">AI Asistan</div>
                  <div className="assistant-status">
                    <span className={`status-dot ${hasKey ? 'on' : 'off'}`} />
                    {hasKey ? 'Çevrim içi' : 'API key gerekli'}
                  </div>
                </div>
              </div>
              <div className="assistant-header-actions">
                <button
                  type="button"
                  className="assistant-icon-btn"
                  onClick={() => setOpen(false)}
                  title="Kapat"
                  aria-label="Kapat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="assistant-messages" ref={scrollRef}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  className={`assistant-msg ${m.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="assistant-bubble">{m.text}</div>
                </motion.div>
              ))}

              {pendingPlan && (
                <motion.div
                  className="assistant-plan-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="assistant-plan-head">
                    <div>
                      <div className="assistant-plan-title">Ekleme taslağı</div>
                      <div className="assistant-plan-summary">{pendingPlan.summary}</div>
                    </div>
                    <span className="assistant-plan-count">{pendingPlan.items.length + pendingPlan.medicines.length + pendingPlan.expenses.length}</span>
                  </div>

                  {pendingPlan.items.length > 0 && (
                    <div className="assistant-plan-section-label">Planner</div>
                  )}
                  <div className="assistant-plan-items">
                    {pendingPlan.items.map((item, idx) => (
                      <div key={`${item.name}_${idx}`} className="assistant-plan-item">
                        {editingPlan ? (
                          <div className="assistant-plan-edit-form">
                            <div className="assistant-plan-edit-top">
                              <input
                                className="assistant-plan-input title"
                                value={item.name}
                                onChange={(e) => updatePendingPlanItem(idx, { name: e.target.value })}
                                placeholder="Öğe adı"
                              />
                              <button
                                type="button"
                                className="assistant-plan-row-remove"
                                onClick={() => removePendingPlanItem(idx)}
                                title="Satırı sil"
                                aria-label="Satırı sil"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            <div className="assistant-plan-edit-grid">
                              <label>
                                <span>Tür</span>
                                <select
                                  value={item.kind}
                                  onChange={(e) => updatePendingPlanItem(idx, { kind: e.target.value as EventKind })}
                                >
                                  {EVENT_KINDS.map(kind => (
                                    <option key={kind} value={kind}>{EVENT_KIND_LABELS[kind]}</option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                <span>Kategori</span>
                                <select
                                  value={item.category}
                                  onChange={(e) => updatePendingPlanItem(idx, { category: e.target.value as EventCategory })}
                                >
                                  {EVENT_CATEGORIES.map(category => (
                                    <option key={category} value={category}>{EVENT_CATEGORY_LABELS[category]}</option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                <span>Önem</span>
                                <select
                                  value={item.importance}
                                  onChange={(e) => updatePendingPlanItem(idx, { importance: e.target.value as PlannerEvent['importance'] })}
                                >
                                  {IMPORTANCE_LEVELS.map(importance => (
                                    <option key={importance} value={importance}>{IMPORTANCE_LABELS[importance]}</option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                <span>Tarih</span>
                                <input
                                  type="date"
                                  value={item.date}
                                  onChange={(e) => updatePendingPlanItem(idx, { date: e.target.value })}
                                />
                              </label>
                              <label className="assistant-plan-check">
                                <input
                                  type="checkbox"
                                  checked={item.allDay}
                                  disabled={item.kind === 'goal'}
                                  onChange={(e) => updatePendingPlanItem(idx, { allDay: e.target.checked })}
                                />
                                <span>Tüm gün</span>
                              </label>
                              {!item.allDay && item.kind !== 'goal' && (
                                <>
                                  <label>
                                    <span>Başlangıç</span>
                                    <input
                                      type="time"
                                      value={item.startTime || '09:00'}
                                      onChange={(e) => updatePendingPlanItem(idx, { startTime: e.target.value })}
                                    />
                                  </label>
                                  <label>
                                    <span>Bitiş</span>
                                    <input
                                      type="time"
                                      value={item.endTime || '09:30'}
                                      onChange={(e) => updatePendingPlanItem(idx, { endTime: e.target.value })}
                                    />
                                  </label>
                                </>
                              )}
                            </div>

                            <textarea
                              className="assistant-plan-input note"
                              value={item.description || ''}
                              onChange={(e) => updatePendingPlanItem(idx, { description: e.target.value || undefined })}
                              placeholder="Açıklama (opsiyonel)"
                              rows={2}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="assistant-plan-item-main">
                              <span className={`assistant-plan-kind ${item.kind}`}>{EVENT_KIND_LABELS[item.kind]}</span>
                              <strong>{item.name}</strong>
                            </div>
                            <div className="assistant-plan-meta">
                              {item.date}
                              {item.allDay ? ' · tüm gün' : ` · ${item.startTime}-${item.endTime}`}
                              {` · ${EVENT_CATEGORY_LABELS[item.category]}`}
                            </div>
                            {item.sourceNote && <div className="assistant-plan-note">{item.sourceNote}</div>}
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {pendingPlan.medicines.length > 0 && (
                    <>
                      <div className="assistant-plan-section-label medicine">İlaçlarım</div>
                      <div className="assistant-plan-items">
                        {pendingPlan.medicines.map((med, idx) => (
                          <div key={`${med.name}_${idx}`} className="assistant-plan-item medicine">
                            {editingPlan ? (
                              <div className="assistant-plan-edit-form">
                                <div className="assistant-plan-edit-top">
                                  <input
                                    className="assistant-plan-input title"
                                    value={med.name}
                                    onChange={(e) => updatePendingPlanMedicine(idx, { name: e.target.value })}
                                    placeholder="İlaç adı"
                                  />
                                  <button
                                    type="button"
                                    className="assistant-plan-row-remove"
                                    onClick={() => removePendingPlanMedicine(idx)}
                                    title="Satırı sil"
                                    aria-label="Satırı sil"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                                <input
                                  className="assistant-plan-input"
                                  value={med.dosage}
                                  onChange={(e) => updatePendingPlanMedicine(idx, { dosage: e.target.value })}
                                  placeholder="Dozaj / açıklama"
                                />

                                <div className="assistant-med-freq-editor">
                                  {MEDICINE_FREQUENCIES.map(freq => (
                                    <button
                                      key={freq}
                                      type="button"
                                      className={`assistant-med-freq${med.frequency.includes(freq) ? ' active' : ''}`}
                                      onClick={() => togglePendingMedicineFrequency(idx, freq)}
                                    >
                                      {freq}
                                    </button>
                                  ))}
                                </div>

                                <div className="assistant-plan-edit-grid">
                                  <label>
                                    <span>Doz başı</span>
                                    <input
                                      type="number"
                                      min={1}
                                      value={med.countPerDose}
                                      onChange={(e) => updatePendingPlanMedicine(idx, { countPerDose: normalizePositiveInt(Number(e.target.value), 1, 1, 8) })}
                                    />
                                  </label>
                                  <label>
                                    <span>Kutu</span>
                                    <input
                                      type="number"
                                      min={1}
                                      value={med.boxSize}
                                      onChange={(e) => updatePendingPlanMedicine(idx, { boxSize: normalizePositiveInt(Number(e.target.value), 20, 1, 300) })}
                                    />
                                  </label>
                                  <label>
                                    <span>Süre (gün)</span>
                                    <input
                                      type="number"
                                      min={1}
                                      value={med.duration}
                                      onChange={(e) => updatePendingPlanMedicine(idx, { duration: normalizePositiveInt(Number(e.target.value), 10, 1, 365) })}
                                    />
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="assistant-plan-item-main">
                                  <span className="assistant-plan-kind medicine">İlaç</span>
                                  <strong>{med.name}</strong>
                                </div>
                                <div className="assistant-plan-meta">
                                  {med.dosage} · {med.frequency.join(', ')} · {med.countPerDose} adet
                                </div>
                                {med.sourceNote && <div className="assistant-plan-note">{med.sourceNote}</div>}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {pendingPlan.expenses.length > 0 && (
                    <>
                      <div className="assistant-plan-section-label expense">Harcamalar</div>
                      <div className="assistant-plan-items">
                        {pendingPlan.expenses.map((expense, idx) => (
                          <div key={`${expense.name}_${idx}`} className="assistant-plan-item expense">
                            {editingPlan ? (
                              <div className="assistant-plan-edit-form">
                                <div className="assistant-plan-edit-top">
                                  <input
                                    className="assistant-plan-input title"
                                    value={expense.name}
                                    onChange={(e) => updatePendingPlanExpense(idx, { name: e.target.value })}
                                    placeholder="Harcama açıklaması"
                                  />
                                  <button
                                    type="button"
                                    className="assistant-plan-row-remove"
                                    onClick={() => removePendingPlanExpense(idx)}
                                    title="Satırı sil"
                                    aria-label="Satırı sil"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                                <div className="assistant-plan-edit-grid">
                                  <label>
                                    <span>Tutar</span>
                                    <input
                                      type="number"
                                      min={0}
                                      step="0.01"
                                      value={expense.amount}
                                      onChange={(e) => updatePendingPlanExpense(idx, { amount: normalizeMoney(Number(e.target.value)) })}
                                    />
                                  </label>
                                  <label>
                                    <span>Kategori</span>
                                    <select
                                      value={expense.category}
                                      onChange={(e) => updatePendingPlanExpense(idx, { category: e.target.value as ExpenseCategory })}
                                    >
                                      {EXPENSE_CATEGORIES.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                      ))}
                                    </select>
                                  </label>
                                  <label>
                                    <span>Tarih</span>
                                    <input
                                      type="date"
                                      value={expense.date}
                                      onChange={(e) => updatePendingPlanExpense(idx, { date: e.target.value })}
                                    />
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="assistant-plan-item-main">
                                  <span className="assistant-plan-kind expense">Harcama</span>
                                  <strong>{expense.name}</strong>
                                </div>
                                <div className="assistant-plan-meta">
                                  ₺{expense.amount.toLocaleString('tr-TR')} · {expense.category} · {expense.date}
                                </div>
                                {expense.sourceNote && <div className="assistant-plan-note">{expense.sourceNote}</div>}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {pendingPlan.warnings.length > 0 && (
                    <div className="assistant-plan-warnings">
                      {pendingPlan.warnings.map((warning, idx) => (
                        <span key={`${warning}_${idx}`}>{warning}</span>
                      ))}
                    </div>
                  )}

                  <div className="assistant-plan-actions">
                    <button type="button" className="assistant-plan-action primary" onClick={handleApplyPendingPlan} disabled={sending}>
                      <Check size={14} /> Ekle
                    </button>
                    <button
                      type="button"
                      className="assistant-plan-action"
                      onClick={() => setEditingPlan(prev => !prev)}
                      disabled={sending}
                    >
                      <Pencil size={14} /> {editingPlan ? 'Bitti' : 'Düzenle'}
                    </button>
                    {editingPlan && (
                      <button type="button" className="assistant-plan-action" onClick={addPendingPlanItem} disabled={sending}>
                        + Plan
                      </button>
                    )}
                    {editingPlan && (
                      <button type="button" className="assistant-plan-action" onClick={addPendingPlanMedicine} disabled={sending}>
                        + İlaç
                      </button>
                    )}
                    {editingPlan && (
                      <button type="button" className="assistant-plan-action" onClick={addPendingPlanExpense} disabled={sending}>
                        + Harcama
                      </button>
                    )}
                    <button type="button" className="assistant-plan-action danger" onClick={() => { setPendingPlan(null); setEditingPlan(false); }} disabled={sending}>
                      <Trash2 size={14} /> İptal
                    </button>
                  </div>
                </motion.div>
              )}

              {sending && (
                <motion.div
                  className="assistant-msg assistant"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="assistant-bubble typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="assistant-error"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle size={14} />
                  <span>{error}</span>
                  {!hasKey && onOpenSettings && (
                    <button
                      type="button"
                      className="assistant-error-cta"
                      onClick={() => { setOpen(false); onOpenSettings(); }}
                    >
                      <SettingsIcon size={12} /> Ayarlar
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Suggested prompts — yatay scroll */}
            <div className="assistant-suggestions" aria-label="Önerilen sorular">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="assistant-suggestion-chip"
                  onClick={() => handleSuggestedClick(p)}
                  disabled={sending}
                  title={p.displayText}
                >
                  <span className="suggestion-emoji">{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Composer */}
            <div className="assistant-composer">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="assistant-file-input"
                onChange={handlePhotoSelected}
              />
              <button
                type="button"
                className="assistant-attach"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
                title="Fotoğraf yükle"
                aria-label="Fotoğraf yükle"
              >
                <ImagePlus size={16} />
              </button>
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasKey ? (pendingPlan ? 'Taslak için düzenleme isteği yaz…' : 'Asistana sor…') : 'Önce API key ekle'}
                rows={1}
                disabled={sending}
              />
              <motion.button
                type="button"
                className="assistant-send"
                onClick={() => handleSend()}
                disabled={!draft.trim() || sending}
                whileHover={{ scale: draft.trim() ? 1.05 : 1 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Gönder"
              >
                {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
