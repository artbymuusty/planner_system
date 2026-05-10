# Life Planner

## Proje Hakkında

Life Planner, PlanFlow AI Challenge kapsamında geliştirilmiş AI destekli bir görev planlama ve davranış analizi sistemidir.

Seçilen Problem:
### Problem 3 — Sürekli Ertelenen Görevler

Birçok kullanıcı görevlerini yalnızca unutkanlık nedeniyle değil; yorgunluk, mental yük, belirsizlik, yanlış süre tahmini veya beklenmedik durumlar nedeniyle sürekli ertelemektedir. Bu durum zamanla görevlerin psikolojik olarak daha büyük görünmesine ve kullanıcıların göreve başlamasını daha zor hale getirmesine neden olmaktadır.

Bu proje, kullanıcıya daha fazla bildirim göndermek yerine erteleme davranışının nedenlerini anlamaya ve kullanıcıyı yeniden harekete geçirmeye odaklanmaktadır.

---

# Proje Amacı

Life Planner’ın amacı kullanıcıların sürekli ertelediği görevleri analiz ederek:
- erteleme davranışını takip etmek,
- görevin neden ertelenmiş olabileceğini yorumlamak,
- görevleri daha küçük ve uygulanabilir parçalara bölmek,
- kullanıcıya başlangıç önerileri sunmak,
- yeniden planlama oluşturmak

ve kullanıcıyı psikolojik olarak göreve başlatmayı kolaylaştırmaktır.

Sistem klasik bir yapılacaklar listesi uygulaması yerine kullanıcı davranışını analiz eden bir “AI mentor” mantığında çalışmaktadır.

---

# Temel Özellikler

- Erteleme davranışı takibi
- AI destekli görev analizi
- Görev küçültme sistemi
- Akıllı yeniden planlama
- Başlangıç oturumu önerileri
- Kullanıcı davranışı analizi
- Kişiselleştirilmiş AI önerileri
- Sade ve kullanıcı dostu arayüz

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

# Sistem Mimarisi

Sistem temel olarak kullanıcı arayüzü, görev takip sistemi ve AI analiz katmanından oluşmaktadır.

Kullanıcı tarafından oluşturulan görevler sistem içerisinde kayıt altına alınmaktadır. Bir görev ertelendiğinde sistem:
- görevin kaç kez ertelendiğini,
- hangi zaman aralıklarında ertelendiğini,
- kullanıcı geri bildirimlerini,
- tekrar eden davranışları

analiz etmektedir.

Toplanan veriler AI analiz katmanına gönderilmektedir. Yapay zeka burada görevin neden ertelenmiş olabileceğini yorumlayarak kullanıcıya özel öneriler oluşturmaktadır.

Bu öneriler:
- görevi küçük parçalara bölme,
- başlangıç adımı oluşturma,
- yeniden planlama yapma,
- daha uygun çalışma zamanı önerme

gibi işlemleri kapsamaktadır.

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

# Demo Kullanım Senaryosu

1. Kullanıcı yeni bir görev oluşturur.
2. Görev birkaç kez ertelenir.
3. Sistem erteleme davranışını analiz eder.
4. AI olası erteleme nedenlerini yorumlar.
5. Görev küçük ve uygulanabilir adımlara bölünür.
6. Kullanıcıya yeniden başlama önerileri sunulur.

Örnek:
“Bitirme Projesi Raporu Yaz”

AI önerileri:
- Başlıkları oluştur
- Giriş paragrafını yaz
- Kaynak listesini düzenle
- 15 dakikalık başlangıç oturumu başlat

---

# Kurulum

Projeyi klonlayın:

```bash
git clone https://github.com/repository-link.git
```

Proje klasörüne girin:

```bash
cd plannersystem
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

# Karşılaşılan Zorluklar

- İnsan davranışını teknik veriler ile yorumlamak
- Erteleme nedenlerini tahmin etmek
- Kullanıcıyı baskılamayan AI önerileri üretmek
- Görevleri daha gerçekçi ve uygulanabilir hale getirmek

---

# Gelecek Geliştirme Planları

- Takvim entegrasyonu
- Enerji ve yoğunluk analizi
- AI üretkenlik skorlama sistemi
- Sesli asistan entegrasyonu
- Mobil uygulama desteği
- Alışkanlık öğrenme modeli
- Adaptif günlük planlama sistemi

---

# Takım

ZENITH TEAM