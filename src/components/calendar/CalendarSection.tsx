'use client';

import type { PlannerEvent } from '@/types';
import type { CalendarView } from '@/components/TopBar';
import { DAYS_SHORT } from '@/lib/constants';
import { START_HOUR, END_HOUR, HOUR_HEIGHT } from '@/lib/constants';
import { isToday, isPast, formatDate, getWeekDates } from '@/lib/dateUtils';

interface Props {
  view: CalendarView;
  anchorDate: Date;
  events: PlannerEvent[];
  deleteMode: boolean;
  onEventClick: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  getBirthdayBanners?: (dateStr: string) => { name: string }[];
}

export default function CalendarSection(props: Props) {
  if (props.view === 'day') return <DayView {...props} />;
  if (props.view === 'month') return <MonthView {...props} />;
  return <WeekView {...props} />;
}

function WeekView({
  anchorDate,
  events,
  deleteMode,
  onEventClick,
  onDeleteEvent,
  getBirthdayBanners,
}: Props) {
  const dates = getWeekDates(anchorDate);

  return (
    <section className="calendar-section">
      <div className="calendar-header">
        <div className="cal-time-header">Saat</div>
        {dates.map((d, i) => {
          const today = isToday(d);
          const past = isPast(d) && !today;

          return (
            <div
              key={formatDate(d)}
              className={`cal-day-header${today ? ' today' : ''}${past ? ' past' : ''}`}
            >
              <span className="day-name">{DAYS_SHORT[i]}</span>
              <span className="day-date">{d.getDate()}</span>
            </div>
          );
        })}
      </div>

      <div className={`calendar-body${deleteMode ? ' delete-mode' : ''}`}>
        <TimeLabels />

        {dates.map(d => {
          const dateStr = formatDate(d);
          const today = isToday(d);
          const past = isPast(d) && !today;
          const bdays = getBirthdayBanners ? getBirthdayBanners(dateStr) : [];
          const dayEvents = events.filter(e => e.date === dateStr && e.moduleType !== 'birthday');

          return (
            <div
              key={dateStr}
              className={`day-column${today ? ' today-col' : ''}${past ? ' past-col' : ''}`}
              style={{ minHeight: (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT }}
              data-date={dateStr}
            >
              {bdays.map((b, i) => (
                <div key={`${b.name}-${i}`} className="bday-banner">🎂 {b.name}</div>
              ))}
              <HourLines />
              {dayEvents.map(ev => (
                <EventCard
                  key={ev.id}
                  ev={ev}
                  deleteMode={deleteMode}
                  onClick={() => onEventClick(ev.id)}
                  onDelete={() => onDeleteEvent(ev.id)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DayView({
  anchorDate,
  events,
  deleteMode,
  onEventClick,
  onDeleteEvent,
  getBirthdayBanners,
}: Props) {
  const dateStr = formatDate(anchorDate);
  const today = isToday(anchorDate);
  const dayIndex = anchorDate.getDay() === 0 ? 6 : anchorDate.getDay() - 1;
  const dayEvents = events.filter(e => e.date === dateStr && e.moduleType !== 'birthday');
  const bdays = getBirthdayBanners ? getBirthdayBanners(dateStr) : [];

  return (
    <section className="calendar-section">
      <div className="calendar-header day-calendar-header">
        <div className="cal-time-header">Saat</div>
        <div className={`cal-day-header${today ? ' today' : ''}`}>
          <span className="day-name">{DAYS_SHORT[dayIndex]}</span>
          <span className="day-date">{anchorDate.getDate()}</span>
        </div>
      </div>

      <div className={`calendar-body day-calendar-body${deleteMode ? ' delete-mode' : ''}`}>
        <TimeLabels />

        <div
          className={`day-column${today ? ' today-col' : ''}`}
          style={{ minHeight: (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT }}
          data-date={dateStr}
        >
          {bdays.map((b, i) => (
            <div key={`${b.name}-${i}`} className="bday-banner">🎂 {b.name}</div>
          ))}
          <HourLines />
          {dayEvents.length === 0 ? (
            <div className="calendar-empty-state">Bu gün için planlanmış etkinlik yok.</div>
          ) : (
            dayEvents.map(ev => (
              <EventCard
                key={ev.id}
                ev={ev}
                wide
                deleteMode={deleteMode}
                onClick={() => onEventClick(ev.id)}
                onDelete={() => onDeleteEvent(ev.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function MonthView({
  anchorDate,
  events,
  deleteMode,
  onEventClick,
  onDeleteEvent,
}: Props) {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(year, month, i - startOffset + 1);
    cells.push({ date: d, inMonth: d.getMonth() === month });
  }

  return (
    <section className="calendar-section month-calendar-section">
      <div className="month-calendar-header">
        {DAYS_SHORT.map(day => (
          <div key={day} className="month-day-header">{day}</div>
        ))}
      </div>

      <div className={`month-calendar-body${deleteMode ? ' delete-mode' : ''}`}>
        {cells.map(({ date, inMonth }, i) => {
          const dateStr = formatDate(date);
          const today = isToday(date);
          const past = isPast(date) && !today;
          const dayEvents = events.filter(e => e.date === dateStr && e.moduleType !== 'birthday');

          return (
            <div
              key={dateStr}
              className={
                'month-day-cell' +
                (!inMonth ? ' other-month' : '') +
                (today ? ' today' : '') +
                (past && inMonth ? ' past' : '') +
                (i < 7 ? ' first-week' : '')
              }
            >
              <div className="month-day-top">
                <span className="month-day-number">{date.getDate()}</span>
                {dayEvents.length > 3 && (
                  <span className="month-more-count">+{dayEvents.length - 3}</span>
                )}
              </div>
              <div className="month-event-list">
                {dayEvents.slice(0, 3).map(ev => (
                  <button
                    key={ev.id}
                    onClick={e => {
                      e.stopPropagation();
                      if (deleteMode) onDeleteEvent(ev.id);
                      else onEventClick(ev.id);
                    }}
                    className={`month-event-card ${importanceClass(ev)}${ev.completed ? ' completed' : ''}`}
                    title={`${ev.startTime} ${ev.name}`}
                  >
                    <span className="month-event-time">{ev.startTime}</span>
                    <span className="month-event-name">{ev.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TimeLabels() {
  return (
    <div className="time-labels">
      {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => (
        <div key={i} className="time-label">
          {String(START_HOUR + i).padStart(2, '0')}:00
        </div>
      ))}
    </div>
  );
}

function HourLines() {
  return (
    <>
      {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => (
        <div
          key={i}
          className="hour-line"
          style={{ top: i * HOUR_HEIGHT }}
        />
      ))}
    </>
  );
}

function EventCard({
  ev,
  deleteMode,
  onClick,
  onDelete,
  wide,
}: {
  ev: PlannerEvent;
  deleteMode: boolean;
  onClick: () => void;
  onDelete: () => void;
  wide?: boolean;
}) {
  const [sh, sm] = ev.startTime.split(':').map(Number);
  const [eh, em] = ev.endTime.split(':').map(Number);
  const startH = sh + sm / 60;
  const endH = eh + em / 60;
  const top = (startH - START_HOUR) * HOUR_HEIGHT;
  const height = Math.max((endH - startH) * HOUR_HEIGHT, 28);
  const completedCls = ev.completed ? ' completed' : '';
  const ppCount = ev.postponeCount || 0;
  const ppClass = ppCount >= 3 ? ' chronic-postpone' : ppCount >= 1 ? ' postponed' : '';

  return (
    <div
      className={`event-card ${importanceClass(ev)}${completedCls}${ppClass}${wide ? ' wide' : ''}`}
      style={{ top, height }}
      data-id={ev.id}
      onClick={onClick}
    >
      {ppCount > 0 && (
        <div className="postpone-badge" title={`${ppCount} kez ertelendi`}>
          🔄{ppCount}
        </div>
      )}
      <span className="event-name">{ev.name}</span>
      <span className="event-time">{ev.startTime} - {ev.endTime}</span>
      {deleteMode && (
        <div
          className="delete-badge"
          onClick={e => { e.stopPropagation(); onDelete(); }}
        >
          ✕
        </div>
      )}
    </div>
  );
}

function importanceClass(ev: PlannerEvent): string {
  if (ev.importance === 'high') return 'imp-high';
  if (ev.importance === 'medium') return 'imp-med';
  return 'imp-low';
}
