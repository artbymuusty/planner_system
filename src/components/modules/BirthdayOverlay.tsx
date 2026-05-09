'use client';

import { useState } from 'react';
import type { Birthday, ModuleState } from '@/types';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onAdd: (bday: Birthday) => void;
  onDelete: (id: string) => void;
}

const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  const [, month, day] = dateStr.split('-').map(Number);
  const next = new Date(today.getFullYear(), month - 1, day);
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function BirthdayOverlay({ active, modState, onClose, onAdd, onDelete }: Props) {
  const [form, setForm] = useState({ name: '', date: '', giftIdea: '', giftPrice: '', giftBuyBy: '' });
  const [giftPlanned, setGiftPlanned] = useState(false);

  const handleAdd = () => {
    if (!form.name || !form.date) { alert('İsim ve tarih girin'); return; }
    const bday: Birthday = {
      id: 'bday_' + Date.now(),
      name: form.name,
      date: form.date,
      giftPlanned,
      giftIdea: form.giftIdea || undefined,
      giftPrice: form.giftPrice ? parseFloat(form.giftPrice) : undefined,
      giftBuyBy: form.giftBuyBy || undefined,
    };
    onAdd(bday);
    setForm({ name: '', date: '', giftIdea: '', giftPrice: '', giftBuyBy: '' });
    setGiftPlanned(false);
  };

  const sorted = [...modState.birthdays].sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date));

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="birthdayOverlay">
      <div className="module-header">
        <h2>🎂 Doğum Günü Takibi</h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card bday-accent">
            <h3>Yaklaşan Doğum Günleri</h3>
            <div className="bday-list">
              {sorted.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: 20 }}>Henüz doğum günü eklenmedi</p>
              ) : (
                sorted.map(b => {
                  const days = getDaysUntil(b.date);
                  const [, month] = b.date.split('-').map(Number);
                  return (
                    <div key={b.id} className="bday-item">
                      <div className="bday-avatar">{b.name[0].toUpperCase()}</div>
                      <div className="bday-info">
                        <div className="bday-name">{b.name}</div>
                        <div className="bday-date">{MONTH_NAMES[month - 1]}</div>
                        {b.giftPlanned && b.giftIdea && (
                          <div className="bday-gift">🎁 {b.giftIdea}{b.giftPrice ? ` (${b.giftPrice}₺)` : ''}</div>
                        )}
                      </div>
                      <div className="bday-countdown">
                        <div className="days">{days}</div>
                        <div className="label">gün</div>
                      </div>
                      <button className="bday-delete" onClick={() => onDelete(b.id)}>✕</button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="module-card bday-accent">
            <h3>Doğum Günü Ekle</h3>
            <div className="m-form-group"><label>Kişi Adı</label><input type="text" placeholder="ör: Ayşe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="m-form-group"><label>Doğum Tarihi</label><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
            <div className="m-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={giftPlanned} onChange={e => setGiftPlanned(e.target.checked)} />
                Hediye Planla
              </label>
            </div>
            {giftPlanned && (
              <>
                <div className="m-form-group"><label>Hediye Fikri</label><input type="text" placeholder="ör: Kitap" value={form.giftIdea} onChange={e => setForm(p => ({ ...p, giftIdea: e.target.value }))} /></div>
                <div className="m-form-group"><label>Bütçe (₺)</label><input type="number" placeholder="ör: 200" value={form.giftPrice} onChange={e => setForm(p => ({ ...p, giftPrice: e.target.value }))} /></div>
                <div className="m-form-group"><label>Son Alım Tarihi</label><input type="date" value={form.giftBuyBy} onChange={e => setForm(p => ({ ...p, giftBuyBy: e.target.value }))} /></div>
              </>
            )}
            <button className="m-btn success" onClick={handleAdd} style={{ width: '100%' }}>🎂 Ekle</button>
          </div>
        </div>
      </div>
    </div>
  );
}
