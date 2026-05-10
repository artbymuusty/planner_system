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
    const ok = window.confirm(
      'Test senaryosunu yüklemek mevcut tüm görev ve modül verilerini DEĞİŞTİRECEK.\n\n' +
      'Devam etmek istiyor musun?'
    );
    if (!ok) return;
    onLoadScenario();
    showScenarioToast({ kind: 'ok', text: 'Test senaryosu yüklendi — 26 görev + tüm modüller dolduruldu.' });
  };

  const handleResetAll = () => {
    if (!onResetAll) return;
    const ok = window.confirm(
      '⚠️ TÜM VERİLER SİLİNECEK!\n\n' +
      '• Tüm görevler ve etkinlikler\n' +
      '• Tüm modül verileri (ilaç, su, spor, doğum günü, bütçe, uyku, hedefler)\n' +
      '• Kayıtlı OpenAI API key\n\n' +
      'Bu işlem geri alınamaz. Devam edilsin mi?'
    );
    if (!ok) return;
    onResetAll();
    setStored('');
    setDraft('');
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
        <div className="module-card">
          <h3 style={{ borderLeftColor: '#6366f1', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Key size={16} /> OpenAI API Key
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Test amaçlı kullanılır. Anahtar yalnızca bu cihazın <code>localStorage</code>&apos;ında saklanır;
            kaydedildikten sonra ekranda yalnızca <strong>prefix + son 4 hane</strong> gösterilir, gerisi maskelidir.
          </p>

          {/* Mevcut kayıtlı key (varsa) */}
          {stored && (
            <div className="settings-key-row">
              <div className="settings-key-display" title={reveal ? 'Açık görünüm' : 'Maskeli görünüm'}>
                <span className="settings-key-value">{display}</span>
                <button
                  type="button"
                  className="settings-key-eye"
                  onClick={() => setReveal(r => !r)}
                  title={reveal ? 'Maskele' : 'Tümünü göster'}
                  aria-label={reveal ? 'Maskele' : 'Tümünü göster'}
                >
                  {reveal ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                type="button"
                className="settings-key-clear"
                onClick={handleClear}
                title="Anahtarı sil"
              >
                <Trash2 size={14} />
                <span>Sil</span>
              </button>
            </div>
          )}

          {/* Giriş alanı */}
          <label className="settings-key-label" htmlFor="openaiKeyInput">
            {stored ? 'Yeni anahtarla değiştir' : 'API Key'}
          </label>
          <div className="settings-key-input-row">
            <input
              id="openaiKeyInput"
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder="sk-..."
              className="settings-key-input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            />
            <button
              type="button"
              className="m-btn primary settings-save-btn"
              onClick={handleSave}
              disabled={!draft.trim()}
            >
              <Save size={14} />
              <span>{savedTick ? 'Kaydedildi' : 'Kaydet'}</span>
            </button>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 12 }}>
            ⚠️ Anahtarı sadece kendi cihazında kullan. Üretim ortamına alınırken sunucu tarafında saklanmalı.
          </p>

          {/* Test bağlantı bölümü */}
          <hr style={{ margin: '18px 0' }} />
          <div className="settings-test-row">
            <button
              type="button"
              className="m-btn primary settings-test-btn"
              onClick={handleTest}
              disabled={test.status === 'loading' || (!stored && !draft.trim())}
              title={!stored && !draft.trim() ? 'Önce bir anahtar kaydet veya gir' : 'Bağlantıyı test et'}
            >
              {test.status === 'loading'
                ? <Loader2 size={14} className="spin" />
                : <Zap size={14} />
              }
              <span>{test.status === 'loading' ? 'Test ediliyor…' : 'Bağlantıyı Test Et'}</span>
            </button>
            <span className="settings-test-hint">
              Küçük bir prompt gönderir ve modelin yanıtını gösterir.
            </span>
          </div>

          {test.status === 'ok' && (
            <div className="settings-test-result ok">
              <strong>✓ Başarılı</strong>
              <div className="settings-test-meta">
                Model: <code>{test.model}</code>
                {test.source && <> · Kaynak: <code>{test.source === 'user' ? 'Settings (localStorage)' : '.env'}</code></>}
              </div>
              <pre className="settings-test-text">{test.text}</pre>
            </div>
          )}
          {test.status === 'error' && (
            <div className="settings-test-result err">
              <strong>✕ Hata</strong>
              <pre className="settings-test-text">{test.message}</pre>
            </div>
          )}
        </div>

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
                onClick={handleLoadScenario}
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
                onClick={handleResetAll}
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
      </div>
    </div>
  );
}
