import { formatDate } from './dateUtils';
import type { PlannerEvent } from '@/types';

export function computeStreak(events: PlannerEvent[]): { streak: number; todayDone: boolean; todayTotal: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);

  const todayTasks = events.filter(e => e.date === todayStr && e.kind === 'task');
  const todayDone = todayTasks.length > 0 && todayTasks.every(e => e.completed);

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const dayTasks = events.filter(e => e.date === dateStr && e.kind === 'task');

    if (dayTasks.length === 0) continue; // boş gün → atla
    const allDone = dayTasks.every(e => e.completed);

    if (allDone) {
      streak++;
    } else {
      // Bugün için: gün bitmediyse streak'i kırma, sadece atla
      if (i === 0) continue;
      break;
    }
  }
  return { streak, todayDone, todayTotal: todayTasks.length };
}
