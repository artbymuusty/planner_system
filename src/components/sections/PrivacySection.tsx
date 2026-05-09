export default function PrivacySection() {
  const cards = [
    { icon: '🛡️', title: 'Veri Güvenliği', text: 'Tüm verileriniz AES-256 şifreleme standardıyla korunur. Yerel depolama üzerinde güvenli bir şekilde saklanır.' },
    { icon: '🔐', title: 'Gizlilik Politikası', text: 'Kişisel bilgileriniz üçüncü taraflarla paylaşılmaz. KVKK ve GDPR uyumlu veri işleme politikalarımız mevcuttur.' },
    { icon: '📋', title: 'Kullanım Koşulları', text: 'Uygulamayı kullanarak hizmet şartlarımızı kabul etmiş olursunuz. Detaylı bilgi için kullanım koşulları sayfamızı ziyaret edin.' },
    { icon: '🍪', title: 'Çerez Politikası', text: 'Uygulama deneyiminizi iyileştirmek için temel çerezler kullanılmaktadır. Üçüncü taraf çerezleri kullanılmamaktadır.' },
    { icon: '📧', title: 'İletişim', text: 'Gizlilik ve güvenlik ile ilgili sorularınız için destek ekibimize support@hackplanner.com adresinden ulaşabilirsiniz.' },
    { icon: '⚖️', title: 'Yasal Haklar', text: 'Tüm hakları saklıdır. © 2026 Hackathon Planner. Bu uygulama Türkiye Cumhuriyeti yasalarına tabidir.' },
  ];

  return (
    <section className="privacy-section" id="privacySection">
      <h2>🔒 Gizlilik & Güvenlik</h2>
      <div className="privacy-grid">
        {cards.map((c, i) => (
          <div key={i} className="privacy-card">
            <div className="icon">{c.icon}</div>
            <h4>{c.title}</h4>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
