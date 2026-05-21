# Iqlimoy

**Iqlimoy** — O‘zbekiston uchun sun’iy yo‘ldosh asosida ekologik monitoring platformasi.

## Nima ish qiladi?

- Real vaqt havo sifati (AQI, PM2.5, PM10), UV indeksi, harorat, namlik va shamol ma’lumotlarini ko‘rsatadi.
- Sun’iy intellekt yordamida foydalanuvchiga qisqa va aniq ekologik tavsiyalar beradi.
- Mobil ilova Expo/React Native orqali qurilgan.
- Backend Express serveri orqali chat va monitoring API’larini taqdim qiladi.
- Loyihada pnpm monorepo tuzilishi ishlatilgan va lib/ bilan umumiy kutubxonalar mavjud.

## Loyihaning tuzilishi

- artifacts/api-server — Express backend va AI chat rutlari.
- artifacts/mobile — Expo mobil ilova va UI komponentlar.
- artifacts/mockup-sandbox — UI sandbox va demo interfeys.
- lib/db — Drizzle ORM + PostgreSQL konfiguratsiyasi.
- lib/api-client-react — umumiy API klient modul.
- lib/api-spec — OpenAPI hujjat fayllari.
- scripts — yordamchi skriptlar va ish jarayoni tarkibi.

## Ishlash tartibi

1. pnpm install
2. pnpm run build
3. pnpm run typecheck
4. Backend va mobil ilovani ishga tushirish uchun mos muhit o‘zgaruvchilarini sozlang:
   - GEMINI_API_KEY
   - DATABASE_URL
   - Replit muhitidagi port va domain sozlamalari

## Bugun qilgan ishlarimiz

- Repo tuzilishini tahlil qildik.
- Backend va mobil ilova papkalarini aniqladik.
- AI yordamchi, chat va demo ma’lumotlar ustida ishlashni aniqladik.
- Loyihaning muhim fayllari va konfiguratsiyalari haqida xulosa yozdik.

## Ertaga qilinadigan ishlar

- Android uchun mobil ilovani moslash.
- Map qo‘shish va heatmap funksiyasini yaratish.
- Qolgan API’larni ulanib, real ma’lumot oqimini yo‘lga qo‘yish.

## Eslatma

Loyiha hozircha demo va statik ma’lumotlar ustida ishlaydi. Keyingi bosqichda haqiqiy API integratsiyalari va mobil xarita qo‘shilishi kerak.
