'use client';

import { useState, useCallback, useEffect } from 'react';
import type { PlannerEvent, PlannerState } from '@/types';
import { getMonday, formatDate } from '@/lib/dateUtils';
import { savePlannerData, loadPlannerData } from '@/lib/storage';

export function usePlannerState() {
  const [state, setState] = useState<PlannerState>({
    currentWeekStart: getMonday(new Date()),
    events: [],
    user: null,
    deleteMode: false,
    pendingDeleteId: null,
    pendingReaddEvent: null,
    pendingSplitEvent: null,
    selectedImportance: 'high',
  });

  useEffect(() => {
    const { events, user } = loadPlannerData();
    setState(prev => ({ ...prev, events, user }));
  }, []);

  const saveAndUpdate = useCallback((events: PlannerEvent[], user: typeof state.user) => {
    savePlannerData(events, user);
  }, []);

  const navigateWeek = useCallback((dir: number) => {
    setState(prev => {
      const next = new Date(prev.currentWeekStart);
      next.setDate(next.getDate() + dir * 7);
      return { ...prev, currentWeekStart: next };
    });
  }, []);

  const goToToday = useCallback(() => {
    setState(prev => ({ ...prev, currentWeekStart: getMonday(new Date()) }));
  }, []);

  const setCurrentDate = useCallback((d: Date) => {
    setState(prev => ({ ...prev, currentWeekStart: d }));
  }, []);

  const addEvent = useCallback((event: PlannerEvent) => {
    setState(prev => {
      const events = [...prev.events, event];
      saveAndUpdate(events, prev.user);
      return { ...prev, events };
    });
  }, [saveAndUpdate]);

  const addEvents = useCallback((newEvents: PlannerEvent[]) => {
    setState(prev => {
      const events = [...prev.events, ...newEvents];
      saveAndUpdate(events, prev.user);
      return { ...prev, events };
    });
  }, [saveAndUpdate]);

  const toggleComplete = useCallback((id: string) => {
    setState(prev => {
      const events = prev.events.map(e =>
        e.id === id ? { ...e, completed: !e.completed } : e
      );
      saveAndUpdate(events, prev.user);
      return { ...prev, events };
    });
  }, [saveAndUpdate]);

  const deleteEvent = useCallback((id: string) => {
    setState(prev => {
      const events = prev.events.filter(e => e.id !== id);
      saveAndUpdate(events, prev.user);
      return { ...prev, events, pendingDeleteId: null, deleteMode: false };
    });
  }, [saveAndUpdate]);

  const removeEventsByModule = useCallback((moduleType: string, filter?: (e: PlannerEvent) => boolean) => {
    setState(prev => {
      const events = prev.events.filter(e => {
        if (e.moduleType !== moduleType) return true;
        if (filter) return !filter(e);
        return false;
      });
      saveAndUpdate(events, prev.user);
      return { ...prev, events };
    });
  }, [saveAndUpdate]);

  const postponeEvent = useCallback((id: string, newDate: string, reason: string) => {
    setState(prev => {
      const events = prev.events.map(e => {
        if (e.id !== id) return e;
        return {
          ...e,
          postponeCount: (e.postponeCount || 0) + 1,
          postponeHistory: [
            ...(e.postponeHistory || []),
            { from: e.date, to: newDate, reason, timestamp: Date.now() }
          ],
          originalDate: e.originalDate || e.date,
          date: newDate,
          completed: false,
        };
      });
      saveAndUpdate(events, prev.user);
      return { ...prev, events, pendingReaddEvent: null };
    });
  }, [saveAndUpdate]);

  const splitEvent = useCallback((originalId: string, subEvents: PlannerEvent[]) => {
    setState(prev => {
      const events = [
        ...prev.events.filter(e => e.id !== originalId),
        ...subEvents,
      ];
      saveAndUpdate(events, prev.user);
      return { ...prev, events, pendingSplitEvent: null };
    });
  }, [saveAndUpdate]);

  const toggleDeleteMode = useCallback(() => {
    setState(prev => ({ ...prev, deleteMode: !prev.deleteMode }));
  }, []);

  const setDeleteMode = useCallback((val: boolean) => {
    setState(prev => ({ ...prev, deleteMode: val }));
  }, []);

  const setPendingDelete = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, pendingDeleteId: id }));
  }, []);

  const setPendingReadd = useCallback((event: PlannerEvent | null) => {
    setState(prev => ({ ...prev, pendingReaddEvent: event }));
  }, []);

  const setPendingSplit = useCallback((event: PlannerEvent | null) => {
    setState(prev => ({ ...prev, pendingSplitEvent: event }));
  }, []);

  const setSelectedImportance = useCallback((imp: 'high' | 'medium' | 'low') => {
    setState(prev => ({ ...prev, selectedImportance: imp }));
  }, []);

  const login = useCallback((name: string) => {
    setState(prev => {
      const user = { name };
      saveAndUpdate(prev.events, user);
      return { ...prev, user };
    });
  }, [saveAndUpdate]);

  const logout = useCallback(() => {
    setState(prev => {
      saveAndUpdate(prev.events, null);
      return { ...prev, user: null };
    });
  }, [saveAndUpdate]);

  return {
    state,
    navigateWeek,
    goToToday,
    setCurrentDate,
    addEvent,
    addEvents,
    toggleComplete,
    deleteEvent,
    removeEventsByModule,
    postponeEvent,
    splitEvent,
    toggleDeleteMode,
    setDeleteMode,
    setPendingDelete,
    setPendingReadd,
    setPendingSplit,
    setSelectedImportance,
    login,
    logout,
  };
}
