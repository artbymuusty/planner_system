'use client';

import { useMemo } from 'react';
import type { PlannerEvent, ModuleState } from '@/types';
import { formatDate } from '@/lib/dateUtils';

interface Props {
  events: PlannerEvent[];
  modState: ModuleState;
}

export default function InboxBar({ events, modState }: Props) {
  const items = useMemo(() => {
    const today = new Date();
    const todayStr = formatDate(today);
    const result: { key: string; content: React.ReactNode; urgent?: boolean }[] = [];

    const todayEvents = events.filter(e => e.date === todayStr && !e.completed);
    if (todayEvents.length > 0) {
      result.push({
        key: 'events',
        content: <><span className="inbox-icon">📅</span><span className="inbox-text"><strong>{todayEvents.length}</strong> etkinlik bugün</span></>,
      });
    }

    modState.medicines.forEach(m => {
      if (m.remaining <= 5) {
        result.push({
          key: `med-${m.id}`,
          urgent: true,
          content: <><span className="inbox-icon">💊</span><span className="inbox-text"><strong>{m.name}</strong> bitmek üzere ({m.remaining})</span></>,
        });
      }
    });

    const todayWater = modState.water.log[todayStr];
    const consumed = todayWater?.total || 0;
    const goal = modState.water.dailyGoal || 2500;
    const pct = Math.round((consumed / goal) * 100);
    if (pct < 100) {
      result.push({
        key: 'water',
        content: <><span className="inbox-icon">💧</span><span className="inbox-text">Su: <strong>{pct}%</strong></span></>,
      });
    } else {
      result.push({
        key: 'water-done',
        content: <><span className="inbox-icon">✅</span><span className="inbox-text">Su hedefi tamam!</span></>,
      });
    }

    modState.birthdays.forEach(b => {
      const bdate = new Date(b.date);
      bdate.setFullYear(today.getFullYear());
      if (bdate < today) bdate.setFullYear(today.getFullYear() + 1);
      const diff = Math.ceil((bdate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diff <= 7 && diff >= 0) {
        result.push({
          key: `bday-${b.id}`,
          urgent: true,
          content: <><span className="inbox-icon">🎂</span><span className="inbox-text"><strong>{b.name}</strong> {diff === 0 ? 'BUGÜN!' : `${diff} gün sonra`}</span></>,
        });
      }
    });

    if (result.length === 0) {
      result.push({
        key: 'empty',
        content: <><span className="inbox-icon">📬</span><span className="inbox-text">Bildirim yok, harika gidiyorsun!</span></>,
      });
    }

    return result;
  }, [events, modState]);

  return (
    <div className="inbox-bar" id="inboxBar">
      {items.map(item => (
        <div key={item.key} className={`inbox-item${item.urgent ? ' urgent' : ''}`}>
          {item.content}
        </div>
      ))}
    </div>
  );
}
