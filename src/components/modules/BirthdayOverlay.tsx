'use client';

import { useState } from 'react';
import type { Birthday, ModuleState } from '@/types';
import { Cake, Gift, Plus, Trash2, Edit2, CheckCircle2, Calendar } from 'lucide-react';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onAdd: (bday: Birthday) => void;
  onDelete: (id: string) => void;
  onUpdate: (bday: Birthday) => void;
}

const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  const [, month, day] = dateStr.split('-').map(Number);
  const next = new Date(today.getFullYear(), month - 1, day);
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function BirthdayOverlay({ active, modState, onClose, onAdd, onDelete, onUpdate }: Props) {
  const [form, setForm] = useState({ name: '', date: '', giftIdea: '', giftPrice: '' });
  const [giftPlanned, setGiftPlanned] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    if (!form.name || !form.date) { alert('İsim ve tarih girin'); return; }
    
    const bday: Birthday = {
      id: editingId || 'bday_' + Date.now(),
      name: form.name,
      date: form.date,
      giftPlanned,
      giftIdea: form.giftIdea || undefined,
      giftPrice: form.giftPrice ? parseFloat(form.giftPrice) : undefined,
      giftBought: editingId ? (modState.birthdays.find(b => b.id === editingId)?.giftBought) : false,
    };

    if (editingId) {
      onUpdate(bday);
      setEditingId(null);
    } else {
      onAdd(bday);
    }

    setForm({ name: '', date: '', giftIdea: '', giftPrice: '' });
    setGiftPlanned(false);
  };

  const handleEdit = (b: Birthday) => {
    setEditingId(b.id);
    setForm({
      name: b.name,
      date: b.date,
      giftIdea: b.giftIdea || '',
      giftPrice: b.giftPrice ? String(b.giftPrice) : '',
    });
    setGiftPlanned(b.giftPlanned);
  };

  const toggleBought = (b: Birthday) => {
    onUpdate({ ...b, giftBought: !b.giftBought });
  };

  const sorted = [...modState.birthdays].sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date));

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="birthdayOverlay">
      <div className="module-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Cake className="text-pink-500" /> Doğum Günü Takibi
        </h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card bday-accent">
            <h3>🎈 Yaklaşan Kutlamalar</h3>
            <div className="bday-list">
              {sorted.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: 20 }}>Henüz doğum günü eklenmedi</p>
              ) : (
                sorted.map(b => {
                  const days = getDaysUntil(b.date);
                  const [, month, day] = b.date.split('-').map(Number);
                  return (
                    <div key={b.id} className="bday-item" style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, border: '1px solid #f1f5f9' }}>
                      <div className="bday-avatar" style={{ background: '#fdf2f8', color: '#db2777' }}>{b.name[0].toUpperCase()}</div>
                      <div className="bday-info" style={{ flex: 1, marginLeft: 12 }}>
                        <div className="bday-name" style={{ fontWeight: 800 }}>{b.name}</div>
                        <div className="bday-date" style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                           <Calendar size={12} /> Doğum Günü: {day} {MONTH_NAMES[month - 1]}
                        </div>
                        {b.giftPlanned && b.giftIdea && (
                          <div 
                            className={`bday-gift-pill ${b.giftBought ? 'bought' : ''}`}
                            onClick={() => toggleBought(b)}
                            style={{ 
                              marginTop: 8, padding: '6px 12px', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800, 
                              display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                              background: b.giftBought ? '#dcfce7' : '#f1f5f9',
                              color: b.giftBought ? '#166534' : '#64748b',
                              border: b.giftBought ? '1px solid #86efac' : '1px solid #e2e8f0'
                            }}
                          >
                            <Gift size={12} /> {b.giftBought ? 'Hediye Alındı' : `Hediye: ${b.giftIdea}`}
                          </div>
                        )}
                      </div>
                      <div className="bday-countdown" style={{ textAlign: 'center', minWidth: 60 }}>
                        <div className="days" style={{ fontSize: '1.2rem', fontWeight: 900, color: days <= 7 ? '#db2777' : '#1e293b' }}>{days}</div>
                        <div className="label" style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#94a3b8' }}>GÜN</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                         <button className="bday-act" onClick={() => handleEdit(b)} style={{ background: 'none', border: 'none', color: '#94a3b8' }}><Edit2 size={16} /></button>
                         <button className="bday-act" onClick={() => onDelete(b.id)} style={{ background: 'none', border: 'none', color: '#fecaca' }}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="module-card bday-accent">
            <h3>{editingId ? '✏️ Düzenle' : '➕ Yeni Kayıt'}</h3>
            <div className="m-form-group"><label>Kişi Adı</label><input type="text" placeholder="ör: Ayşe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="m-form-group"><label>Doğum Tarihi</label><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
            
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 16, border: '1px solid #e2e8f0', marginTop: 10 }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', color: '#475569' }}>
                 <input type="checkbox" checked={giftPlanned} onChange={e => setGiftPlanned(e.target.checked)} style={{ width: 18, height: 18 }} />
                 🎁 Hediye Planı Ekle
               </label>
               {giftPlanned && (
                 <div style={{ marginTop: 16 }}>
                   <div className="m-form-group"><label>Hediye Fikri</label><input type="text" placeholder="ör: Kitap / Parfüm" value={form.giftIdea} onChange={e => setForm(p => ({ ...p, giftIdea: e.target.value }))} /></div>
                   <div className="m-form-group"><label>Tahmini Bütçe (₺)</label><input type="number" placeholder="ör: 500" value={form.giftPrice} onChange={e => setForm(p => ({ ...p, giftPrice: e.target.value }))} /></div>
                 </div>
               )}
            </div>
            
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
               <button className="m-btn success" onClick={handleSave} style={{ flex: 1, height: 48, borderRadius: 12 }}>{editingId ? 'Güncelle' : 'Ekle'}</button>
               {editingId && <button className="m-btn secondary" onClick={() => { setEditingId(null); setForm({ name: '', date: '', giftIdea: '', giftPrice: '' }); setGiftPlanned(false); }} style={{ flex: 1 }}>İptal</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
