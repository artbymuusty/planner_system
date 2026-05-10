/**
 * AI Context Builders
 * --------------------
 * Asistan'a gönderilecek prompt'lara **gerçek kullanıcı verisini** enjekte eden
 * yardımcılar. Suggested prompt çipleri tıklandığında veya kullanıcının yazdığı
 * metin context gerektiren bir konuya işaret ettiğinde kullanılır.
 *
 * Tasarım ilkesi: prompt'lar hep Türkçe, kompakt (token israf etme),
 * sayısal/gerçek alanlar açık ve etiketli.
 */

import type { PlannerEvent, ModuleState } from '@/types';
import { formatDate, getWeekDates } from '@/lib/dateUtils';
import { POSTPONE_REASON_LABELS } from '@/lib/constants';

/* ---------------------------------------------------------------------------
 *  ORTAK YARDIMCILAR
 * --------------------------------------------------------------------------- */

const TR_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

function fmtTL(n: number): string {
  return `₺${n.toLocaleString('tr-TR')}`;
}

function safeName(s: string): string {
  return s.replace(/"/g, '\\"');
}

function describeEvent(e: PlannerEvent): string {
  const time = e.startTime && e.startTime !== '00:00' ? ` ${e.startTime}` : '';
  const cat = e.category ? ` [${e.category}]` : '';
  const imp = e.importance === 'high' ? ' ★' : '';
  const status = e.completed ? ' ✓' : '';
  const pp = (e.postponeCount || 0) > 0 ? ` (${e.postponeCount}x ertelenmiş)` : '';
  return `- "${safeName(e.name)}"${time}${cat}${imp}${status}${pp}`;
}

/* ---------------------------------------------------------------------------
 *  HAFTALIK ÖZET CONTEXT'İ
 * --------------------------------------------------------------------------- */

export function buildWeeklyContext(events: PlannerEvent[], weekStart: Date): string {
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
    .map(([k, c]) => `${POSTPONE_REASON_LABELS[k] || k}: ${c}`);

  const topPostponed = [...inWeek]
    .filter(e => (e.postponeCount || 0) > 0)
    .sort((a, b) => (b.postponeCount || 0) - (a.postponeCount || 0))
    .slice(0, 3)
    .map(e => `"${safeName(e.name)}" (${e.postponeCount}x)`);

  const catMap: Record<string, { total: number; completed: number }> = {};
  inWeek.forEach(e => {
    const k = e.category || 'other';
    catMap[k] ||= { total: 0, completed: 0 };
    catMap[k].total++;
    if (e.completed) catMap[k].completed++;
  });
  const catLines = Object.entries(catMap)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([cat, v]) => `${cat}: ${v.completed}/${v.total}`);

  const first = dates[0];
  const last = dates[dates.length - 1];
  const weekRange = `${first.getDate()}.${first.getMonth() + 1} - ${last.getDate()}.${last.getMonth() + 1}.${last.getFullYear()}`;

  return [
    `[Gerçek Haftalık İstatistikler — ${weekRange}]`,
    `Toplam görev: ${total}`,
    `Tamamlanan: ${completed} (%${completionRate})`,
    `Tamamlanmayan: ${uncompleted}`,
    `Toplam erteleme: ${totalPostpones}`,
    `Kronik (3+ ertelenen) görev sayısı: ${chronicCount}`,
    `En sık erteleme nedenleri: ${topReasons.length ? topReasons.join(', ') : 'yok'}`,
    `En çok ertelenen görevler: ${topPostponed.length ? topPostponed.join(', ') : 'yok'}`,
    `Kategori dağılımı (tamamlanan/toplam): ${catLines.length ? catLines.join(', ') : 'yok'}`,
  ].join('\n');
}

export function buildWeeklyPrompt(events: PlannerEvent[], weekStart: Date): string {
  const ctx = buildWeeklyContext(events, weekStart);
  return `Sen kişisel verimlilik koçusun. Aşağıdaki GERÇEK haftalık planner istatistiklerine bakarak Türkçe, kısa (3-5 cümle), samimi ve motive edici bir özet yaz. Önce 1 cümle genel değerlendirme, sonra 1-2 cümle güçlü yan, sonra 1-2 cümle nazik bir öneri. Sayıları metne doğal olarak yedir. Madde işareti veya başlık kullanma — sadece akıcı paragraf. Markdown KULLANMA.

${ctx}`;
}

/* ---------------------------------------------------------------------------
 *  ERTELEME ANALİZİ CONTEXT'İ
 * --------------------------------------------------------------------------- */

export function buildPostponeContext(events: PlannerEvent[]): string {
  const postponed = events.filter(e => (e.postponeCount || 0) > 0);
  if (postponed.length === 0) {
    return '[Erteleme Verisi]\nHiç ertelenmiş görev yok.';
  }

  const total = postponed.length;
  const totalPostpones = postponed.reduce((s, e) => s + (e.postponeCount || 0), 0);
  const chronic = postponed.filter(e => (e.postponeCount || 0) >= 3);

  // Top 5 en çok ertelenen
  const top = [...postponed]
    .sort((a, b) => (b.postponeCount || 0) - (a.postponeCount || 0))
    .slice(0, 5);

  // Reason dağılımı
  const reasonCounts: Record<string, number> = {};
  postponed.forEach(e => {
    (e.postponeHistory || []).forEach(h => {
      reasonCounts[h.reason] = (reasonCounts[h.reason] || 0) + 1;
    });
  });
  const reasonLines = Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, c]) => `${POSTPONE_REASON_LABELS[k] || k}: ${c}`);

  // Kategori dağılımı (sadece ertelenenler)
  const catCounts: Record<string, number> = {};
  postponed.forEach(e => {
    const k = e.category || 'other';
    catCounts[k] = (catCounts[k] || 0) + (e.postponeCount || 0);
  });
  const catLines = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, c]) => `${k}: ${c} erteleme`);

  const lines: string[] = [
    `[Gerçek Erteleme Verisi]`,
    `Toplam ertelenmiş görev: ${total}`,
    `Toplam erteleme sayısı: ${totalPostpones}`,
    `Kronik (3+ ertelenmiş) görev: ${chronic.length}`,
    '',
    `En çok ertelenen görevler (önem ve kategoriyle):`,
  ];
  top.forEach(e => {
    const reasonsForThis = (e.postponeHistory || [])
      .map(h => POSTPONE_REASON_LABELS[h.reason] || h.reason)
      .join(', ');
    lines.push(
      `- "${safeName(e.name)}" → ${e.postponeCount}x ertelenmiş` +
      ` | önem: ${e.importance}` +
      ` | kategori: ${e.category}` +
      (reasonsForThis ? ` | nedenler: ${reasonsForThis}` : '')
    );
  });
  lines.push('');
  lines.push(`Erteleme nedenleri (toplam): ${reasonLines.length ? reasonLines.join(', ') : 'belirtilmemiş'}`);
  lines.push(`Kategori dağılımı: ${catLines.length ? catLines.join(', ') : 'yok'}`);
  return lines.join('\n');
}

export function buildPostponePrompt(events: PlannerEvent[]): string {
  const ctx = buildPostponeContext(events);
  return `Sen kişisel verimlilik koçusun. Aşağıdaki GERÇEK erteleme verisini analiz et ve Türkçe, samimi bir analiz yap. Yapı:
1) 2-3 cümle genel patern değerlendirmesi (en çok hangi tip görev/kategori erteleniyor, neden olabilir).
2) En kritik 1-2 görevi ismiyle vurgula ve **niye** sıkıntılı olabileceğini söyle (ipucu: ertelenme nedenleri ve kategori).
3) 2-3 madde halinde ("• " ile başlayarak) somut, küçük, hemen uygulanabilir öneri.
Markdown başlık/kalın KULLANMA, sade düz metin. Sayıları metne doğal olarak yedir.

${ctx}`;
}

/* ---------------------------------------------------------------------------
 *  YARIN İÇİN PLAN CONTEXT'İ
 * --------------------------------------------------------------------------- */

export function buildTomorrowContext(events: PlannerEvent[]): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);
  const dayName = TR_DAYS[tomorrow.getDay()];

  const tEvents = events
    .filter(e => e.date === tomorrowStr && e.kind !== 'goal')
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  // Bugün biten/kalanları da bağlam olarak ekle
  const todayStr = formatDate(new Date());
  const todayUncompleted = events.filter(
    e => e.date === todayStr && !e.completed && e.kind !== 'goal'
  );

  const lines: string[] = [
    `[Yarın — ${dayName}, ${tomorrowStr}]`,
  ];
  if (tEvents.length === 0) {
    lines.push(`Planlı görev yok.`);
  } else {
    lines.push(`Planlanmış ${tEvents.length} görev:`);
    tEvents.forEach(e => lines.push(describeEvent(e)));
  }
  if (todayUncompleted.length > 0) {
    lines.push('');
    lines.push(`Bugünden kalan ${todayUncompleted.length} açık görev (yarına taşıma adayı):`);
    todayUncompleted.slice(0, 6).forEach(e => lines.push(describeEvent(e)));
  }
  return lines.join('\n');
}

export function buildTomorrowPrompt(events: PlannerEvent[]): string {
  const ctx = buildTomorrowContext(events);
  return `Sen verimlilik koçusun. Aşağıdaki GERÇEK yarın planına ve bugünden kalanlara bakarak Türkçe, somut bir günlük plan öner. 4-6 cümle. Sabah/öğle/akşam bloklarına göre öncelikleri sırala, mola zamanlarını ekle, en yüksek öncelikli görevi sabaha al. Mevcut görev isimlerini kullan, yeni iş icat etme. Markdown KULLANMA.

${ctx}`;
}

/* ---------------------------------------------------------------------------
 *  HEDEF İLERLEMESİ CONTEXT'İ
 * --------------------------------------------------------------------------- */

export function buildGoalsContext(modState: ModuleState): string {
  const goals = modState.goals || [];
  if (goals.length === 0) return '[Hedef Verisi]\nHenüz tanımlanmış hedef yok.';
  const lines = ['[Gerçek Hedef İlerlemesi]'];
  goals.forEach(g => {
    const pct = g.target > 0 ? Math.round((g.current / g.target) * 100) : 0;
    lines.push(`- "${safeName(g.name)}": ${g.current}/${g.target} ${g.unit} (%${pct})`);
  });
  return lines.join('\n');
}

export function buildGoalsPrompt(modState: ModuleState): string {
  const ctx = buildGoalsContext(modState);
  return `Aşağıdaki GERÇEK hedef ilerleme verisine bakarak Türkçe, kısa (3-5 cümle) bir değerlendirme yap. Hangi hedefte iyi gidildiğini, hangisinde geride kalındığını isimleriyle söyle. Sonunda 1 somut adım öner. Markdown KULLANMA, sade düz metin.

${ctx}`;
}

/* ---------------------------------------------------------------------------
 *  SAĞLIK ÖZETİ CONTEXT'İ (su + uyku + spor + ilaç)
 * --------------------------------------------------------------------------- */

export function buildHealthContext(modState: ModuleState): string {
  const today = formatDate(new Date());
  const lines: string[] = ['[Gerçek Sağlık Verisi — son 7 gün]'];

  // Su — son 7 gün ortalama
  const waterLog = modState.water?.log || {};
  const goal = modState.water?.dailyGoal || 0;
  const last7Water: number[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = formatDate(d);
    last7Water.push(waterLog[k]?.total || 0);
  }
  const avgWater = Math.round(last7Water.reduce((a, b) => a + b, 0) / 7);
  const todayWater = waterLog[today]?.total || 0;
  lines.push(`Su: bugün ${todayWater}ml / hedef ${goal}ml | son 7 gün ort. ${avgWater}ml/gün`);

  // Uyku — son 7 log
  const sleepLogs = (modState.sleep?.logs || [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);
  if (sleepLogs.length > 0) {
    const avg = sleepLogs.reduce((s, l) => s + l.duration, 0) / sleepLogs.length;
    const min = Math.min(...sleepLogs.map(l => l.duration));
    const max = Math.max(...sleepLogs.map(l => l.duration));
    lines.push(`Uyku: son ${sleepLogs.length} gece ort. ${avg.toFixed(1)} saat (min ${min.toFixed(1)} / max ${max.toFixed(1)})`);
  } else {
    lines.push(`Uyku: kayıt yok`);
  }

  // Spor — son 7 günde yapılan egzersiz sayısı
  const exLog = modState.gym?.exerciseLog || {};
  let gymDays = 0;
  let gymCheckedTotal = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = formatDate(d);
    const dayChecked = Object.keys(exLog).filter(key => key.endsWith(`_${k}`) && exLog[key]).length;
    if (dayChecked > 0) gymDays++;
    gymCheckedTotal += dayChecked;
  }
  lines.push(`Spor: son 7 günde ${gymDays} antrenman günü, toplam ${gymCheckedTotal} egzersiz tikli`);

  // İlaç — bugün
  const meds = modState.medicines || [];
  const todayDow = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][new Date().getDay()];
  const todayMeds = meds.filter(m => m.days?.includes(todayDow));
  const takenToday = todayMeds.filter(m => (m.takenLog?.[today] || []).length > 0).length;
  lines.push(`İlaç: bugün ${takenToday}/${todayMeds.length} alındı (${todayMeds.map(m => m.name).join(', ') || '—'})`);

  return lines.join('\n');
}

export function buildHealthPrompt(modState: ModuleState): string {
  const ctx = buildHealthContext(modState);
  return `Aşağıdaki GERÇEK sağlık verisine (su, uyku, spor, ilaç) bakarak Türkçe, kısa bir değerlendirme yap. 4-5 cümle. Hangi alanda iyi olduğunu, hangisinin dikkat istediğini söyle ve 1-2 küçük somut iyileştirme öner. Sayıları doğal olarak metne yedir. Markdown KULLANMA.

${ctx}`;
}

/* ---------------------------------------------------------------------------
 *  POMODORO ÖNERİSİ CONTEXT'İ
 * --------------------------------------------------------------------------- */

export function buildPomodoroContext(events: PlannerEvent[], modState: ModuleState): string {
  const today = formatDate(new Date());
  const todayTasks = events
    .filter(e => e.date === today && !e.completed && e.kind !== 'goal')
    .slice(0, 8);
  const subjects = (modState.study?.subjects || []).slice(0, 6);

  const lines: string[] = [`[Bugün — ${today}]`];
  if (todayTasks.length === 0) {
    lines.push(`Bugün için açık görev yok.`);
  } else {
    lines.push(`Bugün açık ${todayTasks.length} görev:`);
    todayTasks.forEach(e => lines.push(describeEvent(e)));
  }
  if (subjects.length > 0) {
    lines.push('');
    lines.push(`Çalışma rafları: ${subjects.map(s => s.name).join(', ')}`);
  }
  return lines.join('\n');
}

export function buildPomodoroPrompt(events: PlannerEvent[], modState: ModuleState): string {
  const ctx = buildPomodoroContext(events, modState);
  return `Aşağıdaki GERÇEK bugün listesi ve çalışma raflarına bakarak ideal bir pomodoro planı öner. Türkçe, somut. 25 dk çalışma + 5 dk mola standardını kullan, en yüksek öncelikli/işten gerideki göreve daha fazla seans ayır. 3-5 satırda blok blok yaz (örn: "1) 09:00-09:25 — <görev>"). Mevcut görev isimlerini kullan. Markdown KULLANMA.

${ctx}`;
}

/* ---------------------------------------------------------------------------
 *  HAFİF "HER ZAMAN" CONTEXT'İ — kullanıcı serbest yazdığında
 * --------------------------------------------------------------------------- */

export function buildBaseContext(events: PlannerEvent[], modState: ModuleState): string {
  const today = formatDate(new Date());
  const todayTasks = events.filter(e => e.date === today && e.kind !== 'goal');
  const todayDone = todayTasks.filter(e => e.completed).length;

  const overdue = events.filter(
    e => e.date < today && !e.completed && e.kind !== 'goal'
  ).length;
  const chronic = events.filter(e => (e.postponeCount || 0) >= 3).length;
  const goalsCount = (modState.goals || []).length;
  const dayName = TR_DAYS[new Date().getDay()];

  return [
    `[Kullanıcı durumu — ${dayName}, ${today}]`,
    `Bugün ${todayDone}/${todayTasks.length} görev tamam`,
    `Geçmişten kalan açık görev: ${overdue}`,
    `Kronik (3+) ertelenmiş görev: ${chronic}`,
    `Aktif hedef sayısı: ${goalsCount}`,
  ].join('\n');
}

/* ---------------------------------------------------------------------------
 *  BÜTÇE CONTEXT'İ (ekstra, ileride kullanılabilir)
 * --------------------------------------------------------------------------- */

export function buildBudgetContext(modState: ModuleState): string {
  const b = modState.budget;
  if (!b || !b.income) return '[Bütçe Verisi]\nKayıt yok.';
  const now = new Date();
  const monthly = (b.expenses || []).filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const total = monthly.reduce((s, e) => s + e.amount, 0);
  const pct = b.income > 0 ? Math.round((total / b.income) * 100) : 0;
  const byCat: Record<string, number> = {};
  monthly.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
  const cats = Object.entries(byCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, v]) => `${k}: ${fmtTL(v)}`);
  return [
    `[Aylık Bütçe]`,
    `Gelir: ${fmtTL(b.income)}`,
    `Bu ay harcama: ${fmtTL(total)} (%${pct})`,
    `Top kategoriler: ${cats.join(', ') || 'yok'}`,
  ].join('\n');
}
