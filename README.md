# Iqlimoy 🌍🛰️

O‘zbekiston uchun sun‘iy yo‘ldosh va biometrik ma’lumotlar asosidagi ekologik monitoring platformasi.

**Iqlimoy** — bu havoning sifati, atrof-muhit ko‘rsatkichlari va foydalanuvchilarning taqiladigan qurilmalari (wearables) orqali olingan salomatlik signallarini sun'iy intellekt yordamida tahlil qiluvchi va shaxsiy ekologik tavsiyalar beruvchi to'liq ekotizimdir.

---

## 🔥 Asosiy Imkoniyatlar (Features)

* **Real vaqt rejimida monitoring:** Havo sifati (AQI, PM2.5, PM10), UV indeksi, harorat, namlik va shamol tezligi ma'lumotlari.
* **AI Ekologik Yordamchi:** Sun'iy intellekt (Gemini API) asosida foydalanuvchi joylashgan hudud va uning salomatligiga moslashtirilgan qisqa, aniq va hayotiy tavsiyalar.
* **Biometrik Integratsiya (Eco-Health):** Wearable qurilmalar (Whoop, Google Fit, Apple Health, FitBit) bilan ulanish orqali yurak urishi (RHR), uyqu sifati va tiklanish (recovery) ko'rsatkichlarini havo sifati bilan sinxron tahlil qilish.
* **Vizual Heatmap:** Hududlardagi ekologik holatni ko'rsatuvchi interaktiv xarita va issiqlik xaritasi (Heatmap) funksiyasi.
* **Aqlli Bildirishnomalar:** "Havo iflosligi + Yurak urishi/Uyqu" ssenariylari bo'yicha foydalanuvchini faol ravishda himoya qiluvchi shaxsiy bildirishnomalar tizimi.
* **Offline-First Tizim:** Internet aloqasi barqaror bo'lmagan hududlarda ham kesh ma'lumotlari orqali ishlash imkoniyati.

---

## 📂 Loyiha Tuzilishi (Repository Structure)

Loyiha **pnpm monorepo** tuzilishiga ega bo'lib, umumiy paketlar va servislar alohida modullarga ajratilgan:

```text
├── artifacts/
│   ├── api-server/         # Express backend, AI chat va monitoring API rutlari
│   ├── mobile/             # Expo / React Native mobil ilovasi va UI komponentlari
│   └── mockup-sandbox/     # UI sandbox va demo interfeys (prototiplash uchun)
├── lib/
│   ├── db/                 # Drizzle ORM + PostgreSQL konfiguratsiyasi va sxemalari
│   ├── api-client-react/   # Mobil ilova uchun umumiy API klient moduli
│   └── api-spec/           # OpenAPI (Swagger) hujjat fayllari
└── scripts/                # Yordamchi skriptlar va CI/CD ish jarayoni sozlamalari

```
## 🛠️ Ishga tushirish (Getting Started)
### Oldindan talab qilinadigan vositalar:
 * Node.js (v18 yoki undan yuqori)
 * pnpm (npm i -g pnpm)
### 1. Bog'liqliklarni o'rnatish
Monorepodagi barcha paketlar uchun bog'liqliklarni bir marta o'rnatish:
```bash
pnpm install

```
### 2. Loyihani build qilish va tekshirish
```bash
# Loyihani distributiv holatga keltirish
pnpm run build

# TypeScript turlarini tekshirish
pnpm run typecheck

```
### 3. Muhit o'zgaruvchilarini sozlash (.env)
artifacts/api-server papkasida .env faylini yarating va quyidagi o'zgaruvchilarni kiriting:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/iqlimoy
GEMINI_API_KEY=your_gemini_api_key_here

```
## 🚀 Ishlash Rejasi va Yo'l Xaritasi (Roadmap)
### Bajarilgan ishlar (Done) ✅
 * [x] Monorepo (pnpm) tuzilishi va arxitektura tahlili.
 * [x] Backend (Express) va Frontend (Expo) asosiy strukturasini qurish.
 * [x] Drizzle ORM orqali PostgreSQL bazasi konfiguratsiyasi.
 * [x] AI yordamchi va mock-data monitoring interfeyslarini yaratish.
 * [x] Mobil ilovani Android platformasi uchun to'liq optimallashtirish.
 * [x] Xarita (Map) integratsiyasi va hududiy Heatmap (issiqlik xaritasi) funksiyasini ishga tushirish.
 * [x] Real sun'iy yo'ldosh va stansiya API'larini ulab, jonli ma'lumotlar oqimini yo'lga qo'yish.
 * [x] Taqiladigan qurilmalar (Whoop, FitBit, Apple Health, Google Fit) API integratsiyasi.
 * [x] "Havo iflosligi + Yurak urishi/Uyqu" ssenariylari bo'yicha shaxsiy aqlli bildirishnomalar tizimini yaratish.
### Kelgusi kengaytirish rejalari (Next Milestones) 🎯
 * [ ] **Keshni optimallashtirish:** Katta hajmdagi geografik va heatmap ma'lumotlarini tezkor qayta ishlash uchun Redis kesh tizimini backendga qo'shish.
 * [ ] **CI/CD va Avtomatlashtirish:** GitHub Actions yordamida avtomatik testlar va mobil ilovani EAS (Expo Application Services) orqali build qilish tizimini sozlash.
 * [ ] **噴 Tizimni masshtablash:** Ma'lumotlar bazasida vaqtga bog'liq (time-series) ekologik ko'rsatkichlarni PostGIS yordamida yanada samaraliroq indekslash.
 * [ ] **Ko'p tillilik (i18n):** Ilovaga to'liq o'zbek (lotin/kirill), ingliz va rus tillarini integratsiya qilish```
