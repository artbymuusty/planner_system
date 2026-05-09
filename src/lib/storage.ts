import type { PlannerEvent, User, ModuleState } from '@/types';

const PLANNER_KEY = 'hackplanner';
const MODULES_KEY = 'hackplanner_modules';

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
      return { events: data.events || [], user: data.user || null };
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
