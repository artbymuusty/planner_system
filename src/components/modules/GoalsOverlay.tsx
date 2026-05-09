'use client';

import { useState } from 'react';
import type { Goal, ModuleState } from '@/types';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onAdd: (goal: Goal) => void;
  onUpdateProgress: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
}

const GOAL_ICONS = ['🎯', '📚', '🏃', '💪', '🧘', '🎨', '🎵', '💻', '✈️', '💰'];

export default function GoalsOverlay({ active, modState, onClose, onAdd, onUpdateProgress, onDelete }: Props) {
  const [form, setForm] = useState({ name: '', target: '', unit: '', step: '1', icon: '🎯' });

  const handleAdd = () => {
    if (!form.name || !form.target || !form.unit) { alert('Hedef adı, değer ve birim girin'); return; }
    const goal: Goal = {
      id: 'goal_' + Date.now(),
      name: form.name,
      target: parseFloat(form.target) || 1,
      current: 0,
      unit: form.unit,
      step: parseFloat(form.step) || 1,
      icon: form.icon,
    };
    onAdd(goal);
    setForm({ name: '', target: '', unit: '', step: '1', icon: '🎯' });
  };

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="goalsOverlay">
      <div className="module-header">
        <h2>🎯 Hedef Takibi</h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card goals-accent">
            <h3>Hedeflerim</h3>
            {modState.goals.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: 20 }}>Henüz hedef eklenmedi</p>
            ) : (
              modState.goals.map(g => {
                const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
                return (
                  <div key={g.id} className="goal-item">
                    <div className="goal-header">
                      <span className="goal-icon">{g.icon}</span>
                      <div className="goal-info">
                        <div className="goal-name">{g.name}</div>
                        <div className="goal-progress-text">{g.current} / {g.target} {g.unit}</div>
                      </div>
                      <div className="goal-pct">{pct}%</div>
                      <button className="goal-delete" onClick={() => onDelete(g.id)}>✕</button>
                    </div>
                    <div className="goal-bar-track">
                      <div className="goal-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="goal-btns">
                      <button className="goal-btn minus" onClick={() => onUpdateProgress(g.id, -g.step)}>-{g.step}</button>
                      <button className="goal-btn plus" onClick={() => onUpdateProgress(g.id, g.step)}>+{g.step}</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="module-card goals-accent">
            <h3>Yeni Hedef Ekle</h3>
            <div className="m-form-group">
              <label>İkon Seç</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {GOAL_ICONS.map(icon => (
                  <span
                    key={icon}
                    onClick={() => setForm(p => ({ ...p, icon }))}
                    style={{
                      fontSize: '1.4rem', cursor: 'pointer', padding: '4px 8px', borderRadius: 8,
                      background: form.icon === icon ? 'rgba(99,102,241,0.15)' : 'transparent',
                      border: form.icon === icon ? '2px solid #6366f1' : '2px solid transparent',
                    }}
                  >{icon}</span>
                ))}
              </div>
            </div>
            <div className="m-form-group"><label>Hedef Adı</label><input type="text" placeholder="ör: Kitap oku" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="m-form-group"><label>Hedef Değer</label><input type="number" placeholder="ör: 12" value={form.target} onChange={e => setForm(p => ({ ...p, target: e.target.value }))} /></div>
            <div className="m-form-group"><label>Birim</label><input type="text" placeholder="ör: kitap, km, saat" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} /></div>
            <div className="m-form-group"><label>Artış Adımı</label><input type="number" placeholder="ör: 1" value={form.step} onChange={e => setForm(p => ({ ...p, step: e.target.value }))} /></div>
            <button className="m-btn success" onClick={handleAdd} style={{ width: '100%' }}>🎯 Hedef Ekle</button>
          </div>
        </div>
      </div>
    </div>
  );
}
