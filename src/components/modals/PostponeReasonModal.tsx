'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/dateUtils';

interface Props {
  open: boolean;
  eventName: string;
  postponeCount: number;
  onConfirm: (reason: string, newDate: string) => void;
  onCancel: () => void;
}

const REASON_OPTIONS = [
  { value: 'too_big', emoji: '😰', label: 'Çok büyük/karmaşık' },
  { value: 'no_time', emoji: '⏰', label: 'Zamanım yetmedi' },
  { value: 'dont_know', emoji: '🤷', label: 'Nereden başlayacağımı bilmiyorum' },
  { value: 'no_energy', emoji: '😴', label: 'Enerjim yoktu' },
  { value: 'priorities', emoji: '🔄', label: 'Öncelikler değişti' },
  { value: 'other', emoji: '📝', label: 'Diğer' },
];

export default function PostponeReasonModal({ open, eventName, postponeCount, onConfirm, onCancel }: Props) {
  const [selectedReason, setSelectedReason] = useState('');
  const [newDate, setNewDate] = useState(formatDate(new Date()));

  const handleConfirm = () => {
    if (!selectedReason) { alert('Lütfen bir erteleme nedeni seçin'); return; }
    if (!newDate) { alert('Lütfen yeni tarih seçin'); return; }
    onConfirm(selectedReason, newDate);
    setSelectedReason('');
    setNewDate(formatDate(new Date()));
  };

  if (!open) return null;

  return (
    <div className="modal-overlay active" id="postponeReasonModal" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal pp-modal" style={{ position: 'relative' }}>
        <button className="modal-close" onClick={onCancel}>✕</button>
        <h2>🔄 Görevi Ertele</h2>
        <p className="pp-task-name"><strong>{eventName}</strong></p>
        {postponeCount > 1 && (
          <div className="pp-count-info">
            <span className="pp-warning-icon">⚠️</span> Bu görev <strong className="pp-count">{postponeCount}</strong>. kez erteleniyor!
          </div>
        )}
        <p className="pp-question">Neden erteliyorsun?</p>
        <div className="pp-reason-options">
          {REASON_OPTIONS.map(opt => (
            <div
              key={opt.value}
              className={`pp-reason-option${selectedReason === opt.value ? ' selected' : ''}`}
              onClick={() => setSelectedReason(opt.value)}
            >
              <span className="pp-reason-emoji">{opt.emoji}</span>
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Yeni Tarih</label>
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
        </div>
        <div className="confirm-btns">
          <button className="modal-btn primary" onClick={handleConfirm}>🔄 Ertele & Taşı</button>
          <button className="modal-btn secondary" onClick={onCancel}>İptal</button>
        </div>
      </div>
    </div>
  );
}
