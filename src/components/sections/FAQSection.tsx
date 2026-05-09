'use client';

import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'Hackathon Planner nedir?',
    a: 'Hackathon Planner, hackathon etkinlikleri için tasarlanmış bir haftalık planlama ve görev yönetim aracıdır. Etkinliklerinizi kolayca planlayabilir, takip edebilir ve tamamlanma durumlarını kontrol edebilirsiniz.',
  },
  {
    q: 'Etkinlik nasıl eklenir?',
    a: 'Sol kenar çubuğundaki yeşil "+" butonuna tıklayarak etkinlik ekleme formunu açabilirsiniz. Etkinlik adı, tarih, saat ve önem seviyesini belirleyerek yeni etkinlik oluşturabilirsiniz.',
  },
  {
    q: 'Önem seviyeleri ne anlama geliyor?',
    a: 'Kırmızı: En yüksek öncelikli görevler (kritik). Turuncu: Orta öncelikli görevler. Mavi: Düşük öncelikli görevler. Renk kodları sayesinde görevlerinizi hızlıca önceliklendirebilirsiniz.',
  },
  {
    q: 'Tamamlanan görevleri nasıl işaretlerim?',
    a: 'Takvimde bir etkinliğe tıklayarak onu tamamlandı olarak işaretleyebilirsiniz. Tamamlanan görevler yeşil renk alır ve üzeri çizili gösterilir.',
  },
  {
    q: 'Verilerim güvende mi?',
    a: 'Tüm verileriniz tarayıcınızın yerel depolama alanında (localStorage) saklanır. Verileriniz sunuculara gönderilmez ve tamamen cihazınızda kalır.',
  },
  {
    q: 'Etkinlik nasıl silinir?',
    a: 'Sol kenar çubuğundaki kırmızı "−" butonuna tıklayarak silme modunu aktif edin. Ardından silmek istediğiniz etkinlikteki "×" işaretine tıklayın. Onay verdikten sonra etkinlik silinecektir.',
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="faq-section" id="faqSection">
      <h2>❓ Sıkça Sorulan Sorular</h2>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`}>
          <div className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
            <span>{item.q}</span>
            <span className="arrow">▼</span>
          </div>
          <div className="faq-answer">{item.a}</div>
        </div>
      ))}
    </section>
  );
}
