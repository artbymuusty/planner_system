'use client';

import { useState, useEffect, useCallback } from 'react';

interface TourStep {
  target: string;
  title: string;
  desc: string;
  pos: 'right' | 'bottom' | 'top';
}

const TOUR_STEPS: TourStep[] = [
  { target: '.calendar-section', title: '📅 Haftalık Takvim', desc: 'Tüm etkinlikleriniz burada saatlik olarak gösterilir. Bir etkinliğe tıklayarak tamamlandı olarak işaretleyebilirsiniz.', pos: 'bottom' },
  { target: '#homeBtn', title: '🏠 Ana Sayfa', desc: 'Ana takvim görünümüne dönmek için bu butona tıklayın.', pos: 'right' },
  { target: '#medicineBtn', title: '💊 İlaç Takibi', desc: 'İlaçlarınızı ekleyin, dozaj ve zamanlamalarını takip edin. İlaç azaldığında uyarı alırsınız.', pos: 'right' },
  { target: '#waterBtn', title: '💧 Su Takibi', desc: 'Günlük su tüketiminizi takip edin. Boy/kilo bilgilerinize göre kişisel hedef hesaplanır.', pos: 'right' },
  { target: '#gymBtn', title: '🏋️ Gym Takibi', desc: 'Antrenman programınızı oluşturun, hazır şablonları kullanın ve hareketlerinizi tamamlayın.', pos: 'right' },
  { target: '#birthdayBtn', title: '🎂 Doğum Günleri', desc: 'Yakınlarınızın doğum günlerini ekleyin, hediye takibi yapın. Takvimde üst kısımda banner olarak görünür.', pos: 'right' },
  { target: '#budgetBtn', title: '💰 Bütçe & Alışveriş', desc: 'Aylık gelir ve harcamalarınızı takip edin. Market alışveriş listeleri oluşturup takvimde gösterin.', pos: 'right' },
  { target: '#sleepBtn', title: '😴 Uyku Takibi', desc: 'Uyku saatlerinizi kaydedin, detaylı sağlık raporu alın. Yetersiz uykunun etkilerini görün.', pos: 'right' },
  { target: '#goalsBtn', title: '🎯 Hedef Takibi', desc: 'Kişisel hedefler belirleyin ve ilerlemenizi takip edin. Motivasyon mesajları ile hedefe ulaşın!', pos: 'right' },
  { target: '#statisticsBtn', title: '📊 İstatistikler', desc: 'Tamamlanma ve erteleme analizlerini ayrı panelde görüntüleyebilirsiniz.', pos: 'right' },
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
    const pw = 340, ph = 180;
    let top: number, left: number;
    let aC = '';

    if (pos === 'right') {
      top = rect.top + rect.height / 2 - ph / 2;
      left = rect.right + 16;
      aC = 'arrow-left';
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
