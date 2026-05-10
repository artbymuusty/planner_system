'use client';

import { useState } from 'react';
import type { ModuleState } from '@/types';
import { formatDate } from '@/lib/dateUtils';
import { Droplets, Info, AlertTriangle, CheckCircle, Flame, Heart } from 'lucide-react';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onAddWater: (ml: number) => void;
  onDeleteWaterEntry: (index: number) => void;
  onSaveProfile: (h: number, w: number, a: number, gender: 'male' | 'female') => void;
}

export default function WaterOverlay({ active, modState, onClose, onAddWater, onDeleteWaterEntry, onSaveProfile }: Props) {
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
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Droplets className="text-blue-500" /> Su Takibi & Sağlık
        </h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card water-accent">
            <h3>💧 Günlük Su Durumu</h3>
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
                style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', background: '#f8fafc' }}
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
              />
              <button className="m-btn primary" onClick={() => { const v = parseInt(customAmount) || 0; if (v > 0) { onAddWater(v); setCustomAmount(''); } }}>Ekle</button>
            </div>

            <div className="water-history" style={{ marginTop: 20 }}>
               <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#64748b', marginBottom: 12 }}>Son Yudumlar</h4>
              {entries.length === 0
                ? <p style={{ color: '#cbd5e1', fontSize: '0.8rem', textAlign: 'center' }}>Henüz su içilmedi</p>
                : entries.map((e, idx) => ({ ...e, originalIndex: idx })).reverse().map((e) => (
                    <div key={e.originalIndex} className="water-history-item" style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: 10, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>+{e.amount}ml <span style={{ color: '#94a3b8', marginLeft: 4 }}>{e.time}</span></span>
                      <button onClick={() => onDeleteWaterEntry(e.originalIndex)} style={{ background: 'none', border: 'none', color: '#fecaca', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))
              }
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="module-card water-accent">
              <h3>📏 Vücut Bilgileri</h3>
              <div className="m-form-group"><label>Boy (cm)</label><input type="number" placeholder="ör: 175" value={profile.height} onChange={e => setProfile(p => ({ ...p, height: e.target.value }))} /></div>
              <div className="m-form-group"><label>Kilo (kg)</label><input type="number" placeholder="ör: 75" value={profile.weight} onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))} /></div>
              <button className="m-btn primary" onClick={handleSaveProfile} style={{ width: '100%', borderRadius: 12 }}>Hesapla & Kaydet</button>
              {bmiResult && <div className="bmi-result" style={{ marginTop: 12, padding: 12, background: '#e0f2fe', color: '#0369a1', borderRadius: 10, fontSize: '0.8rem', fontWeight: 800 }}>{bmiResult}</div>}
            </div>

            <div className="module-card" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
               <h3 style={{ color: '#0369a1', fontSize: '1rem' }}>💡 Su İçmenin Önemi</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                     <CheckCircle size={16} className="text-blue-500" />
                     <p style={{ fontSize: '0.75rem', color: '#0c4a6e', margin: 0 }}><strong>Yeterli Su:</strong> Enerji seviyesini artırır, cildi güzelleştirir ve odaklanmayı kolaylaştırır.</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                     <AlertTriangle size={16} className="text-amber-500" />
                     <p style={{ fontSize: '0.75rem', color: '#0c4a6e', margin: 0 }}><strong>Az Su:</strong> Baş ağrısı, yorgunluk ve kas kramplarına neden olabilir.</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                     <Heart size={16} className="text-rose-500" />
                     <p style={{ fontSize: '0.75rem', color: '#0c4a6e', margin: 0 }}><strong>Metabolizma:</strong> Su içmek sindirimi düzenler ve kilo kontrolüne yardımcı olur.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
