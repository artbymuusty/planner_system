'use client';

import { useState } from 'react';
import type { Medicine, ModuleState } from '@/types';
import { formatDate } from '@/lib/dateUtils';
import { Pill, Plus, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onAdd: (med: Medicine) => void;
  onDelete: (id: string) => void;
  onToggleTaken: (medId: string, date: string, freq: string) => void;
}

const FREQUENCIES = ['Sabah', 'Öğle', 'Akşam', 'Gece'];

export default function MedicineOverlay({ active, modState, onClose, onAdd, onDelete, onToggleTaken }: Props) {
  const [form, setForm] = useState({ 
    name: '', 
    dosage: '', 
    countPerDose: '1',
    boxSize: '20', 
    duration: '10' 
  });
  const [selectedFreq, setSelectedFreq] = useState<string[]>(['Sabah']);

  const handleAdd = () => {
    if (!form.name || !form.dosage) { alert('İlaç adı ve dozaj girin'); return; }
    const med: Medicine = {
      id: 'med_' + Date.now(),
      name: form.name,
      dosage: form.dosage,
      countPerDose: parseInt(form.countPerDose) || 1,
      frequency: selectedFreq,
      days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      duration: parseInt(form.duration) || 10,
      boxSize: parseInt(form.boxSize) || 20,
      remaining: parseInt(form.boxSize) || 20,
      startDate: formatDate(new Date()),
      takenLog: {},
    };
    onAdd(med);
    setForm({ name: '', dosage: '', countPerDose: '1', boxSize: '20', duration: '10' });
  };

  const today = formatDate(new Date());

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="medicineOverlay">
      <div className="module-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Pill className="text-rose-500" /> İlaç Takibi
        </h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card med-accent">
            <h3>💊 Bugünkü İlaçlar</h3>
            <div className="med-list">
              {modState.medicines.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: 20 }}>Henüz ilaç eklenmedi</p>
              ) : (
                modState.medicines.map(m => (
                  <div key={m.id} className="med-item" style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div className="med-info">
                        <div className="med-name" style={{ fontWeight: 800, color: '#1e293b' }}>{m.name}</div>
                        <div className="med-dosage" style={{ fontSize: '0.8rem', color: '#64748b' }}>{m.dosage} • {m.countPerDose || 1} Adet</div>
                      </div>
                      <div className="med-rem" style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 8, background: m.remaining < 5 ? '#fee2e2' : '#f1f5f9', color: m.remaining < 5 ? '#ef4444' : '#64748b', fontWeight: 700 }}>
                        {m.remaining} kalan
                      </div>
                    </div>
                    <div className="med-freq-chips" style={{ display: 'flex', gap: 6 }}>
                      {m.frequency.map(f => {
                        const taken = (m.takenLog[today] || []).includes(f);
                        return (
                          <button
                            key={f}
                            className={`freq-chip${taken ? ' taken' : ''}`}
                            onClick={() => onToggleTaken(m.id, today, f)}
                            style={{ 
                              flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', 
                              background: taken ? '#10b981' : '#f8fafc', 
                              color: taken ? '#fff' : '#64748b',
                              fontSize: '0.75rem', fontWeight: 800, transition: 'all 0.2s'
                            }}
                          >
                            {taken ? '✓' : ''} {f}
                          </button>
                        );
                      })}
                    </div>
                    <button className="med-delete" onClick={() => onDelete(m.id)} style={{ marginTop: 12, background: 'none', border: 'none', color: '#cbd5e1', fontSize: '0.7rem' }}>Kaldır</button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="module-card med-accent">
            <h3>➕ Yeni İlaç Ekle</h3>
            <div className="m-form-group"><label>İlaç Adı</label><input type="text" placeholder="ör: Parol" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="m-form-group"><label>Dozaj / Açıklama</label><input type="text" placeholder="ör: 500mg - Tok Karnına" value={form.dosage} onChange={e => setForm(p => ({ ...p, dosage: e.target.value }))} /></div>
            
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
               <div className="m-form-group"><label>Doz Başı Adet</label><input type="number" value={form.countPerDose} onChange={e => setForm(p => ({ ...p, countPerDose: e.target.value }))} /></div>
               <div className="m-form-group"><label>Kutu Mevcudu</label><input type="number" value={form.boxSize} onChange={e => setForm(p => ({ ...p, boxSize: e.target.value }))} /></div>
            </div>
            
            <div className="m-form-group">
              <label>Kullanım Vakti</label>
              <div className="freq-selector" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {FREQUENCIES.map(f => (
                  <button
                    key={f}
                    className={`freq-btn${selectedFreq.includes(f) ? ' active' : ''}`}
                    onClick={() => setSelectedFreq(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                    style={{ 
                      padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0', 
                      background: selectedFreq.includes(f) ? '#6366f1' : '#fff',
                      color: selectedFreq.includes(f) ? '#fff' : '#64748b',
                      fontSize: '0.8rem', fontWeight: 700
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <button className="m-btn primary" onClick={handleAdd} style={{ width: '100%', height: 48, borderRadius: 12, marginTop: 10 }}>➕ Listeye Ekle</button>
          </div>
        </div>
      </div>
    </div>
  );
}
