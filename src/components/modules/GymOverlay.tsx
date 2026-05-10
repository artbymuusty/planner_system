'use client';

import { useState } from 'react';
import type { ModuleState, GymExercise, GymProgram } from '@/types';
import { DAYS_SHORT } from '@/lib/constants';
import { formatDate } from '@/lib/dateUtils';
import { Dumbbell, Plus, List, CheckCircle2, TrendingUp, Info, Calendar } from 'lucide-react';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onAddExercise: (ex: GymExercise) => void;
  onUseTemplate: (exercises: GymExercise[], name: string) => void;
  onToggleExercise: (key: string) => void;
  onSetActiveProgram: (id: string) => void;
}

const GYM_TEMPLATES = [
  {
    name: 'Push/Pull/Legs (İtme/Çekme/Bacak)',
    desc: 'Kas gruplarını fonksiyonel olarak bölen en popüler program.',
    badge: '3-6 Gün',
    exercises: [
      { id: '', day: 'Pzt', name: 'Bench Press', sets: 4, reps: 8, muscle: 'Göğüs' },
      { id: '', day: 'Pzt', name: 'Overhead Press', sets: 3, reps: 10, muscle: 'Omuz' },
      { id: '', day: 'Sal', name: 'Barbell Row', sets: 4, reps: 8, muscle: 'Sırt' },
      { id: '', day: 'Sal', name: 'Bicep Curl', sets: 3, reps: 12, muscle: 'Bicep' },
      { id: '', day: 'Çar', name: 'Squat', sets: 4, reps: 8, muscle: 'Bacak' },
    ],
  },
  {
    name: 'Tüm Vücut (Full Body)',
    desc: 'Haftada 3 gün tüm vücudu çalıştıran başlangıç dostu program.',
    badge: '3 Gün • Başlangıç',
    exercises: [
      { id: '', day: 'Pzt', name: 'Squat', sets: 3, reps: 10, muscle: 'Bacak' },
      { id: '', day: 'Pzt', name: 'Bench Press', sets: 3, reps: 10, muscle: 'Göğüs' },
      { id: '', day: 'Pzt', name: 'Barbell Row', sets: 3, reps: 10, muscle: 'Sırt' },
    ],
  },
  {
    name: 'Evde Egzersiz (Ekipmansız)',
    desc: 'Ekipman gerektirmeyen, vücut ağırlığı ile yapılan antrenman.',
    badge: 'Her Gün • Ev',
    exercises: [
      { id: '', day: 'Pzt', name: 'Şınav (Push-up)', sets: 3, reps: 15, muscle: 'Göğüs' },
      { id: '', day: 'Pzt', name: 'Mekik (Crunch)', sets: 3, reps: 20, muscle: 'Karın' },
      { id: '', day: 'Pzt', name: 'Plank', sets: 3, reps: 45, muscle: 'Core' },
    ],
  },
  {
    name: 'Kardiyo & Yağ Yakımı',
    desc: 'Kalp sağlığı ve yağ yakımı odaklı yüksek tempolu program.',
    badge: '2-3 Gün',
    exercises: [
      { id: '', day: 'Sal', name: 'Koşu', sets: 1, reps: 30, muscle: 'Kardiyo' },
      { id: '', day: 'Per', name: 'İp Atlama', sets: 5, reps: 100, muscle: 'Kardiyo' },
    ],
  },
];

export default function GymOverlay({ active, modState, onClose, onAddExercise, onUseTemplate, onToggleExercise, onSetActiveProgram }: Props) {
  const [form, setForm] = useState({ name: '', muscle: '', sets: '3', reps: '10', day: 'Pzt' });

  const handleAddExercise = () => {
    if (!form.name || !form.muscle) { alert('Hareket adı ve kas grubu girin'); return; }
    const ex: GymExercise = {
      id: 'ex_' + Date.now(),
      name: form.name,
      muscle: form.muscle,
      sets: parseInt(form.sets) || 3,
      reps: parseInt(form.reps) || 10,
      day: form.day,
    };
    onAddExercise(ex);
    setForm(p => ({ ...p, name: '', muscle: '' }));
  };

  const todayDay = DAYS_SHORT[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const activeProgram = modState.gym.programs.find(p => p.id === modState.gym.activeProgram);
  const todayExercises = activeProgram ? activeProgram.exercises.filter(e => e.day === todayDay) : [];
  const exerciseLog = modState.gym.exerciseLog;

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="gymOverlay">
      <div className="module-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Dumbbell className="text-orange-500" /> Spor Takibi
        </h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          {/* Programs List */}
          <div className="module-card gym-accent">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><List size={18} /> Programlarım</h3>
            <div className="program-cards">
              {modState.gym.programs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', opacity: 0.5 }}>
                   <Info size={32} style={{ margin: '0 auto 10px' }} />
                   <p style={{ fontSize: '0.85rem' }}>Henüz program yok. Aşağıdaki şablonları kullanabilirsin.</p>
                </div>
              ) : (
                modState.gym.programs.map(p => (
                  <div
                    key={p.id}
                    className={`program-card${modState.gym.activeProgram === p.id ? ' active' : ''}`}
                    onClick={() => onSetActiveProgram(p.id)}
                    style={{ 
                      padding: 16, borderRadius: 16, border: '1px solid #f1f5f9', cursor: 'pointer', marginBottom: 10,
                      background: modState.gym.activeProgram === p.id ? '#fff7ed' : '#fff',
                      borderColor: modState.gym.activeProgram === p.id ? '#ffedd5' : '#f1f5f9'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#1e293b' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                       {p.exercises.length} Hareket • {[...new Set(p.exercises.map(e => e.day))].join(', ')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Exercise */}
          <div className="module-card gym-accent">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Plus size={18} /> Hareket Ekle</h3>
            <div className="m-form-group"><label>Hareket Adı</label><input type="text" placeholder="ör: Bench Press" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="m-form-group"><label>Kas Grubu</label><input type="text" placeholder="ör: Göğüs" value={form.muscle} onChange={e => setForm(p => ({ ...p, muscle: e.target.value }))} /></div>
            <div className="gym-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="m-form-group"><label>Set</label><input type="number" value={form.sets} onChange={e => setForm(p => ({ ...p, sets: e.target.value }))} /></div>
              <div className="m-form-group"><label>Tekrar</label><input type="number" value={form.reps} onChange={e => setForm(p => ({ ...p, reps: e.target.value }))} /></div>
            </div>
            <div className="m-form-group">
              <label>Antrenman Günü</label>
              <select value={form.day} onChange={e => setForm(p => ({ ...p, day: e.target.value }))}>
                {[['Pzt','Pazartesi'],['Sal','Salı'],['Çar','Çarşamba'],['Per','Perşembe'],['Cum','Cuma'],['Cmt','Cumartesi'],['Paz','Pazar']].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <button className="m-btn success" onClick={handleAddExercise} style={{ width: '100%', borderRadius: 12, height: 48 }}>Antrenmana Ekle</button>
          </div>
        </div>

        {/* Today's Workout */}
        <div className="module-card gym-accent" style={{ marginTop: 20 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={18} /> Bugünü Tamamla ({todayDay})</h3>
          <div className="exercise-list">
            {!activeProgram ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: 30 }}>Program seçerek antrenmana başla.</p>
            ) : todayExercises.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: 30 }}>Bugün için planlanmış bir hareket yok. Dinlenme günü!</p>
            ) : (
              todayExercises.map((ex, i) => {
                const key = `${activeProgram.id}_${i}`;
                const done = !!(exerciseLog as Record<string, unknown>)[key];
                return (
                  <div key={i} className={`exercise-item${done ? ' done' : ''}`} style={{ 
                    display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: done ? '#f0fdf4' : '#f8fafc', 
                    borderRadius: 16, marginBottom: 10, border: '1px solid', borderColor: done ? '#dcfce7' : '#f1f5f9'
                  }}>
                    <div style={{ background: done ? '#10b981' : '#f97316', color: 'white', width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                       {ex.muscle[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 800, color: '#1e293b' }}>{ex.name}</div>
                       <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{ex.sets} Set × {ex.reps} Tekrar</div>
                    </div>
                    <button className={`ex-check${done ? ' checked' : ''}`} onClick={() => onToggleExercise(key)} style={{ 
                       width: 32, height: 32, borderRadius: '50%', border: '2px solid #cbd5e1', 
                       background: done ? '#10b981' : 'transparent',
                       borderColor: done ? '#10b981' : '#cbd5e1',
                       color: 'white', fontWeight: 900
                    }}>{done ? '✓' : ''}</button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Templates */}
        <div className="module-card" style={{ marginTop: 20 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={18} /> Hazır Programlar</h3>
          <div className="template-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16, marginTop: 12 }}>
            {GYM_TEMPLATES.map((tmpl, i) => (
              <div key={i} className="template-card" onClick={() => onUseTemplate(tmpl.exercises, tmpl.name)} style={{ 
                padding: 20, borderRadius: 20, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s'
              }}>
                <div style={{ fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>{tmpl.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4, marginBottom: 12 }}>{tmpl.desc}</div>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, background: '#eef2ff', color: '#4f46e5', padding: '4px 10px', borderRadius: 8 }}>{tmpl.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
