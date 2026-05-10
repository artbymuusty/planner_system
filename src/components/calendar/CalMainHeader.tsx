'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { CheckCircle2, RotateCcw, AlertTriangle, Flame, Target } from 'lucide-react';
import { MONTHS_TR, DAYS_TR } from '@/lib/constants';
import { formatDate } from '@/lib/dateUtils';
import { computeStreak } from '@/lib/statsUtils';
import type { CalendarView } from '@/components/TopBar';
import type { PlannerEvent } from '@/types';

interface Props {
  view: CalendarView;
  anchorDate: Date;
  events: PlannerEvent[];
  onToday: () => void;
  onAddEvent: () => void;
}

function buildTitle(view: CalendarView, d: Date): string {
  if (view === 'day') {
    const dayName = DAYS_TR[d.getDay() === 0 ? 6 : d.getDay() - 1];
    return `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()} • ${dayName}`;
  }
  if (view === 'month') {
    return `${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
  }
  // week
  return `${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
}

export default function CalMainHeader({ view, anchorDate, events, onToday, onAddEvent }: Props) {
  const title = buildTitle(view, anchorDate);

  return (
    <div className="cal-main-header">
      <div className="cal-main-title-group">
        <h2 className="cal-main-title">{title}</h2>
      </div>

      <div className="cal-main-actions">
        <button
          onClick={onToday}
          className="cal-today-btn"
        >
          Bugün
        </button>
        <button
          onClick={onAddEvent}
          className="cal-add-btn"
        >
          <PlusIcon />
          <span>Etkinlik / Görev Ekle</span>
        </button>
      </div>
    </div>
  );
}
