'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { CheckCircle2, RotateCcw, AlertTriangle, Flame, Target } from 'lucide-react';
import { MONTHS_TR, DAYS_TR } from '@/lib/constants';
import { formatDate } from '@/lib/dateUtils';
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

function computePostponeStats(events: PlannerEvent[]) {
  const postponed = events.filter(e => (e.postponeCount || 0) > 0);
  const total = postponed.reduce((s, e) => s + (e.postponeCount || 0), 0);
  const chronic = postponed.filter(e => (e.postponeCount || 0) >= 3).length;
  const pendingPostponed = postponed.filter(e => !e.completed).length;
  return { total, chronic, pendingPostponed };
}

/**
 * Streak: Bugünden geriye doğru, görevi olan ve TÜM görevleri tamamlanmış
 * günlerin kesintisiz sayısı.
 *  - Görevi olmayan günler atlanır (streak kırılmaz, sayılmaz)
 *  - Bugün: tüm görevler tamamlanmadıysa streak kırılmaz, sadece atlanır
 *    (gün henüz bitmemiş olabilir)
 *  - Eski tarihlerde tamamlanmamış görev varsa streak kırılır
 */
function computeStreak(events: PlannerEvent[]): { streak: number; todayDone: boolean; todayTotal: number } {
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

function scrollToPostpone() {
  const el = document.getElementById('postponeSection');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function CalMainHeader({ view, anchorDate, events, onToday, onAddEvent }: Props) {
  const title = buildTitle(view, anchorDate);
  const { total, chronic, pendingPostponed } = computePostponeStats(events);
  const { streak, todayDone, todayTotal } = computeStreak(events);

  const tone =
    chronic > 0 ? 'danger' : total > 0 ? 'warn' : 'ok';
  const label =
    total === 0
      ? 'Erteleme yok'
      : `${total} erteleme`;
  const tooltip =
    total === 0
      ? 'Harika! Hiçbir görev ertelenmemiş.'
      : `Toplam erteleme: ${total}\nKronik (3+ erteleme): ${chronic}\nBekleyen ertelenmiş görev: ${pendingPostponed}\n\nDetay için tıkla.`;

  // Streak ton/etiket/tooltip
  const streakTone =
    streak === 0 ? 'muted' : streak >= 7 ? 'hot' : 'live';
  const streakLabel =
    streak === 0 ? 'Streak yok' : `${streak} gün streak`;
  const streakTooltip =
    streak === 0
      ? 'Henüz streak yok. Bugünün tüm görevlerini tamamlayarak başla!'
      : todayDone
        ? `🔥 ${streak} günlük streak — bugünün görevleri tamam!`
        : todayTotal > 0
          ? `${streak} günlük streak. Bugün ${todayTotal} görev tamamlanmayı bekliyor.`
          : `${streak} günlük streak.`;

  return (
    <div className="cal-main-header">
      <div className="cal-main-title-group">
        <h2 className="cal-main-title">{title}</h2>
      </div>

      <div className="cal-main-actions">
        <button
          type="button"
          onClick={scrollToPostpone}
          className={`cal-postpone-pill tone-${tone}`}
          title={tooltip}
          aria-label={tooltip}
        >
          <span className="cpp-icon" aria-hidden>
            {tone === 'ok' ? (
              <CheckCircle2 size={15} strokeWidth={2.25} />
            ) : tone === 'danger' ? (
              <AlertTriangle size={15} strokeWidth={2.25} />
            ) : (
              <RotateCcw size={15} strokeWidth={2.25} />
            )}
          </span>
          <span className="cpp-label">{label}</span>
          {chronic > 0 && (
            <span className="cpp-badge" title={`${chronic} kronik görev`}>
              {chronic}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={scrollToPostpone}
          className={`cal-streak-pill tone-${streakTone}`}
          title={streakTooltip}
          aria-label={streakTooltip}
        >
          <span className="csp-icon" aria-hidden>
            {streak === 0 ? (
              <Target size={15} strokeWidth={2.25} />
            ) : (
              <Flame size={15} strokeWidth={2.25} />
            )}
          </span>
          <span className="csp-label">{streakLabel}</span>
          {todayDone && streak > 0 && (
            <span className="csp-dot" title="Bugün tamam" aria-hidden />
          )}
        </button>

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
          <span>Etkinlik Ekle</span>
        </button>
      </div>
    </div>
  );
}
