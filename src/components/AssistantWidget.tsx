'use client';

/**
 * Floating AI Asistan Widget'ı.
 *
 * Sağ alt köşede sabit duran bir balon/floating button → tıklanınca
 * framer-motion ile küçük bir chat paneli açılır. Konuşma geçmişi
 * `openaiChat()` üzerinden OpenAI'ye gönderilir (Settings'te kayıtlı key).
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Settings as SettingsIcon, AlertTriangle, Loader2 } from 'lucide-react';
import type { PlannerEvent, ModuleState } from '@/types';
import { openaiChat, hasStoredOpenAIKey } from '@/lib/openaiClient';
import {
  buildWeeklyPrompt,
  buildPostponePrompt,
  buildTomorrowPrompt,
  buildGoalsPrompt,
  buildHealthPrompt,
  buildPomodoroPrompt,
  buildBaseContext,
} from '@/lib/aiContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

/** Proaktif asistan mesajı — useProactiveAssistant hook'undan gelir */
export interface ProactiveMessageInput {
  id: string;
  text: string;
}

interface Props {
  /** Tıklandığında ayarlar overlay'ini aç */
  onOpenSettings?: () => void;
  /** Dışarıdan (proaktif sistem) gelen ek asistan mesajları. Yeni id'liler chat'e eklenir. */
  proactiveMessages?: ProactiveMessageInput[];
  /** Asistanın gerçek veri analizi yapabilmesi için */
  events: PlannerEvent[];
  modState: ModuleState;
  currentWeekStart: Date;
}

const SYSTEM_PREFIX =
  'Sen kullanıcının kişisel planlayıcı uygulamasındaki yardımcı bir asistansın. ' +
  'Türkçe, kısa, samimi ve net yanıt ver. Markdown kullanma; sade düz metin yaz. ' +
  'Bilmiyorsan dürüstçe söyle.';

/**
 * Bir öneri çipi. `contextKey` doluysa tıklandığında kullanıcıya gösterilen
 * (display) metin kısa kalır AMA modele gönderilen prompt **gerçek verilerle**
 * zenginleştirilir. Böylece AI, kullanıcıya "nasıl analiz yaparsın" anlatmak
 * yerine doğrudan kendi verisine bakıp yanıt verir.
 */
interface SuggestedPrompt {
  emoji: string;
  label: string;
  /** Kullanıcının chat'inde "kullanıcı mesajı" olarak görünen metin */
  displayText: string;
  /** Hangi context builder kullanılacak. Yoksa sadece displayText gönderilir. */
  contextKey?: 'weekly' | 'postpone' | 'tomorrow' | 'goals' | 'health' | 'pomodoro' | 'tip' | 'motivation';
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { emoji: '📊', label: 'Haftalık özet', displayText: 'Bu haftamı analiz eder misin?', contextKey: 'weekly' },
  { emoji: '🔁', label: 'Erteleme analizi', displayText: 'En çok ertelediğim görevleri analiz eder misin?', contextKey: 'postpone' },
  { emoji: '📅', label: 'Yarın için plan', displayText: 'Yarın için verimli bir plan önerir misin?', contextKey: 'tomorrow' },
  { emoji: '🎯', label: 'Hedef ilerlemem', displayText: 'Hedeflerimde nasıl gidiyorum?', contextKey: 'goals' },
  { emoji: '💧', label: 'Sağlık özeti', displayText: 'Sağlık verilerimi (su/uyku/spor) değerlendirir misin?', contextKey: 'health' },
  { emoji: '🍅', label: 'Pomodoro önerisi', displayText: 'Bugün için pomodoro planı önerir misin?', contextKey: 'pomodoro' },
  { emoji: '💡', label: 'Verimlilik ipucu', displayText: 'Bana 3 pratik verimlilik ipucu verir misin?', contextKey: 'tip' },
  { emoji: '✨', label: 'Motivasyon', displayText: 'Bugün için kısa bir motivasyon yazar mısın?', contextKey: 'motivation' },
];

function buildPrompt(history: ChatMessage[], newUserText: string, baseContext?: string): string {
  const lines: string[] = [SYSTEM_PREFIX];
  if (baseContext) {
    lines.push('');
    lines.push(baseContext);
    lines.push(
      '↑ Yukarıda kullanıcının uygulamasından gelen GERÇEK güncel veri var. ' +
      'Soruyu cevaplarken bu veriye bak, somut isim ve sayı kullan. ' +
      'Eğer kullanıcı genel bir şey sorduysa bile yanıtı bu bağlamla zenginleştir.'
    );
  }
  lines.push('');
  history.forEach(m => {
    lines.push(m.role === 'user' ? `Kullanıcı: ${m.text}` : `Asistan: ${m.text}`);
  });
  lines.push(`Kullanıcı: ${newUserText}`);
  lines.push('Asistan:');
  return lines.join('\n');
}

export default function AssistantWidget({
  onOpenSettings,
  proactiveMessages,
  events,
  modState,
  currentWeekStart,
}: Props) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const consumedProIdsRef = useRef<Set<string>>(new Set());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Selam 👋 Ben senin kişisel planlayıcı asistanınım. Bir şey sormak veya planlama konusunda yardım almak için yaz!',
      timestamp: Date.now(),
    },
  ]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Açılınca key kontrolü + odaklan + okunmamış sayacı sıfırla
  useEffect(() => {
    if (open) {
      setHasKey(hasStoredOpenAIKey());
      setError(null);
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  // Proaktif mesajları izle — yeni id'liler chat'e eklensin, kapalıysa badge artsın
  useEffect(() => {
    if (!proactiveMessages || proactiveMessages.length === 0) return;
    const fresh = proactiveMessages.filter(m => !consumedProIdsRef.current.has(m.id));
    if (fresh.length === 0) return;
    fresh.forEach(m => consumedProIdsRef.current.add(m.id));
    setMessages(prev => [
      ...prev,
      ...fresh.map(m => ({
        id: m.id,
        role: 'assistant' as const,
        text: m.text,
        timestamp: Date.now(),
      })),
    ]);
    if (!open) setUnread(u => u + fresh.length);
  }, [proactiveMessages, open]);

  // Yeni mesaj geldiğinde scroll en alta
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  // Component unmount olursa devam eden istek varsa iptal et
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  /**
   * Suggested prompt'larda kullanılan context anahtarına göre **modele gönderilecek**
   * tam prompt'u üretir. Burası sayesinde AI "nasıl analiz yaparsın" anlatmak
   * yerine doğrudan gerçek veriye bakıp cevap verir.
   */
  const buildContextPrompt = (key: SuggestedPrompt['contextKey']): string | null => {
    switch (key) {
      case 'weekly':
        return buildWeeklyPrompt(events, currentWeekStart);
      case 'postpone':
        return buildPostponePrompt(events);
      case 'tomorrow':
        return buildTomorrowPrompt(events);
      case 'goals':
        return buildGoalsPrompt(modState);
      case 'health':
        return buildHealthPrompt(modState);
      case 'pomodoro':
        return buildPomodoroPrompt(events, modState);
      case 'tip':
      case 'motivation':
      default:
        return null;
    }
  };

  /**
   * Mesaj gönderir.
   * - `displayText`  : kullanıcının chat balonunda görünecek metin (kısa, doğal)
   * - `modelPrompt`  : modele gerçekten gidecek prompt (verili context dahil)
   * Boş bırakılırsa tüm bağlam textarea draft'tan alınır ve aynı metin
   * hem ekrana hem modele gider.
   */
  const handleSend = async (displayText?: string, modelPrompt?: string) => {
    const userText = (displayText ?? draft).trim();
    if (!userText || sending) return;

    if (!hasStoredOpenAIKey()) {
      setHasKey(false);
      setError('OpenAI API key tanımlı değil. Ayarlar → API Key bölümünden ekleyebilirsin.');
      return;
    }

    setError(null);
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setDraft('');
    setSending(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      // Suggested prompt'lar için zaten context dahil edilmiş tam prompt geldi.
      // Serbest yazılan metinler için hafif "her zaman" context'ini ekle ki
      // kullanıcı "haftamı özetle" gibi yazsa bile model boş tahminle değil
      // gerçek verisiyle yanıt versin.
      let prompt: string;
      if (modelPrompt) {
        // Suggested prompt — modelPrompt zaten kendi context'ini içeriyor.
        // Kısa bir geçmişe bağla (önceki konuşma turları varsa) — ama tek seferde
        // büyütmemek için son 4 mesajı dahil et.
        const recent = messages.slice(-4);
        const histLines: string[] = [];
        if (recent.length > 0) {
          histLines.push('');
          histLines.push('Önceki konuşma:');
          recent.forEach(m => {
            histLines.push(m.role === 'user' ? `Kullanıcı: ${m.text}` : `Asistan: ${m.text}`);
          });
        }
        prompt = `${modelPrompt}${histLines.join('\n')}`;
      } else {
        // Serbest mesaj: hafif context + tüm geçmiş
        const baseCtx = buildBaseContext(events, modState);
        prompt = buildPrompt(messages, userText, baseCtx);
      }

      const res = await openaiChat(prompt, { signal: ctrl.signal });
      const reply = (res.text || '').trim() || '(boş yanıt)';
      setMessages(prev => [
        ...prev,
        { id: `a_${Date.now()}`, role: 'assistant', text: reply, timestamp: Date.now() },
      ]);
    } catch (err) {
      if ((err as any)?.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setError(msg);
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  };

  /** Önerilen prompt çipinden tetiklenen gönderim — context'i otomatik üretir */
  const handleSuggestedClick = (p: SuggestedPrompt) => {
    const modelPrompt = buildContextPrompt(p.contextKey) ?? p.displayText;
    handleSend(p.displayText, modelPrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* === Floating Trigger Button === */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="trigger"
            type="button"
            className="assistant-fab"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            whileHover={{ scale: 1.08, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Yardımcıyı aç"
          >
            <MessageCircle size={22} strokeWidth={2.4} />
            <span className="assistant-fab-pulse" />
            {unread > 0 && (
              <motion.span
                className="assistant-fab-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                aria-label={`${unread} yeni mesaj`}
              >
                {unread > 9 ? '9+' : unread}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* === Chat Panel === */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="assistant-panel"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            role="dialog"
            aria-label="AI Asistan"
          >
            {/* Header */}
            <div className="assistant-header">
              <div className="assistant-header-left">
                <motion.div
                  className="assistant-avatar"
                  animate={{ rotate: [0, 8, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop' }}
                >
                  <Sparkles size={16} />
                </motion.div>
                <div>
                  <div className="assistant-title">AI Asistan</div>
                  <div className="assistant-status">
                    <span className={`status-dot ${hasKey ? 'on' : 'off'}`} />
                    {hasKey ? 'Çevrim içi' : 'API key gerekli'}
                  </div>
                </div>
              </div>
              <div className="assistant-header-actions">
                <button
                  type="button"
                  className="assistant-icon-btn"
                  onClick={() => setOpen(false)}
                  title="Kapat"
                  aria-label="Kapat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="assistant-messages" ref={scrollRef}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  className={`assistant-msg ${m.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="assistant-bubble">{m.text}</div>
                </motion.div>
              ))}

              {sending && (
                <motion.div
                  className="assistant-msg assistant"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="assistant-bubble typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="assistant-error"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle size={14} />
                  <span>{error}</span>
                  {!hasKey && onOpenSettings && (
                    <button
                      type="button"
                      className="assistant-error-cta"
                      onClick={() => { setOpen(false); onOpenSettings(); }}
                    >
                      <SettingsIcon size={12} /> Ayarlar
                    </button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Suggested prompts — yatay scroll */}
            <div className="assistant-suggestions" aria-label="Önerilen sorular">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="assistant-suggestion-chip"
                  onClick={() => handleSuggestedClick(p)}
                  disabled={sending}
                  title={p.displayText}
                >
                  <span className="suggestion-emoji">{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Composer */}
            <div className="assistant-composer">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasKey ? 'Asistana sor…' : 'Önce API key ekle'}
                rows={1}
                disabled={sending}
              />
              <motion.button
                type="button"
                className="assistant-send"
                onClick={() => handleSend()}
                disabled={!draft.trim() || sending}
                whileHover={{ scale: draft.trim() ? 1.05 : 1 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Gönder"
              >
                {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
