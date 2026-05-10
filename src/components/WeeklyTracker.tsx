'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, X, Check } from 'lucide-react';
import type { WeeklyHabit, WeeklyTodo } from '@/types';
import { getWeekDates, formatDate } from '@/lib/dateUtils';

const STORAGE_KEY_HABITS = 'hackplanner_weekly_habits';
const STORAGE_KEY_TODOS = 'hackplanner_weekly_todos';

const DAY_LABELS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];
const DAY_FULL = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const PASTEL_COLORS = [
  '#f87171', // kırmızı
  '#fb923c', // turuncu
  '#fbbf24', // sarı
  '#4ade80', // yeşil
  '#60a5fa', // mavi
  '#c084fc', // mor
  '#f472b6', // pembe
];

interface Props {
  currentWeekStart: Date;
}

function loadHabits(): WeeklyHabit[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HABITS);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveHabits(habits: WeeklyHabit[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
}

function loadTodos(): WeeklyTodo[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TODOS);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveTodos(todos: WeeklyTodo[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
}

export default function WeeklyTracker({ currentWeekStart }: Props) {
  const [habits, setHabits] = useState<WeeklyHabit[]>([]);
  const [todos, setTodos] = useState<WeeklyTodo[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHabits(loadHabits());
    setTodos(loadTodos());
    setMounted(true);
  }, []);

  const weekDates = getWeekDates(currentWeekStart);
  const weekDateStrs = weekDates.map(d => formatDate(d));

  // --- Habits ---
  const addHabit = useCallback(() => {
    if (!newHabit.trim()) return;
    const updated = [...habits, { id: 'habit_' + Date.now(), name: newHabit.trim(), completedDays: {} }];
    setHabits(updated);
    saveHabits(updated);
    setNewHabit('');
  }, [habits, newHabit]);

  const removeHabit = useCallback((id: string) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    saveHabits(updated);
  }, [habits]);

  const toggleHabitDay = useCallback((habitId: string, dateStr: string) => {
    const updated = habits.map(h => {
      if (h.id !== habitId) return h;
      const completedDays = { ...h.completedDays };
      completedDays[dateStr] = !completedDays[dateStr];
      return { ...h, completedDays };
    });
    setHabits(updated);
    saveHabits(updated);
  }, [habits]);

  // --- Todos ---
  const addTodo = useCallback(() => {
    if (!newTodo.trim()) return;
    const updated = [...todos, { id: 'todo_' + Date.now(), text: newTodo.trim(), completed: false }];
    setTodos(updated);
    saveTodos(updated);
    setNewTodo('');
  }, [todos, newTodo]);

  const removeTodo = useCallback((id: string) => {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated);
    saveTodos(updated);
  }, [todos]);

  const toggleTodo = useCallback((id: string) => {
    const updated = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTodos(updated);
    saveTodos(updated);
  }, [todos]);

  // Progress
  const totalHabitChecks = habits.length * 7;
  const completedHabitChecks = habits.reduce((sum, h) => {
    return sum + weekDateStrs.filter(d => h.completedDays[d]).length;
  }, 0);
  const habitPercent = totalHabitChecks > 0 ? Math.round((completedHabitChecks / totalHabitChecks) * 100) : 0;

  const completedTodos = todos.filter(t => t.completed).length;
  const todoPercent = todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;

  if (!mounted) return null;

  return (
    <div className="weekly-tracker-grid">
      {/* Weekly Habits */}
      <div className="wt-card">
        <div className="wt-card-header">
          <h3 className="wt-title">📋 Haftalık Alışkanlıklar</h3>
        </div>

        {habits.length > 0 && (
          <div className="wt-habits-table">
            <div className="wt-habits-header">
              <span className="wt-habits-label-col" />
              {weekDates.map((d, i) => (
                <span key={i} className="wt-habits-day-col">
                  <span className="wt-day-letter" style={{ color: PASTEL_COLORS[i] }}>{DAY_LABELS[i]}</span>
                </span>
              ))}
            </div>

            {habits.map(habit => (
              <div key={habit.id} className="wt-habit-row">
                <span className="wt-habit-name">
                  {habit.name}
                  <button className="wt-habit-remove" onClick={() => removeHabit(habit.id)} title="Kaldır">
                    <X size={12} />
                  </button>
                </span>
                {weekDateStrs.map((dateStr, i) => {
                  const checked = !!habit.completedDays[dateStr];
                  return (
                    <button
                      key={dateStr}
                      className={`wt-habit-check ${checked ? 'checked' : ''}`}
                      style={checked ? { background: PASTEL_COLORS[i] + '20', borderColor: PASTEL_COLORS[i] } : {}}
                      onClick={() => toggleHabitDay(habit.id, dateStr)}
                    >
                      {checked && <Check size={14} style={{ color: PASTEL_COLORS[i] }} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {habits.length > 0 && (
          <div className="wt-progress-wrap">
            <div className="wt-progress-bar">
              <div
                className="wt-progress-fill habits"
                style={{ width: `${habitPercent}%` }}
              />
            </div>
            <span className="wt-progress-pct">{habitPercent}%</span>
          </div>
        )}

        {/* Add habit */}
        <div className="wt-add-row">
          <input
            className="wt-add-input"
            value={newHabit}
            onChange={e => setNewHabit(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHabit()}
            placeholder="Yeni alışkanlık ekle..."
          />
          <button className="wt-add-btn" onClick={addHabit} disabled={!newHabit.trim()}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Weekly To-Do List */}
      <div className="wt-card">
        <div className="wt-card-header">
          <h3 className="wt-title">✅ Haftalık Yapılacaklar</h3>
        </div>

        {todos.length > 0 && (
          <div className="wt-todo-list">
            {todos.map(todo => (
              <div key={todo.id} className={`wt-todo-item ${todo.completed ? 'done' : ''}`}>
                <button
                  className={`wt-todo-check ${todo.completed ? 'checked' : ''}`}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed && <Check size={14} />}
                </button>
                <span className="wt-todo-text">{todo.text}</span>
                <button className="wt-todo-remove" onClick={() => removeTodo(todo.id)}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {todos.length > 0 && (
          <div className="wt-progress-wrap">
            <div className="wt-progress-bar">
              <div
                className="wt-progress-fill todos"
                style={{ width: `${todoPercent}%` }}
              />
            </div>
            <span className="wt-progress-pct">{todoPercent}%</span>
          </div>
        )}

        {/* Add todo */}
        <div className="wt-add-row">
          <input
            className="wt-add-input"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="Yeni görev ekle..."
          />
          <button className="wt-add-btn" onClick={addTodo} disabled={!newTodo.trim()}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
