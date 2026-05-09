'use client';

import type { ActiveModule } from '@/types';

interface Props {
  activeModule: ActiveModule;
  onHome: () => void;
  onModule: (mod: ActiveModule) => void;
}

export default function AppSidebar({
  activeModule, onHome, onModule
}: Props) {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-top">
        <button
          className={`sidebar-btn home-btn${!activeModule ? ' active' : ''}`}
          id="homeBtn"
          title="Ana Sayfa"
          onClick={onHome}
        >
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </button>
        <div className="sidebar-sep" />
        <button className={`sidebar-btn${activeModule === 'medicine' ? ' active' : ''}`} id="medicineBtn" title="İlaç" onClick={() => onModule('medicine')}>
          <svg viewBox="0 0 24 24"><path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
        </button>
        <button className={`sidebar-btn${activeModule === 'water' ? ' active' : ''}`} id="waterBtn" title="Su" onClick={() => onModule('water')}>
          <svg viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
        </button>
        <button className={`sidebar-btn${activeModule === 'gym' ? ' active' : ''}`} id="gymBtn" title="Gym" onClick={() => onModule('gym')}>
          <svg viewBox="0 0 24 24"><path d="M6.5 6.5h11M6.5 17.5h11"/><rect x="2" y="8.5" width="4" height="7" rx="1"/><rect x="18" y="8.5" width="4" height="7" rx="1"/><line x1="6.5" y1="12" x2="17.5" y2="12"/></svg>
        </button>
        <button className={`sidebar-btn bday-btn${activeModule === 'birthday' ? ' active' : ''}`} id="birthdayBtn" title="Doğum Günleri" onClick={() => onModule('birthday')}>🎂</button>
        <button className={`sidebar-btn${activeModule === 'budget' ? ' active' : ''}`} id="budgetBtn" title="Bütçe" onClick={() => onModule('budget')}>💰</button>
        <button className={`sidebar-btn${activeModule === 'sleep' ? ' active' : ''}`} id="sleepBtn" title="Uyku" onClick={() => onModule('sleep')}>😴</button>
        <button className={`sidebar-btn${activeModule === 'goals' ? ' active' : ''}`} id="goalsBtn" title="Hedefler" onClick={() => onModule('goals')}>🎯</button>
        <button className={`sidebar-btn${activeModule === 'statistics' ? ' active' : ''}`} id="statisticsBtn" title="İstatistikler" onClick={() => onModule('statistics')}>
          <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
        </button>
      </div>
    </aside>
  );
}
