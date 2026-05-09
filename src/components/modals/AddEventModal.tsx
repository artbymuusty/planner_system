'use client';

import { useState } from 'react';
import type { PlannerEvent } from '@/types';
import { formatDate } from '@/lib/dateUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (event: PlannerEvent) => void;
}

export default function AddEventModal({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(formatDate(new Date()));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [importance, setImportance] = useState<'high' | 'medium' | 'low'>('high');

  const handleAdd = () => {
    if (!name.trim()) { alert('Lütfen etkinlik adı girin'); return; }
    if (!date) { alert('Lütfen tarih seçin'); return; }
    if (!startTime || !endTime) { alert('Lütfen saat belirleyin'); return; }
    if (startTime >= endTime) { alert('Bitiş saati başlangıçtan sonra olmalı'); return; }

    const ev: PlannerEvent = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
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
    };
    onAdd(ev);
    setName('');
    setDate(formatDate(new Date()));
    setStartTime('09:00');
    setEndTime('10:00');
    setImportance('high');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay active" id="addEventModal" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ position: 'relative' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>📅 Etkinlik Ekle</h2>
        <div className="form-group">
          <label>Etkinlik Adı</label>
          <input type="text" placeholder="Etkinlik adını girin" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className="form-group">
          <label>Tarih</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Başlangıç Saati</label>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Bitiş Saati</label>
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
        </div>
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
        <button className="modal-btn primary" onClick={handleAdd}>Etkinlik Ekle</button>
      </div>
    </div>
  );
}
