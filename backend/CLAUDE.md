# Express API Proje Kuralları

## Klasör Yapısı
```
src/
  routes/
  controllers/
  middleware/
  models/
.env
.env.production
Dockerfile
```

## Stack
- Express.js
- MongoDB Atlas (Mongoose)
- Editor: vim

## Kod Kuralları
- Her route ayrı dosyada olsun
- Controller'da iş mantığı, route'da sadece yönlendirme
- Mongoose model dosyaları models altında
- async/await kullan, callback kullanma
- Hata yönetimi için try/catch bloğu ekle
- Özel bir sebep olmadıkça arrow function kullan (`const fn = () => {}`)

## Terminal
- Dosya açmak için: `vim <dosya>`
- Editör önermek gerekirse vim kullan

## MongoDB
- Bağlantı .env içindeki MONGODB_URI ile yapılsın
- .env dosyasına dokunma, sadece kullan
- Model şemalarında validation ekle

## Deployment
- Git → GitHub → Render otomatik deploy
- Ortam değişkenleri: .env (local), .env.production (production)
- .env ve .env.production asla commit edilmesin (.gitignore'da olsun)
- Her proje için Dockerfile oluşturulmalı
- Dockerfile Node.js alpine image kullansın
- Production build: NODE_ENV=production

## Dockerfile Şablonu
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

## Genel
- Tek adım yap, dur ve onay bekle
- Dosya 150 satırı geçmesin, geçecekse böl