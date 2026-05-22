# Iqlimoy

Iqlimoy — O'zbekiston uchun sun'iy yo'ldosh asosida ekologik monitoring platformasi.

## Nima ish qiladi?

- Real vaqt havo sifati (AQI, PM2.5, PM10), UV indeksi, harorat, namlik va shamol ma'lumotlarini ko'rsatadi.
- Sun'iy intellekt (Iqlimoy AI, Gemini 2.5 Flash) yordamida foydalanuvchiga qisqa va aniq ekologik tavsiyalar beradi.
- Mobil ilova Expo/React Native orqali qurilgan.
- Backend Express serveri orqali chat va monitoring API'larini taqdim qiladi.
- Loyihada pnpm monorepo tuzilishi ishlatilgan va `lib/` bilan umumiy kutubxonalar mavjud.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API serverni ishga tushirish (port 8080)
- `pnpm --filter @workspace/mobile run dev` — Expo mobil ilovani ishga tushirish
- `pnpm run typecheck` — barcha paketlar bo'yicha to'liq typecheck
- `pnpm run build` — typecheck + barcha paketlarni build qilish
- `pnpm --filter @workspace/api-spec run codegen` — OpenAPI spec'dan API hooks va Zod sxemalarini qayta yaratish
- `pnpm --filter @workspace/db run push` — DB sxema o'zgarishlarini push qilish (faqat dev)

## Muhit o'zgaruvchilari (Secrets)

- `GEMINI_API_KEY` — Gemini AI API kaliti (Replit secrets'da saqlangan)
- `DATABASE_URL` — PostgreSQL ulanish satri (kerak bo'lganda qo'shiladi)
- `SESSION_SECRET` — session shifrlash uchun

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobil: Expo SDK, Expo Router, React Native, @expo/vector-icons (Feather), expo-linear-gradient
- API: Express 5, @google/genai (Gemini 2.5 Flash)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (OpenAPI spec'dan)
- Build: esbuild (CJS bundle)
- Font: Inter (400, 500, 600, 700)

## Loyihaning tuzilishi

```
artifacts/api-server   — Express backend, Iqlimoy AI chat rutlari (/api/chat)
artifacts/mobile       — Expo mobil ilova, 5 tab + 5 drill-down ekran
artifacts/mockup-sandbox — UI sandbox va demo interfeys
lib/db                 — Drizzle ORM + PostgreSQL konfiguratsiyasi
lib/api-client-react   — Umumiy API klient modul
lib/api-spec           — OpenAPI hujjat fayllari
scripts                — Yordamchi skriptlar
```

## Muhim fayllar

- `artifacts/mobile/app/(tabs)/` — 5 tab ekrani (index, map, alerts, assistant, explore)
- `artifacts/mobile/app/` — Drill-down ekranlar (city/[id], b2b, construction, forecast, guide)
- `artifacts/mobile/constants/demoData.ts` — Barcha demo ma'lumotlar (o'zbekcha)
- `artifacts/mobile/hooks/useColors.ts` — Rang tizimi (dark navy tema)
- `artifacts/api-server/src/routes/chat.ts` — Gemini AI chat endpoint
- `artifacts/api-server/src/routes/index.ts` — Route'lar ro'yxati

## Arxitektura qarorlari

- **Demo ma'lumotlar** — hozircha statik `demoData.ts` faylida; keyingi bosqichda real API'ga ulanadi
- **AI chat** — backend orqali (mobil → `/api/chat` → Express → Gemini API); API kalit mobilda ko'rinmaydi
- **Rang tizimi** — `useColors` hook, `#070D1B` fon, `#00E5C3` teal primary
- **Barcha UI matnlar** — o'zbek tilida
- **Proxy routing** — barcha xizmatlar `localhost:80` orqali proxylangan; to'g'ridan-to'g'ri port ishlatilmaydi

## Mahsulot

- **Bosh ekran** — tanlangan shahar AQI, ob-havo, PM2.5/PM10/UV kartalar, soatlik prognoz, tavsiyalar
- **Xarita** — O'zbekiston shaharlari bo'yicha AQI heatmap
- **Xabar** — faol ekologik ogohlantirishlar (chang bo'roni, smog, UV, magnit bo'roni)
- **Iqlimoy AI** — Gemini 2.5 Flash bilan real vaqt chat, o'zbek tilida
- **Ko'proq (Explore)** — B2B, qurilish xavfsizligi, prognoz drill-down ekranlari
- **Qo'llanma** — har bir ko'rsatkich nima ekanligini oddiy tilda tushuntiradi

## Keyingi bosqich (Ertaga qilinadigan ishlar)

- Android uchun mobil ilovani moslash
- Map qo'shish va heatmap funksiyasini yaratish (real interaktiv xarita)
- Qolgan API'larni ulanib, real ma'lumot oqimini yo'lga qo'yish
- Wearable qurilmalar (Whoop / Google Fit / Apple Health / FitBit) bilan integratsiya
- Foydalanuvchi sog'liq signalini (yurak urishi, uyqu, tiklanish) AQI/UV bilan birlashtirish
- "Havo iflos + yurak urishi/uyqu yomon" kabi shaxsiy maslahatlar tizimini ishlab chiqish

## Foydalanuvchi sozlamalari

- Barcha UI matnlar o'zbek tilida bo'lishi shart
- `console.log` server kodida ishlatilmaydi — `req.log` va `logger` ishlatiladi
- Komponentlar alohida fayllarda saqlanadi, katta fayllar bo'linadi

## Ehtiyot bo'linadi

- `pnpm dev` workspace root'dan ishga tushirilmaydi — faqat workflow orqali
- Artifact typecheck uchun `pnpm --filter @workspace/<slug> run typecheck` ishlatiladi
- Port to'qnashuvi oldini olish uchun `PORT` env o'zgaruvchisi o'qiladi (hard-code qilinmaydi)
- Replit proxy orqali ishlanganda root-relative URL `/api/...` emas, base path bilan ishlatiladi

## Pointers

- `pnpm-workspace` skill — workspace tuzilishi, TypeScript sozlamasi va paket tafsilotlari uchun
