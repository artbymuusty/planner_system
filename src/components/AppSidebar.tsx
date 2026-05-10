'use client';

import { BarChart3, Cake, Dumbbell, Droplets, Home, Moon, Pill, Settings, Wallet, Book, Target, Library, PenTool } from 'lucide-react';
import type { ActiveModule } from '@/types';

interface Props {
  activeModule: ActiveModule;
  onHome: () => void;
  onModule: (mod: ActiveModule) => void;
  focusMode: boolean;
  onToggleFocus: () => void;
}

export default function AppSidebar({
  activeModule, onHome, onModule, focusMode, onToggleFocus
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
          <Home />
        </button>
        <div className="sidebar-sep" />
        <button className={`sidebar-btn${activeModule === 'medicine' ? ' active' : ''}`} id="medicineBtn" title="İlaç" onClick={() => onModule('medicine')}>
          <Pill />
        </button>
        <button className={`sidebar-btn${activeModule === 'water' ? ' active' : ''}`} id="waterBtn" title="Su" onClick={() => onModule('water')}>
          <Droplets />
        </button>
        <button className={`sidebar-btn gym-btn${activeModule === 'gym' ? ' active' : ''}`} id="gymBtn" title="Spor Takibi" onClick={() => onModule('gym')}><Dumbbell /></button>
        <button className={`sidebar-btn bday-btn${activeModule === 'birthday' ? ' active' : ''}`} id="birthdayBtn" title="Doğum Günleri" onClick={() => onModule('birthday')}><Cake /></button>
        <button className={`sidebar-btn${activeModule === 'budget' ? ' active' : ''}`} id="budgetBtn" title="Bütçe" onClick={() => onModule('budget')}><Wallet /></button>
        <button className={`sidebar-btn${activeModule === 'sleep' ? ' active' : ''}`} id="sleepBtn" title="Uyku" onClick={() => onModule('sleep')}><Moon /></button>
        <button className={`sidebar-btn${activeModule === 'journal' ? ' active' : ''}`} id="journalBtn" title="Günlük" onClick={() => onModule('journal')}>
          <Book />
        </button>
        <button className={`sidebar-btn${activeModule === 'study' ? ' active' : ''}`} id="studyBtn" title="Kütüphane" onClick={() => onModule('study')}><Library /></button>
        <button className={`sidebar-btn${activeModule === 'statistics' ? ' active' : ''}`} id="statisticsBtn" title="İstatistikler" onClick={() => onModule('statistics')}>
          <BarChart3 />
        </button>
      </div>

      <div className="sidebar-bottom">
        <button
          className={`sidebar-btn${focusMode ? ' active' : ''}`}
          style={focusMode ? { color: '#ef4444', background: 'rgba(239,68,68,0.1)' } : {}}
          id="focusBtn"
          title="Odak Modu"
          onClick={onToggleFocus}
        >
          <Target />
        </button>
        <button
          className={`sidebar-btn${activeModule === 'settings' ? ' active' : ''}`}
          id="settingsBtn"
          title="Ayarlar"
          onClick={() => onModule('settings')}
        >
          <Settings />
        </button>
      </div>
    </aside>
  );
}
