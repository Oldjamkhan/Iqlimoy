export type AQILevel = 'good' | 'moderate' | 'unhealthy' | 'veryUnhealthy' | 'hazardous';

export interface CityData {
  id: string;
  name: string;
  nameUz: string;
  region: string;
  aqi: number;
  pm25: number;
  pm10: number;
  uvIndex: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  dustRisk: number;
  solarRadiation: number;
  magneticField: 'normal' | 'disturbed' | 'storm';
  conditions: string;
}

export interface AlertData {
  id: string;
  type: 'dust' | 'smog' | 'uv' | 'magnetic' | 'heat' | 'chemical';
  title: string;
  titleUz: string;
  description: string;
  regions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'monitoring' | 'resolved';
  timestamp: string;
  expiresAt: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  aqi: number;
  uvIndex: number;
  precipChance: number;
  conditions: string;
  dustRisk: number;
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  description: string;
  discount: string;
  cleanAirScore: number;
}

export interface RegionData {
  id: string;
  name: string;
  aqi: number;
  gridRow: number;
  gridCol: number;
  gridColSpan: number;
}

export function getAQILevel(aqi: number): AQILevel {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  if (aqi <= 200) return 'veryUnhealthy';
  return 'hazardous';
}

export function getAQILabel(aqi: number): string {
  const level = getAQILevel(aqi);
  const labels: Record<AQILevel, string> = {
    good: 'Yaxshi',
    moderate: "O'rtacha",
    unhealthy: 'Zararli',
    veryUnhealthy: 'Juda Zararli',
    hazardous: 'Xavfli',
  };
  return labels[level];
}

export function getAQILabelUz(aqi: number): string {
  return getAQILabel(aqi);
}

export const CITIES: CityData[] = [
  {
    id: 'toshkent',
    name: 'Tashkent',
    nameUz: 'Toshkent',
    region: 'Toshkent viloyati',
    aqi: 87,
    pm25: 32,
    pm10: 68,
    uvIndex: 5,
    temperature: 28,
    humidity: 45,
    windSpeed: 12,
    dustRisk: 35,
    solarRadiation: 420,
    magneticField: 'disturbed',
    conditions: 'Qisman bulutli',
  },
  {
    id: 'samarqand',
    name: 'Samarkand',
    nameUz: 'Samarqand',
    region: 'Samarqand viloyati',
    aqi: 42,
    pm25: 15,
    pm10: 28,
    uvIndex: 7,
    temperature: 31,
    humidity: 38,
    windSpeed: 8,
    dustRisk: 15,
    solarRadiation: 510,
    magneticField: 'normal',
    conditions: 'Toza havo',
  },
  {
    id: 'buxoro',
    name: 'Bukhara',
    nameUz: 'Buxoro',
    region: 'Buxoro viloyati',
    aqi: 156,
    pm25: 78,
    pm10: 142,
    uvIndex: 9,
    temperature: 36,
    humidity: 22,
    windSpeed: 18,
    dustRisk: 82,
    solarRadiation: 620,
    magneticField: 'normal',
    conditions: 'Chang bo\'roni',
  },
  {
    id: 'namangan',
    name: 'Namangan',
    nameUz: 'Namangan',
    region: 'Namangan viloyati',
    aqi: 65,
    pm25: 24,
    pm10: 45,
    uvIndex: 6,
    temperature: 26,
    humidity: 52,
    windSpeed: 7,
    dustRisk: 20,
    solarRadiation: 380,
    magneticField: 'normal',
    conditions: 'Asosan toza',
  },
  {
    id: 'andijon',
    name: 'Andijan',
    nameUz: 'Andijon',
    region: 'Andijon viloyati',
    aqi: 73,
    pm25: 28,
    pm10: 52,
    uvIndex: 6,
    temperature: 27,
    humidity: 50,
    windSpeed: 9,
    dustRisk: 25,
    solarRadiation: 395,
    magneticField: 'normal',
    conditions: 'Qisman bulutli',
  },
  {
    id: 'qarshi',
    name: 'Karshi',
    nameUz: 'Qarshi',
    region: 'Qashqadaryo viloyati',
    aqi: 118,
    pm25: 55,
    pm10: 98,
    uvIndex: 8,
    temperature: 34,
    humidity: 28,
    windSpeed: 15,
    dustRisk: 68,
    solarRadiation: 580,
    magneticField: 'normal',
    conditions: 'Tumanli',
  },
  {
    id: 'nukus',
    name: 'Nukus',
    nameUz: 'Nukus',
    region: "Qoraqalpog'iston",
    aqi: 201,
    pm25: 95,
    pm10: 185,
    uvIndex: 10,
    temperature: 38,
    humidity: 15,
    windSpeed: 25,
    dustRisk: 96,
    solarRadiation: 680,
    magneticField: 'storm',
    conditions: 'Og\'ir chang',
  },
  {
    id: 'fargona',
    name: 'Fergana',
    nameUz: "Farg'ona",
    region: "Farg'ona viloyati",
    aqi: 58,
    pm25: 22,
    pm10: 38,
    uvIndex: 5,
    temperature: 25,
    humidity: 55,
    windSpeed: 6,
    dustRisk: 18,
    solarRadiation: 360,
    magneticField: 'normal',
    conditions: 'Toza havo',
  },
];

export const ALERTS: AlertData[] = [
  {
    id: 'a1',
    type: 'dust',
    title: "Kuchli chang bo'roni",
    titleUz: "Kuchli chang bo'roni",
    description:
      "Qoraqum cho'lidan kuchli chang bo'roni Buxoro va Qashqadaryo viloyatlarini qamrab olmoqda. Ko'rinish 500m dan kam. PM10 me'yordan 14 marta yuqori. Barcha tashqi ishlarni to'xtating.",
    regions: ['Buxoro', 'Qashqadaryo', "Qoraqalpog'iston"],
    severity: 'critical',
    status: 'active',
    timestamp: '2026-05-21T08:30:00',
    expiresAt: '2026-05-22T18:00:00',
  },
  {
    id: 'a2',
    type: 'magnetic',
    title: "Geomagnetik bo'ron G2",
    titleUz: "Geomagnetik bo'ron G2",
    description:
      "G2 darajasidagi geomagnetik bo'ron davom etmoqda. GPS ishlashida buzilishlar kuzatilishi mumkin. Radio aloqaga ta'sir ko'rsatadi. Sezgir odamlarda bosh og'rig'i va charchoq kuzatilishi mumkin.",
    regions: ["Butun O'rta Osiyo"],
    severity: 'medium',
    status: 'active',
    timestamp: '2026-05-21T06:00:00',
    expiresAt: '2026-05-22T06:00:00',
  },
  {
    id: 'a3',
    type: 'uv',
    title: 'Haddan tashqari UV nurlanish',
    titleUz: 'Haddan tashqari UV nurlanish',
    description:
      "Nukus va Qoraqalpog'istonda UV indeksi 10–11 (Ekstremal) ga yetmoqda. Maksimal himoya talab qilinadi. Soat 10:00–16:00 da tashqarida qolmang.",
    regions: ["Qoraqalpog'iston", 'Xorazm'],
    severity: 'high',
    status: 'active',
    timestamp: '2026-05-21T09:00:00',
    expiresAt: '2026-05-21T18:00:00',
  },
  {
    id: 'a4',
    type: 'smog',
    title: 'Shahar tutuni ogohlantirishi',
    titleUz: 'Shahar tutuni ogohlantirishi',
    description:
      "Havo aylanishining kamayishi sababli Toshkentda PM2.5 darajasi ko'tarilgan. Sezgir guruhlar tashqi faoliyatni cheklashi kerak. Eng yuqori daraja soat 07:00–10:00 da kutilmoqda.",
    regions: ['Toshkent'],
    severity: 'low',
    status: 'monitoring',
    timestamp: '2026-05-21T07:00:00',
    expiresAt: '2026-05-21T22:00:00',
  },
  {
    id: 'a5',
    type: 'heat',
    title: "Issiqlik to'lqini",
    titleUz: "Issiqlik to'lqini",
    description:
      "Keyingi 3 kun davomida O'zbekistonning janubida harorat 40°C dan oshishi kutilmoqda. Tashqi ishchilar uchun issiqlik urishi xavfi yuqori. Majburiy suv ichish tanaffuslari.",
    regions: ['Surxondaryo', 'Qashqadaryo', 'Buxoro'],
    severity: 'medium',
    status: 'monitoring',
    timestamp: '2026-05-21T05:00:00',
    expiresAt: '2026-05-24T20:00:00',
  },
  {
    id: 'a6',
    type: 'chemical',
    title: 'Orol dengizi zaharli changi',
    titleUz: 'Orol dengizi zaharli changi',
    description:
      "Qoraqalpog'istonda qurib qolgan Orol dengizi tubidan pestitsid qoldiqlari o'z ichiga olgan zaharli chang aniqlandi. Nafas olish salomatligi uchun juda xavfli. Tashqarida N95 niqob majburiy.",
    regions: ["Qoraqalpog'iston"],
    severity: 'critical',
    status: 'active',
    timestamp: '2026-05-20T22:00:00',
    expiresAt: '2026-05-23T22:00:00',
  },
];

export const FORECAST_7DAY: ForecastDay[] = [
  { date: '2026-05-21', dayName: 'Bugun', tempMin: 18, tempMax: 30, aqi: 87, uvIndex: 5, precipChance: 10, conditions: 'Qisman bulutli', dustRisk: 35 },
  { date: '2026-05-22', dayName: 'Psh', tempMin: 17, tempMax: 29, aqi: 72, uvIndex: 4, precipChance: 25, conditions: 'Asosan bulutli', dustRisk: 28 },
  { date: '2026-05-23', dayName: 'Jum', tempMin: 16, tempMax: 28, aqi: 55, uvIndex: 6, precipChance: 5, conditions: 'Toza havo', dustRisk: 20 },
  { date: '2026-05-24', dayName: 'Sha', tempMin: 19, tempMax: 32, aqi: 95, uvIndex: 7, precipChance: 0, conditions: 'Tumanli', dustRisk: 45 },
  { date: '2026-05-25', dayName: 'Yak', tempMin: 21, tempMax: 35, aqi: 110, uvIndex: 8, precipChance: 0, conditions: 'Tumanli', dustRisk: 62 },
  { date: '2026-05-26', dayName: 'Du', tempMin: 22, tempMax: 34, aqi: 88, uvIndex: 7, precipChance: 5, conditions: 'Qisman bulutli', dustRisk: 38 },
  { date: '2026-05-27', dayName: 'Se', tempMin: 20, tempMax: 31, aqi: 65, uvIndex: 5, precipChance: 15, conditions: 'Asosan bulutli', dustRisk: 25 },
];

export const HOURLY_FORECAST = [
  { hour: '07:00', aqi: 65, temp: 21, icon: 'sun' },
  { hour: '09:00', aqi: 78, temp: 24, icon: 'cloud' },
  { hour: '11:00', aqi: 87, temp: 27, icon: 'cloud' },
  { hour: '13:00', aqi: 92, temp: 29, icon: 'sun' },
  { hour: '15:00', aqi: 88, temp: 30, icon: 'sun' },
  { hour: '17:00', aqi: 76, temp: 28, icon: 'cloud' },
  { hour: '19:00', aqi: 60, temp: 25, icon: 'cloud' },
  { hour: '21:00', aqi: 52, temp: 22, icon: 'moon' },
];

export const AI_RESPONSES: Record<string, string> = {
  default: "Assalomu alaykum! Men ZARA — Iqlimoy sun'iy yo'ldosh ekologiya monitoring tizimining AI yordamchisiman. Havo sifati, UV nurlanish, chang bo'ronlari, geomagnetik faollik va iqlim xavflari haqida yordam bera olaman. Nima so'ramoqchisiz?",
  greeting: "Hozir men O'zbekistonning 8 ta shahrida sharoitni kuzatyapman. Umumiy holat: O'rtacha. 3 ta faol ogohlantirish mavjud — Buxorada kritik chang bo'roni, butun Markaziy Osiyoda G2 geomagnetik bo'ron, va Nukusda haddan tashqari UV nurlanish.",
  aqi: "Toshkentning joriy AQI si 87 (O'rtacha). PM2.5 32 μg/m³ — JSSning 25 μg/m³ ko'rsatkichidan biroz yuqori. Bugun kuchli jismoniy mashq qilishni cheklashni tavsiya etaman. Hozir eng toza shahar — Samarqand, AQI 42 (Yaxshi).",
  outdoor: "Toshkentda bugungi eng yaxshi tashqi faoliyat vaqti: 06:00–09:00. Ertalab havo ifloslanishi odatda 15–20% pastroq bo'ladi. UV indeksi o'rtacha (5), SPF 30+ tavsiya etiladi. Buxoro va Nukusdan bugun butunlay saqlaning — faol chang bo'roni va ekstremal UV ogohlantirishlari kuchda.",
  magnetic: "G2 darajasidagi geomagnetik bo'ron butun Markaziy Osiyoda faol. K-indeksi 6 ga yetgan. Ta'siri: GPS signali buzilishi, qisqa to'lqinli radio interferensiyasi, kichik elektr tarmog'i tebranishlari. Sezgir odamlarda bosh og'rig'i yoki charchoq bo'lishi mumkin. Tugash vaqti: 18–24 soat ichida.",
  dust: "Buxoro chang bo'roni bugun taxminan 03:45 UTC da Qoraqum cho'lidan boshlandi. PM10 142 μg/m³ — me'yordan 14 marta yuqori. Soatiga 18 km tezlik bilan shimoli-sharq tomon harakat qilmoqda. Kechqurun Qashqadaryo viloyatiga yetib borishi kutilmoqda. Ta'sirlangan hududlardagi barcha qurilish maydonlari darhol ishni to'xtatishi kerak.",
  forecast: "Toshkent uchun 7 kunlik prognoz: AQI juma kuni Yaxshi darajaga yaxshilanadi, keyin janubdan keluvchi yuqori bosimli tizim ifloslantiruvchi moddalarni ushlab qolishi sababli dam olish kunlarida Zararli darajaga ko'tariladi. Harorat yakshanba kuni 35°C ga yaqinlashadi. Tashqarida bo'lish uchun eng yaxshi kunlar: juma va shanba ertalabi.",
  b2b: "Iqlimoy B2B API qurilish kompaniyalari, qishloq xo'jaligi va tadbirlar tashkilotchilariga real vaqt va prognoz ekologik ma'lumotlarini beradi. Pro tarif: kuniga 10,000 API so'rovi, 6 soatlik prognoz. Enterprise: maxsus sun'iy yo'ldosh, shaxsiy menejer, SLA 99.9%. Hozirda beta bosqichida — 12 ta korporativ mijoz.",
  construction: "Toshkent uchun bugungi qurilish xavfi: PAST-O'RTA. Shamol: 12 km/soat (80m gacha kranlarga xavfsiz). UV: 5 (standart himoya). Chang xavfi: 35/100 (standart ehtiyot choralari). Harorat: 28°C (har 2 soatda suv ichish tanaffuslari tavsiya etiladi). Ob-havo to'xtashi talab etilmaydi. Shu hafta beton quyish uchun optimal vaqt — juma.",
  health: "Joriy ma'lumotlarga asoslangan sog'liq bo'yicha maslahat: Astma/COPD bemorlari bugun Buxoro, Qarshi va Nukusda tashqarida qolmasligi kerak. Sog'lom odamlar Samarqand va Farg'onada tashqarida mashq qila oladi. Chang ta'sirlangan hududlardagi barcha tashqi ishchilar: N95 niqob majburiy. Magnit bo'roni nafas olish simptomlarini kuchaytirishi mumkin.",
  aral: "Orol dengizi inqirozi Markaziy Osiyoning eng og'ir ekologik falokatligicha qolmoqda. Sun'iy yo'ldosh sensorlarim qurib qolgan dengiz tubidan Qoraqalpog'iston bo'ylab zaharli changni (pestitsid qoldiqlari, tuz, og'ir metallar) tarqalayotganini ko'rsatmoqda — bu Nukusning AQI 201 (Xavfli) darajasiga hissa qo'shmoqda. Nukusdagi o'pka kasalliklari darajasi milliy o'rtacha ko'rsatkichdan 3 marta yuqori.",
};

export const PARTNERS: Partner[] = [
  { id: 'p1', name: 'Oq Suv Kafe', category: 'Kafe va Restoran', description: 'Toshkent markazida HEPA filtrli toza havoli ichki muhit', discount: 'Iqlimoy foydalanuvchilari uchun 15% chegirma', cleanAirScore: 95 },
  { id: 'p2', name: 'Ekopark Chimyon', category: 'Tabiat va Dam olish', description: '1600m balandlikdagi tog\' kurortida doimo toza havo', discount: 'Yaxshi havo sifati kunlarida kirish bepul', cleanAirScore: 98 },
  { id: 'p3', name: 'Wellness Hub UZ', category: 'Sog\'liq va Fitnes', description: 'Yunusobodda HEPA filtrlangan havoli premium sport zali', cleanAirScore: 92, discount: 'Kunlik abonement: 20,000 vs 35,000 so\'m' },
  { id: 'p4', name: 'Registon Tours', category: 'Turizm va Meros', description: 'Samarqandda havo eng toza paytda ertalabki meros sayohatlari', discount: 'Ertalabki sessiyalarda 10% chegirma', cleanAirScore: 85 },
  { id: 'p5', name: 'Ipak Yo\'li Dorixonasi', category: 'Sog\'liq va Farovonlik', description: 'Ifloslantiruvchi moddalardan himoya kosmetikasi va nafas olish mahsulotlari', discount: 'Bu hafta N95 niqobda 25% chegirma', cleanAirScore: 90 },
];

export const REGIONS_GRID: RegionData[] = [
  { id: 'karakalpak', name: "Qoraqalpog'iston", aqi: 201, gridRow: 0, gridCol: 0, gridColSpan: 2 },
  { id: 'xorazm', name: 'Xorazm', aqi: 145, gridRow: 0, gridCol: 2, gridColSpan: 1 },
  { id: 'buxoro', name: 'Buxoro', aqi: 156, gridRow: 1, gridCol: 0, gridColSpan: 2 },
  { id: 'navoiy', name: 'Navoiy', aqi: 98, gridRow: 1, gridCol: 2, gridColSpan: 1 },
  { id: 'samarqand', name: 'Samarqand', aqi: 42, gridRow: 2, gridCol: 0, gridColSpan: 1 },
  { id: 'jizzax', name: 'Jizzax', aqi: 68, gridRow: 2, gridCol: 1, gridColSpan: 1 },
  { id: 'toshkent', name: 'Toshkent', aqi: 87, gridRow: 2, gridCol: 2, gridColSpan: 1 },
  { id: 'qashqa', name: 'Qashqadaryo', aqi: 118, gridRow: 3, gridCol: 0, gridColSpan: 1 },
  { id: 'surxon', name: 'Surxondaryo', aqi: 85, gridRow: 3, gridCol: 1, gridColSpan: 1 },
  { id: 'sirdaryo', name: 'Sirdaryo', aqi: 72, gridRow: 3, gridCol: 2, gridColSpan: 1 },
  { id: 'fargona', name: "Farg'ona", aqi: 58, gridRow: 4, gridCol: 0, gridColSpan: 1 },
  { id: 'namangan', name: 'Namangan', aqi: 65, gridRow: 4, gridCol: 1, gridColSpan: 1 },
  { id: 'andijon', name: 'Andijon', aqi: 73, gridRow: 4, gridCol: 2, gridColSpan: 1 },
];
