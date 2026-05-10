'use client';

import type { PlannerEvent } from '@/types';
import type { CalendarView } from '@/components/TopBar';
import { DAYS_SHORT, EVENT_CATEGORY_COLORS, EVENT_CATEGORY_ICONS } from '@/lib/constants';
import { START_HOUR, END_HOUR, HOUR_HEIGHT } from '@/lib/constants';
import { isToday, isPast, formatDate, getWeekDates } from '@/lib/dateUtils';

interface Props {
  view: CalendarView;
  anchorDate: Date;
  events: PlannerEvent[];
  deleteMode: boolean;
  onEventClick: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  /** Hover'daki ✓ butonu — toggleComplete'i çağırır. */
  onComplete?: (id: string) => void;
  /** Hover'daki 🔄 butonu — postpone modal'ı açar. */
  onPostpone?: (id: string) => void;
  /** Hover'daki ✂️ butonu — split modal'ı açar. */
  onSplit?: (id: string) => void;
  /** Boş slot tıklaması — pre-filled add modal aç. */
  onSlotClick?: (dateStr: string, hour: number, minute: number) => void;
  getBirthdayBanners?: (dateStr: string) => { name: string }[];
  onEventDrop?: (id: string, newDate: string, newStartH: number, newStartM: number) => void;
}

/**
 * Calendar render filtresi:
 *  - 'goal' türündekiler grid'de hiç gözükmez (Aşama 6'da sidebar'da)
 *  - 'birthday' modülü banner olarak ayrı handle edilir
 */
function isCalendarRenderable(e: PlannerEvent): boolean {
  if (e.kind === 'goal') return false;
  if (e.moduleType === 'birthday') return false;
  return true;
}

/** All-day mi? Saat alanı yokmuş gibi davranır. */
function isAllDay(e: PlannerEvent): boolean {
  return Boolean(e.allDay);
}

export default function CalendarSection(props: Props) {
  if (props.view === 'day') return <DayView {...props} />;
  if (props.view === 'month') return <MonthView {...props} />;
  return <WeekView {...props} />;
}

// ======================================================================
// WEEK VIEW
// ======================================================================
function WeekView({
  anchorDate,
  events,
  deleteMode,
  onEventClick,
  onDeleteEvent,
  onComplete,
  onPostpone,
  onSplit,
  onSlotClick,
  getBirthdayBanners,
  onEventDrop,
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
          const dayAll = events.filter(e => e.date === dateStr && isCalendarRenderable(e));
          const allDayItems = dayAll.filter(isAllDay);
          const timedItems = dayAll.filter(e => !isAllDay(e));

          return (
            <div
              key={dateStr}
              className={`day-column${today ? ' today-col' : ''}${past ? ' past-col' : ''}`}
              data-date={dateStr}
            >
              <div
                className="day-column-header-area"
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const eventId = e.dataTransfer.getData('text/plain');
                  if (eventId && onEventDrop) {
                    onEventDrop(eventId, dateStr, 9, 0); // Varsayılan başlangıç saati
                  }
                }}
              >
                <AllDayShelf
                  bdays={bdays}
                  tasks={allDayItems}
                  onEventClick={onEventClick}
                  onComplete={onComplete}
                  onPostpone={onPostpone}
                  onSplit={onSplit}
                  deleteMode={deleteMode}
                  onDelete={onDeleteEvent}
                />
              </div>

              <div
                className="time-grid"
                style={{ minHeight: (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const eventId = e.dataTransfer.getData('text/plain');
                  if (!eventId || !onEventDrop) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const offsetY = e.clientY - rect.top;
                  
                  // offsetY to hour & minute
                  const totalHours = offsetY / HOUR_HEIGHT;
                  const targetStartHourFloat = START_HOUR + totalHours;
                  
                  let newStartH = Math.floor(targetStartHourFloat);
                  let newStartM = (targetStartHourFloat % 1) < 0.5 ? 0 : 30;

                  onEventDrop(eventId, dateStr, newStartH, newStartM);
                }}
              >
                <SlotGrid
                  dateStr={dateStr}
                  onSlotClick={onSlotClick}
                  disabled={deleteMode}
                />

                {timedItems.map(ev => (
                  <EventCard
                    key={ev.id}
                    ev={ev}
                    deleteMode={deleteMode}
                    onClick={() => onEventClick(ev.id)}
                    onDelete={() => onDeleteEvent(ev.id)}
                    onComplete={onComplete ? () => onComplete(ev.id) : undefined}
                    onPostpone={onPostpone ? () => onPostpone(ev.id) : undefined}
                    onSplit={onSplit ? () => onSplit(ev.id) : undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ======================================================================
// DAY VIEW
// ======================================================================
function DayView({
  anchorDate,
  events,
  deleteMode,
  onEventClick,
  onDeleteEvent,
  onComplete,
  onPostpone,
  onSplit,
  onSlotClick,
  getBirthdayBanners,
}: Props) {
  const dateStr = formatDate(anchorDate);
  const today = isToday(anchorDate);
  const dayIndex = anchorDate.getDay() === 0 ? 6 : anchorDate.getDay() - 1;
  const dayAll = events.filter(e => e.date === dateStr && isCalendarRenderable(e));
  const allDayItems = dayAll.filter(isAllDay);
  const timedItems = dayAll.filter(e => !isAllDay(e));
  const bdays = getBirthdayBanners ? getBirthdayBanners(dateStr) : [];

  return (
    <section className="calendar-section">
      <div className="calendar-header day-calendar-header">
        <div className="cal-time-header">Saat</div>
        <div className={`cal-day-header${today ? ' today' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 8px', minHeight: 90 }}>
          <span className="day-name" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: today ? '#ef4444' : '#64748b', marginBottom: 2 }}>{DAYS_SHORT[dayIndex]}</span>
          <span className="day-date" style={{ fontSize: '1.6rem', fontWeight: 950, color: '#1e293b', lineHeight: 1 }}>{anchorDate.getDate()}</span>
          
          {dayAll.length > 0 && (
            <div className="day-progress-mini" style={{ width: '100%', maxWidth: 140, marginTop: 10 }}>
              <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
                 <div style={{ width: `${(dayAll.filter(e => e.completed).length / dayAll.length) * 100}%`, background: '#10b981', transition: 'width 0.3s ease' }} />
              </div>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', marginTop: 4 }}>
                 {dayAll.filter(e => e.completed).length}/{dayAll.length}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`calendar-body day-calendar-body${deleteMode ? ' delete-mode' : ''}`}>
        <TimeLabels />

        <div
          className={`day-column${today ? ' today-col' : ''}`}
          data-date={dateStr}
        >
          <AllDayShelf
            bdays={bdays}
            tasks={allDayItems}
            onEventClick={onEventClick}
            onComplete={onComplete}
            onPostpone={onPostpone}
            onSplit={onSplit}
            deleteMode={deleteMode}
            onDelete={onDeleteEvent}
            wide
          />

          <div
            className="time-grid"
            style={{ minHeight: (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT }}
          >
            <SlotGrid
              dateStr={dateStr}
              onSlotClick={onSlotClick}
              disabled={deleteMode}
            />

            {timedItems.length === 0 && allDayItems.length === 0 && bdays.length === 0 ? (
              <div className="calendar-empty-state">Bu gün için planlanmış etkinlik yok.</div>
            ) : (
              timedItems.map(ev => (
                <EventCard
                  key={ev.id}
                  ev={ev}
                  wide
                  deleteMode={deleteMode}
                  onClick={() => onEventClick(ev.id)}
                  onDelete={() => onDeleteEvent(ev.id)}
                  onComplete={onComplete ? () => onComplete(ev.id) : undefined}
                  onPostpone={onPostpone ? () => onPostpone(ev.id) : undefined}
                  onSplit={onSplit ? () => onSplit(ev.id) : undefined}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ======================================================================
// MONTH VIEW
// ======================================================================
function MonthView({
  anchorDate,
  events,
  deleteMode,
  onEventClick,
  onDeleteEvent,
  getBirthdayBanners,
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
          const bdays = getBirthdayBanners ? getBirthdayBanners(dateStr) : [];
          const dayEvents = events.filter(e => e.date === dateStr && isCalendarRenderable(e));
          const visibleBirthdayCount = Math.min(bdays.length, 2);
          const visibleEventCount = Math.max(0, 3 - visibleBirthdayCount);
          const hiddenCount =
            Math.max(0, bdays.length - visibleBirthdayCount) +
            Math.max(0, dayEvents.length - visibleEventCount);

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
                {hiddenCount > 0 && (
                  <span className="month-more-count">+{hiddenCount}</span>
                )}
              </div>
              <div className="month-event-list">
                {bdays.slice(0, visibleBirthdayCount).map((b, bi) => (
                  <div key={`${dateStr}-bday-${bi}`} className="month-birthday-card" title={`Doğum günü: ${b.name}`}>
                    <span>🎂 {b.name}</span>
                  </div>
                ))}
                {dayEvents.slice(0, visibleEventCount).map(ev => {
                  const isTask = ev.kind === 'task';
                  const allDay = isAllDay(ev);
                  return (
                    <button
                      key={ev.id}
                      onClick={e => {
                        e.stopPropagation();
                        if (deleteMode) onDeleteEvent(ev.id);
                        else onEventClick(ev.id);
                      }}
                      className={
                        `month-event-card ${importanceClass(ev)}` +
                        (ev.completed ? ' completed' : '') +
                        (isTask ? ' is-task' : '') +
                        (allDay ? ' is-allday' : '')
                      }
                      style={{
                        borderLeftColor: EVENT_CATEGORY_COLORS[ev.category] ?? '#64748b',
                      }}
                      title={`${allDay ? '' : ev.startTime + ' '}${ev.name}`}
                    >
                      {!allDay && <span className="month-event-time">{ev.startTime}</span>}
                      {allDay && <span className="month-event-time">{isTask ? '✓' : '•'}</span>}
                      <span className="month-event-name">{ev.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ======================================================================
// All-Day Shelf — Saatsiz görevler ve doğum günleri
// ======================================================================
function AllDayShelf({
  bdays,
  tasks,
  onEventClick,
  onComplete,
  onPostpone,
  onSplit,
  deleteMode,
  onDelete,
  wide,
}: {
  bdays: { name: string }[];
  tasks: PlannerEvent[];
  onEventClick: (id: string) => void;
  onComplete?: (id: string) => void;
  onPostpone?: (id: string) => void;
  onSplit?: (id: string) => void;
  deleteMode: boolean;
  onDelete: (id: string) => void;
  wide?: boolean;
}) {
  if (bdays.length === 0 && tasks.length === 0) return null;

  return (
    <div className={`allday-shelf${wide ? ' wide' : ''}`}>
      {bdays.map((b, i) => (
        <div key={`bday-${i}`} className="allday-chip bday">
          🎂 <span className="allday-chip-name">{b.name}</span>
        </div>
      ))}
      {tasks.map(ev => {
        const ppCount = ev.postponeCount || 0;
        const ppClass = ppCount >= 3 ? ' chronic-postpone' : ppCount >= 1 ? ' postponed' : '';
        const completedCls = ev.completed ? ' completed' : '';
        const catColor = EVENT_CATEGORY_COLORS[ev.category] ?? '#64748b';

        return (
          <div
            key={ev.id}
            className={`allday-chip task${completedCls}${ppClass}`}
            style={{ borderLeftColor: catColor }}
            onClick={e => {
              e.stopPropagation();
              if (deleteMode) onDelete(ev.id);
              else onEventClick(ev.id);
            }}
            title={ev.name}
          >
            <span className="allday-chip-icon">{EVENT_CATEGORY_ICONS[ev.category] ?? '✓'}</span>
            <span className="allday-chip-name">{ev.name}</span>
            {ppCount > 0 && (
              <span className="allday-chip-pp" title={`${ppCount} kez ertelendi`}>🔄{ppCount}</span>
            )}
            {!deleteMode && (onComplete || onPostpone || onSplit) && (
              <span className="allday-actions" onClick={e => e.stopPropagation()}>
                {onComplete && (
                  <button
                    className="allday-act done"
                    title="Tamamla"
                    onClick={() => onComplete(ev.id)}
                  >✓</button>
                )}
                {onPostpone && (
                  <button
                    className="allday-act postpone"
                    title="Ertele"
                    onClick={() => onPostpone(ev.id)}
                  >🔄</button>
                )}
                {onSplit && (
                  <button
                    className="allday-act split"
                    title="Parçala"
                    onClick={() => onSplit(ev.id)}
                  >✂️</button>
                )}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ======================================================================
// Slot Grid — Görsel saat çizgileri + tam yükseklik tıklama overlay'i
// ======================================================================
function SlotGrid({
  dateStr,
  onSlotClick,
  disabled,
}: {
  dateStr: string;
  onSlotClick?: (dateStr: string, hour: number, minute: number) => void;
  disabled?: boolean;
}) {
  return (
    <>
      {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => {
        const hour = START_HOUR + i;
        const top = i * HOUR_HEIGHT;
        return (
          <div key={`slot-${i}`}>
            {/* Görsel saat çizgisi (1px) */}
            <div className="hour-line" style={{ top }} />
            {/* Tıklanabilir görünmez slot — sadece okunabilir mod'da */}
            {!disabled && onSlotClick && (
              <div
                className="hour-slot"
                style={{ top, height: HOUR_HEIGHT }}
                onClick={e => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  const offsetY = e.clientY - rect.top;
                  const minute = offsetY < HOUR_HEIGHT / 2 ? 0 : 30;
                  onSlotClick(dateStr, hour, minute);
                }}
              />
            )}
          </div>
        );
      })}
    </>
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

// ======================================================================
// EventCard — Saatli event/task için
// ======================================================================
function EventCard({
  ev,
  deleteMode,
  onClick,
  onDelete,
  onComplete,
  onPostpone,
  onSplit,
  wide,
}: {
  ev: PlannerEvent;
  deleteMode: boolean;
  onClick: () => void;
  onDelete: () => void;
  onComplete?: () => void;
  onPostpone?: () => void;
  onSplit?: () => void;
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
  const kindClass = ev.kind === 'task' ? ' kind-task' : ' kind-event';
  const catColor = EVENT_CATEGORY_COLORS[ev.category] ?? '#64748b';

  const past = isPast(new Date(ev.date + 'T23:59:59')) && !isToday(new Date(ev.date));
  const isUndonePast = past && !ev.completed;
  
  return (
    <div
      className={`event-card ${importanceClass(ev)}${completedCls}${ppClass}${kindClass}${wide ? ' wide' : ''}${isUndonePast ? ' past-undone' : ''}${past && !isUndonePast ? ' past-done' : ''}`}
      style={{ top, height, borderLeftColor: catColor }}
      data-id={ev.id}
      draggable={!deleteMode}
      onDragStart={e => {
        if (!deleteMode) {
          e.dataTransfer.setData('text/plain', ev.id);
          e.dataTransfer.effectAllowed = 'move';
        }
      }}
      onClick={e => { e.stopPropagation(); onClick(); }}
    >
      {ppCount > 0 && (
        <div className="postpone-badge" title={`${ppCount} kez ertelendi`}>
          🔄{ppCount}
        </div>
      )}
      <span className="event-name">
        {ev.kind === 'task' && <span className="kind-marker" title="Görev">✓</span>}
        {ev.name}
      </span>
      <span className="event-time">{ev.startTime} - {ev.endTime}</span>

      {/* Hover aksiyon menüsü — delete mode'da gizlenir */}
      {!deleteMode && (onComplete || onPostpone || onSplit) && (
        <div className="card-actions" onClick={e => e.stopPropagation()}>
          {onComplete && !ev.completed && (
            <button className="card-act done" title="Tamamla" onClick={onComplete}>✓</button>
          )}
          {onComplete && ev.completed && (
            <button className="card-act done active" title="Geri al" onClick={onComplete}>↺</button>
          )}
          {onPostpone && (
            <button className="card-act postpone" title="Ertele" onClick={onPostpone}>🔄</button>
          )}
          {onSplit && (
            <button className="card-act split" title="Parçala" onClick={onSplit}>✂️</button>
          )}
        </div>
      )}

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
