'use client';

import { useState, useEffect } from 'react';
import type { PlannerEvent } from '@/types';

interface Props {
  open: boolean;
  event: PlannerEvent | null;
  onConfirm: (subTaskNames: string[]) => void;
  onCancel: () => void;
}

const HINT_SETS = [
  ['Araştırma yap', 'Taslak hazırla', 'İçerik yaz', 'Son kontrol'],
  ['Başlıkları belirle', 'Ana kısmı yaz', 'Detayları ekle', 'Gözden geçir'],
  ['Malzemeleri hazırla', 'İlk adım', 'Devam et', 'Bitir'],
];

function getHint(idx: number): string {
  const set = HINT_SETS[Math.floor(Math.random() * HINT_SETS.length)];
  return set[idx] || `Adım ${idx + 1}`;
}

export default function SplitTaskModal({ open, event, onConfirm, onCancel }: Props) {
  const [inputs, setInputs] = useState<string[]>(['', '', '']);

  useEffect(() => {
    if (!event) return;
    const [sh, sm] = event.startTime.split(':').map(Number);
    const [eh, em] = event.endTime.split(':').map(Number);
    const totalMin = (eh * 60 + em) - (sh * 60 + sm);
    const parts = totalMin > 90 ? 4 : totalMin > 60 ? 3 : 2;
    setInputs(Array(parts).fill(''));
  }, [event]);

  if (!open || !event) return null;

  const [sh, sm] = event.startTime.split(':').map(Number);
  const [eh, em] = event.endTime.split(':').map(Number);
  const totalMin = (eh * 60 + em) - (sh * 60 + sm);
  const parts = inputs.length;

  const handleConfirm = () => {
    const names = inputs.map(s => s.trim()).filter(Boolean);
    if (names.length < 2) { alert('En az 2 alt görev girin'); return; }
    onConfirm(inputs.map(s => s.trim()));
  };

  return (
    <div className="modal-overlay active" id="splitTaskModal" onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal pp-modal" style={{ position: 'relative' }}>
        <button className="modal-close" onClick={onCancel}>✕</button>
        <h2>✂️ Görevi Parçalara Böl</h2>
        <div className="split-task-info">
          <p>Ana görev: <strong>{event.name}</strong></p>
          <p className="split-meta">⏱️ Süre: {totalMin} dk · 🔄 {event.postponeCount || 0}x ertelendi</p>
          <p className="split-suggestion">{parts} parçaya bölmeyi öneriyoruz (her biri ~{Math.round(totalMin / parts)} dk)</p>
        </div>
        <div className="split-subtask-list">
          {inputs.map((val, i) => (
            <div key={i} className="split-input-row">
              <span className="split-num">{i + 1}.</span>
              <input
                type="text"
                className="split-subtask-input"
                placeholder={`Alt görev adı (ör: ${getHint(i)})`}
                value={val}
                onChange={e => setInputs(prev => prev.map((v, j) => j === i ? e.target.value : v))}
              />
              {inputs.length > 2 && (
                <button className="split-remove-btn" onClick={() => setInputs(prev => prev.filter((_, j) => j !== i))}>✕</button>
              )}
            </div>
          ))}
        </div>
        <button className="split-add-more" onClick={() => setInputs(prev => [...prev, ''])}>+ Alt Görev Ekle</button>
        <div className="confirm-btns" style={{ marginTop: 16 }}>
          <button className="modal-btn primary" onClick={handleConfirm}>✂️ Parçalara Böl</button>
          <button className="modal-btn secondary" onClick={onCancel}>İptal</button>
        </div>
      </div>
    </div>
  );
}
