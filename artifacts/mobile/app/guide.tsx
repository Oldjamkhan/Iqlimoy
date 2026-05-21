import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColors } from '@/hooks/useColors';

interface GuideItem {
  icon: string;
  title: string;
  simple: string;
  detail: string;
  scale?: { color: string; label: string; range: string }[];
  color: string;
}

const GUIDE_ITEMS: GuideItem[] = [
  {
    icon: 'wind',
    title: 'AQI — Havo Sifati Indeksi',
    simple: 'Havoning qanchalik toza yoki iflosligini ko\'rsatuvchi raqam. Qanchalik past bo\'lsa, havo shunchalik toza.',
    detail: 'AQI (Air Quality Index) — atmosferadagi ifloslantiruvchi moddalar miqdori asosida hisoblanadi. Bu raqam qanchalik past bo\'lsa, siz va oilangiz uchun havo shunchalik xavfsiz.',
    color: '#22D3A5',
    scale: [
      { color: '#22D3A5', label: 'Yaxshi', range: '0–50' },
      { color: '#F59E0B', label: "O'rtacha", range: '51–100' },
      { color: '#F97316', label: 'Zararli', range: '101–150' },
      { color: '#EF4444', label: 'Juda Zararli', range: '151–200' },
      { color: '#A855F7', label: 'Xavfli', range: '200+' },
    ],
  },
  {
    icon: 'cloud',
    title: 'PM2.5 — Mayda Zarralar',
    simple: 'O\'pkangizga kirib ketadigan juda mayda chang va tutun zarralari. 12 dan oshsa — ehtiyot bo\'ling.',
    detail: 'PM2.5 — diametri 2.5 mikrondan kichik zarralar. Bu zarralar shunchalik mayda-ki, ko\'z bilan ko\'rib bo\'lmaydi. Nafas olayotganda o\'pka to\'qimasiga kirib, astma, bronxit va yurak kasalliklariga olib kelishi mumkin. WHO me\'yori: kunlik 25 μg/m³.',
    color: '#F97316',
    scale: [
      { color: '#22D3A5', label: 'Xavfsiz', range: '0–12 μg/m³' },
      { color: '#F59E0B', label: "O'rtacha", range: '12–35 μg/m³' },
      { color: '#EF4444', label: 'Zararli', range: '35+ μg/m³' },
    ],
  },
  {
    icon: 'cloud',
    title: 'PM10 — Yirik Zarralar',
    simple: 'Ko\'rinuvchi chang va tuproq zarralari. Burun va tomoqqa ta\'sir qiladi.',
    detail: 'PM10 — diametri 10 mikrongacha bo\'lgan zarralar. Asosan chang bo\'roni, qurilish ishlari va yo\'l changidan hosil bo\'ladi. Nafas yo\'llarining yuqori qismiga, ko\'z va terига ta\'sir qiladi. WHO me\'yori: kunlik 50 μg/m³.',
    color: '#F59E0B',
    scale: [
      { color: '#22D3A5', label: 'Xavfsiz', range: '0–50 μg/m³' },
      { color: '#F59E0B', label: "O'rtacha", range: '50–100 μg/m³' },
      { color: '#EF4444', label: 'Zararli', range: '100+ μg/m³' },
    ],
  },
  {
    icon: 'sun',
    title: 'UV Indeks — Quyosh Nurlanishi',
    simple: 'Quyoshning terini qanchalik kuydirishini ko\'rsatadi. 3 dan yuqori bo\'lsa — quyosh kremi suring.',
    detail: 'UV (Ultrabinafsha) nurlar ko\'zga ko\'rinmaydi, lekin teri va ko\'zga zarar yetkazadi. O\'zbekistonda yoz oylarida UV indeksi 10–11 ga yetishi mumkin — bu ekstremalniye daraja. Doimiy ta\'sir teri raki xavfini oshiradi.',
    color: '#F59E0B',
    scale: [
      { color: '#22D3A5', label: 'Past (xavfsiz)', range: '1–2' },
      { color: '#F59E0B', label: "O'rtacha", range: '3–5' },
      { color: '#F97316', label: 'Yuqori', range: '6–7' },
      { color: '#EF4444', label: 'Juda Yuqori', range: '8–10' },
      { color: '#A855F7', label: 'Ekstremal', range: '11+' },
    ],
  },
  {
    icon: 'alert-triangle',
    title: 'Chang Xavfi',
    simple: 'Chang bo\'roni kelish ehtimoli. 50 dan oshsa — tashqarida niqob taqing.',
    detail: 'O\'zbekistonda, ayniqsa Qoraqum cho\'li yaqinidagi hududlarda, chang bo\'ronlari tez-tez bo\'ladi. Nukus va Buxoro eng ko\'p ta\'sirlanadigan shaharlar. Chang bo\'roni vaqtida ko\'rinish juda yomonlashadi va nafas olish qiyinlashadi.',
    color: '#EF4444',
    scale: [
      { color: '#22D3A5', label: 'Past', range: '0–25' },
      { color: '#F59E0B', label: "O'rtacha", range: '25–50' },
      { color: '#F97316', label: 'Yuqori', range: '50–75' },
      { color: '#A855F7', label: "Og'ir", range: '75–100' },
    ],
  },
  {
    icon: 'zap',
    title: 'Magnit Bo\'roni',
    simple: 'Yer magnit maydoni buzilishi. Ba\'zi odamlarda bosh og\'riq va charchoq qilishi mumkin.',
    detail: 'Quyoshdan keluvchi zaryadlangan zarralar Yer\'ning magnit maydoniga ta\'sir qilganda magnit bo\'roni hosil bo\'ladi. GPS va radio aloqada buzilishlar paydo bo\'ladi. Sezgir odamlarda — asosan qon bosimi yuqori yoki migren bor kishilarda — bosh og\'rig\'i kuchayishi mumkin.',
    color: '#A855F7',
    scale: [
      { color: '#22D3A5', label: 'Tinch', range: 'Normal' },
      { color: '#F59E0B', label: 'Buzilgan', range: 'Disturbed' },
      { color: '#A855F7', label: "Bo'ron", range: 'G1–G5' },
    ],
  },
  {
    icon: 'droplet',
    title: 'Namlik (Humidity)',
    simple: 'Havoda qancha suv bug\'i borligini ko\'rsatadi. Juda past bo\'lsa — teri qurib qoladi. Juda yuqori bo\'lsa — nafas og\'irlashadi.',
    detail: 'Optimal namlik: 40–60%. O\'zbekistonning janubiy hududlarida yozda namlik 15–20% ga tushishi mumkin — bu juda quruq havo demak. Quruq havoda yuqori nafas yo\'llari shilliq qavati qurib, infeksiyalarga moyillik ortadi.',
    color: '#3B82F6',
    scale: [
      { color: '#F59E0B', label: 'Juda quruq', range: '0–30%' },
      { color: '#22D3A5', label: 'Optimal', range: '30–60%' },
      { color: '#3B82F6', label: 'Nam', range: '60%+' },
    ],
  },
  {
    icon: 'sun',
    title: 'Quyosh Radiatsiyasi',
    simple: 'Quyoshdan keladigan issiqlik energiyasi miqdori. Qurilish va qishloq xo\'jaligi uchun muhim.',
    detail: 'Quyosh radiatsiyasi W/m² (Vatt per kvadrat metr) da o\'lchanadi. O\'zbekistonda yozda 700–800 W/m² ga yetishi mumkin. Bu ko\'rsatkich quyosh panellari uchun foydali, lekin tashqarida uzoq turuvchilar uchun issiqlik urishi xavfini oshiradi.',
    color: '#F59E0B',
    scale: [
      { color: '#22D3A5', label: 'Soya', range: '0–200 W/m²' },
      { color: '#F59E0B', label: "O'rtacha", range: '200–500 W/m²' },
      { color: '#EF4444', label: 'Kuchli', range: '500+ W/m²' },
    ],
  },
];

const ALERT_TYPES = [
  { icon: 'alert-triangle', color: '#EF4444', name: 'Chang bo\'roni', desc: 'Qoraqum cho\'lidan keladigan qum va chang to\'fonlari' },
  { icon: 'cloud', color: '#94A3B8', name: 'Shahar tutuni (Smog)', desc: 'Toshkent kabi shaharlarda transport va sanoat tutuni' },
  { icon: 'sun', color: '#F59E0B', name: 'UV ogohlantirish', desc: 'Haddan tashqari quyosh nurlanishi xavfi' },
  { icon: 'zap', color: '#A855F7', name: 'Magnit bo\'roni', desc: 'Yer magnit maydoni buzilishi' },
  { icon: 'thermometer', color: '#F97316', name: "Issiqlik to'lqini", desc: 'Harorat 38°C dan oshishi va issiqlik urishi xavfi' },
  { icon: 'wind', color: '#6366F1', name: 'Orol dengizi changi', desc: 'Qoraqalpog\'istonda zaharli kimyoviy chang' },
];

export default function GuideScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Qo'llanma</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Ko'rsatkichlar nima degan ma'noni anglatadi?</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.introBanner, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '25' }]}>
          <Text style={[styles.introEmoji, { color: colors.primary }]}>Iqlimoy nima?</Text>
          <Text style={[styles.introText, { color: colors.mutedForeground }]}>
            Iqlimoy — sun'iy yo'ldosh va yer stantsiyalaridan real vaqtda ma'lumot olib, O'zbekiston shaharlarida havo sifati, UV nurlanish, chang bo'roni va magnit faollikni kuzatuvchi ilova.
          </Text>
          <Text style={[styles.introText, { color: colors.mutedForeground, marginTop: 6 }]}>
            Quyida har bir ko'rsatkich nima ekanligini oddiy til bilan tushuntirganmiz.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>KO'RSATKICHLAR</Text>

        {GUIDE_ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.guideCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: item.color }]}
            onPress={() => setExpanded(expanded === idx ? null : idx)}
            activeOpacity={0.8}
          >
            <View style={styles.guideHeader}>
              <View style={[styles.guideIcon, { backgroundColor: item.color + '20' }]}>
                <Feather name={item.icon as any} size={18} color={item.color} />
              </View>
              <View style={styles.guideTitle}>
                <Text style={[styles.guideName, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[styles.guideSimple, { color: colors.mutedForeground }]} numberOfLines={expanded === idx ? 0 : 2}>
                  {item.simple}
                </Text>
              </View>
              <Feather
                name={expanded === idx ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.mutedForeground}
              />
            </View>

            {expanded === idx && (
              <View style={styles.guideExpanded}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.guideDetail, { color: colors.foreground }]}>{item.detail}</Text>

                {item.scale && (
                  <View style={styles.scaleContainer}>
                    <Text style={[styles.scaleTitle, { color: colors.mutedForeground }]}>DARAJALAR:</Text>
                    {item.scale.map((s, i) => (
                      <View key={i} style={styles.scaleRow}>
                        <View style={[styles.scaleDot, { backgroundColor: s.color }]} />
                        <Text style={[styles.scaleLabel, { color: colors.foreground }]}>{s.label}</Text>
                        <Text style={[styles.scaleRange, { color: colors.mutedForeground }]}>{s.range}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>OGOHLANTIRISH TURLARI</Text>

        <View style={[styles.alertCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {ALERT_TYPES.map((a, i) => (
            <View key={i}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 50 }]} />}
              <View style={styles.alertRow}>
                <View style={[styles.alertIcon, { backgroundColor: a.color + '20' }]}>
                  <Feather name={a.icon as any} size={16} color={a.color} />
                </View>
                <View style={styles.alertText}>
                  <Text style={[styles.alertName, { color: colors.foreground }]}>{a.name}</Text>
                  <Text style={[styles.alertDesc, { color: colors.mutedForeground }]}>{a.desc}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>MASLAHATLAR</Text>

        <View style={[styles.tipsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            { icon: 'clock', color: '#22D3A5', tip: 'Ertalab 06:00–09:00 — havo eng toza payt. Yugurish va sport uchun ideal vaqt.' },
            { icon: 'shield', color: '#3B82F6', tip: 'AQI 100 dan oshsa — bolalar va keksa odamlar tashqarida uzoq qolmasin.' },
            { icon: 'sun', color: '#F59E0B', tip: 'UV 3 dan oshsa — quyosh kremi (SPF 30+) suring va qalpoq kiyib chiqing.' },
            { icon: 'wind', color: '#EF4444', tip: 'Chang xavfi 50 dan oshsa — tashqarida tibbiy niqob taqing.' },
            { icon: 'cpu', color: '#00E5C3', tip: "Iqlimoy AI dan so'rang — u har qanday savolga o'zbek tilida javob beradi." },
          ].map((t, i) => (
            <View key={i}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 50 }]} />}
              <View style={styles.tipRow}>
                <View style={[styles.tipIcon, { backgroundColor: t.color + '20' }]}>
                  <Feather name={t.icon as any} size={15} color={t.color} />
                </View>
                <Text style={[styles.tipText, { color: colors.foreground }]}>{t.tip}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.aiBtn, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}
          onPress={() => router.push('/(tabs)/assistant' as any)}
        >
          <View style={[styles.aiBtnIcon, { backgroundColor: colors.primary + '20' }]}>
            <Feather name="cpu" size={20} color={colors.primary} />
          </View>
          <View style={styles.aiBtnText}>
            <Text style={[styles.aiBtnTitle, { color: colors.foreground }]}>Iqlimoy AI ga so'rang</Text>
            <Text style={[styles.aiBtnDesc, { color: colors.mutedForeground }]}>Har qanday savolga o'zbek tilida javob beradi</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 2 },
  content: { padding: 16, gap: 12 },
  introBanner: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 6 },
  introEmoji: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  introText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.2, marginTop: 6 },
  guideCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 3,
    overflow: 'hidden',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  guideIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  guideTitle: { flex: 1 },
  guideName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginBottom: 4 },
  guideSimple: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18 },
  guideExpanded: { paddingHorizontal: 14, paddingBottom: 14 },
  divider: { height: 1, marginBottom: 12 },
  guideDetail: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  scaleContainer: { gap: 8 },
  scaleTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.8 },
  scaleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scaleDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  scaleLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, flex: 1 },
  scaleRange: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  alertCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
  alertIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  alertText: { flex: 1 },
  alertName: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  alertDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 2 },
  tipsCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
  tipIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, flex: 1 },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    marginTop: 4,
  },
  aiBtnIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aiBtnText: { flex: 1 },
  aiBtnTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  aiBtnDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 },
});
