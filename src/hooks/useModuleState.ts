'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ModuleState, Medicine, Birthday, Expense, ShoppingList, SleepLog, Goal, GymExercise, GymProgram } from '@/types';
import { saveModuleData, loadModuleData } from '@/lib/storage';
import { formatDate } from '@/lib/dateUtils';

const defaultModState: ModuleState = {
  medicines: [],
  water: { height: 0, weight: 0, age: 0, gender: 'male', dailyGoal: 2500, log: {} },
  gym: { programs: [], activeProgram: null, exerciseLog: {} },
  birthdays: [],
  budget: { income: 0, expenses: [], shoppingLists: [] },
  sleep: { logs: [], goalMin: 7, goalMax: 9 },
  goals: [],
  study: { sessions: [], subjects: [] },
  journal: { entries: {} },
};

export function useModuleState() {
  const [modState, setModState] = useState<ModuleState>(defaultModState);

  useEffect(() => {
    const saved = loadModuleData();
    setModState(prev => ({ ...prev, ...saved }));
  }, []);

  const save = useCallback((next: ModuleState) => {
    saveModuleData(next);
    setModState(next);
  }, []);

  // Medicine
  const addMedicine = useCallback((med: Medicine) => {
    setModState(prev => {
      const next = { ...prev, medicines: [...prev.medicines, med] };
      saveModuleData(next);
      return next;
    });
  }, []);

  const deleteMedicine = useCallback((id: string) => {
    setModState(prev => {
      const next = { ...prev, medicines: prev.medicines.filter(m => m.id !== id) };
      saveModuleData(next);
      return next;
    });
  }, []);

  const toggleMedTaken = useCallback((medId: string, date: string, freq: string) => {
    setModState(prev => {
      const medicines = prev.medicines.map(m => {
        if (m.id !== medId) return m;
        const log = { ...m.takenLog };
        const dayLog = [...(log[date] || [])];
        const idx = dayLog.indexOf(freq);
        if (idx >= 0) dayLog.splice(idx, 1);
        else dayLog.push(freq);
        log[date] = dayLog;
        return { ...m, takenLog: log };
      });
      const next = { ...prev, medicines };
      saveModuleData(next);
      return next;
    });
  }, []);

  // Water
  const addWater = useCallback((ml: number) => {
    setModState(prev => {
      const today = formatDate(new Date());
      const todayLog = prev.water.log[today] || { total: 0, entries: [] };
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const updated = {
        total: todayLog.total + ml,
        entries: [...todayLog.entries, { amount: ml, time }],
      };
      const next = {
        ...prev,
        water: { ...prev.water, log: { ...prev.water.log, [today]: updated } },
      };
      saveModuleData(next);
      return next;
    });
  }, []);

  const deleteWaterEntry = useCallback((index: number) => {
    setModState(prev => {
      const today = formatDate(new Date());
      const todayLog = prev.water.log[today];
      if (!todayLog) return prev;

      const entries = [...todayLog.entries];
      const removed = entries.splice(index, 1)[0];
      const updated = {
        total: Math.max(0, todayLog.total - (removed?.amount || 0)),
        entries,
      };

      const next = {
        ...prev,
        water: { ...prev.water, log: { ...prev.water.log, [today]: updated } },
      };
      saveModuleData(next);
      return next;
    });
  }, []);

  const saveWaterProfile = useCallback((height: number, weight: number, age: number, gender: 'male' | 'female') => {
    setModState(prev => {
      const dailyGoal = Math.round((weight * 35 + (gender === 'male' ? 500 : 300)) / 100) * 100;
      const next = {
        ...prev,
        water: { ...prev.water, height, weight, age, gender, dailyGoal },
      };
      saveModuleData(next);
      return next;
    });
  }, []);

  // Gym
  const addExercise = useCallback((exercise: GymExercise) => {
    setModState(prev => {
      let programs = [...prev.gym.programs];
      const activeId = prev.gym.activeProgram;
      if (activeId) {
        programs = programs.map(p =>
          p.id === activeId
            ? { ...p, exercises: [...p.exercises, exercise] }
            : p
        );
      } else {
        const newProgram: GymProgram = {
          id: 'prog_' + Date.now(),
          name: 'Programım',
          exercises: [exercise],
        };
        programs = [newProgram];
        const next = { ...prev, gym: { ...prev.gym, programs, activeProgram: newProgram.id } };
        saveModuleData(next);
        return next;
      }
      const next = { ...prev, gym: { ...prev.gym, programs } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const useGymTemplate = useCallback((templateExercises: GymExercise[], name: string) => {
    setModState(prev => {
      const newProgram: GymProgram = {
        id: 'prog_' + Date.now(),
        name,
        exercises: templateExercises,
      };
      const next = {
        ...prev,
        gym: { ...prev.gym, programs: [...prev.gym.programs, newProgram], activeProgram: newProgram.id },
      };
      saveModuleData(next);
      return next;
    });
  }, []);

  const toggleExercise = useCallback((key: string) => {
    setModState(prev => {
      const exerciseLog = { ...prev.gym.exerciseLog, [key]: !prev.gym.exerciseLog[key] };
      const next = { ...prev, gym: { ...prev.gym, exerciseLog } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const setActiveProgram = useCallback((id: string) => {
    setModState(prev => {
      const next = { ...prev, gym: { ...prev.gym, activeProgram: id } };
      saveModuleData(next);
      return next;
    });
  }, []);

  // Birthday
  const addBirthday = useCallback((bday: Birthday) => {
    setModState(prev => {
      const next = { ...prev, birthdays: [...prev.birthdays, bday] };
      saveModuleData(next);
      return next;
    });
  }, []);

  const updateBirthday = useCallback((bday: Birthday) => {
    setModState(prev => {
      const next = { ...prev, birthdays: prev.birthdays.map(b => b.id === bday.id ? bday : b) };
      saveModuleData(next);
      return next;
    });
  }, []);

  const deleteBirthday = useCallback((id: string) => {
    setModState(prev => {
      const next = { ...prev, birthdays: prev.birthdays.filter(b => b.id !== id) };
      saveModuleData(next);
      return next;
    });
  }, []);

  // Budget
  const updateIncome = useCallback((income: number) => {
    setModState(prev => {
      const next = { ...prev, budget: { ...prev.budget, income } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const addExpense = useCallback((expense: Expense) => {
    setModState(prev => {
      const next = { ...prev, budget: { ...prev.budget, expenses: [...prev.budget.expenses, expense] } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setModState(prev => {
      const next = { ...prev, budget: { ...prev.budget, expenses: prev.budget.expenses.filter(e => e.id !== id) } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const addShoppingList = useCallback((list: ShoppingList) => {
    setModState(prev => {
      const next = { ...prev, budget: { ...prev.budget, shoppingLists: [...prev.budget.shoppingLists, list] } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const toggleShoppingItem = useCallback((listId: string, itemIdx: number) => {
    setModState(prev => {
      const lists = prev.budget.shoppingLists.map(l => {
        if (l.id !== listId) return l;
        const items = l.items.map((item, i) =>
          i === itemIdx ? { ...item, checked: !item.checked } : item
        );
        return { ...l, items };
      });
      const next = { ...prev, budget: { ...prev.budget, shoppingLists: lists } };
      saveModuleData(next);
      return next;
    });
  }, []);

  // Sleep
  const addSleepLog = useCallback((log: SleepLog) => {
    setModState(prev => {
      const next = { ...prev, sleep: { ...prev.sleep, logs: [...prev.sleep.logs, log] } };
      saveModuleData(next);
      return next;
    });
  }, []);

  // Goals
  const addGoal = useCallback((goal: Goal) => {
    setModState(prev => {
      const next = { ...prev, goals: [...prev.goals, goal] };
      saveModuleData(next);
      return next;
    });
  }, []);

  const updateGoalProgress = useCallback((id: string, delta: number) => {
    setModState(prev => {
      const goals = prev.goals.map(g =>
        g.id === id ? { ...g, current: Math.min(g.target, Math.max(0, g.current + delta)) } : g
      );
      const next = { ...prev, goals };
      saveModuleData(next);
      return next;
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setModState(prev => {
      const next = { ...prev, goals: prev.goals.filter(g => g.id !== id) };
      saveModuleData(next);
      return next;
    });
  }, []);

  // Study
  const addStudySubject = useCallback((name: string, color: string) => {
    setModState(prev => {
      const subject: StudySubject = { id: 'sub_' + Date.now(), name, color, resources: [] };
      const next = { ...prev, study: { ...prev.study, subjects: [...prev.study.subjects, subject] } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const deleteStudySubject = useCallback((id: string) => {
    setModState(prev => {
      const next = { ...prev, study: { ...prev.study, subjects: prev.study.subjects.filter(s => s.id !== id) } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const addStudyResource = useCallback((subjectId: string, resource: any) => {
    setModState(prev => {
      const subjects = prev.study.subjects.map(s => {
        if (s.id !== subjectId) return s;
        return { ...s, resources: [...s.resources, { ...resource, id: 'res_' + Date.now() }] };
      });
      const next = { ...prev, study: { ...prev.study, subjects } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const addStudySession = useCallback((subjectId: string, duration: number, topic?: string, questions?: number) => {
    setModState(prev => {
      const today = formatDate(new Date());
      const session = { date: today, duration, subjectId, topic, questions };
      const next = { ...prev, study: { ...prev.study, sessions: [...prev.study.sessions, session] } };
      saveModuleData(next);
      return next;
    });
  }, []);

  // Journal
  const saveJournalEntry = useCallback((date: string, content: string, mood?: string, title?: string, gratitude?: string[], weather?: string, location?: string, paperStyle?: any, quote?: string, color?: string) => {
    setModState(prev => {
      const entries = { ...prev.journal.entries };
      const id = entries[date]?.id || 'jrnl_' + Date.now();
      entries[date] = { id, date, content, mood, title, gratitude, weather, location, paperStyle, quote, color };
      const next = { ...prev, journal: { ...prev.journal, entries } };
      saveModuleData(next);
      return next;
    });
  }, []);

  const deleteJournalEntry = useCallback((date: string) => {
    setModState(prev => {
      const entries = { ...prev.journal.entries };
      delete entries[date];
      const next = { ...prev, journal: { ...prev.journal, entries } };
      saveModuleData(next);
      return next;
    });
  }, []);

  return {
    modState,
    save,
    addMedicine, deleteMedicine, toggleMedTaken,
    addWater, deleteWaterEntry, saveWaterProfile,
    addExercise, useGymTemplate, toggleExercise, setActiveProgram,
    addBirthday, updateBirthday, deleteBirthday,
    updateIncome, addExpense, deleteExpense, addShoppingList, toggleShoppingItem,
    addSleepLog,
    addGoal, updateGoalProgress, deleteGoal,
    addStudySession, addStudySubject, deleteStudySubject, addStudyResource,
    saveJournalEntry, deleteJournalEntry,
  };
}
