'use client';

import { useState, useMemo, useEffect } from 'react';
import type {
  PlannerEvent,
  EventKind,
  EventCategory,
  RecurrencePattern,
} from '@/types';
import {
  EVENT_KIND_LABELS,
  EVENT_KIND_HINTS,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_ICONS,
  EVENT_CATEGORY_COLORS,
  ESTIMATED_MIN_OPTIONS,
  RECURRENCE_LABELS,
} from '@/lib/constants';
import { formatDate } from '@/lib/dateUtils';

/** Modal açılırken ön doldurma. Calendar slot tıklamasından geliyor. */
export interface AddEventPreset {
  date?: string;
  /** "HH:MM" — verilirse Etkinlik sekmesi seçilir ve startTime bu değer olur. */
  startTime?: string;
  endTime?: string;
  kind?: EventKind;
  name?: string;
  category?: EventCategory;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (event: PlannerEvent) => void;
  /** Modal her açıldığında uygulanır. */
  preset?: AddEventPreset | null;
}

const KIND_TABS: EventKind[] = ['event', 'task', 'goal'];
const CATEGORY_OPTIONS: EventCategory[] = ['personal', 'work', 'study', 'health', 'other'];
const RECURRENCE_OPTIONS: { value: RecurrencePattern | 'none'; label: string }[] = [
  { value: 'none', label: 'Tekrar yok' },
  { value: 'daily', label: RECURRENCE_LABELS.daily },
  { value: 'weekdays', label: RECURRENCE_LABELS.weekdays },
  { value: 'weekly', label: RECURRENCE_LABELS.weekly },
];

function makeId(prefix: string) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
}

/** Süre dakikasını "HH:MM" string'e dönüştürür. */
function minutesToTime(min: number): string {
  const h = Math.max(0, Math.min(23, Math.floor(min / 60)));
  const m = Math.max(0, Math.min(59, min % 60));
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** "HH:MM" string'i toplam dakikaya dönüştürür. */
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function AddEventModal({ open, onClose, onAdd, preset }: Props) {
  // --- Sekme & ortak alanlar -------------------------------------------
  const [kind, setKind] = useState<EventKind>('event');
  const [name, setName] = useState('');
  const [date, setDate] = useState(formatDate(new Date()));
  const [importance, setImportance] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState<EventCategory>('personal');

  // --- Etkinlik/Görev ortak: saat alanları -----------------------------
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  // --- Görev'e özel ----------------------------------------------------
  const [allDay, setAllDay] = useState(false);
  const [estimatedMin, setEstimatedMin] = useState<number>(30);
  const [recurrence, setRecurrence] = useState<RecurrencePattern | 'none'>('none');

  // --- Hedef'e özel ----------------------------------------------------
  const [description, setDescription] = useState('');

  const resetAll = () => {
    setKind('event');
    setName('');
    setDate(formatDate(new Date()));
    setImportance('medium');
    setCategory('personal');
    setStartTime('09:00');
    setEndTime('10:00');
    setAllDay(false);
    setEstimatedMin(30);
    setRecurrence('none');
    setDescription('');
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  // Modal açıldığında preset'i uygula. open=false → state'i sıfırlama
  // (kullanıcı yazıyor olabilir, modal sadece görsel olarak gizlendi).
  useEffect(() => {
    if (!open) return;
    if (!preset) return;
    if (preset.date) setDate(preset.date);
    if (preset.kind) setKind(preset.kind);
    if (preset.startTime) {
      setStartTime(preset.startTime);
      // Eğer endTime verilmediyse +1 saat default
      if (preset.endTime) {
        setEndTime(preset.endTime);
      } else {
        const start = timeToMinutes(preset.startTime);
        setEndTime(minutesToTime(Math.min(start + 60, 23 * 60 + 59)));
      }
      // Slot tıklaması saatli bir şey istiyor → kind verilmediyse Etkinlik
      if (!preset.kind) setKind('event');
    }
    if (preset.name) setName(preset.name);
    if (preset.category) setCategory(preset.category);
  }, [open, preset]);

  // --- Görev sekmesinde estimatedMin değiştiğinde endTime'ı otomatik ayarla
  const taskTimeBlock = useMemo(() => {
    if (kind !== 'task' || allDay) return null;
    const startMin = timeToMinutes(startTime);
    return {
      start: startTime,
      end: minutesToTime(startMin + estimatedMin),
    };
  }, [kind, allDay, startTime, estimatedMin]);

  const handleAdd = () => {
    if (!name.trim()) {
      alert('Lütfen bir ad girin');
      return;
    }

    // Türe göre validasyon ve event nesnesi inşası
    let ev: PlannerEvent;

    if (kind === 'event') {
      if (!date) { alert('Lütfen tarih seçin'); return; }
      if (!startTime || !endTime) { alert('Lütfen saat belirleyin'); return; }
      if (startTime >= endTime) { alert('Bitiş saati başlangıçtan sonra olmalı'); return; }

      ev = {
        id: makeId('evt'),
        name: name.trim(),
        date,
        startTime,
        endTime,
        importance,
        completed: false,
        postponeCount: 0,
        postponeHistory: [],
        originalDate: date,
        subTasks: [],
        parentId: null,
        kind: 'event',
        category,
      };
    } else if (kind === 'task') {
      if (!date) { alert('Lütfen tarih seçin'); return; }

      // Saatsiz görevler için placeholder slot — calendar Aşama 3'te
      // allDay flag'ine bakarak shelf'e koyacak.
      const tStart = allDay ? '09:00' : startTime;
      const tEnd = allDay
        ? minutesToTime(timeToMinutes('09:00') + (estimatedMin || 30))
        : (taskTimeBlock?.end ?? endTime);

      if (!allDay && tStart >= tEnd) {
        alert('Bitiş saati başlangıçtan sonra olmalı');
        return;
      }

      ev = {
        id: makeId('tsk'),
        name: name.trim(),
        date,
        startTime: tStart,
        endTime: tEnd,
        importance,
        completed: false,
        postponeCount: 0,
        postponeHistory: [],
        originalDate: date,
        subTasks: [],
        parentId: null,
        kind: 'task',
        category,
        estimatedMin,
        allDay: allDay || undefined,
        recurrence:
          recurrence === 'none' ? undefined : { pattern: recurrence },
      };
    } else {
      // kind === 'goal' — büyük hedef container'ı
      // Tarih = hedef bitiş tarihi. Saat slot'u taşımıyor; calendar bunu
      // ayrı görsel olarak ele alacak (Aşama 3/6).
      ev = {
        id: makeId('goal'),
        name: name.trim(),
        description: description.trim() || undefined,
        date,
        startTime: '09:00',
        endTime: '10:00',
        importance,
        completed: false,
        postponeCount: 0,
        postponeHistory: [],
        originalDate: date,
        subTasks: [],
        parentId: null,
        kind: 'goal',
        category,
        allDay: true,
      };
    }

    onAdd(ev);
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay active"
      id="addEventModal"
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal add-evt-modal" style={{ position: 'relative' }}>
        <button className="modal-close" onClick={handleClose}>✕</button>

        {/* --- Tür sekmeleri ---------------------------------------- */}
        <div className="kind-tabs" role="tablist" aria-label="Eklenecek tür">
          {KIND_TABS.map(k => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={kind === k}
              className={`kind-tab${kind === k ? ' active' : ''}`}
              onClick={() => setKind(k)}
            >
              {EVENT_KIND_LABELS[k]}
            </button>
          ))}
        </div>
        <p className="kind-hint">{EVENT_KIND_HINTS[kind]}</p>

        {/* --- Ortak: Ad ------------------------------------------- */}
        <div className="form-group">
          <label>{kind === 'goal' ? 'Hedef Adı' : kind === 'task' ? 'Görev Adı' : 'Etkinlik Adı'}</label>
          <input
            type="text"
            placeholder={
              kind === 'goal'
                ? 'Ör: Python öğren'
                : kind === 'task'
                  ? 'Ör: Rapor yaz'
                  : 'Ör: Doktor randevusu'
            }
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>

        {/* --- Hedef için açıklama --------------------------------- */}
        {kind === 'goal' && (
          <div className="form-group">
            <label>Açıklama (opsiyonel)</label>
            <textarea
              className="goal-desc-input"
              placeholder="Bu hedefe ulaşmak ne anlama geliyor?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
            />
          </div>
        )}

        {/* --- Tarih ----------------------------------------------- */}
        <div className="form-group">
          <label>{kind === 'goal' ? 'Hedef Tarihi' : 'Tarih'}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        {/* --- Görev: Saatsiz toggle ------------------------------- */}
        {kind === 'task' && (
          <div className="toggle-row">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={allDay}
                onChange={e => setAllDay(e.target.checked)}
              />
              <span>Saatsiz görev (tüm gün)</span>
            </label>
          </div>
        )}

        {/* --- Etkinlik: Başlangıç + Bitiş saati ------------------- */}
        {kind === 'event' && (
          <>
            <div className="form-group">
              <label>Başlangıç Saati</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Bitiş Saati</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          </>
        )}

        {/* --- Görev: Saatli ise sadece başlangıç saati ------------ */}
        {kind === 'task' && !allDay && (
          <div className="form-group">
            <label>Başlangıç Saati</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            {taskTimeBlock && (
              <p className="time-preview">
                Bitiş ≈ <strong>{taskTimeBlock.end}</strong> (tahmini süreye göre)
              </p>
            )}
          </div>
        )}

        {/* --- Görev: Tahmini süre chip'leri ----------------------- */}
        {kind === 'task' && (
          <div className="form-group">
            <label>Tahmini Süre</label>
            <div className="estimated-chips">
              {ESTIMATED_MIN_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`estimated-chip${estimatedMin === opt.value ? ' active' : ''}`}
                  onClick={() => setEstimatedMin(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- Görev: Tekrar -------------------------------------- */}
        {kind === 'task' && (
          <div className="form-group">
            <label>Tekrar</label>
            <div className="estimated-chips">
              {RECURRENCE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`estimated-chip${recurrence === opt.value ? ' active' : ''}`}
                  onClick={() => setRecurrence(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- Ortak: Kategori chip'leri --------------------------- */}
        <div className="form-group">
          <label>Kategori</label>
          <div className="category-chips">
            {CATEGORY_OPTIONS.map(c => {
              const active = category === c;
              const color = EVENT_CATEGORY_COLORS[c];
              return (
                <button
                  key={c}
                  type="button"
                  className={`category-chip${active ? ' active' : ''}`}
                  onClick={() => setCategory(c)}
                  style={
                    active
                      ? {
                          borderColor: color,
                          background: color + '18',
                          color,
                        }
                      : undefined
                  }
                >
                  <span className="cat-icon">{EVENT_CATEGORY_ICONS[c]}</span>
                  <span>{EVENT_CATEGORY_LABELS[c]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Ortak: Önem ----------------------------------------- */}
        <div className="form-group">
          <label>Önem Seviyesi</label>
          <div className="importance-selector">
            {(['high', 'medium', 'low'] as const).map(imp => (
              <div
                key={imp}
                className={`imp-option ${imp === 'high' ? 'high' : imp === 'medium' ? 'med' : 'low'}${importance === imp ? ' selected' : ''}`}
                onClick={() => setImportance(imp)}
              >
                {imp === 'high' ? '🔴 Yüksek' : imp === 'medium' ? '🟠 Orta' : '🔵 Düşük'}
              </div>
            ))}
          </div>
        </div>

        <button className="modal-btn primary" onClick={handleAdd}>
          {kind === 'goal' ? '🎯 Hedef Oluştur' : kind === 'task' ? '✓ Görev Ekle' : '📅 Etkinlik Ekle'}
        </button>
      </div>
    </div>
  );
}
