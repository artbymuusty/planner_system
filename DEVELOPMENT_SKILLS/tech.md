## UI Tech

[ui ux pro max kutuphane](https://ui-ux-pro-max-skill.nextlevelbuilder.io/)

---

## Framework

- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **Framer Motion** — sayfa geçişleri, modül animasyonları
- **shadcn/ui** — temel component seti (Button, Dialog, Card, Tabs…)
- **PWA** — offline destek, ana ekrana ekle, push notification

---

## Backend — Supabase

- **Auth:** Email/password + Google OAuth (Supabase Auth)
- **Database:** PostgreSQL — events, modules, user profiles
- **Realtime:** Supabase Realtime subscriptions → çoklu cihaz senkronizasyonu
- **Storage:** Supabase Storage — profil fotoğrafı, receipt görselleri
- **Edge Functions:** Zamanlanmış bildirimler (ilaç, doğum günü, su hatırlatıcı)
- **Row Level Security:** Kullanıcı verisi izolasyonu

---

## State Management

- **Zustand** — global client state (mevcut `state` + `modState` yerine)
- **TanStack Query (React Query)** — server state, cache, optimistic updates

---

## AI & Akıllı Özellikler

- **OpenAI GPT-4o-mini**
  - Sol alt panel AI Asistan (sohbet + planlama önerileri)
  - Doğal dil ile etkinlik oluşturma: *"Yarın saat 3'te gym"*
  - Haftalık özet rapor üretme (uyku/su/hedef analizi)
- **OpenAI Vision (GPT-4o)**
  - Fiş/fatura tarama → bütçe modülüne otomatik gider ekleme
  - İlaç kutusu fotoğrafı → ilaç bilgilerini otomatik doldurma

---

## Grafikler & Analitik

- **Recharts** veya **Tremor** — haftalık/aylık trend grafikleri
  - Uyku kalitesi grafiği (14 günlük)
  - Su tüketimi trendi
  - Hedef ilerleme timeline
  - Bütçe kategori dağılımı (pie chart)

---



## Performans & Kalite

- **TanStack Virtual** — uzun listelerde sanal scroll (işlem geçmişi vb.)
- **next/image** — görseller için otomatik optimizasyon
- **Sentry** — hata takibi ve performans izleme
- **Vercel Analytics** — sayfa görüntüleme ve kullanıcı davranışı

---

## Yayınlama

- **Vercel** (önerilen) veya **Cloudflare Pages**
- Custom domain + HTTPS otomatik
- Preview deployments (her PR için)

---

## Lokalizasyon

- **next-intl** — TR / EN dil desteği
- Tüm UI metinleri `messages/tr.json` ve `messages/en.json` içinde

---

## Geliştirme Ortamı

- **TypeScript** — tip güvenliği
- **ESLint + Prettier** — kod stili standardizasyonu
- **Husky + lint-staged** — commit öncesi otomatik lint
- **Storybook** — component geliştirme ve dokümantasyon (isteğe bağlı)

---

## Migration Sırası (Önerilen)

1. Next.js + Tailwind + shadcn kurulumu
2. Supabase bağlantısı (Auth + DB şeması)
3. Mevcut localStorage verilerini Supabase'e taşı
4. Modülleri sırayla React component'larına dönüştür
5. Zustand + TanStack Query entegrasyonu
6. AI Asistan panelini aktif et (OpenAI)
7. PWA yapılandırması
8. Yayınlama (Vercel)
