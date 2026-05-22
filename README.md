Loyihangiz uchun tayyorlangan va barcha texnik qismlarni, arxitekturani hamda rejalarni o‘z ichiga olgan mukammal README.md fayli. Uni to‘g‘ridan-to‘g‘ri loyihangizning ildiz (root) papkasiga joylashtirishingiz mumkin.
```markdown
# Iqlimoy 🌍🛰️

O‘zbekiston uchun sun‘iy yo‘ldosh va biometrik ma’lumotlar asosidagi ekologik monitoring platformasi.

**Iqlimoy** — bu havoning sifati, atrof-muhit ko‘rsatkichlari va foydalanuvchilarning taqiladigan qurilmalari (wearables) orqali olingan salomatlik signallarini sun'iy intellekt yordamida tahlil qiluvchi va shaxsiy ekologik tavsiyalar beruvchi to'liq ekotizimdir.

---

## 🔥 Asosiy Imkoniyatlar (Features)

* **Real vaqt rejimida monitoring:** Havo sifati (AQI, PM2.5, PM10), UV indeksi, harorat, namlik va shamol tezligi ma'lumotlari.
* **AI Ekologik Yordamchi:** Sun'iy intellekt (Gemini API) asosida foydalanuvchi joylashgan hudud va uning salomatligiga moslashtirilgan qisqa, aniq va hayotiy tavsiyalar.
* **Biometrik Integratsiya (Eco-Health):** Wearable qurilmalar (Whoop, Google Fit, Apple Health, FitBit) bilan ulanish orqali yurak urishi (RHR), uyqu sifati va tiklanish (recovery) ko'rsatkichlarini havo sifati bilan sinxron tahlil qilish.
* **Vizual Heatmap:** Hududlardagi ekologik holatni ko'rsatuvchi interaktiv xarita va issiqlik xaritasi (Heatmap) funksiyasi.
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
### Done (Bajarilgan ishlar) ✅
 * [x] Monorepo (pnpm) tuzilishi va arxitektura tahlili.
 * [x] Backend (Express) va Frontend (Expo) asosiy strukturasini qurish.
 * [x] Drizzle ORM orqali PostgreSQL bazasi konfiguratsiyasi.
 * [x] AI yordamchi va mock-data monitoring interfeyslarini yaratish.
### In Progress / Todo (Kelgusi rejalar) 🛠️
 * [ ] Mobil ilovani Android platformasi uchun to'liq optimallashtirish.
 * [ ] Xarita (Map) integratsiyasi va hududiy Heatmap funksiyasini ishga tushirish.
 * [ ] Real sun'iy yo'ldosh va stansiya API'larini ulab, ma'lumotlar oqimini yo'lga qo'yish.
 * [ ] Taqiladigan qurilmalar (Whoop, FitBit, Apple Health) API integratsiyasi.
 * [ ] "Havo iflosligi + Yurak urishi/Uyqu" ssenariylari bo'yicha shaxsiy aqlli bildirishnomalar tizimini yaratish.
