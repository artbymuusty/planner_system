'use client';

import type { PlannerEvent } from '@/types';
import { POSTPONE_REASON_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/dateUtils';

interface Props {
  events: PlannerEvent[];
  onSplit: (id: string) => void;
}

function calculateStreak(events: PlannerEvent[]): number {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const dayEvents = events.filter(e => e.date === dateStr);
    if (dayEvents.length === 0) continue;
    const hasPostpone = dayEvents.some(e =>
      (e.postponeHistory || []).some(h => h.to === dateStr)
    );
    if (hasPostpone) break;
    if (dayEvents.some(e => e.completed)) streak++;
  }
  return streak;
}

export default function PostponeSection({ events, onSplit }: Props) {
  const postponedEvents = events.filter(e => (e.postponeCount || 0) > 0);
  const totalPostpones = postponedEvents.reduce((s, e) => s + (e.postponeCount || 0), 0);
  const chronicEvents = postponedEvents.filter(e => (e.postponeCount || 0) >= 3);
  const completedAfterPostpone = postponedEvents.filter(e => e.completed).length;
  const streak = calculateStreak(events);

  const reasonCounts: Record<string, number> = {};
  postponedEvents.forEach(ev => {
    (ev.postponeHistory || []).forEach(h => {
      reasonCounts[h.reason] = (reasonCounts[h.reason] || 0) + 1;
    });
  });

  const topPostponed = [...postponedEvents]
    .filter(e => !e.completed)
    .sort((a, b) => (b.postponeCount || 0) - (a.postponeCount || 0))
    .slice(0, 3);

  const maxReasonCount = Math.max(...Object.values(reasonCounts), 1);

  return (
    <section className="postpone-section" id="postponeSection">
      <h2>🔄 Erteleme Analizi</h2>
      <div className="pp-stats-grid">
        {[
          { icon: '🔄', val: totalPostpones, label: 'Toplam Erteleme' },
          { icon: '🚨', val: chronicEvents.length, label: 'Kronik (3+)' },
          { icon: '✅', val: completedAfterPostpone, label: 'Sonunda Tamamlanan' },
          { icon: '🔥', val: streak, label: 'Gün Streak' },
        ].map((s, i) => (
          <div key={i} className="pp-stat-card">
            <div className="pp-stat-icon">{s.icon}</div>
            <div className="pp-stat-val">{s.val}</div>
            <div className="pp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {totalPostpones > 0 ? (
        <div className="pp-detail-grid">
          <div className="pp-detail-card">
            <h4>📊 Erteleme Nedenleri</h4>
            <div className="pp-reason-bars">
              {Object.entries(reasonCounts).length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Henüz veri yok</p>
              ) : (
                Object.entries(reasonCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, count]) => (
                    <div key={key} className="pp-reason-bar-item">
                      <span className="pp-reason-label">{POSTPONE_REASON_LABELS[key] || key}</span>
                      <div className="pp-reason-bar-bg">
                        <div
                          className="pp-reason-bar-fill"
                          style={{ width: `${Math.round((count / maxReasonCount) * 100)}%` }}
                        />
                      </div>
                      <span className="pp-reason-count">{count}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
          <div className="pp-detail-card">
            <h4>🔝 En Çok Ertelenen</h4>
            <div className="pp-top-list">
              {topPostponed.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center' }}>Ertelenen görev yok 🎉</p>
              ) : (
                topPostponed.map(ev => (
                  <div key={ev.id} className="pp-top-item">
                    <span className="pp-top-badge">{ev.postponeCount}x</span>
                    <span className="pp-top-name">{ev.name}</span>
                    <button className="pp-split-btn" onClick={() => onSplit(ev.id)} title="Parçalara böl">✂️</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="pp-empty"><p>🎉 Henüz erteleme yok! Harika gidiyorsun.</p></div>
      )}
    </section>
  );
}
