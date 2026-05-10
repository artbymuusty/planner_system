'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileDown, Loader2, Mail, Sparkles } from 'lucide-react';
import type { PlannerEvent } from '@/types';
import { formatDate, getWeekDates } from '@/lib/dateUtils';
import { POSTPONE_REASON_LABELS } from '@/lib/constants';
import { openaiChat, openaiStatus } from '@/lib/openaiClient';
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

interface WeekStats {
  weekRange: string;
  total: number;
  completed: number;
  uncompleted: number;
  completionRate: number; // 0-100
  totalPostpones: number;
  chronicCount: number;
  topReasons: { label: string; count: number }[];
  topPostponed: { name: string; count: number }[];
  byCategory: { category: string; total: number; completed: number }[];
}

type AiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; text: string; model: string }
  | { status: 'error'; message: string };

function computeWeekStats(events: PlannerEvent[], weekStart: Date): WeekStats {
  const dates = getWeekDates(weekStart);
  const weekDateStrs = new Set(dates.map(formatDate));
  const inWeek = events.filter(e => weekDateStrs.has(e.date));

  const total = inWeek.length;
  const completed = inWeek.filter(e => e.completed).length;
  const uncompleted = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const totalPostpones = inWeek.reduce((s, e) => s + (e.postponeCount || 0), 0);
  const chronicCount = inWeek.filter(e => (e.postponeCount || 0) >= 3).length;

  const reasonCounts: Record<string, number> = {};
  inWeek.forEach(ev => {
    (ev.postponeHistory || []).forEach(h => {
      reasonCounts[h.reason] = (reasonCounts[h.reason] || 0) + 1;
    });
  });
  const topReasons = Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, c]) => ({ label: POSTPONE_REASON_LABELS[k] || k, count: c }));

  const topPostponed = [...inWeek]
    .filter(e => (e.postponeCount || 0) > 0)
    .sort((a, b) => (b.postponeCount || 0) - (a.postponeCount || 0))
    .slice(0, 3)
    .map(e => ({ name: e.name, count: e.postponeCount || 0 }));

  const catMap: Record<string, { total: number; completed: number }> = {};
  inWeek.forEach(e => {
    const k = e.category || 'other';
    catMap[k] ||= { total: 0, completed: 0 };
    catMap[k].total++;
    if (e.completed) catMap[k].completed++;
  });
  const byCategory = Object.entries(catMap)
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.total - a.total);

  const first = dates[0];
  const last = dates[dates.length - 1];
  const weekRange = `${first.getDate()}.${first.getMonth() + 1} - ${last.getDate()}.${last.getMonth() + 1}.${last.getFullYear()}`;

  return {
    weekRange,
    total,
    completed,
    uncompleted,
    completionRate,
    totalPostpones,
    chronicCount,
    topReasons,
    topPostponed,
    byCategory,
  };
}

function buildPrompt(stats: WeekStats): string {
  const reasonStr = stats.topReasons.length
    ? stats.topReasons.map(r => `${r.label}: ${r.count}`).join(', ')
    : 'yok';
  const topPpStr = stats.topPostponed.length
    ? stats.topPostponed.map(p => `"${p.name}" (${p.count}x)`).join(', ')
    : 'yok';
  const catStr = stats.byCategory.length
    ? stats.byCategory.map(c => `${c.category}: ${c.completed}/${c.total}`).join(', ')
    : 'yok';

  return `Sen kişisel verimlilik koçusun. Aşağıdaki haftalık planner istatistiklerine bakarak Türkçe, kısa (3-5 cümle), samimi ve motive edici bir özet yaz. Önce 1 cümle genel değerlendirme, sonra 1-2 cümle güçlü yan, sonra 1-2 cümle nazik bir öneri. Madde işareti veya başlık kullanma — sadece akıcı paragraf.

Hafta: ${stats.weekRange}
Toplam görev: ${stats.total}
Tamamlanan: ${stats.completed} (%${stats.completionRate})
Tamamlanmayan: ${stats.uncompleted}
Toplam erteleme: ${stats.totalPostpones}
Kronik (3+ ertelenen) görev sayısı: ${stats.chronicCount}
En sık erteleme nedenleri: ${reasonStr}
En çok ertelenen görevler: ${topPpStr}
Kategori dağılımı (tamamlanan/toplam): ${catStr}`;
}

function buildFallbackSummary(stats: WeekStats): string {
  if (stats.total === 0) {
    return `Bu hafta (${stats.weekRange}) henüz planlı görevin yok. Önce küçük birkaç hedef ekleyerek başlayabilirsin.`;
  }
  const tone =
    stats.completionRate >= 80 ? 'harika'
    : stats.completionRate >= 50 ? 'iyi'
    : 'gelişmeye açık';
  const ppLine =
    stats.totalPostpones === 0
      ? 'Hiç erteleme yok — disiplinli bir hafta.'
      : `Toplam ${stats.totalPostpones} erteleme yaşandı${stats.chronicCount ? `, ${stats.chronicCount} görev kronik düzeyde` : ''}.`;
  return `Bu hafta (${stats.weekRange}) ${stats.completed}/${stats.total} görev tamamlandı (%${stats.completionRate}). Performans ${tone}. ${ppLine}`;
}

export default function StatisticsOverlay({
  active, events, currentWeekStart, onReadd, onSplit, onClose,
}: Props) {
  const stats = useMemo(
    () => computeWeekStats(events, currentWeekStart),
    [events, currentWeekStart]
  );
  const fallback = useMemo(() => buildFallbackSummary(stats), [stats]);

  const [ai, setAi] = useState<AiState>({ status: 'idle' });
  const [keyConfigured, setKeyConfigured] = useState(false);

  // Overlay her açıldığında: AI state'i sıfırla, key durumunu yenile
  useEffect(() => {
    if (active) {
      setAi({ status: 'idle' });
      openaiStatus()
        .then(status => setKeyConfigured(status.configured))
        .catch(() => setKeyConfigured(false));
    }
  }, [active]);

  const handleGenerate = async () => {
    const status = await openaiStatus().catch(() => ({ configured: false, model: '' }));
    setKeyConfigured(status.configured);
    if (!status.configured) {
      setAi({
        status: 'error',
        message: 'OpenAI API anahtarı bulunamadı. Sunucuda .env OPENAI_API_KEY yoksa Sol menüden ⚙️ Ayarlar → OpenAI API Key bölümünden ekleyebilirsin.',
      });
      return;
    }
    setAi({ status: 'loading' });
    try {
      const res = await openaiChat(buildPrompt(stats));
      setAi({
        status: 'ok',
        text: res.text || fallback,
        model: res.model,
      });
    } catch (err) {
      setAi({
        status: 'error',
        message: err instanceof Error ? err.message : 'AI özeti alınamadı',
      });
    }
  };

  const summaryText =
    ai.status === 'ok' ? ai.text : fallback;

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
          {/* === AI Haftalık Özet === */}
          <div className="module-card">
            <h3 style={{ borderLeftColor: '#6366f1', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} /> Haftalık Özet
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              {stats.weekRange} · {stats.completed}/{stats.total} görev · %{stats.completionRate} tamamlanma
            </p>

            <div className="ai-summary-box">
              {ai.status === 'loading' ? (
                <div className="ai-summary-loading">
                  <Loader2 size={16} className="spin" />
                  <span>AI özet hazırlıyor…</span>
                </div>
              ) : (
                <>
                  <strong>{ai.status === 'ok' ? 'AI Özeti:' : 'Özet:'}</strong> {summaryText}
                  {ai.status === 'ok' && (
                    <div className="ai-summary-meta">Model: <code>{ai.model}</code></div>
                  )}
                </>
              )}
            </div>

            {ai.status === 'error' && (
              <div className="ai-summary-error">
                ⚠️ {ai.message}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              <button
                className="m-btn primary"
                onClick={handleGenerate}
                disabled={ai.status === 'loading'}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {ai.status === 'loading'
                  ? <Loader2 size={14} className="spin" />
                  : <Sparkles size={14} />}
                <span>
                  {ai.status === 'loading' ? 'Hazırlanıyor…' : ai.status === 'ok' ? 'Yeniden Üret' : 'Özeti Üret (AI)'}
                </span>
              </button>
              {!keyConfigured && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  .env yoksa ⚙️ Ayarlar&apos;dan API key gir
                </span>
              )}
            </div>
          </div>

          {/* === Yakında: PDF / E-posta === */}
          <div className="module-card coming-soon-card">
            <h3 style={{ borderLeftColor: '#10b981', display: 'flex', alignItems: 'center', gap: 8 }}>
              Haftalık E-posta Özeti
              <span className="coming-soon-badge">Yakında</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Verilerinizi PDF formatında indirerek arşivleyin veya e-posta ile alın.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="m-btn coming-soon-btn"
                disabled
                aria-disabled="true"
                title="Yakında"
              >
                <FileDown size={14} />
                <span>PDF Olarak İndir</span>
              </button>
              <button
                className="m-btn coming-soon-btn"
                disabled
                aria-disabled="true"
                title="Yakında"
              >
                <Mail size={14} />
                <span>E-posta Gönder</span>
              </button>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 12 }}>
              Bu özellikler yakında eklenecek.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
