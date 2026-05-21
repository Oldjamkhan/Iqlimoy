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
    good: 'Good',
    moderate: 'Moderate',
    unhealthy: 'Unhealthy',
    veryUnhealthy: 'Very Unhealthy',
    hazardous: 'Hazardous',
  };
  return labels[level];
}

export function getAQILabelUz(aqi: number): string {
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
    conditions: 'Partly Cloudy',
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
    conditions: 'Clear Sky',
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
    conditions: 'Dust Storm',
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
    conditions: 'Mostly Clear',
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
    conditions: 'Partly Cloudy',
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
    conditions: 'Hazy',
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
    conditions: 'Severe Dust',
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
    conditions: 'Clear Sky',
  },
];

export const ALERTS: AlertData[] = [
  {
    id: 'a1',
    type: 'dust',
    title: 'Severe Dust Storm Warning',
    titleUz: "Kuchli chang bo'roni",
    description:
      'A severe dust storm from the Karakum Desert is affecting Bukhara and Karshi regions. Visibility below 500m. PM10 at 14x safe levels. Suspend all outdoor activities.',
    regions: ['Buxoro', 'Qashqadaryo', "Qoraqalpog'iston"],
    severity: 'critical',
    status: 'active',
    timestamp: '2026-05-21T08:30:00',
    expiresAt: '2026-05-22T18:00:00',
  },
  {
    id: 'a2',
    type: 'magnetic',
    title: 'Geomagnetic Storm G2',
    titleUz: "Geomagnetik bo'ron G2",
    description:
      'A G2-class geomagnetic storm is in progress. GPS disruption likely. Radio communications affected. Sensitive individuals may experience headaches and fatigue.',
    regions: ['All Central Asia'],
    severity: 'medium',
    status: 'active',
    timestamp: '2026-05-21T06:00:00',
    expiresAt: '2026-05-22T06:00:00',
  },
  {
    id: 'a3',
    type: 'uv',
    title: 'Extreme UV Radiation',
    titleUz: 'Haddan tashqari UV nurlanish',
    description:
      'UV Index reaching 10–11 (Extreme) in Nukus and Karakalpakstan. Maximum sun protection required. Avoid outdoor exposure 10:00–16:00.',
    regions: ["Qoraqalpog'iston", 'Xorazm'],
    severity: 'high',
    status: 'active',
    timestamp: '2026-05-21T09:00:00',
    expiresAt: '2026-05-21T18:00:00',
  },
  {
    id: 'a4',
    type: 'smog',
    title: 'Urban Smog Advisory',
    titleUz: 'Shahar tutun ogohlantirishi',
    description:
      'Elevated PM2.5 levels in Tashkent due to reduced air circulation. Sensitive groups should limit outdoor exposure. Peaks expected 07:00–10:00.',
    regions: ['Toshkent'],
    severity: 'low',
    status: 'monitoring',
    timestamp: '2026-05-21T07:00:00',
    expiresAt: '2026-05-21T22:00:00',
  },
  {
    id: 'a5',
    type: 'heat',
    title: 'Heat Wave Forecast',
    titleUz: "Issiqlik to'lqini",
    description:
      'Temperatures expected to exceed 40°C in southern Uzbekistan over the next 3 days. High risk of heat stroke for outdoor workers. Mandatory hydration breaks.',
    regions: ['Surxondaryo', 'Qashqadaryo', 'Buxoro'],
    severity: 'medium',
    status: 'monitoring',
    timestamp: '2026-05-21T05:00:00',
    expiresAt: '2026-05-24T20:00:00',
  },
  {
    id: 'a6',
    type: 'chemical',
    title: 'Aral Sea Toxic Dust',
    titleUz: 'Orol dengizi zaharli changi',
    description:
      "Toxic dust from the dried Aral Sea containing pesticide residues detected in Karakalpakstan. Highly dangerous for respiratory health. N95 masks mandatory outdoors.",
    regions: ["Qoraqalpog'iston"],
    severity: 'critical',
    status: 'active',
    timestamp: '2026-05-20T22:00:00',
    expiresAt: '2026-05-23T22:00:00',
  },
];

export const FORECAST_7DAY: ForecastDay[] = [
  { date: '2026-05-21', dayName: 'Today', tempMin: 18, tempMax: 30, aqi: 87, uvIndex: 5, precipChance: 10, conditions: 'Partly Cloudy', dustRisk: 35 },
  { date: '2026-05-22', dayName: 'Thu', tempMin: 17, tempMax: 29, aqi: 72, uvIndex: 4, precipChance: 25, conditions: 'Mostly Cloudy', dustRisk: 28 },
  { date: '2026-05-23', dayName: 'Fri', tempMin: 16, tempMax: 28, aqi: 55, uvIndex: 6, precipChance: 5, conditions: 'Clear Sky', dustRisk: 20 },
  { date: '2026-05-24', dayName: 'Sat', tempMin: 19, tempMax: 32, aqi: 95, uvIndex: 7, precipChance: 0, conditions: 'Hazy', dustRisk: 45 },
  { date: '2026-05-25', dayName: 'Sun', tempMin: 21, tempMax: 35, aqi: 110, uvIndex: 8, precipChance: 0, conditions: 'Hazy', dustRisk: 62 },
  { date: '2026-05-26', dayName: 'Mon', tempMin: 22, tempMax: 34, aqi: 88, uvIndex: 7, precipChance: 5, conditions: 'Partly Cloudy', dustRisk: 38 },
  { date: '2026-05-27', dayName: 'Tue', tempMin: 20, tempMax: 31, aqi: 65, uvIndex: 5, precipChance: 15, conditions: 'Mostly Cloudy', dustRisk: 25 },
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
  default: "I'm ZARA, your AI environmental assistant. I monitor air quality, UV radiation, dust storms, geomagnetic activity, and climate risks across Central Asia via satellite. What can I help you with?",
  greeting: "Right now I'm tracking conditions across 8 major cities in Uzbekistan. Overall status: Moderate. There are 3 active alerts — a critical dust storm in Bukhara, a G2 geomagnetic storm affecting all of Central Asia, and extreme UV in Nukus.",
  aqi: "Tashkent's current AQI is 87 (Moderate). PM2.5 is 32 μg/m³ — slightly above WHO guidelines of 25 μg/m³. I recommend limiting strenuous outdoor exercise today. The cleanest city right now is Samarkand with AQI 42 (Good).",
  outdoor: "Best outdoor activity window today: 06:00–09:00 in Tashkent. AQI is typically 15–20% lower in early morning due to reduced traffic. UV Index is moderate (5), SPF 30+ recommended. Avoid Bukhara and Nukus entirely today — active dust storm and extreme UV warnings in effect.",
  magnetic: "A G2-class geomagnetic storm is active across Central Asia. K-index is at 6 from my Aral Sea magnetometer cluster. Effects: GPS signal degradation, HF radio interference, minor power grid fluctuations. Sensitive individuals may experience headaches or fatigue. Expected resolution: 18–24 hours.",
  dust: "The Bukhara dust storm originated from the Karakum Desert at ~03:45 UTC today. PM10 is at 142 μg/m³ — 14x above safe levels. Moving northeast at 18 km/h. Expected to reach Kashkadarya by evening. All construction sites in affected regions should suspend operations immediately.",
  forecast: "7-day outlook for Tashkent: AQI improves to Good by Friday, then rises to Unhealthy this weekend as a high-pressure system from the south traps pollutants. Temperatures climb toward 35°C by Sunday. Best days to be outdoors: Friday and Saturday morning.",
  b2b: "The Iqlimoy B2B API gives construction firms, agriculture operations, and event organizers real-time and forecast environmental data. Pro tier: 1,000 API calls/day with 6-hour forecast windows. Enterprise: custom satellite tasking, dedicated CSM, compliance reporting. Currently in beta — 12 enterprise clients onboarded.",
  construction: "Construction risk for Tashkent today: LOW-MEDIUM. Wind: 12 km/h (safe for cranes up to 80m). UV: 5 (standard PPE). Dust risk: 35/100 (standard precautions). Temperature: 28°C (hydration breaks every 2 hours recommended). No weather stops required. Friday is the optimal window for concrete pours this week.",
  health: "Health advisory based on current data: Asthma/COPD patients should avoid outdoor exposure in Bukhara, Karshi, and Nukus today. Healthy adults can exercise outdoors safely in Samarkand and Fergana. All outdoor workers in dust-affected regions: N95 masks mandatory. Magnetic storm may amplify respiratory symptoms.",
  aral: "The Aral Sea crisis remains Central Asia's most severe environmental disaster. My satellite sensors show the dried seabed emitting toxic dust (pesticide residues, salt, heavy metals) across Karakalpakstan — contributing to the region's hazardous AQI of 201. Lung disease rates in Nukus are 3x the national average.",
};

export const PARTNERS: Partner[] = [
  { id: 'p1', name: 'Oq Suv Café', category: 'Cafe & Dining', description: 'Air-purified indoor dining with HEPA filtration in Tashkent city center', discount: '15% off for Iqlimoy users', cleanAirScore: 95 },
  { id: 'p2', name: 'Ecopark Chimyon', category: 'Nature & Recreation', description: 'Mountain resort at 1,600m elevation — consistently clean air away from city pollution', discount: 'Free entry on Good air quality days', cleanAirScore: 98 },
  { id: 'p3', name: 'Wellness Hub UZ', category: 'Health & Fitness', description: 'Premium gym with HEPA-filtered air systems in Yunusabad district', discount: 'Daily pass: 20,000 vs 35,000 UZS', cleanAirScore: 92 },
  { id: 'p4', name: 'Registan Tours', category: 'Tourism & Heritage', description: 'Early morning heritage tours when air is at its cleanest in Samarkand', discount: '10% off morning slots', cleanAirScore: 85 },
  { id: 'p5', name: 'Silk Road Pharmacy', category: 'Health & Wellness', description: 'Anti-pollution skincare and respiratory health products delivered to your door', discount: '25% off N95 masks this week', cleanAirScore: 90 },
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
