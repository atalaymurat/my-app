# My - App Postiva
Try to develop a functional SaaS Project

# Run to start
docker compose down -v
docker compose build --no-cache
docker compose up

## Backend
Express Server


## Frontend
nextjs front end
firebase authentication service for users


## Yapılacaklar

Yapı bu sisteme uyumlu hale getirilecek

[x] [Frontend] 
  → Kullanıcı giriş yapar → Firebase'den idToken alır 
  → Token'i backend'e gönderir → 
  
[x] [Backend] 
  → Token'i doğrular → Session cookie oluşturur 
  → Cookie'yi tarayıcıya kaydeder →
  bunu su an yapamadik cinku domainler ayni olmadigi icin server ve frontend cookie okumasi middlewarede yapilamiyor 
  domain ayni olunca useAuth mantik degistirilip middleware ile route korumasi yapilacak
  
[x] [Sonraki İstekler] 
  → Tarayıcı cookie'yi otomatik gönderir → 
  → Backend cookie'yi kontrol eder → 
  → Yetki verirse işlemi yapar

[Yapılacaklarar]

- [x] Firma Modeli
  - detaylandırıldı
  - servises eklendi
  - user özel model yapıldı
  - testler bazıları yapıldı
  [] - scraping özelliklerini güncelle ve ilave et
  

- Contatct Modeli
  [x] - user contact modeli yapılacak
  [x] - servisler ve utiller yapılacak
  [ ] - burda updateUserContact form data si ile yeniliyor gerek olursa onu CompanyUpdate
  gibi degistir.
  

- Base Modeli
  [x] - model taslak routelar ve kontroller taslak olusturuldu
  [ ] - frontend base model Index ve Base Model Form yap

- Option Modeli

- Teklif Modeli

[x] - Table modellerini reusable component haline getir.
[x] - Contact and Companies Pages re arranged 
[ ] - Tablolar icin duzgun bir Skeleton yap
[ ] - fORM Sayfalarininda ayni sablonu kullanmasini sagla

###AUTH LOGIN SISTEMI
✅ Şu anda Çalışan Auth Sistemi Özeti:
🔐 1. Giriş Süreci (Login Flow)
Kullanıcı, Firebase üzerinden e-posta/şifre ya da Google ile giriş yapıyor.

Firebase client SDK'sı aracılığıyla idToken alınır (auth.currentUser.getIdToken()).

Bu idToken, backend'e (/auth/login) bir POST isteği ile gönderilir.

🔁 2. Backend Token Doğrulama (Tek seferlik)
Backend, gelen idToken'ı firebase-admin ile doğrular.

Token geçerliyse:

Firebase UID, email gibi bilgilerle MongoDB'de kullanıcı kaydı oluşturulur veya güncellenir.

Backend, kendi JWT'sini (örneğin accessToken) üretir ve client’a döner.

🛡️ 3. JWT Kullanımı (Artık Firebase yok)
Artık tüm kimlik doğrulama, Firebase yerine backend’in verdiği JWT (Bearer Token) ile yapılır.

Bu token:

localStorage'da tutulur.

Her API isteğine otomatik olarak Authorization: Bearer <token> header'ı ile eklenir (utils/axios.js aracılığıyla).

Backend'deki korumalı route'larda, middleware/guard ile bu token doğrulanır ve ilgili kullanıcıya erişim izni verilir.

🚫 Firebase ile İlişki Koptu mu?
Evet ve Hayır:

Amaç	Firebase kullanımı	Açıklama
Kimlik Doğrulama Başlangıcı	✅ Giriş için (login)	Kullanıcıyı doğrulayıp idToken alıyoruz.
Backend token üretimi	✅ İlk doğrulamada	idToken kontrol edilip backend token'ı veriliyor.
API isteklerinde kimlik	❌ Kullanılmıyor	Artık sadece backend JWT tokenı kullanılıyor.
Firebase ile tekrar kontrol	❌ Gerekli değil	Token verildikten sonra tüm işlemler backend’e ait.

Yani sadece girişte Firebase kullanıyorsun, sonrasında tüm akış tamamen kendi backend’in üzerinde ilerliyor.

 [ ] - refresh token yapisi kur ve token gecerlilik suresini 1 saat e dusur
 [x] - cookie artiklari temizlensi, cors passsword reset limit ekle

✅ Girişte access + refresh token üret.

🍪 Refresh token'ı HTTP-only cookie olarak gönder.

🔐 Her istek access token ile yapılır.

❌ Token süresi dolunca 401 alınırsa → /auth/refresh ile yeni token alınır.

🚫 Logout’ta refresh token temizlenir.

