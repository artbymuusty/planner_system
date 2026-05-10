'use client';

import { useEffect, useState } from 'react';
import { Database, Eye, EyeOff, Flame, Key, Loader2, RotateCcw, Save, Trash2, Zap } from 'lucide-react';
import { OPENAI_KEY_STORAGE, openaiChat } from '@/lib/openaiClient';

interface Props {
  active: boolean;
  onClose: () => void;
  /** Test senaryosunu yükler — planner + module verilerini değiştirir. */
  onLoadScenario?: () => void;
  /** Tüm verileri sıfırlar — planner, module, ve API key dahil. */
  onResetAll?: () => void;
}

const STORAGE_KEY = OPENAI_KEY_STORAGE;

type TestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; text: string; model: string; source?: string }
  | { status: 'error'; message: string };

/**
 * API key'i güvenli bir biçimde maskeler.
 * Sadece tanıtıcı prefix (sk-proj- / sk-) + son 4 hane görünür kalır.
 * Orta kısım sabit uzunlukta • ile gösterilir → key uzunluğu da sızdırılmaz.
 *
 * Örnek:
 *   "sk-proj-abc123def456ghi789jkl012XYZ4" → "sk-proj-••••••••••••XYZ4"
 *   "sk-abcdef1234ghij5678"                → "sk-••••••••••••5678"
 */
function maskKey(key: string): string {
  if (!key) return '';
  if (key.length <= 8) return '•'.repeat(Math.max(key.length, 4));

  let prefix = '';
  if (key.startsWith('sk-proj-')) prefix = 'sk-proj-';
  else if (key.startsWith('sk-')) prefix = 'sk-';
  else prefix = key.slice(0, 3);

  const suffix = key.slice(-4);
  return `${prefix}${'•'.repeat(12)}${suffix}`;
}

type Toast = { kind: 'ok' | 'err'; text: string } | null;

export default function SettingsOverlay({ active, onClose, onLoadScenario, onResetAll }: Props) {
  const [stored, setStored] = useState<string>('');
  const [draft, setDraft] = useState<string>('');
  const [reveal, setReveal] = useState<boolean>(false);
  const [savedTick, setSavedTick] = useState<boolean>(false);
  const [test, setTest] = useState<TestState>({ status: 'idle' });
  const [scenarioToast, setScenarioToast] = useState<Toast>(null);
  const [pendingAction, setPendingAction] = useState<'load' | 'reset' | null>(null);

  // Mount'ta localStorage'dan oku
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const v = window.localStorage.getItem(STORAGE_KEY) || '';
    setStored(v);
  }, []);

  // Overlay her açıldığında taze state
  useEffect(() => {
    if (active) {
      const v = typeof window !== 'undefined'
        ? (window.localStorage.getItem(STORAGE_KEY) || '')
        : '';
      setStored(v);
      setDraft('');
      setReveal(false);
      setSavedTick(false);
      setTest({ status: 'idle' });
      setScenarioToast(null);
    }
  }, [active]);

  const showScenarioToast = (t: Toast) => {
    setScenarioToast(t);
    if (t) setTimeout(() => setScenarioToast(null), 3000);
  };

  const handleLoadScenario = () => {
    if (!onLoadScenario) return;
    onLoadScenario();
    setPendingAction(null);
    showScenarioToast({ kind: 'ok', text: 'Test senaryosu yüklendi — 26 görev + tüm modüller dolduruldu.' });
  };

  const handleResetAll = () => {
    if (!onResetAll) return;
    onResetAll();
    setStored('');
    setDraft('');
    setPendingAction(null);
    showScenarioToast({ kind: 'ok', text: 'Tüm veriler sıfırlandı.' });
  };

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    window.localStorage.setItem(STORAGE_KEY, trimmed);
    setStored(trimmed);
    setDraft('');
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 1800);
  };

  const handleClear = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setStored('');
    setDraft('');
    setTest({ status: 'idle' });
  };

  const handleTest = async () => {
    setTest({ status: 'loading' });
    try {
      const res = await openaiChat('Cevap olarak sadece "OK" yaz.');
      setTest({
        status: 'ok',
        text: res.text || '(boş yanıt)',
        model: res.model,
        source: res.keySource,
      });
    } catch (err) {
      setTest({
        status: 'error',
        message: err instanceof Error ? err.message : 'Bilinmeyen hata',
      });
    }
  };

  const display = stored
    ? (reveal ? stored : maskKey(stored))
    : '';

  return (
    <div className={`module-overlay${active ? ' active' : ''}`}>
      <div className="module-header">
        <h2>⚙️ Ayarlar</h2>
        <button className="close-module" onClick={onClose} aria-label="Kapat">✕</button>
      </div>

      <div style={{ padding: '24px 28px 28px', maxWidth: 720 }}>


        {/* === Test & Sıfırlama Kartı === */}
        <div className="module-card" style={{ marginTop: 16 }}>
          <h3 style={{ borderLeftColor: '#f59e0b', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={16} /> Test Verisi & Sıfırlama
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Geliştirme amaçlı, önceden hazırlanmış bir test senaryosu yükle veya tüm
            verileri sil. Veriler bu cihazın <code>localStorage</code>&apos;ında saklanır.
          </p>

          <div className="settings-scenario-grid">
            {/* Senaryo yükle */}
            <div className="settings-scenario-item">
              <div className="settings-scenario-head">
                <Flame size={14} style={{ color: '#f59e0b' }} />
                <strong>Test Senaryosu Yükle</strong>
              </div>
              <p>
                14 günlük geçmiş + bugün + 7 günlük gelecek dağılımında ~26 görev/etkinlik
                ve <strong>tüm modüller</strong> için (ilaç, su, spor, doğum günü, bütçe,
                uyku, hedefler) dolu örnek veri yükler. Mevcut veriler değiştirilir.
              </p>
              <button
                type="button"
                className="m-btn primary settings-scenario-btn"
                onClick={() => setPendingAction('load')}
                disabled={!onLoadScenario}
              >
                <Database size={14} />
                <span>Senaryoyu Yükle</span>
              </button>
            </div>

            {/* Sıfırla */}
            <div className="settings-scenario-item danger">
              <div className="settings-scenario-head">
                <RotateCcw size={14} style={{ color: '#dc2626' }} />
                <strong>Tüm Verileri Sıfırla</strong>
              </div>
              <p>
                Görevleri, modül verilerini ve kayıtlı OpenAI API key&apos;ini siler.
                Uygulama ilk açılış durumuna döner. <strong>Bu işlem geri alınamaz.</strong>
              </p>
              <button
                type="button"
                className="settings-scenario-btn danger"
                onClick={() => setPendingAction('reset')}
                disabled={!onResetAll}
              >
                <Trash2 size={14} />
                <span>Tümünü Sıfırla</span>
              </button>
            </div>
          </div>

          {scenarioToast && (
            <div className={`settings-toast ${scenarioToast.kind}`}>
              {scenarioToast.text}
            </div>
          )}
        </div>

        {/* Action Confirmation Modal */}
        {pendingAction && (
          <div className="modal-overlay active">
            <div className="modal" style={{ maxWidth: 400 }}>
              <h2>{pendingAction === 'load' ? 'Senaryo Yüklensin mi?' : '⚠️ Tümünü Sıfırla?'}</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                {pendingAction === 'load' 
                  ? 'Mevcut tüm veriler örnek verilerle değiştirilecek. Devam edilsin mi?' 
                  : 'Tüm görevler, modüller ve API anahtarı silinecek. Bu işlem geri alınamaz!'}
              </p>
              <div className="confirm-btns" style={{ display: 'flex', gap: 10 }}>
                <button 
                  className={`m-btn ${pendingAction === 'reset' ? 'danger' : 'primary'}`} 
                  style={{ flex: 1 }}
                  onClick={pendingAction === 'load' ? handleLoadScenario : handleResetAll}
                >
                  {pendingAction === 'load' ? 'Yükle' : 'Tümünü Sil'}
                </button>
                <button 
                  className="m-btn secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setPendingAction(null)}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
