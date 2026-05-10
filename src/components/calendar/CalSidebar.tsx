'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Check } from 'lucide-react';
import type { PlannerEvent, EventCategory } from '@/types';
import type { WeeklyHabit, WeeklyTodo } from '@/types';
import { MONTHS_TR } from '@/lib/constants';
import { formatDate, isToday, getWeekDates } from '@/lib/dateUtils';

interface Props {
  currentWeekStart: Date;
  events: PlannerEvent[];
  onAddEvent: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectDate: (date: Date) => void;
  hiddenCategories: EventCategory[];
  onToggleCategory: (cat: EventCategory) => void;
}

const DAY_HEADERS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];
const DAY_LETTERS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
const PASTEL_COLORS = ['#f87171','#fb923c','#fbbf24','#4ade80','#60a5fa','#c084fc','#f472b6'];

const HABITS_KEY = 'hackplanner_weekly_habits';
const TODOS_KEY = 'hackplanner_weekly_todos';

function loadHabits(): WeeklyHabit[] {
  if (typeof window === 'undefined') return [];
  try { const r = localStorage.getItem(HABITS_KEY); if (r) return JSON.parse(r); } catch {}
  return [];
}
function saveHabits(h: WeeklyHabit[]) { if (typeof window !== 'undefined') localStorage.setItem(HABITS_KEY, JSON.stringify(h)); }
function loadTodos(): WeeklyTodo[] {
  if (typeof window === 'undefined') return [];
  try { const r = localStorage.getItem(TODOS_KEY); if (r) return JSON.parse(r); } catch {}
  return [];
}
function saveTodos(t: WeeklyTodo[]) { if (typeof window !== 'undefined') localStorage.setItem(TODOS_KEY, JSON.stringify(t)); }

/** Bir gün için rutin durumunu hesapla: 'completed' | 'missed' | 'postponed' | null */
function getDayRoutineStatus(
  dateStr: string,
  habits: WeeklyHabit[],
  events: PlannerEvent[],
  isPastDay: boolean,
): 'completed' | 'missed' | 'postponed' | null {
  if (habits.length === 0) return null;

  const totalHabits = habits.length;
  const completedCount = habits.filter(h => h.completedDays[dateStr]).length;

  // O gün ertelenen bir event var mı?
  const hasPostponed = events.some(e => e.date === dateStr && (e.postponeCount || 0) > 0);

  if (completedCount === totalHabits) return 'completed';
  if (hasPostponed && completedCount < totalHabits) return 'postponed';
  if (isPastDay && completedCount < totalHabits) return 'missed';
  return null;
}

export default function CalSidebar({ 
  currentWeekStart, 
  events, 
  onAddEvent, 
  onPrev, 
  onNext, 
  onSelectDate,
  hiddenCategories,
  onToggleCategory
}: Props) {
  const [habits, setHabits] = useState<WeeklyHabit[]>([]);
  const [todos, setTodos] = useState<WeeklyTodo[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setHabits(loadHabits()); setTodos(loadTodos()); setMounted(true); }, []);

  const weekDates = getWeekDates(currentWeekStart);
  const weekDateStrs = weekDates.map(d => formatDate(d));

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

  const now = new Date();
  const todayStr = formatDate(now);

  const currentDays = useMemo(() => {
    const days: { day: number; date: Date; dStr: string; todayFlag: boolean; inWeek: boolean; hasEv: boolean; routineStatus: 'completed' | 'missed' | 'postponed' | null }[] = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const d = new Date(year, month, day);
      const dStr = formatDate(d);
      const todayFlag = isToday(d);
      const isPast = dStr < todayStr && !todayFlag;
      days.push({
        day,
        date: d,
        dStr,
        todayFlag,
        inWeek: weekDateStrs.includes(dStr),
        hasEv: events.some(e => e.date === dStr),
        routineStatus: mounted ? getDayRoutineStatus(dStr, habits, events, isPast) : null,
      });
    }
    return days;
  }, [year, month, lastDay, weekDateStrs, events, habits, mounted, todayStr]);

  const filled = startOffset + lastDay.getDate();
  const remaining = filled % 7 === 0 ? 0 : 7 - (filled % 7);
  const nextDays = Array.from({ length: remaining }, (_, i) => i + 1);

  // --- Habits ---
  const addHabit = useCallback(() => {
    if (!newHabit.trim()) return;
    const updated = [...habits, { id: 'h_' + Date.now(), name: newHabit.trim(), completedDays: {} }];
    setHabits(updated); saveHabits(updated); setNewHabit('');
  }, [habits, newHabit]);

  const removeHabit = useCallback((id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated); saveHabits(updated);
  }, [habits]);

  const toggleHabitDay = useCallback((habitId: string, dateStr: string) => {
    const updated = habits.map(h => {
      if (h.id !== habitId) return h;
      const cd = { ...h.completedDays }; cd[dateStr] = !cd[dateStr];
      return { ...h, completedDays: cd };
    });
    setHabits(updated); saveHabits(updated);
  }, [habits]);

  // --- Todos ---
  const addTodo = useCallback(() => {
    if (!newTodo.trim()) return;
    const updated = [...todos, { id: 't_' + Date.now(), text: newTodo.trim(), completed: false }];
    setTodos(updated); saveTodos(updated); setNewTodo('');
  }, [todos, newTodo]);

  const removeTodo = useCallback((id: string) => {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated); saveTodos(updated);
  }, [todos]);

  const toggleTodo = useCallback((id: string) => {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTodos(updated); saveTodos(updated);
  }, [todos]);

  // Progress
  const completedTodos = todos.filter(t => t.completed).length;
  const todoPercent = todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;

  return (
    <aside className="cal-sidebar">
      {/* Mini Calendar */}
      <div className="mini-cal-nav">
        <span className="mini-cal-month">{MONTHS_TR[month]} {year}</span>
        <div className="mini-cal-nav-actions">
          <button onClick={onPrev} className="mini-cal-nav-btn" aria-label="Önceki"><ChevronLeft size={16} /></button>
          <button onClick={onNext} className="mini-cal-nav-btn" aria-label="Sonraki"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="mini-cal-grid">
        {DAY_HEADERS.map(h => (<div key={h} className="mini-cal-day-header">{h}</div>))}
        {prevMonthDays.map((d, i) => (<div key={`prev-${i}`} className="mini-cal-day other-month">{d}</div>))}
        {currentDays.map(({ day, date, dStr, todayFlag, inWeek, hasEv, routineStatus }) => {
          let cls = 'mini-cal-day';
          if (todayFlag) cls += ' today';
          else if (inWeek) cls += ' current-week';
          if (hasEv) cls += ' has-event';
          // Rutin durumuna göre çerçeve rengi
          if (routineStatus === 'completed') cls += ' routine-done';
          else if (routineStatus === 'missed') cls += ' routine-missed';
          else if (routineStatus === 'postponed') cls += ' routine-postponed';
          return (<button key={dStr} type="button" className={cls} onClick={() => onSelectDate(date)}>{day}</button>);
        })}
        {nextDays.map((d, i) => (<div key={`next-${i}`} className="mini-cal-day other-month">{d}</div>))}
      </div>

      <div className="cal-sidebar-sep" />

      {/* Haftalık Rutinler */}
      {mounted && (
        <div className="cs-habits-section">
          <div className="cs-section-title">Haftalık Rutinler</div>

          {habits.length > 0 && (
            <div className="cs-habits-table">
              {/* Day header row */}
              <div className="cs-habits-header-row">
                <span className="cs-habits-name-col" />
                {DAY_LETTERS.map((l, i) => (
                  <span key={i} className="cs-habits-day-hdr" style={{ color: PASTEL_COLORS[i] }}>{l}</span>
                ))}
              </div>
              {/* Habit rows */}
              {habits.map(habit => (
                <div key={habit.id} className="cs-habit-row">
                  <span className="cs-habit-name" title={habit.name}>
                    {habit.name}
                    <button className="cs-habit-del" onClick={() => removeHabit(habit.id)} title="Kaldır"><X size={10} /></button>
                  </span>
                  {weekDateStrs.map((ds, i) => {
                    const ok = !!habit.completedDays[ds];
                    return (
                      <button
                        key={ds}
                        className={`cs-habit-chk${ok ? ' on' : ''}`}
                        style={ok ? { background: PASTEL_COLORS[i] + '22', borderColor: PASTEL_COLORS[i] } : {}}
                        onClick={() => toggleHabitDay(habit.id, ds)}
                      >
                        {ok && <Check size={12} style={{ color: PASTEL_COLORS[i] }} />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          <div className="cs-add-row">
            <input
              className="cs-add-input"
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHabit()}
              placeholder="+ Rutin ekle"
            />
            <button className="cs-add-btn" onClick={addHabit} disabled={!newHabit.trim()}><Plus size={14} /></button>
          </div>
        </div>
      )}

      <div className="cal-sidebar-sep" />

      {/* Weekly To-Do List */}
      {mounted && (
        <div className="cs-todo-section">
          <div className="cs-section-title">Yapılacaklar</div>

          {todos.length > 0 && (
            <>
              <div className="cs-todo-list">
                {todos.map(todo => (
                  <div key={todo.id} className={`cs-todo-item${todo.completed ? ' done' : ''}`}>
                    <button className={`cs-todo-chk${todo.completed ? ' on' : ''}`} onClick={() => toggleTodo(todo.id)}>
                      {todo.completed && <Check size={12} />}
                    </button>
                    <span className="cs-todo-text">{todo.text}</span>
                    <button className="cs-todo-del" onClick={() => removeTodo(todo.id)}><X size={10} /></button>
                  </div>
                ))}
              </div>
              {/* Progress bar */}
              <div className="cs-todo-progress">
                <div className="cs-todo-bar">
                  <div className="cs-todo-fill" style={{ width: `${todoPercent}%` }} />
                </div>
                <span className="cs-todo-pct">{todoPercent}%</span>
              </div>
            </>
          )}

          <div className="cs-add-row">
            <input
              className="cs-add-input"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTodo()}
              placeholder="+ Görev ekle"
            />
            <button className="cs-add-btn" onClick={addTodo} disabled={!newTodo.trim()}><Plus size={14} /></button>
          </div>
        </div>
      )}

      <div className="cal-sidebar-sep" />

      {/* Kategoriler */}
      <div className="cs-todo-section" id="categoriesFilter" style={{ paddingBottom: 20 }}>
        <div className="cs-section-title">Kategoriler</div>
        <div className="cs-todo-list">
          {(['personal', 'work', 'study', 'health', 'other'] as EventCategory[]).map(cat => {
            const isHidden = hiddenCategories.includes(cat);
            const label = {
              personal: 'Kişisel',
              work: 'İş',
              study: 'Ders',
              health: 'Sağlık',
              other: 'Diğer'
            }[cat];
            const color = {
              personal: '#60a5fa',
              work: '#f87171',
              study: '#fbbf24',
              health: '#4ade80',
              other: '#94a3b8'
            }[cat];

            return (
              <div key={cat} className="cs-todo-item" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 8 }}>
                <button 
                  className={`cs-todo-chk${!isHidden ? ' on' : ''}`} 
                  onClick={() => onToggleCategory(cat)}
                  style={!isHidden ? { background: color, borderColor: color } : {}}
                >
                  {!isHidden && <Check size={12} />}
                </button>
                <span className="cs-todo-text" style={{ fontSize: '0.85rem' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
