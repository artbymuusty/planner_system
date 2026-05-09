import type { PlannerEvent, User, ModuleState, EventKind, EventCategory } from '@/types';

const PLANNER_KEY = 'hackplanner';
const MODULES_KEY = 'hackplanner_modules';

/**
 * Eski (Aşama 1 öncesi) PlannerEvent kayıtlarında bulunmayan alanları
 * default değerlerle doldurur. Tip değişikliği ile localStorage'da
 * geriye dönük uyumluluk sağlanır.
 */
function migrateEvent(raw: unknown): PlannerEvent | null {
  if (!raw || typeof raw !== 'object') return null;
  const e = raw as Partial<PlannerEvent> & Record<string, unknown>;

  if (typeof e.id !== 'string' || typeof e.name !== 'string' || typeof e.date !== 'string') {
    return null;
  }

  // Modül kaynaklı event'lerde (birthday gibi) varsayılan kategori daha mantıklı
  const moduleType = typeof e.moduleType === 'string' ? e.moduleType : undefined;
  const defaultCategory: EventCategory =
    moduleType === 'birthday'
      ? 'personal'
      : moduleType === 'medicine'
        ? 'health'
        : 'personal';

  // Saat alanı boş/eksikse all-day kabul et
  const startTime = typeof e.startTime === 'string' ? e.startTime : '';
  const endTime = typeof e.endTime === 'string' ? e.endTime : '';
  const inferredAllDay = !startTime || !endTime;

  const kind: EventKind =
    (e.kind as EventKind | undefined) ??
    // Eski kayıtların hepsi saatli event olarak yaratıldığı için 'event' default'u güvenli
    'event';

  const category: EventCategory =
    (e.category as EventCategory | undefined) ?? defaultCategory;

  return {
    id: e.id,
    name: e.name,
    description: typeof e.description === 'string' ? e.description : undefined,
    date: e.date,
    startTime: startTime || '09:00',
    endTime: endTime || '10:00',
    importance: (e.importance as PlannerEvent['importance']) ?? 'medium',
    completed: Boolean(e.completed),
    postponeCount: typeof e.postponeCount === 'number' ? e.postponeCount : 0,
    postponeHistory: Array.isArray(e.postponeHistory) ? e.postponeHistory : [],
    originalDate: typeof e.originalDate === 'string' ? e.originalDate : e.date,
    subTasks: Array.isArray(e.subTasks) ? (e.subTasks as string[]) : [],
    parentId: typeof e.parentId === 'string' ? e.parentId : null,
    parentName: typeof e.parentName === 'string' ? e.parentName : undefined,
    moduleType,
    // YENİ alanlar
    kind,
    category,
    estimatedMin: typeof e.estimatedMin === 'number' ? e.estimatedMin : undefined,
    allDay: typeof e.allDay === 'boolean' ? e.allDay : inferredAllDay ? true : undefined,
    recurrence: (e.recurrence as PlannerEvent['recurrence']) ?? undefined,
    completedDates: Array.isArray(e.completedDates) ? (e.completedDates as string[]) : undefined,
  };
}

export function savePlannerData(events: PlannerEvent[], user: User | null) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PLANNER_KEY, JSON.stringify({ events, user }));
}

export function loadPlannerData(): { events: PlannerEvent[]; user: User | null } {
  if (typeof window === 'undefined') return { events: [], user: null };
  try {
    const raw = localStorage.getItem(PLANNER_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const rawEvents: unknown[] = Array.isArray(data?.events) ? data.events : [];
      const events: PlannerEvent[] = rawEvents
        .map(migrateEvent)
        .filter((e): e is PlannerEvent => e !== null);
      return { events, user: data?.user ?? null };
    }
  } catch (e) {
    console.error('Load error:', e);
  }
  return { events: [], user: null };
}

export function saveModuleData(modState: ModuleState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODULES_KEY, JSON.stringify(modState));
}

export function loadModuleData(): Partial<ModuleState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MODULES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Module load error:', e);
  }
  return {};
}
