'use client';

import { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { BellIcon } from '@heroicons/react/24/outline';

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

export default function TopBar({ view, onViewChange, onTour, onProfile, userName }: Props) {
  const [search, setSearch] = useState('');

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
          placeholder="Ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Right actions */}
      <div className="topbar-actions">
        <button
          aria-label="Bildirimler"
          title="Bildirimler"
          className="topbar-icon-btn"
        >
          <BellIcon strokeWidth={2} />
        </button>
        <button
          onClick={onTour}
          aria-label="Yardım"
          title="Öğretici modu başlat"
          className="topbar-icon-btn"
        >
          <HelpCircle strokeWidth={2} />
        </button>
        <button
          onClick={onProfile}
          title="Profil"
          className="topbar-profile"
        >
          <div className="topbar-avatar">
            {(userName || 'M').charAt(0).toUpperCase()}
          </div>
          <div className="topbar-profile-info">
            <span className="topbar-profile-name">{userName || 'Misafir'}</span>
            <span className="topbar-profile-sub">{userName ? 'Üye' : 'Giriş yap'}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
