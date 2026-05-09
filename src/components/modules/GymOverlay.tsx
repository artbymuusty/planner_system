'use client';

import { useState } from 'react';
import type { ModuleState, GymExercise, GymProgram } from '@/types';
import { DAYS_SHORT } from '@/lib/constants';
import { formatDate } from '@/lib/dateUtils';

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
    name: 'Push/Pull/Legs',
    desc: 'Klasik 3 günlük program. İtme, çekme ve bacak günleri ile kasları hedefleyin.',
    badge: '3 Gün',
    exercises: [
      { id: '', day: 'Pzt', name: 'Bench Press', sets: 4, reps: 8, muscle: 'Göğüs' },
      { id: '', day: 'Pzt', name: 'Overhead Press', sets: 3, reps: 10, muscle: 'Omuz' },
      { id: '', day: 'Pzt', name: 'Tricep Pushdown', sets: 3, reps: 12, muscle: 'Tricep' },
      { id: '', day: 'Çar', name: 'Barbell Row', sets: 4, reps: 8, muscle: 'Sırt' },
      { id: '', day: 'Çar', name: 'Pull-up', sets: 3, reps: 10, muscle: 'Sırt' },
      { id: '', day: 'Çar', name: 'Bicep Curl', sets: 3, reps: 12, muscle: 'Bicep' },
      { id: '', day: 'Cum', name: 'Squat', sets: 4, reps: 8, muscle: 'Bacak' },
      { id: '', day: 'Cum', name: 'Leg Press', sets: 3, reps: 10, muscle: 'Bacak' },
      { id: '', day: 'Cum', name: 'Calf Raise', sets: 4, reps: 15, muscle: 'Baldır' },
    ],
  },
  {
    name: 'Full Body',
    desc: 'Haftada 3 gün tüm vücudu çalıştıran başlangıç dostu program.',
    badge: '3 Gün • Başlangıç',
    exercises: [
      { id: '', day: 'Pzt', name: 'Squat', sets: 3, reps: 10, muscle: 'Bacak' },
      { id: '', day: 'Pzt', name: 'Bench Press', sets: 3, reps: 10, muscle: 'Göğüs' },
      { id: '', day: 'Çar', name: 'Deadlift', sets: 3, reps: 8, muscle: 'Sırt' },
      { id: '', day: 'Çar', name: 'Overhead Press', sets: 3, reps: 10, muscle: 'Omuz' },
      { id: '', day: 'Cum', name: 'Leg Press', sets: 3, reps: 12, muscle: 'Bacak' },
      { id: '', day: 'Cum', name: 'Plank', sets: 3, reps: 30, muscle: 'Core' },
    ],
  },
  {
    name: 'Upper/Lower',
    desc: '4 günlük üst/alt beden bölünmesi. Orta seviye için ideal.',
    badge: '4 Gün • Orta',
    exercises: [
      { id: '', day: 'Pzt', name: 'Bench Press', sets: 4, reps: 8, muscle: 'Göğüs' },
      { id: '', day: 'Pzt', name: 'Barbell Row', sets: 4, reps: 8, muscle: 'Sırt' },
      { id: '', day: 'Sal', name: 'Squat', sets: 4, reps: 8, muscle: 'Bacak' },
      { id: '', day: 'Sal', name: 'Leg Curl', sets: 3, reps: 12, muscle: 'Hamstring' },
      { id: '', day: 'Per', name: 'Overhead Press', sets: 4, reps: 8, muscle: 'Omuz' },
      { id: '', day: 'Per', name: 'Pull-up', sets: 3, reps: 10, muscle: 'Sırt' },
      { id: '', day: 'Cum', name: 'Front Squat', sets: 3, reps: 10, muscle: 'Bacak' },
      { id: '', day: 'Cum', name: 'Calf Raise', sets: 4, reps: 15, muscle: 'Baldır' },
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

  const today = formatDate(new Date());
  const todayDay = DAYS_SHORT[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const activeProgram = modState.gym.programs.find(p => p.id === modState.gym.activeProgram);
  const todayExercises = activeProgram ? activeProgram.exercises.filter(e => e.day === todayDay) : [];
  const logKey = today;
  const exerciseLog = modState.gym.exerciseLog;

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="gymOverlay">
      <div className="module-header">
        <h2>🏋️ Gym Takibi</h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card gym-accent">
            <h3>Programlarım</h3>
            <div className="program-cards" id="gymProgramCards">
              {modState.gym.programs.length === 0
                ? <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Henüz program eklenmedi. Şablonlardan birini seçin.</p>
                : modState.gym.programs.map(p => (
                    <div
                      key={p.id}
                      className={`program-card${modState.gym.activeProgram === p.id ? ' active' : ''}`}
                      onClick={() => onSetActiveProgram(p.id)}
                    >
                      <div className="prog-name">{p.name}</div>
                      <div className="prog-days">{[...new Set(p.exercises.map(e => e.day))].join(', ')}</div>
                      <div className="prog-count">{p.exercises.length} hareket</div>
                    </div>
                  ))
              }
            </div>
          </div>
          <div className="module-card gym-accent">
            <h3>Hareket Ekle</h3>
            <div className="m-form-group"><label>Hareket Adı</label><input type="text" placeholder="ör: Bench Press" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="m-form-group"><label>Kas Grubu</label><input type="text" placeholder="ör: Göğüs" value={form.muscle} onChange={e => setForm(p => ({ ...p, muscle: e.target.value }))} /></div>
            <div className="gym-form-row">
              <div className="m-form-group"><label>Set</label><input type="number" value={form.sets} onChange={e => setForm(p => ({ ...p, sets: e.target.value }))} /></div>
              <div className="m-form-group"><label>Tekrar</label><input type="number" value={form.reps} onChange={e => setForm(p => ({ ...p, reps: e.target.value }))} /></div>
            </div>
            <div className="m-form-group">
              <label>Gün</label>
              <select value={form.day} onChange={e => setForm(p => ({ ...p, day: e.target.value }))}>
                {[['Pzt','Pazartesi'],['Sal','Salı'],['Çar','Çarşamba'],['Per','Perşembe'],['Cum','Cuma'],['Cmt','Cumartesi'],['Paz','Pazar']].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <button className="m-btn success" onClick={handleAddExercise} style={{ width: '100%' }}>➕ Hareket Ekle</button>
          </div>
        </div>

        <div className="module-card gym-accent" style={{ marginTop: 20 }}>
          <h3>Bugünkü Antrenman</h3>
          <div className="exercise-list" id="gymExerciseList">
            {!activeProgram
              ? <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>Aktif program seçilmedi</p>
              : todayExercises.length === 0
                ? <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>Bugün ({todayDay}) antrenman yok</p>
                : todayExercises.map((ex, i) => {
                    const key = `${activeProgram.id}_${i}`;
                    const done = !!(exerciseLog as Record<string, unknown>)[key];
                    return (
                      <div key={i} className={`exercise-item${done ? ' done' : ''}`}>
                        <span className="ex-muscle">{ex.muscle}</span>
                        <div className="ex-info">
                          <div className="ex-name">{ex.name}</div>
                          <div className="ex-detail">{ex.sets} set × {ex.reps} tekrar</div>
                        </div>
                        <button className={`ex-check${done ? ' checked' : ''}`} onClick={() => onToggleExercise(key)}>{done ? '✓' : ''}</button>
                      </div>
                    );
                  })
            }
          </div>
        </div>

        <div className="module-card" style={{ marginTop: 20 }}>
          <h3>📋 Hazır Program Şablonları</h3>
          <div className="template-cards">
            {GYM_TEMPLATES.map((tmpl, i) => (
              <div key={i} className="template-card" onClick={() => onUseTemplate(tmpl.exercises, tmpl.name)}>
                <div className="tmpl-name">💪 {tmpl.name}</div>
                <div className="tmpl-desc">{tmpl.desc}</div>
                <span className="tmpl-badge">{tmpl.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
