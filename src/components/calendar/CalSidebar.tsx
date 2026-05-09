'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import type { PlannerEvent } from '@/types';
import { MONTHS_TR } from '@/lib/constants';
import { formatDate, isToday, getWeekDates } from '@/lib/dateUtils';

interface Props {
  currentWeekStart: Date;
  events: PlannerEvent[];
  onAddEvent: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectDate: (date: Date) => void;
}

const DAY_HEADERS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];

interface CalendarItem {
  id: string;
  icon: string;
  name: string;
  defaultChecked: boolean;
}

const MY_CALENDARS: CalendarItem[] = [
  { id: 'me', icon: '👤', name: 'Kişisel', defaultChecked: true },
  { id: 'task', icon: '🎯', name: 'Görevler', defaultChecked: true },
  { id: 'work', icon: '💼', name: 'İş', defaultChecked: true },
  { id: 'birthday', icon: '🎉', name: 'Doğum Günleri', defaultChecked: true },
  { id: 'reminder', icon: '🔔', name: 'Hatırlatıcılar', defaultChecked: false },
  { id: 'study', icon: '📚', name: 'Okul', defaultChecked: false },
];

const CATEGORIES = [
  { id: 'high', name: 'Yüksek Öncelik', color: '#ef4444' },
  { id: 'med', name: 'Orta Öncelik', color: '#f59e0b' },
  { id: 'low', name: 'Düşük Öncelik', color: '#3b82f6' },
];

export default function CalSidebar({ currentWeekStart, events, onAddEvent, onPrev, onNext, onSelectDate }: Props) {
  const [otherOpen, setOtherOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(true);
  const [catOpen, setCatOpen] = useState(true);
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(MY_CALENDARS.map(c => [c.id, c.defaultChecked]))
  );

  const weekDateStrs = getWeekDates(currentWeekStart).map(d => formatDate(d));

  const base = new Date(currentWeekStart);
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const prevMonthDays: number[] = [];
  for (let i = 0; i < startOffset; i++) {
    const d = new Date(year, month, -startOffset + i + 1);
    prevMonthDays.push(d.getDate());
  }

  const currentDays: { day: number; date: Date; dStr: string; todayFlag: boolean; inWeek: boolean; hasEv: boolean }[] = [];
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const d = new Date(year, month, day);
    const dStr = formatDate(d);
    currentDays.push({
      day,
      date: d,
      dStr,
      todayFlag: isToday(d),
      inWeek: weekDateStrs.includes(dStr),
      hasEv: events.some(e => e.date === dStr),
    });
  }

  const filled = startOffset + lastDay.getDate();
  const remaining = filled % 7 === 0 ? 0 : 7 - (filled % 7);
  const nextDays = Array.from({ length: remaining }, (_, i) => i + 1);

  const toggle = (id: string) => setChecked(c => ({ ...c, [id]: !c[id] }));

  return (
    <aside className="cal-sidebar">
      {/* Mini Calendar */}
      <div className="mini-cal-nav">
        <span className="mini-cal-month">{MONTHS_TR[month]} {year}</span>
        <div className="mini-cal-nav-actions">
          <button
            onClick={onPrev}
            className="mini-cal-nav-btn"
            aria-label="Önceki"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNext}
            className="mini-cal-nav-btn"
            aria-label="Sonraki"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="mini-cal-grid">
        {DAY_HEADERS.map(h => (
          <div key={h} className="mini-cal-day-header">{h}</div>
        ))}
        {prevMonthDays.map((d, i) => (
          <div key={`prev-${i}`} className="mini-cal-day other-month">{d}</div>
        ))}
        {currentDays.map(({ day, date, dStr, todayFlag, inWeek, hasEv }) => {
          const cls =
            'mini-cal-day' +
            (todayFlag ? ' today' : '') +
            (inWeek && !todayFlag ? ' current-week' : '') +
            (hasEv ? ' has-event' : '');
          return (
            <button key={dStr} type="button" className={cls} onClick={() => onSelectDate(date)}>
              {day}
            </button>
          );
        })}
        {nextDays.map((d, i) => (
          <div key={`next-${i}`} className="mini-cal-day other-month">{d}</div>
        ))}
      </div>

      {/* Scheduled */}
      <div className="cal-sidebar-section">
        <div className="cal-sidebar-section-header">
          <span className="cal-sidebar-section-title">Planlanan</span>
        <button
          onClick={onAddEvent}
          title="Etkinlik ekle"
          className="cal-sidebar-add-btn"
        >
          <Plus size={14} />
        </button>
        </div>
      </div>

      {/* My Calendars */}
      <Section title="Takvimlerim" open={calOpen} onToggle={() => setCalOpen(o => !o)}>
        {MY_CALENDARS.map(c => (
          <label key={c.id} className="cal-list-item">
            <input
              type="checkbox"
              checked={!!checked[c.id]}
              onChange={() => toggle(c.id)}
              className="cal-list-checkbox"
            />
            <span className="cal-list-icon">{c.icon}</span>
            <span className="cal-list-name">{c.name}</span>
          </label>
        ))}
        <button className="cal-list-add">
          + Yeni Ekle
        </button>
      </Section>

      {/* Other Calendars */}
      <Section title="Diğer Takvimler" open={otherOpen} onToggle={() => setOtherOpen(o => !o)}>
        <p className="cal-sidebar-empty">Şimdilik boş</p>
      </Section>

      {/* Categories */}
      <Section title="Kategoriler" open={catOpen} onToggle={() => setCatOpen(o => !o)}>
        {CATEGORIES.map(c => (
          <div key={c.id} className="cal-list-item static">
            <span className="cal-cat-dot" style={{ background: c.color }} />
            <span className="cal-list-name">{c.name}</span>
          </div>
        ))}
      </Section>
    </aside>
  );
}

function Section({
  title, open, onToggle, children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="cal-sidebar-section">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="cal-sidebar-section-header"
      >
        <span className="cal-sidebar-section-title">{title}</span>
        <ChevronDownIcon className={`cal-sidebar-chevron${open ? ' open' : ''}`} />
      </button>
      {open && <div className="cal-sidebar-list">{children}</div>}
    </div>
  );
}
