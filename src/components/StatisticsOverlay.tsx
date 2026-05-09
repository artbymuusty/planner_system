'use client';

import type { PlannerEvent } from '@/types';
import CompletionSection from '@/components/sections/CompletionSection';
import PostponeSection from '@/components/sections/PostponeSection';

interface Props {
  active: boolean;
  events: PlannerEvent[];
  currentWeekStart: Date;
  onReadd: (id: string) => void;
  onSplit: (id: string) => void;
  onClose: () => void;
}

export default function StatisticsOverlay({ active, events, currentWeekStart, onReadd, onSplit, onClose }: Props) {
  return (
    <div className={`module-overlay${active ? ' active' : ''}`}>
      <div className="module-header">
        <h2>📊 İstatistikler</h2>
        <button className="close-module" onClick={onClose} aria-label="Kapat">✕</button>
      </div>
      <div style={{ padding: '0 28px 28px' }}>
        <CompletionSection
          events={events}
          currentWeekStart={currentWeekStart}
          onReadd={onReadd}
        />
        <PostponeSection
          events={events}
          onSplit={onSplit}
        />
      </div>
    </div>
  );
}
