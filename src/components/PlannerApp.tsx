'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { ActiveModule, PlannerEvent, EventCategory, Medicine, Expense } from '@/types';
import { usePlannerState } from '@/hooks/usePlannerState';
import { useModuleState } from '@/hooks/useModuleState';
import { formatDate, getMonday } from '@/lib/dateUtils';
import { computeStreak } from '@/lib/statsUtils';

import AppSidebar from '@/components/AppSidebar';
import TopBar, { type CalendarView } from '@/components/TopBar';
import CalSidebar from '@/components/calendar/CalSidebar';
import CalMainHeader from '@/components/calendar/CalMainHeader';
import CalendarSection from '@/components/calendar/CalendarSection';
import StatisticsOverlay from '@/components/StatisticsOverlay';
import GuidedTour from '@/components/GuidedTour';
import StudyOverlay from '@/components/modules/StudyOverlay';

import LoginModal from '@/components/modals/LoginModal';
import AddEventModal, { type AddEventPreset } from '@/components/modals/AddEventModal';
import DeleteModal from '@/components/modals/DeleteModal';
import PostponeReasonModal from '@/components/modals/PostponeReasonModal';
import SplitTaskModal from '@/components/modals/SplitTaskModal';

import MedicineOverlay from '@/components/modules/MedicineOverlay';
import WaterOverlay from '@/components/modules/WaterOverlay';
import GymOverlay from '@/components/modules/GymOverlay';
import BirthdayOverlay from '@/components/modules/BirthdayOverlay';
import BudgetOverlay from '@/components/modules/BudgetOverlay';
import SleepOverlay from '@/components/modules/SleepOverlay';
import GoalsOverlay from '@/components/modules/GoalsOverlay';
import SettingsOverlay from '@/components/modules/SettingsOverlay';
import JournalOverlay from '@/components/modules/JournalOverlay';
import AssistantWidget from '@/components/AssistantWidget';
import { useProactiveAssistant, type ProactiveMessage } from '@/hooks/useProactiveAssistant';

import { seedScenario, emptyModuleState } from '@/lib/seedScenario';
import { OPENAI_KEY_STORAGE } from '@/lib/openaiClient';

type ActiveModal = 'login' | 'addEvent' | 'delete' | 'postpone' | 'split' | null;

declare global {
  interface Window {
    setActiveModule: (mod: ActiveModule) => void;
  }
}

function isPlannerEvent(event: PlannerEvent | Pick<PlannerEvent, 'id' | 'name'>): event is PlannerEvent {
  return 'date' in event && 'startTime' in event && 'endTime' in event;
}

export default function PlannerApp() {
  const planner = usePlannerState();
  const modules = useModuleState();

  const [activeModule, setActiveModule] = useState<ActiveModule>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [showTour, setShowTour] = useState(false);
  const [view, setView] = useState<CalendarView>('week');
  const [addPreset, setAddPreset] = useState<AddEventPreset | null>(null);
  const [hiddenCategories, setHiddenCategories] = useState<EventCategory[]>([]);
  const [focusMode, setFocusMode] = useState(false);
  const [proactiveMsgs, setProactiveMsgs] = useState<ProactiveMessage[]>([]);

  // Proaktif asistan — uygulama state'ini izleyip uygun anlarda mesaj gönderir
  useProactiveAssistant(
    planner.state.events,
    modules.modState,
    useCallback((msg: ProactiveMessage) => {
      setProactiveMsgs(prev => [...prev, msg]);
    }, [])
  );

  useEffect(() => {
    window.setActiveModule = setActiveModule;
    return () => { (window as any).setActiveModule = undefined; };
  }, []);

  const toggleCategory = useCallback((cat: EventCategory) => {
    setHiddenCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }, []);

  const visibleEvents = useMemo(() => {
    return planner.state.events.filter(e => !hiddenCategories.includes(e.category));
  }, [planner.state.events, hiddenCategories]);

  // Event click handling: complete if not in delete mode, else confirm delete
  const handleEventClick = useCallback((id: string) => {
    if (planner.state.deleteMode) {
      planner.setPendingDelete(id);
      setActiveModal('delete');
    } else {
      planner.toggleComplete(id);
    }
  }, [planner]);

  // Postpone flow: event click, set pendingReadd, open postpone modal.
  const handleReaddClick = useCallback((id: string) => {
    const ev = planner.state.events.find(e => e.id === id);
    if (!ev) return;
    planner.setPendingReadd(ev);
    setActiveModal('postpone');
  }, [planner]);

  // Split flow
  const handleSplitClick = useCallback((id: string) => {
    const ev = planner.state.events.find(e => e.id === id);
    if (!ev) return;
    planner.setPendingSplit(ev);
    setActiveModal('split');
  }, [planner]);

  const handlePostponeConfirm = useCallback((reason: string, newDate: string) => {
    if (!planner.state.pendingReaddEvent) return;
    planner.postponeEvent(planner.state.pendingReaddEvent.id, newDate, reason);
    setActiveModal(null);
  }, [planner]);

  const handleSplitConfirm = useCallback((subTaskNames: string[]) => {
    const orig = planner.state.pendingSplitEvent;
    if (!orig) return;
    const [sh, sm] = orig.startTime.split(':').map(Number);
    const [eh, em] = orig.endTime.split(':').map(Number);
    const totalMin = (eh * 60 + em) - (sh * 60 + sm);
    const partMin = Math.floor(totalMin / subTaskNames.length);

    const subEvents: PlannerEvent[] = subTaskNames.filter(Boolean).map((name, i) => {
      const startMin = sh * 60 + sm + i * partMin;
      const endMin = startMin + partMin;
      const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      return {
        id: 'ev_' + Date.now() + '_' + i,
        name,
        date: orig.date,
        startTime: fmt(startMin),
        endTime: fmt(endMin),
        importance: orig.importance,
        completed: false,
        postponeCount: 0,
        postponeHistory: [],
        originalDate: orig.date,
        subTasks: [],
        parentId: orig.id,
        parentName: orig.name,
        // Alt görevler parent'ın kategorisini ve türünü miras alır.
        // Parçalanmış görevler tipik olarak "task" kabul edilir.
        kind: 'task',
        category: orig.category,
        estimatedMin: partMin,
      };
    });
    planner.splitEvent(orig.id, subEvents);
    setActiveModal(null);
  }, [planner]);

  const handleDeleteConfirm = useCallback(() => {
    if (!planner.state.pendingDeleteId) return;
    planner.deleteEvent(planner.state.pendingDeleteId);
    setActiveModal(null);
  }, [planner]);

  // Boş slot tıklaması → AddEventModal'ı pre-filled aç.
  const handleSlotClick = useCallback((dateStr: string, hour: number, minute: number) => {
    if (planner.state.deleteMode) return;
    const start = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const endHour = Math.min(hour + 1, 23);
    const end = `${String(endHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    setAddPreset({ date: dateStr, startTime: start, endTime: end, kind: 'event' });
    setActiveModal('addEvent');
  }, [planner.state.deleteMode]);

  // Manuel "+ Etkinlik Ekle" butonu — preset yok.
  const handleOpenAddModal = useCallback(() => {
    setAddPreset(null);
    setActiveModal('addEvent');
  }, []);

  const getBirthdayBanners = useCallback((dateStr: string) => {
    const [, month, day] = dateStr.split('-').map(Number);
    return modules.modState.birthdays.filter(b => {
      const [, bmonth, bday] = b.date.split('-').map(Number);
      return bmonth === month && bday === day;
    });
  }, [modules.modState.birthdays]);

  const pendingDeleteEvent = planner.state.pendingDeleteId
    ? planner.state.events.find(e => e.id === planner.state.pendingDeleteId)
    : null;

  const handleEventDrop = useCallback((id: string, newDate: string, newStartH: number, newStartM: number) => {
    const event = planner.state.events.find(e => e.id === id);
    if (!event) return;

    // Calculate original duration in minutes
    const [origSh, origSm] = event.startTime.split(':').map(Number);
    const [origEh, origEm] = event.endTime.split(':').map(Number);
    const durationMinutes = (origEh * 60 + origEm) - (origSh * 60 + origSm);

    // Calculate new end time
    const newEndTotalMins = (newStartH * 60 + newStartM) + durationMinutes;
    let newEndH = Math.floor(newEndTotalMins / 60);
    let newEndM = newEndTotalMins % 60;
    
    // Bounds check
    if (newEndH > 23) {
      newEndH = 23;
      newEndM = 59;
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    const newStartTime = `${pad(newStartH)}:${pad(newStartM)}`;
    const newEndTime = `${pad(newEndH)}:${pad(newEndM)}`;

    const conflict = planner.state.events.find(e => {
      if (e.id === id) return false;
      if (e.date !== newDate || e.allDay) return false;
      const [sh, sm] = e.startTime.split(':').map(Number);
      const [eh, em] = e.endTime.split(':').map(Number);
      const eStart = sh * 60 + sm;
      const eEnd = eh * 60 + em;
      const nStart = newStartH * 60 + newStartM;
      const nEnd = newEndH * 60 + newEndM;
      return (nStart < eEnd && nEnd > eStart);
    });

    if (conflict) {
      // Çakışma durumunda otomatik olarak sonraya ötele (confirm sormadan, kullanıcıya bildirim vererek)
      const [newEH, newEM] = newEndTime.split(':').map(Number);
      const confDuration = (parseInt(conflict.endTime.split(':')[0])*60 + parseInt(conflict.endTime.split(':')[1])) - (parseInt(conflict.startTime.split(':')[0])*60 + parseInt(conflict.startTime.split(':')[1]));
      const confNewEndH = Math.floor((newEH * 60 + newEM + confDuration) / 60);
      const confNewEndM = (newEH * 60 + newEM + confDuration) % 60;
      
      const updatedConflict = {
        ...conflict,
        startTime: newEndTime,
        endTime: `${pad(confNewEndH)}:${pad(confNewEndM)}`
      };

      planner.updateEvent({
        ...event,
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime
      });
      planner.updateEvent(updatedConflict);
      return;
    }

    planner.updateEvent({
      ...event,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime
    });
  }, [planner]);

  // Anchor date is currentWeekStart (it's the date around which day/month views revolve too)
  const anchorDate = planner.state.currentWeekStart;

  const handleNavigate = (dir: number) => {
    const next = new Date(anchorDate);
    if (view === 'day') next.setDate(next.getDate() + dir);
    else if (view === 'week') next.setDate(next.getDate() + dir * 7);
    else next.setMonth(next.getMonth() + dir);
    planner.setCurrentDate(next);
  };

  const handleToday = () => {
    if (view === 'week') planner.goToToday();
    else planner.setCurrentDate(new Date());
  };

  // === Test senaryosu / sıfırlama ===
  const handleLoadScenario = useCallback(() => {
    const seed = seedScenario();
    planner.replaceAll(seed.events, seed.user);
    modules.save(seed.modules);
    setActiveModule(null); // Ana sayfaya dön ki kullanıcı sonucu görsün
  }, [planner, modules]);

  const handleResetAll = useCallback(() => {
    planner.replaceAll([], null);
    modules.save(emptyModuleState());
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(OPENAI_KEY_STORAGE);
    }
  }, [planner, modules]);

  const handleAddAiMedicines = useCallback((medicines: Medicine[]) => {
    medicines.forEach(med => modules.addMedicine(med));
  }, [modules]);

  const handleAddAiExpenses = useCallback((expenses: Expense[]) => {
    expenses.forEach(expense => modules.addExpense(expense));
  }, [modules]);

  const handleAddAiEvents = useCallback((aiEvents: PlannerEvent[]) => {
    planner.addEvents(aiEvents);
    const firstDate = aiEvents.find(ev => ev.date)?.date;
    if (!firstDate) return;

    const parsed = new Date(`${firstDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return;

    setActiveModule(null);
    setView('week');
    planner.setCurrentDate(getMonday(parsed));
  }, [planner]);

  const { streak } = useMemo(() => computeStreak(planner.state.events), [planner.state.events]);
  const waterPercent = useMemo(() => {
    const today = formatDate(new Date());
    const consumed = modules.modState.water.log[today]?.total || 0;
    const goal = modules.modState.water.dailyGoal || 2500;
    return Math.min(Math.round((consumed / goal) * 100), 100);
  }, [modules.modState.water]);

  return (
    <div className={`app-container${focusMode ? ' focus-mode' : ''}`}>
      <AppSidebar
        activeModule={activeModule}
        onHome={() => setActiveModule(null)}
        onModule={mod => setActiveModule(prev => prev === mod ? null : mod)}
      />

      <main className="main-area">
        <TopBar
          view={view}
          onViewChange={setView}
          onTour={() => setShowTour(true)}
          onProfile={() => setActiveModal('login')}
          userName="Asıl Koray Alma"
        />

        <div className="content-area">
          <CalSidebar
            currentWeekStart={planner.state.currentWeekStart}
            events={planner.state.events}
            onAddEvent={handleOpenAddModal}
            onPrev={() => handleNavigate(-1)}
            onNext={() => handleNavigate(1)}
            onSelectDate={planner.setCurrentDate}
            hiddenCategories={hiddenCategories}
            onToggleCategory={toggleCategory}
          />

          <div className="calendar-area">
            <CalMainHeader
              view={view}
              anchorDate={anchorDate}
              events={visibleEvents}
              onToday={handleToday}
              onAddEvent={handleOpenAddModal}
            />

            <CalendarSection
              view={view}
              anchorDate={anchorDate}
              events={visibleEvents}
              deleteMode={planner.state.deleteMode}
              onEventClick={handleEventClick}
              onDeleteEvent={id => { planner.setPendingDelete(id); setActiveModal('delete'); }}
              onComplete={planner.toggleComplete}
              onPostpone={handleReaddClick}
              onSplit={handleSplitClick}
              onSlotClick={handleSlotClick}
              getBirthdayBanners={getBirthdayBanners}
              onEventDrop={handleEventDrop}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <LoginModal
        open={activeModal === 'login'}
        user={planner.state.user}
        onClose={() => setActiveModal(null)}
      />

      <AddEventModal
        open={activeModal === 'addEvent'}
        preset={addPreset}
        onClose={() => { setActiveModal(null); setAddPreset(null); }}
        onAdd={ev => { planner.addEvent(ev); setActiveModal(null); setAddPreset(null); }}
      />

      <DeleteModal
        open={activeModal === 'delete'}
        eventName={pendingDeleteEvent?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { planner.setPendingDelete(null); setActiveModal(null); }}
      />

      <PostponeReasonModal
        open={activeModal === 'postpone'}
        eventName={planner.state.pendingReaddEvent?.name || ''}
        postponeCount={planner.state.pendingReaddEvent?.postponeCount || 0}
        onConfirm={handlePostponeConfirm}
        onCancel={() => { planner.setPendingReadd(null); setActiveModal(null); }}
      />

      <SplitTaskModal
        open={activeModal === 'split'}
        event={planner.state.pendingSplitEvent}
        onConfirm={handleSplitConfirm}
        onCancel={() => { planner.setPendingSplit(null); setActiveModal(null); }}
      />

      {/* Module overlays */}
      <MedicineOverlay
        active={activeModule === 'medicine'}
        modState={modules.modState}
        onClose={() => setActiveModule(null)}
        onAdd={modules.addMedicine}
        onDelete={modules.deleteMedicine}
        onToggleTaken={modules.toggleMedTaken}
      />

      <WaterOverlay
        active={activeModule === 'water'}
        modState={modules.modState}
        onClose={() => setActiveModule(null)}
        onAddWater={modules.addWater}
        onDeleteWaterEntry={modules.deleteWaterEntry}
        onSaveProfile={modules.saveWaterProfile}
      />

      <GymOverlay
        active={activeModule === 'gym'}
        modState={modules.modState}
        onClose={() => setActiveModule(null)}
        onAddExercise={modules.addExercise}
        onUseTemplate={(exercises, name) => modules.useGymTemplate(exercises, name)}
        onToggleExercise={modules.toggleExercise}
        onSetActiveProgram={id => modules.save({ ...modules.modState, gym: { ...modules.modState.gym, activeProgram: id } })}
      />

      <BirthdayOverlay
        active={activeModule === 'birthday'}
        modState={modules.modState}
        onClose={() => setActiveModule(null)}
        onAdd={modules.addBirthday}
        onDelete={modules.deleteBirthday}
        onUpdate={modules.updateBirthday}
      />

      <BudgetOverlay
        active={activeModule === 'budget'}
        modState={modules.modState}
        onClose={() => setActiveModule(null)}
        onUpdateIncome={modules.updateIncome}
        onAddExpense={modules.addExpense}
        onDeleteExpense={modules.deleteExpense}
        onAddShoppingList={modules.addShoppingList}
        onToggleShoppingItem={modules.toggleShoppingItem}
        onUpdateGoalProgress={modules.updateGoalProgress}
      />

      <SleepOverlay
        active={activeModule === 'sleep'}
        modState={modules.modState}
        onClose={() => setActiveModule(null)}
        onAddLog={modules.addSleepLog}
      />

      <GoalsOverlay
        active={activeModule === 'goals'}
        modState={modules.modState}
        onClose={() => setActiveModule(null)}
        onAdd={modules.addGoal}
        onUpdateProgress={modules.updateGoalProgress}
        onDelete={modules.deleteGoal}
      />

      <StudyOverlay
        active={activeModule === 'study'}
        modState={modules.modState}
        focusMode={focusMode}
        onToggleFocus={() => setFocusMode(p => !p)}
        onClose={() => { setFocusMode(false); setActiveModule(null); }}
        onAddSession={modules.addStudySession}
        onAddSubject={modules.addStudySubject}
        onDeleteSubject={modules.deleteStudySubject}
        onAddEvent={(preset) => {
          if (preset.id?.startsWith('study_preset_')) {
            const now = new Date();
            setAddPreset({ 
              date: formatDate(now),
              startTime: '10:00',
              endTime: '11:00',
              kind: 'task',
              category: 'study',
              name: preset.name
            });
            setActiveModal('addEvent');
          } else if (isPlannerEvent(preset)) {
            planner.addEvent(preset);
          }
        }}
      />

      <JournalOverlay
        active={activeModule === 'journal'}
        modState={modules.modState}
        onClose={() => setActiveModule(null)}
        onSaveEntry={modules.saveJournalEntry}
        onDeleteEntry={modules.deleteJournalEntry}
      />

      <StatisticsOverlay
        active={activeModule === 'statistics'}
        events={planner.state.events}
        currentWeekStart={planner.state.currentWeekStart}
        onReadd={handleReaddClick}
        onSplit={handleSplitClick}
        onClose={() => setActiveModule(null)}
      />

      <SettingsOverlay
        active={activeModule === 'settings'}
        onClose={() => setActiveModule(null)}
        onLoadScenario={handleLoadScenario}
        onResetAll={handleResetAll}
      />

      <GuidedTour active={showTour} onEnd={() => setShowTour(false)} />

      <AssistantWidget
        onOpenSettings={() => setActiveModule('settings')}
        proactiveMessages={proactiveMsgs}
        events={planner.state.events}
        modState={modules.modState}
        currentWeekStart={planner.state.currentWeekStart}
        onAddAiEvents={handleAddAiEvents}
        onAddAiMedicines={handleAddAiMedicines}
        onOpenMedicine={() => setActiveModule('medicine')}
        onAddAiExpenses={handleAddAiExpenses}
        onOpenBudget={() => setActiveModule('budget')}
      />
    </div>
  );
}
