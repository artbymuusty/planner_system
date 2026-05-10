'use client';

import { useState, useEffect } from 'react';
import { Search, HelpCircle, Bell, BellRing } from 'lucide-react';

export type CalendarView = 'day' | 'week' | 'month';

interface Props {
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
  onTour: () => void;
  onProfile: () => void;
  userName?: string | null;
}

const VIEW_LABELS: Record<CalendarView, string> = {
  day: 'Gün',
  week: 'Hafta',
  month: 'Ay',
};

const TIPS = [
  "Su içmeyi unutma! Bir bardak su odaklanmanı %15 artırabilir.",
  "Pomodoro tekniği ile 25 dk odaklanıp 5 dk mola vermeyi dene.",
  "Ders kitaplarını kütüphaneden seçip masaya oturabilirsin.",
  "Bugünün görevlerini tamamlayarak streak'ini devam ettir!",
  "Bütçendeki market alışverişlerini 'Bitti' diyerek gidere dönüştürebilirsin.",
  "Uyku kaliteni artırmak için yatmadan 30 dk önce telefonunu bırak.",
  "Spor programındaki hareketleri tamamladıkça '✓' basmayı unutma!",
  "Doğum günlerine hediye fikirleri ekleyerek önceden hazırlanabilirsin."
];

export default function TopBar({ view, onViewChange, onTour, onProfile, userName }: Props) {
  const [search, setSearch] = useState('');
  const [showBell, setShowBell] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const displayName = userName || 'Test Kullanıcı';

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIdx(prev => (prev + 1) % TIPS.length);
      setShowBell(true);
      setTimeout(() => setShowBell(false), 5000);
    }, 45000); // 45 saniyede bir ipucu
    return () => clearInterval(timer);
  }, []);

  const handleNotification = () => {
    const el = document.createElement('div');
    el.className = 'notification info';
    el.innerHTML = `
      <div style="display:flex; gap:12px; align-items:center;">
        <span style="font-size:1.5rem">💡</span>
        <div>
          <strong style="display:block; font-size:0.8rem">VERİMLİLİK İPUCU</strong>
          <span style="font-size:0.85rem">${TIPS[tipIdx]}</span>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  };

  return (
    <div className="topbar">
      {/* View toggle */}
      <div className="topbar-view-toggle">
        {(['day', 'week', 'month'] as CalendarView[]).map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`topbar-view-btn${view === v ? ' active' : ''}`}
          >
            {VIEW_LABELS[v]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="topbar-search">
        <Search className="topbar-search-icon" strokeWidth={2} />
        <input
          type="text"
          placeholder="Etkinlik, görev veya not ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Right actions */}
      <div className="topbar-actions">
        <button
          aria-label="Bildirimler"
          title="Bildirimler"
          className={`topbar-icon-btn${showBell ? ' has-notif' : ''}`}
          onClick={handleNotification}
        >
          {showBell ? <BellRing strokeWidth={2} className="text-indigo-500 animate-bounce" /> : <Bell strokeWidth={2} />}
        </button>
        <button
          onClick={onTour}
          aria-label="Yardım"
          title="Öğretici modu başlat"
          className="topbar-icon-btn topbar-tour-btn"
        >
          <HelpCircle strokeWidth={2} />
        </button>
        <button
          onClick={onProfile}
          title="Profil"
          className="topbar-profile topbar-profile-btn"
        >
          <div className="topbar-avatar" style={{ background: '#4f46e5', color: 'white' }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="topbar-profile-info">
            <span className="topbar-profile-name">{displayName}</span>
            <span className="topbar-profile-sub">Pro Üye</span>
          </div>
        </button>
      </div>
    </div>
  );
}
