'use client';

import type { PlannerEvent } from '@/types';
import { DAYS_SHORT, DAYS_TR } from '@/lib/constants';
import { formatDate, isToday, isPast, getWeekDates } from '@/lib/dateUtils';

interface Props {
  events: PlannerEvent[];
  currentWeekStart: Date;
  onReadd: (id: string) => void;
}

export default function CompletionSection({ events, currentWeekStart, onReadd }: Props) {
  const dates = getWeekDates(currentWeekStart);
  const today = formatDate(new Date());
  const weekDates = dates.map(formatDate);

  const uncompleted = events.filter(
    e => weekDates.includes(e.date) && e.date < today && !e.completed
  );

  return (
    <section className="completion-section" id="completionSection">
      <h2>📊 Haftalık Tamamlanma</h2>
      <div className="chart-container" id="chartContainer">
        {dates.map((d, i) => {
          const dateStr = formatDate(d);
          const dayEvents = events.filter(e => e.date === dateStr);
          const total = dayEvents.length;
          const completed = dayEvents.filter(e => e.completed).length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const barH = total > 0 ? Math.max((pct / 100) * 160, 6) : 6;
          const pastCls = isPast(d) && !isToday(d) ? ' past-bar' : '';
          const emptyCls = total === 0 ? ' empty' : '';
          const todayCls = isToday(d) ? ' today-label' : '';

          return (
            <div key={i} className="chart-bar-wrap">
              <span className="chart-percent">{total > 0 ? `${pct}%` : '-'}</span>
              <div className={`chart-bar${pastCls}${emptyCls}`} style={{ height: barH }} />
              <span className={`chart-day-name${todayCls}`}>{DAYS_SHORT[i]}</span>
            </div>
          );
        })}
      </div>

      <div className="uncompleted-section" id="uncompletedSection">
        <h3>⚠️ Tamamlanmayan Görevler</h3>
        <div id="uncompletedList">
          {uncompleted.length === 0 ? (
            <div className="no-uncompleted">🎉 Tüm geçmiş görevler tamamlandı!</div>
          ) : (
            uncompleted.map(ev => {
              const dateObj = new Date(ev.date);
              const dayName = DAYS_TR[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1];
              return (
                <div key={ev.id} className="uncompleted-item">
                  <div className="uncompleted-info">
                    <div className="name">{ev.name}</div>
                    <div className="detail">{dayName} • {ev.startTime} - {ev.endTime}</div>
                  </div>
                  <button className="readd-btn" onClick={() => onReadd(ev.id)}>Tekrar Ekle</button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
