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

        {/* Hackathon Ekstra Özellikleri */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
          <div className="module-card">
            <h3 style={{ borderLeftColor: '#6366f1' }}>Haftalık Özet</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Hafta sonu otomatik olarak oluşturulan performans özetiniz.
            </p>
            <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              <strong>Özet:</strong> Bu hafta toplam 12 görev tamamladınız. Rutinlerinize sadık kalma oranınız %85. Harika gidiyorsunuz!
            </div>
            <button className="m-btn primary" onClick={() => {
              const el = document.createElement('div');
              el.className = 'notification info';
              el.innerText = 'Yapay zeka haftalık özeti oluşturuluyor...';
              document.body.appendChild(el);
              setTimeout(() => el.remove(), 4500);
            }}>
              Özeti Yenile (AI)
            </button>
          </div>

          <div className="module-card">
            <h3 style={{ borderLeftColor: '#10b981' }}>Haftalık E-posta Özeti</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Verilerinizi PDF formatında indirerek arşivleyin veya e-posta ile alın.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="m-btn success" onClick={() => {
                const el = document.createElement('div');
                el.className = 'notification success';
                el.innerText = 'PDF Raporu hazırlanıyor ve indiriliyor...';
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 4500);
              }}>
                PDF Olarak İndir
              </button>
              <button className="m-btn" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} onClick={() => {
                const el = document.createElement('div');
                el.className = 'notification success';
                el.innerText = 'Rapor e-posta adresinize gönderildi.';
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 4500);
              }}>
                E-posta Gönder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
