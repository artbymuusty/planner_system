'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Check, MoreVertical, Pencil, Trash2 } from 'lucide-react';
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
const CUSTOM_CATS_KEY = 'hackplanner_custom_cats';
const HIDDEN_CUSTOM_CATS_KEY = 'hackplanner_hidden_custom_cats';
const BUILTIN_LABELS_KEY = 'hackplanner_builtin_cat_labels';
const DELETED_BUILTINS_KEY = 'hackplanner_deleted_builtin_cats';

const BUILTIN_CATS: { key: EventCategory; defaultLabel: string; color: string }[] = [
  { key: 'personal', defaultLabel: 'Kişisel', color: '#60a5fa' },
  { key: 'work',     defaultLabel: 'İş',      color: '#f87171' },
  { key: 'study',    defaultLabel: 'Ders',    color: '#fbbf24' },
  { key: 'health',   defaultLabel: 'Sağlık',  color: '#4ade80' },
  { key: 'other',    defaultLabel: 'Diğer',   color: '#94a3b8' },
];

function loadBuiltinLabels(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try { const r = localStorage.getItem(BUILTIN_LABELS_KEY); if (r) return JSON.parse(r); } catch {}
  return {};
}
function saveBuiltinLabels(m: Record<string, string>) { if (typeof window !== 'undefined') localStorage.setItem(BUILTIN_LABELS_KEY, JSON.stringify(m)); }

function loadDeletedBuiltins(): EventCategory[] {
  if (typeof window === 'undefined') return [];
  try { const r = localStorage.getItem(DELETED_BUILTINS_KEY); if (r) return JSON.parse(r); } catch {}
  return [];
}
function saveDeletedBuiltins(arr: EventCategory[]) { if (typeof window !== 'undefined') localStorage.setItem(DELETED_BUILTINS_KEY, JSON.stringify(arr)); }

const CUSTOM_CAT_PALETTE = ['#a78bfa', '#ec4899', '#06b6d4', '#10b981', '#f97316', '#8b5cf6', '#0ea5e9'];

interface CustomCategory {
  id: string;
  name: string;
  color: string;
}

function loadCustomCats(): CustomCategory[] {
  if (typeof window === 'undefined') return [];
  try { const r = localStorage.getItem(CUSTOM_CATS_KEY); if (r) return JSON.parse(r); } catch {}
  return [];
}
function saveCustomCats(c: CustomCategory[]) { if (typeof window !== 'undefined') localStorage.setItem(CUSTOM_CATS_KEY, JSON.stringify(c)); }
function loadHiddenCustomCats(): string[] {
  if (typeof window === 'undefined') return [];
  try { const r = localStorage.getItem(HIDDEN_CUSTOM_CATS_KEY); if (r) return JSON.parse(r); } catch {}
  return [];
}
function saveHiddenCustomCats(ids: string[]) { if (typeof window !== 'undefined') localStorage.setItem(HIDDEN_CUSTOM_CATS_KEY, JSON.stringify(ids)); }

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
  onToggleCategory,
}: Props) {
  const [habits, setHabits] = useState<WeeklyHabit[]>([]);
  const [todos, setTodos] = useState<WeeklyTodo[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [mounted, setMounted] = useState(false);

  // Custom kategoriler
  const [customCats, setCustomCats] = useState<CustomCategory[]>([]);
  const [hiddenCustomIds, setHiddenCustomIds] = useState<string[]>([]);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(CUSTOM_CAT_PALETTE[0]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  // Built-in kategori override'ları
  const [builtinLabels, setBuiltinLabels] = useState<Record<string, string>>({});
  const [deletedBuiltins, setDeletedBuiltins] = useState<EventCategory[]>([]);

  // Menüyü dışarı tıklayınca kapat
  useEffect(() => {
    if (!openMenuId) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuContainerRef.current && !menuContainerRef.current.contains(target)) {
        // Menü container'ı yok / tıklama dışarıda — kapat
        setOpenMenuId(null);
      }
    };
    // Bir tick sonra ekle (mevcut click event'i kapatmaması için)
    const t = setTimeout(() => document.addEventListener('mousedown', onDocClick), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onDocClick);
    };
  }, [openMenuId]);

  useEffect(() => {
    setHabits(loadHabits());
    setTodos(loadTodos());
    setCustomCats(loadCustomCats());
    setHiddenCustomIds(loadHiddenCustomCats());
    setBuiltinLabels(loadBuiltinLabels());
    setDeletedBuiltins(loadDeletedBuiltins());
    setMounted(true);
  }, []);

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

  // --- Custom Kategoriler ---
  const addCustomCat = useCallback(() => {
    const name = newCatName.trim();
    if (!name) return;
    const updated = [...customCats, { id: 'cat_' + Date.now(), name, color: newCatColor }];
    setCustomCats(updated);
    saveCustomCats(updated);
    setNewCatName('');
    setNewCatColor(CUSTOM_CAT_PALETTE[0]);
    setShowAddCat(false);
  }, [customCats, newCatName, newCatColor]);

  const removeCustomCat = useCallback((id: string) => {
    const updated = customCats.filter(c => c.id !== id);
    setCustomCats(updated);
    saveCustomCats(updated);
    setHiddenCustomIds(prev => {
      const next = prev.filter(x => x !== id);
      saveHiddenCustomCats(next);
      return next;
    });
    setOpenMenuId(null);
    if (editingId === id) setEditingId(null);
  }, [customCats, editingId]);

  const startRenameCat = useCallback((id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
    setOpenMenuId(null);
  }, []);

  const commitRenameCat = useCallback(() => {
    if (!editingId) return;
    const name = editingName.trim();
    if (!name) {
      setEditingId(null);
      return;
    }
    if (editingId.startsWith('builtin:')) {
      const key = editingId.slice('builtin:'.length) as EventCategory;
      const next = { ...builtinLabels, [key]: name };
      setBuiltinLabels(next);
      saveBuiltinLabels(next);
    } else {
      const updated = customCats.map(c => c.id === editingId ? { ...c, name } : c);
      setCustomCats(updated);
      saveCustomCats(updated);
    }
    setEditingId(null);
    setEditingName('');
  }, [customCats, editingId, editingName, builtinLabels]);

  const cancelRenameCat = useCallback(() => {
    setEditingId(null);
    setEditingName('');
  }, []);

  // Built-in kategoriyi sil (sadece sidebar listesinden gizler — event verisi etkilenmez)
  const deleteBuiltin = useCallback((key: EventCategory) => {
    setDeletedBuiltins(prev => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      saveDeletedBuiltins(next);
      return next;
    });
    setOpenMenuId(null);
    if (editingId === 'builtin:' + key) setEditingId(null);
  }, [editingId]);

  const toggleCustomCat = useCallback((id: string) => {
    setHiddenCustomIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      saveHiddenCustomCats(next);
      return next;
    });
  }, []);

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
        <div className="cs-cat-header">
          <span className="cs-section-title" style={{ marginBottom: 0 }}>Kategoriler</span>
          <button
            type="button"
            className="cs-cat-add-btn"
            onClick={() => setShowAddCat(s => !s)}
            title={showAddCat ? 'Kapat' : 'Yeni kategori ekle'}
            aria-label="Yeni kategori ekle"
          >
            {showAddCat ? <X size={14} /> : <Plus size={14} />}
          </button>
        </div>

        {showAddCat && (
          <div className="cs-cat-add-form">
            <div className="cs-add-row">
              <input
                className="cs-add-input"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomCat()}
                placeholder="Kategori adı"
                autoFocus
              />
              <button className="cs-add-btn" onClick={addCustomCat} disabled={!newCatName.trim()} title="Ekle">
                <Check size={14} />
              </button>
            </div>
            <div className="cs-cat-color-picker">
              {CUSTOM_CAT_PALETTE.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCatColor(c)}
                  className={`cs-cat-color-dot${newCatColor === c ? ' active' : ''}`}
                  style={{ background: c }}
                  aria-label={`Renk: ${c}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="cs-todo-list">
          {/* Built-in + custom kategoriler — unified render, hepsinde 3-nokta menüsü */}
          {[
            ...BUILTIN_CATS
              .filter(b => !deletedBuiltins.includes(b.key))
              .map(b => ({
                id: 'builtin:' + b.key,
                isBuiltin: true as const,
                builtinKey: b.key,
                label: builtinLabels[b.key] || b.defaultLabel,
                color: b.color,
                isHidden: hiddenCategories.includes(b.key),
              })),
            ...(mounted ? customCats.map(c => ({
              id: c.id,
              isBuiltin: false as const,
              builtinKey: undefined,
              label: c.name,
              color: c.color,
              isHidden: hiddenCustomIds.includes(c.id),
            })) : []),
          ].map(item => {
            const isEditing = editingId === item.id;
            const isMenuOpen = openMenuId === item.id;
            return (
              <div
                key={item.id}
                className="cs-todo-item cs-cat-row"
                style={{ borderLeft: `3px solid ${item.color}`, paddingLeft: 8 }}
              >
                <button
                  className={`cs-todo-chk${!item.isHidden ? ' on' : ''}`}
                  onClick={() => {
                    if (item.isBuiltin && item.builtinKey) onToggleCategory(item.builtinKey);
                    else toggleCustomCat(item.id);
                  }}
                  style={!item.isHidden ? { background: item.color, borderColor: item.color } : {}}
                  disabled={isEditing}
                >
                  {!item.isHidden && <Check size={12} />}
                </button>

                {isEditing ? (
                  <input
                    className="cs-cat-rename-input"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitRenameCat();
                      else if (e.key === 'Escape') cancelRenameCat();
                    }}
                    onBlur={commitRenameCat}
                    autoFocus
                  />
                ) : (
                  <span className="cs-todo-text" style={{ fontSize: '0.85rem' }}>{item.label}</span>
                )}

                {!isEditing && (
                  <div
                    className="cs-cat-menu-wrap"
                    ref={isMenuOpen ? menuContainerRef : undefined}
                  >
                    <button
                      className="cs-cat-menu-btn"
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(isMenuOpen ? null : item.id); }}
                      title="Seçenekler"
                      aria-label="Kategori seçenekleri"
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                    >
                      <MoreVertical size={14} />
                    </button>
                    {isMenuOpen && (
                      <div className="cs-cat-popup" role="menu">
                        <button
                          className="cs-cat-popup-item"
                          onClick={() => startRenameCat(item.id, item.label)}
                          role="menuitem"
                        >
                          <Pencil size={13} /> Yeniden adlandır
                        </button>
                        <button
                          className="cs-cat-popup-item danger"
                          onClick={() => {
                            if (item.isBuiltin && item.builtinKey) deleteBuiltin(item.builtinKey);
                            else removeCustomCat(item.id);
                          }}
                          role="menuitem"
                        >
                          <Trash2 size={13} /> Sil
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
