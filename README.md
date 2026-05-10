# PlanFlow AI

## Seçilen Problem

Bu proje PlanFlow AI Challenge kapsamında geliştirilmiştir.

Seçilen Problem:
### Problem 3 — Sürekli Ertelenen Görevler

Birçok kullanıcı görevlerini yalnızca unutkanlık nedeniyle değil; yorgunluk, mental yük, belirsizlik, yanlış süre tahmini veya beklenmedik durumlar nedeniyle sürekli ertelemektedir. Bu proje, kullanıcıya daha fazla bildirim göndermek yerine erteleme davranışının nedenlerini anlamaya ve kullanıcıyı göreve başlatmaya odaklanmaktadır.

---

# Proje Fikri

PlanFlow AI, kullanıcıların sürekli ertelediği görevleri analiz eden ve kişiselleştirilmiş başlangıç önerileri oluşturan AI destekli bir planlama asistanıdır.

Sistem:
- ertelenen görevleri analiz eder,
- erteleme davranışlarını takip eder,
- görevleri daha küçük ve uygulanabilir parçalara böler,
- yeniden planlama önerileri oluşturur,
- kullanıcıya küçük başlangıç adımları sunar.

PlanFlow AI klasik bir yapılacaklar listesi uygulaması yerine kullanıcı davranışını analiz eden bir “AI mentor” mantığında çalışmaktadır.

---

# Temel Özellikler

- Erteleme davranışı takibi
- AI destekli görev analizi
- Görev küçültme sistemi
- Başlangıç oturumu önerileri
- Akıllı yeniden planlama
- Kişiselleştirilmiş AI önerileri
- Kullanıcı dostu arayüz

---

# Kullanılan Teknolojiler

## Frontend
- Next.js
- TypeScript
- TailwindCSS

## Yapay Zeka Entegrasyonu
- OpenAI API
- Prompt Engineering

## Veri Saklama
- LocalStorage / Veritabanı Sistemi

---

# Örnek AI Prompt Yapısı

```text
User postponed this task 4 times.
Most common reason: mental fatigue.
Task title: "Write internship report"

Generate:
- 3 small actionable starting steps
- 1 motivational suggestion
- 1 realistic restart session plan
```

---

# Kurulum

Projeyi klonlayın:

```bash
git clone https://github.com/repository-link.git
```

Bağımlılıkları yükleyin:

```bash
npm install
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcıdan açın:

```text
http://localhost:3000
```

---

# Ortam Değişkenleri

`.env.local` dosyası oluşturup aşağıdaki değişkeni ekleyin:

```env
OPENAI_API_KEY=your_openai_api_key
```

---

# Sistem Akışı

```text
[ Kullanıcı Görev Oluşturur ]
                ↓
[ Görev Sisteme Kaydedilir ]
                ↓
[ Görev Ertelenir ]
                ↓
[ Davranış Verileri Toplanır ]
                ↓
[ OpenAI Analizi ]
                ↓
[ AI Önerileri Oluşturulur ]
                ↓
[ Görev Küçültme ve Yeniden Planlama ]
```

---

# Gelecek Geliştirme Planları

- Takvim entegrasyonu
- Enerji ve yoğunluk analizi
- AI üretkenlik skorlama sistemi
- Sesli asistan entegrasyonu
- Mobil uygulama desteği
- Alışkanlık öğrenme modeli

---

# Takım

LIFE PLANNER TEAM
