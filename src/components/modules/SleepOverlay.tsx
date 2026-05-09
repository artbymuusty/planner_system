'use client';

import { useState } from 'react';
import type { SleepLog, ModuleState } from '@/types';
import { formatDate } from '@/lib/dateUtils';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onAddLog: (log: SleepLog) => void;
}

function calcDuration(sleepTime: string, wakeTime: string): number {
  const [sh, sm] = sleepTime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let mins = (wh * 60 + wm) - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

export default function SleepOverlay({ active, modState, onClose, onAddLog }: Props) {
  const [form, setForm] = useState({ date: formatDate(new Date()), sleepTime: '23:00', wakeTime: '07:00' });

  const handleAdd = () => {
    const dur = calcDuration(form.sleepTime, form.wakeTime);
    const log: SleepLog = {
      id: 'sleep_' + Date.now(),
      date: form.date,
      sleepTime: form.sleepTime,
      wakeTime: form.wakeTime,
      duration: dur,
    };
    onAddLog(log);
  };

  const recent = [...modState.sleep.logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  const avgDur = recent.length > 0 ? recent.reduce((s, l) => s + l.duration, 0) / recent.length : 0;
  const goalMin = modState.sleep.goalMin;
  const goalMax = modState.sleep.goalMax;

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="sleepOverlay">
      <div className="module-header">
        <h2>😴 Uyku Takibi</h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card sleep-accent">
            <h3>Uyku Durumu</h3>
            <div className="sleep-stats">
              <div className="sleep-stat">
                <div className="ss-value">{avgDur > 0 ? avgDur.toFixed(1) : '--'}</div>
                <div className="ss-label">Ort. Saat</div>
              </div>
              <div className="sleep-stat">
                <div className="ss-value">{goalMin}-{goalMax}</div>
                <div className="ss-label">Hedef</div>
              </div>
              <div className="sleep-stat">
                <div className="ss-value">{recent.length}</div>
                <div className="ss-label">Kayıt</div>
              </div>
            </div>
            <div className="sleep-bars" style={{ marginTop: 16 }}>
              {recent.map(log => {
                const pct = Math.min((log.duration / (goalMax + 2)) * 100, 100);
                const ok = log.duration >= goalMin && log.duration <= goalMax;
                return (
                  <div key={log.id} className="sleep-bar-row">
                    <span className="sleep-bar-date">{log.date.slice(5)}</span>
                    <div className="sleep-bar-track">
                      <div
                        className={`sleep-bar-fill ${ok ? 'good' : 'bad'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="sleep-bar-val">{log.duration}s</span>
                  </div>
                );
              })}
              {recent.length === 0 && <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>Henüz kayıt yok</p>}
            </div>
          </div>
          <div className="module-card sleep-accent">
            <h3>Uyku Kaydı Ekle</h3>
            <div className="m-form-group"><label>Tarih</label><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
            <div className="m-form-group"><label>Uyuma Saati</label><input type="time" value={form.sleepTime} onChange={e => setForm(p => ({ ...p, sleepTime: e.target.value }))} /></div>
            <div className="m-form-group"><label>Uyanma Saati</label><input type="time" value={form.wakeTime} onChange={e => setForm(p => ({ ...p, wakeTime: e.target.value }))} /></div>
            <div className="sleep-preview">
              Toplam: <strong>{calcDuration(form.sleepTime, form.wakeTime)} saat</strong>
              {' '}{calcDuration(form.sleepTime, form.wakeTime) >= goalMin && calcDuration(form.sleepTime, form.wakeTime) <= goalMax ? '✅' : '⚠️'}
            </div>
            <button className="m-btn success" onClick={handleAdd} style={{ width: '100%', marginTop: 12 }}>😴 Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  );
}
