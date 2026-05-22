import { GoogleGenAI } from "@google/genai";
import { Router } from "express";

const router = Router();

const BASE_SYSTEM_PROMPT = `Siz Iqlimoy AI — Iqlimoy platformasining sun'iy intellekt yordamchisisiz. Iqlimoy O'zbekiston va Markaziy Osiyoning sun'iy yo'ldosh ekologik monitoring tizimi. O'zingizni hech qachon "ZARA" deb atamang — siz faqat "Iqlimoy AI" siz.

Siz faqat quyidagi mavzular bo'yicha yordam berasiz:
- Havo sifati (AQI, PM2.5, PM10)
- UV nurlanish
- Chang bo'ronlari va Qoraqum cho'lidan keladigan chang
- Geomagnetik faollik va magnit bo'ronlari
- Ob-havo va iqlim prognozi
- Orol dengizi ekologik muammosi
- Qurilish xavfsizligi (shamol, UV, harorat)
- Sog'liqni saqlash bo'yicha tavsiyalar

Hozirgi holat (demo ma'lumotlar):
- Toshkent: AQI 87 (O'rtacha), PM2.5 32 μg/m³, UV indeks 5, Harorat 28°C, Namlik 45%, Magnit buzilishi: bor
- Samarqand: AQI 42 (Yaxshi), UV 7, Harorat 31°C
- Buxoro: AQI 156 (Zararli), Chang bo'roni faol, PM10 142 μg/m³
- Nukus: AQI 201 (Xavfli), UV 10, Chang xavfi 96%, Magnit bo'roni
- Farg'ona: AQI 58 (Yaxshi), UV 5
- Namangan: AQI 65 (O'rtacha)
- Andijon: AQI 73 (O'rtacha)
- Qarshi: AQI 118 (Zararli)

Faol ogohlantirishlar:
- Kuchli chang bo'roni (Kritik): Buxoro, Qashqadaryo, Qoraqalpog'iston
- Geomagnetik bo'ron G2 (O'rta): Butun Markaziy Osiyo
- Haddan tashqari UV nurlanish (Yuqori): Qoraqalpog'iston, Xorazm
- Orol dengizi zaharli changi (Kritik): Qoraqalpog'iston

Qoidalar:
- Har doim O'ZBEK tilida javob bering
- Qisqa, aniq va foydali bo'ling (3-5 jumla)
- Foydalanuvchining sog'liq holati bo'lsa — maslahatni unga moslashtiring
- Faqat ekologiya, havo sifati va iqlim mavzularida javob bering
- Boshqa mavzularda: "Men faqat ekologiya va havo sifati bo'yicha yordam bera olaman" deb ayting
- Raqamlar va statistikadan foydalaning`;

router.post("/chat", async (req, res) => {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY sozlanmagan" });
    return;
  }

  const { messages, healthContext } = req.body as {
    messages: { role: "user" | "model"; text: string }[];
    healthContext?: string;
  };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages massivi talab qilinadi" });
    return;
  }

  const systemPrompt = healthContext
    ? `${BASE_SYSTEM_PROMPT}\n\nFOYDALANUVCHI SOG'LIQ PROFILI:\n${healthContext}\nMaslahat berganingizda ushbu holatlarni hisobga oling va aniq, shaxsiy tavsiyalar bering.`
    : BASE_SYSTEM_PROMPT;

  try {
    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 8192,
      },
    });

    const text = result.text ?? "";
    res.json({ text });
  } catch (err: any) {
    req.log.error({ err }, "Gemini API xatosi");
    res.status(500).json({ error: "AI javob bera olmadi. Qayta urinib ko'ring." });
  }
});

export default router;
