'use client';

/**
 * useProactiveAssistant
 * ----------------------
 * Kullanıcının uygulama verisindeki değişiklikleri/durumları izler ve uygun
 * koşullarda asistan widget'ına proaktif mesajlar gönderir.
 *
 * Frequency limit:
 *   - 'daily' modu: aynı trigger günde 1 kez
 *   - 'once' modu: bir uniqueKey için ömür boyu 1 kez (örn: ev id veya ev+count)
 *   - Toplam günlük cap: max 5 proaktif mesaj/gün
 *
 * Mesaj kaynağı karması:
 *   - Şablon (anında, key gerekmez): basit hatırlatmalar
 *   - AI (openaiChat): erteleme analizi, alt görev bölme, hedef tahmini
 *     → API key yoksa fallback mesajlara döner.
 */

import { useEffect, useRef, useCallback } from 'react';
import type { PlannerEvent, ModuleState } from '@/types';
import { formatDate } from '@/lib/dateUtils';
import { openaiChat } from '@/lib/openaiClient';

export interface ProactiveMessage {
  id: string;
  text: string;
  triggerType: string;
  timestamp: number;
}

const DAILY_CAP = 10;
const STORAGE_PREFIX = 'proactive_';
const COUNT_PREFIX = 'proactive_count_';

export function clearProactiveStorage() {
  if (typeof window === 'undefined') return;
  try {
    Object.keys(window.localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX) || k.startsWith(COUNT_PREFIX))
      .forEach(k => window.localStorage.removeItem(k));
  } catch { /* ignore */ }
}

function todayKey(): string {
  return formatDate(new Date());
}

function lsGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, val: string) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(key, val); } catch { /* ignore */ }
}

function shouldFire(
  triggerType: string,
  mode: 'daily' | 'once',
  uniqueKey?: string,
  skipCap = false
): boolean {
  const today = todayKey();
  if (!skipCap) {
    const count = parseInt(lsGet(`${COUNT_PREFIX}${today}`) || '0', 10);
    if (count >= DAILY_CAP) return false;
  }
  const lsKey = mode === 'daily'
    ? `${STORAGE_PREFIX}${triggerType}_${today}`
    : `${STORAGE_PREFIX}${triggerType}_${uniqueKey || ''}`;
  return !lsGet(lsKey);
}

function markFired(
  triggerType: string,
  mode: 'daily' | 'once',
  uniqueKey?: string
) {
  const today = todayKey();
  const capKey = `${COUNT_PREFIX}${today}`;
  const count = parseInt(lsGet(capKey) || '0', 10);
  lsSet(capKey, String(count + 1));
  const lsKey = mode === 'daily'
    ? `${STORAGE_PREFIX}${triggerType}_${today}`
    : `${STORAGE_PREFIX}${triggerType}_${uniqueKey || ''}`;
  lsSet(lsKey, '1');
}

// ---- Şablon havuzları ----
const MOTIVATION_MESSAGES = [
  'Bugünkü tüm görevlerini tamamladın 🎉 Harikasın!',
  'Tüm liste yeşil ✓ Bu ritmi sevdik!',
  'Disiplin = özgürlük 💪 Bugünü kapattın!',
  'Sen bugün küçük bir kahramansın ✨ Tüm görevler tamam!',
  'Mükemmel bir gün! Kendine küçük bir ödül borçlusun 🌟',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const TR_DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

// ----------------------------------------------------------------------
//                                 HOOK
// ----------------------------------------------------------------------
export function useProactiveAssistant(
  events: PlannerEvent[],
  modState: ModuleState,
  onMessage: (msg: ProactiveMessage) => void
) {
  // Mesaj göndermek için ortak yardımcı
  const emit = useCallback(
    async (
      triggerType: string,
      mode: 'daily' | 'once',
      builder: () => Promise<string> | string,
      uniqueKey?: string,
      skipCap = false
    ) => {
      if (!shouldFire(triggerType, mode, uniqueKey, skipCap)) return;
      try {
        const text = (await builder())?.trim();
        if (!text) return;
        onMessage({
          id: `pro_${triggerType}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          text,
          triggerType,
          timestamp: Date.now(),
        });
        markFired(triggerType, mode, uniqueKey);
      } catch {
        // Proaktif sistemler asla crash etmemeli
      }
    },
    [onMessage]
  );

  // -------------------------------------------------------------------
  // 1 & 2: Erteleme — postponeCount değişikliklerini izle
  // -------------------------------------------------------------------
  const prevPostponeRef = useRef<Record<string, number> | null>(null);
  useEffect(() => {
    const next: Record<string, number> = {};
    events.forEach(e => { next[e.id] = e.postponeCount || 0; });

    if (prevPostponeRef.current !== null) {
      const prev = prevPostponeRef.current;
      events.forEach(e => {
        const oldCount = prev[e.id] ?? 0;
        const newCount = e.postponeCount || 0;
        if (newCount <= oldCount) return;

        if (newCount === 2) {
          emit('postpone2', 'once', async () => {
            try {
              const res = await openaiChat(
                `Kullanıcı "${e.name}" görevini 2. kez erteledi (kategori: ${e.category}, önem: ${e.importance}). ` +
                `Türkçe, kısa (2-3 cümle), empatik bir mesaj yaz. Erteleme nedenini sor ve 1 küçük somut öneri ver. ` +
                `Markdown KULLANMA, sade düz metin yaz.`
              );
              if (res.text) return res.text;
            } catch {}
            return `"${e.name}" görevini 2. kez erteledin 🤔 Sebebi neydi? Belki birlikte ufak bir çözüm bulabiliriz.`;
          }, e.id, true);
        } else if (newCount >= 3) {
          emit('postpone3', 'once', async () => {
            try {
              const res = await openaiChat(
                `Kullanıcı "${e.name}" görevini ${newCount}. kez erteledi. Bu görev muhtemelen büyük geliyor. ` +
                `Türkçe yanıt ver: önce 1 cümle empati. Sonra "Bunu şu küçük adımlara bölelim:" diyerek ` +
                `3-4 küçük somut alt parçaya böl, her birini "• " ile başlatarak madde madde liste yap. ` +
                `Markdown başlık/kalın KULLANMA, sade düz metin yaz.`
              );
              if (res.text) return res.text;
            } catch {}
            return (
              `"${e.name}" görevini ${newCount}. kez erteledin. Belki büyük geliyor — küçük parçalara bölmeyi düşündün mü?\n\n` +
              `• Görevin ilk 15 dakikalık parçasını yap\n• Sonra hızlı bir mola ver\n• Bir sonraki adımı belirle`
            );
          }, `${e.id}_${newCount}`, true);
        }
      });
    }
    prevPostponeRef.current = next;
  }, [events, emit]);

  // -------------------------------------------------------------------
  // 4: Bugünkü tüm görevler tamam → motivasyon
  // -------------------------------------------------------------------
  useEffect(() => {
    const today = todayKey();
    const todayTasks = events.filter(e => e.date === today && e.kind !== 'goal');
    if (todayTasks.length < 2) return; // en az 2 görev olsun
    const allDone = todayTasks.every(e => e.completed);
    if (allDone) {
      emit('all_done', 'daily', () => pickRandom(MOTIVATION_MESSAGES));
    }
  }, [events, emit]);

  // -------------------------------------------------------------------
  // 5: Geçmiş tarihli açık görevler (>=3 adet)
  // -------------------------------------------------------------------
  useEffect(() => {
    const today = todayKey();
    const overdue = events.filter(
      e => e.date < today && !e.completed && e.kind !== 'goal' && (e.postponeCount || 0) === 0
    );
    if (overdue.length >= 3) {
      emit('overdue', 'daily', () => {
        const examples = overdue.slice(0, 2).map(e => `"${e.name}"`).join(', ');
        return (
          `${overdue.length} adet geçmiş tarihli açık görevin var (örn. ${examples}). ` +
          `Tek tek kapatmak mı, bugüne taşımak mı yoksa silmek mi istersin? 📌`
        );
      });
    }
  }, [events, emit]);

  // -------------------------------------------------------------------
  // 6: Su < %50 ve saat 18:00+
  // -------------------------------------------------------------------
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 18) return;
    const today = todayKey();
    const log = modState.water?.log?.[today];
    const goal = modState.water?.dailyGoal || 2500;
    const consumed = log?.total || 0;
    if (goal > 0 && consumed < goal * 0.5) {
      emit('water_low', 'daily', () =>
        `Bugün ${consumed}ml su içtin (hedef: ${goal}ml). Akşam yaklaşıyor — bir bardak su molası? 💧`
      );
    }
  }, [modState.water, emit]);

  // -------------------------------------------------------------------
  // 7: Spor — son antrenman günlerinde kayıt yok
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!modState.gym?.activeProgram) return;
    const log = modState.gym?.exerciseLog || {};
    let skipped = 0;
    for (let i = 1; i <= 10 && skipped < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dow = d.getDay();
      if (![1, 3, 5].includes(dow)) continue; // Pzt/Çar/Cum
      const dateStr = formatDate(d);
      const hasAny = Object.keys(log).some(k => k.endsWith(`_${dateStr}`) && log[k]);
      if (hasAny) break;
      skipped++;
    }
    if (skipped >= 2) {
      emit('gym_skip', 'daily', () =>
        `Son ${skipped} antrenman gününü atladın 💪 Hadi bugün kısa bir seansla başlayalım, ısın ve devam et!`
      );
    }
  }, [modState.gym, emit]);

  // -------------------------------------------------------------------
  // 8: Uyku — son 2 gece < 6 saat
  // -------------------------------------------------------------------
  useEffect(() => {
    const logs = modState.sleep?.logs || [];
    if (logs.length < 2) return;
    const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    const recent2 = sorted.slice(0, 2);
    if (recent2.every(l => l.duration < 6)) {
      const avg = (recent2[0].duration + recent2[1].duration) / 2;
      emit('sleep_low', 'daily', () =>
        `Son 2 gece ortalama ${avg.toFixed(1)} saat uyumuşsun 🌙 Bu gece erken yatmayı dene, vücudun toparlanması lazım.`
      );
    }
  }, [modState.sleep, emit]);

  // -------------------------------------------------------------------
  // 9: İlaç — bugün alınması gereken ilaçlar akşam 19:00 sonrası işaretlenmemiş
  // -------------------------------------------------------------------
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 19) return;
    const today = todayKey();
    const todayDow = TR_DAYS[new Date().getDay()];
    const meds = modState.medicines || [];
    const skipped = meds.filter(m => {
      if (!m.days?.includes(todayDow)) return false;
      const taken = m.takenLog?.[today] || [];
      return taken.length === 0;
    });
    if (skipped.length > 0) {
      const names = skipped.map(m => m.name).join(', ');
      emit('med_skip', 'daily', () =>
        `Bugünkü ${names} ilac${skipped.length > 1 ? 'larını' : 'ını'} henüz işaretlemedin 💊 Aldıysan unutmadan tikle!`
      );
    }
  }, [modState.medicines, emit]);

  // -------------------------------------------------------------------
  // 10: Hedef tahmini — ilerleme yavaş olan hedef için AI değerlendirmesi
  // -------------------------------------------------------------------
  useEffect(() => {
    const goals = modState.goals || [];
    goals.forEach(g => {
      if (g.target <= 0 || g.current >= g.target) return;
      const pct = (g.current / g.target) * 100;
      // Sadece ilerlemesi <%30 olanlar için
      if (pct >= 30) return;
      emit(`goal_pace_${g.id}`, 'daily', async () => {
        try {
          const res = await openaiChat(
            `Kullanıcının "${g.name}" hedefi var. Hedef: ${g.target} ${g.unit}, mevcut: ${g.current} ${g.unit} ` +
            `(%${pct.toFixed(0)}). İlerleme yavaş. Türkçe, 2 cümle: ` +
            `(1) gidişatı kısa değerlendir, (2) 1 somut öneri ver. Markdown KULLANMA, sade düz metin.`
          );
          return res.text;
        } catch { return ''; }
      }, g.id);
    });
  }, [modState.goals, emit]);

  // -------------------------------------------------------------------
  // 11: Yeni hedef oluşturuldu (count artışı)
  // -------------------------------------------------------------------
  const prevGoalIdsRef = useRef<Set<string> | null>(null);
  useEffect(() => {
    const goals = modState.goals || [];
    const ids = new Set(goals.map(g => g.id));
    if (prevGoalIdsRef.current !== null) {
      const newOnes = goals.filter(g => !prevGoalIdsRef.current!.has(g.id));
      newOnes.forEach(g => {
        emit(`new_goal_${g.id}`, 'once', () =>
          `Yeni hedef güzel: "${g.name}" 🎯 Hedefi alt görevlere bölmek ister misin? Takvime küçük adımlar ekleyebiliriz.`,
          g.id
        );
      });
    }
    prevGoalIdsRef.current = ids;
  }, [modState.goals, emit]);

  // -------------------------------------------------------------------
  // 12: Streak kırıldı — 3+ günlük su streak'i bugün sıfır (akşam 22:00+)
  // -------------------------------------------------------------------
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 22) return;
    const log = modState.water?.log || {};
    const today = todayKey();
    let streak = 0;
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatDate(d);
      if (log[dateStr] && log[dateStr].total > 0) streak++;
      else break;
    }
    const todayTotal = log[today]?.total || 0;
    if (streak >= 3 && todayTotal === 0) {
      emit('streak_broken', 'daily', () =>
        `${streak} günlük su streak'in vardı 🔥 Bugün hiç su girmemişsin — 1 bardak için bile geç değil 💧`
      );
    }
  }, [modState.water, emit]);

  // -------------------------------------------------------------------
  // 13: Doğum günü 0-3 gün kala + hediye planı yok
  // -------------------------------------------------------------------
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birthdays = modState.birthdays || [];
    birthdays.forEach(b => {
      if (b.giftPlanned) return;
      const bday = new Date(b.date);
      if (Number.isNaN(bday.getTime())) return;
      const days = Math.round((bday.getTime() - today.getTime()) / 86_400_000);
      if (days < 0 || days > 3) return;
      const whenText = days === 0 ? 'bugün' : `${days} gün sonra`;
      emit(`bday_${b.id}`, 'daily', () =>
        `${b.name}'in doğum günü ${whenText} 🎂 Hediye planın var mı? Bütçe ve fikir ekleyebiliriz.`,
        b.id
      );
    });
  }, [modState.birthdays, emit]);

  // -------------------------------------------------------------------
  // 14: Aylık bütçenin %80+ kullanılmış
  // -------------------------------------------------------------------
  useEffect(() => {
    const budget = modState.budget;
    if (!budget?.income || budget.income <= 0) return;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthly = (budget.expenses || []).filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    const total = monthly.reduce((acc, e) => acc + e.amount, 0);
    const pct = (total / budget.income) * 100;
    if (pct < 80) return;
    const byCat: Record<string, number> = {};
    monthly.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
    const topPart = top ? `En çok harcama: ${top[0]} (₺${top[1].toLocaleString('tr-TR')}). ` : '';
    emit('budget_warn', 'daily', () =>
      `Aylık bütçenin %${pct.toFixed(0)}'i kullanılmış (₺${total.toLocaleString('tr-TR')}/₺${budget.income.toLocaleString('tr-TR')}). ${topPart}Ay sonuna dikkat 💸`
    );
  }, [modState.budget, emit]);
}
