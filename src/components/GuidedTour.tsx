'use client';

import { useState, useEffect, useCallback } from 'react';

interface TourStep {
  target: string;
  title: string;
  desc: string;
  pos: 'right' | 'bottom' | 'top' | 'left';
}

const TOUR_STEPS: TourStep[] = [
  { target: '.topbar-tour-btn', title: '🎓 Eğitim Modu', desc: 'Bu buton uygulamadaki ana akışları adım adım gösterir. Yeni eklenen AI fotoğraf analizi, taslak düzenleme ve otomatik kayıt özelliklerini de buradan öğrenebilirsin.', pos: 'bottom' },
  { target: '.topbar-profile-btn', title: '👤 Test Kullanıcı', desc: 'Uygulama artık kayıt veya giriş istemez. Buraya tıklayınca sadece Test Kullanıcı oturum popupı açılır ve Kapat ile ekrana dönersin.', pos: 'bottom' },
  { target: '.cal-main-header', title: '📅 Ana Takvim', desc: 'Zamanını yönetmeye buradan başla. AI bir fotoğraftan tarihli görev veya etkinlik çıkardığında takvime ekler ve seni ilgili haftaya götürür.', pos: 'bottom' },
  { target: '#homeBtn', title: '🏠 Navigasyon', desc: 'Bu menü ile farklı modüllere hızlıca geçiş yapabilirsin. AI bir şey eklediğinde ilgili modül, örneğin İlaçlarım veya Harcamalar, otomatik açılır.', pos: 'right' },
  { target: '.assistant-fab', title: '🤖 AI Asistan', desc: 'Sağ alttaki asistana fotoğraf verebilirsin. Asistan önce içeriği analiz eder, ekleme taslağını liste halinde gösterir; Düzenle ile satırları değiştirip sonra Ekle dersin.', pos: 'left' },
  { target: '#medicineBtn', title: '💊 İlaç & Sağlık', desc: 'İlaç kutusu veya reçete fotoğrafı verdiğinde ilaç adı, doz ve kullanım notları taslağa düşer. Onayladığında sol menüdeki İlaçlarım alanına eklenir.', pos: 'right' },
  { target: '#waterBtn', title: '💧 Hidrasyon', desc: 'Boy ve kilona göre su hedefini belirle. Yeterli su içmek odaklanmanı %15 artırır.', pos: 'right' },
  { target: '#gymBtn', title: '🏋️ Spor Takibi', desc: 'Antrenman programını oluştur veya hazır şablonlardan (Evde, Kardiyo vb.) seçim yap.', pos: 'right' },
  { target: '#birthdayBtn', title: '🎂 Hatırlatıcı', desc: 'Sevdiklerinin doğum günlerini ve hediye planlarını buradan yönet. Unutma, küçük sürprizler bağları güçlendirir.', pos: 'right' },
  { target: '#budgetBtn', title: '💰 Finans Yönetimi', desc: 'Gelir-gider dengeni koru. Fiş veya makbuz fotoğrafı yüklersen asistan toplam tutarı, satıcıyı ve kategoriyi çıkarıp Harcamalar taslağına ekler.', pos: 'right' },
  { target: '#sleepBtn', title: '😴 Uyku Kalitesi', desc: 'Uyku düzenini takip et ve haftalık raporlarını incele. Kaliteli uyku, kaliteli bir gün demektir.', pos: 'right' },
  { target: '#journalBtn', title: '📓 Günlük', desc: 'Gün içinde aldığın notları ve duygu durumunu burada tut. Takvim, ders, sağlık ve bütçe kayıtlarınla birlikte günlük planını tamamlar.', pos: 'right' },
  { target: '#studyBtn', title: '📚 Kütüphane', desc: 'Derslerini raflara diz, Pomodoro sayacı ile odaklan ve çalışma günlüğünü tut. El yazısı ödev listesi fotoğrafı verdiğinde tarihli ödevler takvime aktarılır.', pos: 'right' },
  { target: '#statisticsBtn', title: '📊 Analizler', desc: 'Geriye dönük performansını, erteleme alışkanlıklarını ve başarı oranlarını buradan izle. OpenAI anahtarı varsa haftalık AI özetleri de çalışır.', pos: 'right' },
  { target: '#settingsBtn', title: '⚙️ Ayarlar', desc: 'OpenAI API anahtarı .env dosyasında yoksa Ayarlar ekranı senden anahtar eklemeni ister. .env varsa uygulama onu kullanır, Vercel ortam değişkenleriyle de çalışır.', pos: 'right' },
  { target: '.topbar-search', title: '🔎 Hızlı Arama', desc: 'Etkinlik, görev veya not arayarak yoğun takvim içinde hızlıca sonuç bulabilirsin. Görünüm düğmeleriyle gün, hafta ve ay moduna geçebilirsin.', pos: 'bottom' },
  { target: '.topbar-actions', title: '🔔 Bildirimler', desc: 'Zil verimlilik ipuçlarını gösterir. Yanındaki eğitim ve profil butonları artık yeni Test Kullanıcı ve rehber akışlarıyla uyumlu çalışır.', pos: 'bottom' },
];

interface Props {
  active: boolean;
  onEnd: () => void;
}

export default function GuidedTour({ active, onEnd }: Props) {
  const [step, setStep] = useState(0);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' });
  const [arrowClass, setArrowClass] = useState('');

  const positionPopup = useCallback((el: Element, pos: string) => {
    const rect = el.getBoundingClientRect();
    const pw = 340, ph = 220;
    let top: number, left: number;
    let aC = '';

    if (pos === 'right') {
      top = rect.top + rect.height / 2 - ph / 2;
      left = rect.right + 16;
      aC = 'arrow-left';
    } else if (pos === 'left') {
      top = rect.top + rect.height / 2 - ph / 2;
      left = rect.left - pw - 16;
      aC = 'arrow-right';
    } else if (pos === 'bottom') {
      top = rect.bottom + 16;
      left = rect.left + rect.width / 2 - pw / 2;
      aC = 'arrow-top';
    } else {
      top = rect.top - ph - 16;
      left = rect.left + rect.width / 2 - pw / 2;
      aC = 'arrow-bottom';
    }
    top = Math.max(10, Math.min(top, window.innerHeight - ph - 10));
    left = Math.max(10, Math.min(left, window.innerWidth - pw - 10));
    setPopupStyle({ top, left, transform: 'none' });
    setArrowClass(aC);
  }, []);

  useEffect(() => {
    if (!active) return;
    document.querySelectorAll('.tour-highlight').forEach(e => e.classList.remove('tour-highlight'));
    const s = TOUR_STEPS[step];
    if (!s) return;
    const el = document.querySelector(s.target);
    if (el) {
      el.classList.add('tour-highlight');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => positionPopup(el, s.pos), 300);
    } else {
      setPopupStyle({ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' });
      setArrowClass('');
    }
  }, [active, step, positionPopup]);

  if (!active) return null;

  const current = TOUR_STEPS[step];

  const handleEnd = () => {
    document.querySelectorAll('.tour-highlight').forEach(e => e.classList.remove('tour-highlight'));
    onEnd();
  };

  return (
    <div className="tour-overlay active" id="tourOverlay">
      <div className="tour-backdrop" id="tourBackdrop" />
      <div className="tour-popup" id="tourPopup" style={popupStyle}>
        {arrowClass && <div className={`tour-arrow ${arrowClass}`} id="tourArrow" />}
        <div className="tour-step-indicator">{step + 1} / {TOUR_STEPS.length}</div>
        <h3>{current.title}</h3>
        <p>{current.desc}</p>
        <div className="tour-btns">
          <button className="tour-btn-skip" onClick={handleEnd}>Kapat</button>
          <div style={{ display: 'flex', gap: 6 }}>
            {step > 0 && (
              <button className="tour-btn-prev" onClick={() => setStep(s => s - 1)}>← Geri</button>
            )}
            <button
              className="tour-btn-next"
              onClick={() => {
                if (step >= TOUR_STEPS.length - 1) handleEnd();
                else setStep(s => s + 1);
              }}
            >
              {step === TOUR_STEPS.length - 1 ? 'Bitir ✓' : 'İleri →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
