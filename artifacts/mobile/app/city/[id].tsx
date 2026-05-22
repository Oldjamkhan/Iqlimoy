import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AQIBadge } from '@/components/AQIBadge';
import { ForecastRow } from '@/components/ForecastRow';
import { MetricCard } from '@/components/MetricCard';
import { CITIES, FORECAST_7DAY, getAQILabel, getAQILevel } from '@/constants/demoData';
import { useColors } from '@/hooks/useColors';

const UV_LABELS = ['Past','Past','Past','O\'rtacha','O\'rtacha','O\'rtacha','Yuqori','Yuqori','Juda Yuqori','Juda Yuqori','Ekstremal'];
const MAGNETIC_LABELS: Record<string, string> = { normal: 'Tinch', disturbed: 'Buzilgan', storm: 'Bo\'ron' };

export default function CityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const city = CITIES.find((c) => c.id === id);

  if (!city) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad + 20 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Shahar topilmadi</Text>
      </View>
    );
  }

  const level = getAQILevel(city.aqi);
  const aqiColors: Record<string, string> = {
    good: colors.good,
    moderate: colors.moderate,
    unhealthy: colors.unhealthy,
    veryUnhealthy: colors.veryUnhealthy,
    hazardous: colors.hazardous,
  };
  const aqiColor = aqiColors[level];

  const magneticColor = city.magneticField === 'normal' ? colors.good : city.magneticField === 'disturbed' ? colors.moderate : colors.hazardous;

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
        <View style={styles.headerTitle}>
          <Text style={[styles.title, { color: colors.foreground }]}>{city.nameUz}</Text>
          <Text style={[styles.region, { color: colors.mutedForeground }]}>{city.region}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: aqiColor + '50', borderLeftColor: aqiColor }]}>
          <View style={styles.heroLeft}>
            <AQIBadge aqi={city.aqi} size="xl" showLabel />
          </View>
          <View style={styles.heroRight}>
            <View style={styles.heroRow}>
              <Feather name="thermometer" size={14} color={colors.mutedForeground} />
              <Text style={[styles.heroValue, { color: colors.foreground }]}>{city.temperature}°C Harorat</Text>
            </View>
            <View style={styles.heroRow}>
              <Feather name="droplet" size={14} color={colors.mutedForeground} />
              <Text style={[styles.heroValue, { color: colors.foreground }]}>{city.humidity}% Namlik</Text>
            </View>
            <View style={styles.heroRow}>
              <Feather name="wind" size={14} color={colors.mutedForeground} />
              <Text style={[styles.heroValue, { color: colors.foreground }]}>{city.windSpeed} km/h Shamol</Text>
            </View>
            <View style={styles.heroRow}>
              <Feather name="cloud" size={14} color={colors.mutedForeground} />
              <Text style={[styles.heroValue, { color: colors.foreground }]}>{city.conditions}</Text>
            </View>
            <View style={[styles.magBadge, { backgroundColor: magneticColor + '20' }]}>
              <Feather name="zap" size={10} color={magneticColor} />
              <Text style={[styles.magText, { color: magneticColor }]}>
                Magnit: {MAGNETIC_LABELS[city.magneticField] ?? city.magneticField}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>IFLOSLANISH DARAJASI</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsRow}>
          <MetricCard label="PM2.5" value={city.pm25} unit="μg/m³" iconName="wind" accentColor={city.pm25 > 35 ? colors.veryUnhealthy : city.pm25 > 12 ? colors.moderate : colors.good} />
          <MetricCard label="PM10" value={city.pm10} unit="μg/m³" iconName="cloud" accentColor={city.pm10 > 75 ? colors.veryUnhealthy : colors.moderate} />
          <MetricCard label="UV Indeks" value={city.uvIndex} unit="" iconName="sun" accentColor={city.uvIndex >= 8 ? colors.hazardous : city.uvIndex >= 6 ? colors.unhealthy : colors.moderate} subLabel={UV_LABELS[city.uvIndex] ?? 'Ekstremal'} />
          <MetricCard label="Chang Xavfi" value={city.dustRisk} unit="/100" iconName="alert-triangle" accentColor={city.dustRisk > 70 ? colors.hazardous : city.dustRisk > 40 ? colors.unhealthy : colors.moderate} />
          <MetricCard label="Quyosh Nur." value={city.solarRadiation} unit="W/m²" iconName="sun" accentColor={colors.moderate} />
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>7 KUNLIK PROGNOZ</Text>
        <View style={[styles.forecastCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {FORECAST_7DAY.map((day) => (
            <ForecastRow key={day.date} day={day} />
          ))}
        </View>

        <View style={[styles.healthCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.healthTitle, { color: colors.foreground }]}>Sog'liq Tavsiyalari</Text>
          <View style={styles.healthItems}>
            {getHealthAdvisory(city.aqi, city.uvIndex, city.dustRisk, colors).map((item, idx) => (
              <View key={idx} style={styles.healthItem}>
                <View style={[styles.healthDot, { backgroundColor: item.color }]} />
                <Text style={[styles.healthText, { color: colors.foreground }]}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function getHealthAdvisory(aqi: number, uv: number, dust: number, colors: ReturnType<typeof useColors>) {
  const items: { color: string; text: string }[] = [];

  if (aqi <= 50) items.push({ color: colors.good, text: 'Havo sifati yaxshi — tashqarida faollik uchun xavfsiz' });
  else if (aqi <= 100) items.push({ color: colors.moderate, text: 'Sezgir guruhlar uzoq tashqi mashqlarni kamaytirsin' });
  else if (aqi <= 150) items.push({ color: colors.unhealthy, text: 'Hamma tashqi faollikni kamaytirsin; sezgir guruhlar qolmasin' });
  else items.push({ color: colors.hazardous, text: 'Jiddiy xavf — tashqariga chiqmaslik tavsiya etiladi' });

  if (uv >= 8) items.push({ color: colors.hazardous, text: 'Ekstremal UV — 10:00–16:00 da quyoshdan saqlaning, SPF 50+ zarur' });
  else if (uv >= 6) items.push({ color: colors.unhealthy, text: 'Yuqori UV — SPF 30+ quyosh kremi va himoya kiyim kering' });

  if (dust >= 70) items.push({ color: colors.veryUnhealthy, text: 'Kuchli chang — tashqarida N95 niqob majburiy' });
  else if (dust >= 40) items.push({ color: colors.moderate, text: "O'rtacha chang — uzoq tashqarida qolsangiz tibbiy niqob taqing" });

  return items;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 14,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  headerTitle: { flex: 1, gap: 2 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24 },
  region: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  content: { padding: 16, gap: 14 },
  heroCard: {
    flexDirection: 'row', borderRadius: 16, borderWidth: 1, borderLeftWidth: 4,
    padding: 20, gap: 20, alignItems: 'center',
  },
  heroLeft: { alignItems: 'center' },
  heroRight: { flex: 1, gap: 8 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroValue: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  magBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
    alignSelf: 'flex-start', marginTop: 2,
  },
  magText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.2, marginTop: 4 },
  metricsRow: { paddingRight: 16, gap: 10 },
  forecastCard: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 4 },
  healthCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  healthTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  healthItems: { gap: 10 },
  healthItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  healthDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  healthText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, flex: 1 },
  notFound: { fontFamily: 'Inter_400Regular', fontSize: 16, textAlign: 'center', marginTop: 40 },
});
