'use client';

import { useState } from 'react';
import type { Medicine, ModuleState } from '@/types';
import { DAYS_SHORT } from '@/lib/constants';
import { formatDate, getWeekDates } from '@/lib/dateUtils';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onAdd: (med: Medicine) => void;
  onDelete: (id: string) => void;
  onToggleTaken: (medId: string, date: string, freq: string) => void;
  currentWeekStart: Date;
}

const FREQ_OPTIONS = ['Sabah', 'Öğle', 'Akşam'];
const DAY_OPTIONS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export default function MedicineOverlay({ active, modState, onClose, onAdd, onDelete, onToggleTaken, currentWeekStart }: Props) {
  const [form, setForm] = useState({ name: '', dosage: '', startDate: '', duration: '', boxSize: '', remaining: '' });
  const [selectedFreq, setSelectedFreq] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleAdd = () => {
    if (!form.name || !form.dosage || !form.duration || !form.startDate) {
      alert('Lütfen tüm alanları doldurun'); return;
    }
    if (selectedFreq.length === 0) { alert('En az bir zaman seçin'); return; }
    if (selectedDays.length === 0) { alert('En az bir gün seçin'); return; }
    const boxSize = parseInt(form.boxSize) || 0;
    const med: Medicine = {
      id: 'med_' + Date.now(),
      name: form.name,
      dosage: form.dosage,
      frequency: selectedFreq,
      days: selectedDays,
      duration: parseInt(form.duration) || 0,
      boxSize,
      remaining: parseInt(form.remaining) || boxSize,
      startDate: form.startDate,
      takenLog: {},
    };
    onAdd(med);
    setForm({ name: '', dosage: '', startDate: '', duration: '', boxSize: '', remaining: '' });
    setSelectedFreq([]);
    setSelectedDays([]);
  };

  const weekDates = getWeekDates(currentWeekStart);

  const toggleFreq = (val: string) =>
    setSelectedFreq(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  const toggleDay = (val: string) =>
    setSelectedDays(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="medicineOverlay">
      <div className="module-header">
        <h2>💊 İlaç Takibi</h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card med-accent">
            <h3>İlaçlarım</h3>
            <div className="med-list">
              {modState.medicines.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: 20 }}>Henüz ilaç eklenmedi</p>
              ) : (
                modState.medicines.map(m => (
                  <div key={m.id} className="med-item">
                    <div className="med-icon">💊</div>
                    <div className="med-info">
                      <div className="med-name">{m.name}</div>
                      <div className="med-detail">{m.dosage} • {m.frequency.join(', ')} • {m.days.join(', ')}</div>
                      <div className="med-detail">{m.duration} gün • Başlangıç: {m.startDate}</div>
                    </div>
                    <div className="med-stock">
                      <div className={`count ${m.remaining <= 5 ? 'low' : 'ok'}`}>{m.remaining}</div>
                      <div className="stock-label">kalan</div>
                    </div>
                    <button className="med-delete" onClick={() => onDelete(m.id)}>✕</button>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="module-card med-accent">
            <h3>Yeni İlaç Ekle</h3>
            {['name:İlaç Adı:ör: Parol', 'dosage:Dozaj:ör: 500mg'].map(f => {
              const [key, label, ph] = f.split(':');
              return (
                <div key={key} className="m-form-group">
                  <label>{label}</label>
                  <input type="text" placeholder={ph} value={(form as Record<string, string>)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              );
            })}
            <div className="m-form-group"><label>Başlangıç Tarihi</label><input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} /></div>
            <div className="m-form-group"><label>Kaç Gün</label><input type="number" placeholder="ör: 14" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} /></div>
            <div className="m-form-group"><label>Kutu Boyutu (adet)</label><input type="number" placeholder="ör: 30" value={form.boxSize} onChange={e => setForm(p => ({ ...p, boxSize: e.target.value }))} /></div>
            <div className="m-form-group"><label>Kalan İlaç</label><input type="number" placeholder="ör: 25" value={form.remaining} onChange={e => setForm(p => ({ ...p, remaining: e.target.value }))} /></div>
            <div className="m-form-group">
              <label>Ne Zaman Alınacak</label>
              <div className="freq-checks">
                {FREQ_OPTIONS.map(v => (
                  <span key={v} className={`freq-check${selectedFreq.includes(v) ? ' active' : ''}`} onClick={() => toggleFreq(v)}>
                    {v === 'Sabah' ? '☀️' : v === 'Öğle' ? '🌤️' : '🌙'} {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="m-form-group">
              <label>Hangi Günler</label>
              <div className="day-checks">
                {DAY_OPTIONS.map(v => (
                  <span key={v} className={`day-check${selectedDays.includes(v) ? ' active' : ''}`} onClick={() => toggleDay(v)}>{v}</span>
                ))}
              </div>
            </div>
            <button className="m-btn success" onClick={handleAdd} style={{ width: '100%' }}>💊 İlaç Ekle</button>
          </div>
        </div>
        <div className="module-card med-accent" style={{ marginTop: 20 }}>
          <h3>Bu Haftaki İlaç Takvimi</h3>
          <div className="med-schedule-grid">
            {weekDates.map((d, i) => {
              const dateStr = formatDate(d);
              const dayName = DAYS_SHORT[i];
              const medsForDay = modState.medicines.filter(m => m.days.includes(dayName));
              return (
                <div key={dateStr} className="med-sched-day">
                  <div className="day-label">{dayName}<br />{d.getDate()}</div>
                  <div className="pills">
                    {medsForDay.length === 0
                      ? <span style={{ fontSize: '0.65rem', color: '#64748b' }}>-</span>
                      : medsForDay.flatMap(m =>
                          m.frequency.map(f => {
                            const taken = m.takenLog?.[dateStr]?.includes(f);
                            return (
                              <div key={`${m.id}-${f}`} className={`med-pill${taken ? ' taken' : ''}`} onClick={() => onToggleTaken(m.id, dateStr, f)}>
                                {m.name.substring(0, 6)} ({f.substring(0, 1).toUpperCase()})
                              </div>
                            );
                          })
                        )
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
