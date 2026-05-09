'use client';

import { useState } from 'react';
import type { ModuleState } from '@/types';
import { formatDate } from '@/lib/dateUtils';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onAddWater: (ml: number) => void;
  onSaveProfile: (h: number, w: number, a: number, gender: 'male' | 'female') => void;
}

export default function WaterOverlay({ active, modState, onClose, onAddWater, onSaveProfile }: Props) {
  const [customAmount, setCustomAmount] = useState('');
  const [profile, setProfile] = useState({
    height: String(modState.water.height || ''),
    weight: String(modState.water.weight || ''),
    age: String(modState.water.age || ''),
    gender: modState.water.gender || 'male' as 'male' | 'female',
  });
  const [bmiResult, setBmiResult] = useState('');

  const today = formatDate(new Date());
  const consumed = modState.water.log[today]?.total || 0;
  const goal = modState.water.dailyGoal || 2500;
  const pct = Math.min(Math.round((consumed / goal) * 100), 100);
  const entries = modState.water.log[today]?.entries || [];

  const handleSaveProfile = () => {
    const h = parseFloat(profile.height) || 0;
    const w = parseFloat(profile.weight) || 0;
    const a = parseInt(profile.age) || 0;
    if (!h || !w || !a) { alert('Lütfen tüm bilgileri girin'); return; }
    onSaveProfile(h, w, a, profile.gender);
    const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
    const newGoal = Math.round((w * 35 + (profile.gender === 'male' ? 500 : 300)) / 100) * 100;
    setBmiResult(`BMI: ${bmi} • Günlük Su Hedefi: ${newGoal} ml`);
  };

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="waterOverlay">
      <div className="module-header">
        <h2>💧 Su Takibi</h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card water-accent">
            <h3>Günlük Su Durumu</h3>
            <div className="water-visual">
              <div style={{ position: 'relative' }}>
                <div className="water-bottle">
                  <div className="water-bottle-neck" />
                  <div className="water-fill" style={{ height: `${pct}%` }} />
                </div>
              </div>
              <div className="water-stats">
                <div className="current">{(consumed / 1000).toFixed(1)}L</div>
                <div className="goal">/ {(goal / 1000).toFixed(1)}L</div>
                <div className="percent">{pct}%</div>
              </div>
            </div>
            <div className="water-quick-btns">
              {[200, 250, 500, 1000].map(ml => (
                <button key={ml} className="water-add-btn" onClick={() => onAddWater(ml)}>
                  +{ml >= 1000 ? '1L' : `${ml}ml`}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input
                type="number"
                className="water-custom-input"
                placeholder="Özel miktar (ml)"
                style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter', fontSize: '0.85rem' }}
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
              />
              <button className="m-btn primary" onClick={() => { const v = parseInt(customAmount) || 0; if (v > 0) { onAddWater(v); setCustomAmount(''); } }}>Ekle</button>
            </div>
            <div className="water-history" style={{ marginTop: 14 }}>
              {entries.length === 0
                ? <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center' }}>Bugün henüz su içilmedi</p>
                : [...entries].reverse().map((e, i) => (
                    <div key={i} className="water-history-item">
                      <span className="time">{e.time}</span>
                      <span className="amount">+{e.amount}ml</span>
                    </div>
                  ))
              }
            </div>
          </div>
          <div className="module-card water-accent">
            <h3>Vücut Bilgileri</h3>
            <div className="m-form-group"><label>Boy (cm)</label><input type="number" placeholder="ör: 175" value={profile.height} onChange={e => setProfile(p => ({ ...p, height: e.target.value }))} /></div>
            <div className="m-form-group"><label>Kilo (kg)</label><input type="number" placeholder="ör: 75" value={profile.weight} onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))} /></div>
            <div className="m-form-group"><label>Yaş</label><input type="number" placeholder="ör: 25" value={profile.age} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} /></div>
            <div className="m-form-group">
              <label>Cinsiyet</label>
              <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value as 'male' | 'female' }))}>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>
            </div>
            <button className="m-btn primary" onClick={handleSaveProfile} style={{ width: '100%' }}>Hesapla & Kaydet</button>
            {bmiResult && <div className="bmi-result" style={{ display: 'block' }}>{bmiResult}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
