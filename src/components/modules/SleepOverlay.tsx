'use client';

import { useState, useMemo } from 'react';
import type { SleepLog, ModuleState } from '@/types';
import { formatDate } from '@/lib/dateUtils';
import { Moon, Clock, TrendingUp, AlertCircle, CheckCircle2, Zap, Heart, Info } from 'lucide-react';

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

  const logs = useMemo(() => [...modState.sleep.logs].sort((a, b) => b.date.localeCompare(a.date)), [modState.sleep.logs]);
  const recent = logs.slice(0, 7);
  const avgDur = recent.length > 0 ? recent.reduce((s, l) => s + l.duration, 0) / recent.length : 0;
  const goalMin = modState.sleep.goalMin || 7;
  const goalMax = modState.sleep.goalMax || 9;

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="sleepOverlay">
      <div className="module-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Moon className="text-indigo-600" /> Uyku Takibi & Kalitesi
        </h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid" style={{ gridTemplateColumns: '1fr 340px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Analytics Card */}
            <div className="module-card sleep-accent" style={{ background: '#fff', padding: 24, borderRadius: 24 }}>
               <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                 <TrendingUp size={20} className="text-indigo-500" /> Haftalık Analiz
               </h3>
               
               <div className="sleep-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 30 }}>
                  <div style={{ background: '#f5f3ff', padding: 20, borderRadius: 20, textAlign: 'center' }}>
                     <div style={{ fontSize: '1.8rem', fontWeight: 950, color: '#5b21b6' }}>{avgDur.toFixed(1)}</div>
                     <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#7c3aed', opacity: 0.8 }}>ORTALAMA SAAT</div>
                  </div>
                  <div style={{ background: '#eff6ff', padding: 20, borderRadius: 20, textAlign: 'center' }}>
                     <div style={{ fontSize: '1.8rem', fontWeight: 950, color: '#1e40af' }}>{goalMin}-{goalMax}</div>
                     <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', opacity: 0.8 }}>İDEAL ARALIK</div>
                  </div>
                  <div style={{ background: '#fdf2f8', padding: 20, borderRadius: 20, textAlign: 'center' }}>
                     <div style={{ fontSize: '1.8rem', fontWeight: 950, color: '#9d174d' }}>%{Math.round((recent.filter(l => l.duration >= goalMin && l.duration <= goalMax).length / (recent.length || 1)) * 100)}</div>
                     <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#db2777', opacity: 0.8 }}>BAŞARI ORANI</div>
                  </div>
               </div>

               <div className="sleep-chart" style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 12, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                  {[...recent].reverse().map(log => {
                    const h = (log.duration / 12) * 100;
                    const ok = log.duration >= goalMin && log.duration <= goalMax;
                    return (
                      <div key={log.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                         <div style={{ width: '100%', height: `${h}%`, background: ok ? '#818cf8' : '#fda4af', borderRadius: '8px 8px 4px 4px', position: 'relative', minHeight: 20 }} title={`${log.date}: ${log.duration} saat`}>
                            <span style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 900, color: '#64748b' }}>{log.duration}h</span>
                         </div>
                         <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8' }}>{log.date.slice(5)}</span>
                      </div>
                    );
                  })}
                  {recent.length === 0 && <p style={{ width: '100%', textAlign: 'center', color: '#cbd5e1', paddingBottom: 60 }}>Henüz yeterli veri yok.</p>}
               </div>
            </div>

            {/* Health Tips */}
            <div className="module-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
               <div className="module-card" style={{ background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
                  <h4 style={{ color: '#5b21b6', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}><Heart size={16} /> Verimli Uyku İçin</h4>
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '0.75rem', color: '#4c1d95', display: 'flex', flexDirection: 'column', gap: 8 }}>
                     <li>✨ Yatmadan 30dk önce ekranı bırakın.</li>
                     <li>🛌 Karanlık ve serin bir oda tercih edin.</li>
                     <li>🧘 Akşam saatlerinde kafeinden kaçının.</li>
                  </ul>
               </div>
               <div className="module-card" style={{ background: '#fff7ed', border: '1px solid #ffedd5' }}>
                  <h4 style={{ color: '#92400e', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={16} /> Eksik Uykunun Etkisi</h4>
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none', fontSize: '0.75rem', color: '#78350f', display: 'flex', flexDirection: 'column', gap: 8 }}>
                     <li>⚠️ Odaklanma ve hafıza problemleri.</li>
                     <li>⚠️ Gün içi yorgunluk ve stres artışı.</li>
                     <li>⚠️ Bağışıklık sisteminin zayıflaması.</li>
                  </ul>
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
             {/* Log Card */}
             <div className="module-card sleep-accent">
                <h3>😴 Uyku Kaydı</h3>
                <div className="m-form-group"><label>Tarih</label><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
                <div className="m-form-group"><label>Uyuma Saati</label><input type="time" value={form.sleepTime} onChange={e => setForm(p => ({ ...p, sleepTime: e.target.value }))} /></div>
                <div className="m-form-group"><label>Uyanma Saati</label><input type="time" value={form.wakeTime} onChange={e => setForm(p => ({ ...p, wakeTime: e.target.value }))} /></div>
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 16, marginTop: 10, textAlign: 'center' }}>
                   <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 800 }}>TOPLAM SÜRE</span>
                   <div style={{ fontSize: '1.5rem', fontWeight: 950, color: '#1e293b' }}>{calcDuration(form.sleepTime, form.wakeTime)} Saat</div>
                </div>
                <button className="m-btn success" onClick={handleAdd} style={{ width: '100%', height: 48, borderRadius: 12, marginTop: 16 }}>Kaydet</button>
             </div>

             {/* Recent Logs List */}
             <div className="module-card" style={{ flex: 1, overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1rem' }}>Son Kayıtlar</h3>
                {logs.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', marginTop: 30 }}>Kayıt bulunamadı.</p>
                ) : (
                  logs.slice(0, 10).map(l => (
                    <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                       <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{l.date}</div>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{l.sleepTime} - {l.wakeTime}</div>
                       </div>
                       <div style={{ fontWeight: 950, color: l.duration >= goalMin && l.duration <= goalMax ? '#10b981' : '#f43f5e' }}>{l.duration}s</div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
