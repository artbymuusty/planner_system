'use client';

import type { PlannerEvent } from '@/types';
import { DAYS_SHORT } from '@/lib/constants';
import { formatDate, getWeekDates } from '@/lib/dateUtils';

interface Props {
  events: PlannerEvent[];
  currentWeekStart: Date;
  onEventClick: (id: string) => void;
}

export default function BottomPanels({ events, currentWeekStart, onEventClick }: Props) {
  const today = formatDate(new Date());
  const weekDates = getWeekDates(currentWeekStart).map(formatDate);

  const upcoming = events
    .filter(e => weekDates.includes(e.date) && e.date >= today && !e.completed)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 8);

  return (
    <section className="bottom-panels">
      <div className="panel left-panel" id="leftPanel">
        <h3>AI Asistan</h3>
        <p className="placeholder-text">Bu alan yakında aktif olacak...</p>
      </div>
      <div className="panel right-panel" id="rightPanel">
        <h3>Yaklaşanlar</h3>
        <div id="upcomingList">
          {upcoming.length === 0 ? (
            <div className="upcoming-empty">Yaklaşan etkinlik yok</div>
          ) : (
            upcoming.map(ev => {
              const dotCls = ev.importance === 'high' ? 'high' : ev.importance === 'medium' ? 'med' : 'low';
              const dateObj = new Date(ev.date);
              const dayName = DAYS_SHORT[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1];
              return (
                <div key={ev.id} className="upcoming-item" onClick={() => onEventClick(ev.id)}>
                  <div className={`upcoming-dot ${dotCls}`} />
                  <div className="upcoming-info">
                    <div className="name">{ev.name}</div>
                    <div className="time">{dayName} • {ev.startTime} - {ev.endTime}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
