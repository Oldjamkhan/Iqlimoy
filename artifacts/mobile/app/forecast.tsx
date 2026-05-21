import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
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

import { ForecastRow } from '@/components/ForecastRow';
import { FORECAST_7DAY, getAQILabel } from '@/constants/demoData';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function ForecastScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const { selectedCity } = useApp();

  const bestDay = FORECAST_7DAY.reduce((best, day) => (day.aqi < best.aqi ? day : best));
  const worstDay = FORECAST_7DAY.reduce((worst, day) => (day.aqi > worst.aqi ? day : worst));

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
          <Text style={[styles.title, { color: colors.foreground }]}>7-Day Forecast</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{selectedCity.nameUz} · Environmental</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.good + '12', borderColor: colors.good + '30' }]}>
            <Feather name="sun" size={16} color={colors.good} />
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Best Day</Text>
            <Text style={[styles.summaryDay, { color: colors.good }]}>{bestDay.dayName}</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>AQI {bestDay.aqi} · {getAQILabel(bestDay.aqi)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.veryUnhealthy + '12', borderColor: colors.veryUnhealthy + '30' }]}>
            <Feather name="alert-triangle" size={16} color={colors.veryUnhealthy} />
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Watch For</Text>
            <Text style={[styles.summaryDay, { color: colors.veryUnhealthy }]}>{worstDay.dayName}</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>AQI {worstDay.aqi} · {getAQILabel(worstDay.aqi)}</Text>
          </View>
        </View>

        <View style={[styles.trendCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.trendTitle, { color: colors.foreground }]}>AQI Trend Overview</Text>
          <View style={styles.trendBars}>
            {FORECAST_7DAY.map((day) => {
              const height = Math.max(20, (day.aqi / 220) * 80);
              const barColor = day.aqi <= 50 ? colors.good : day.aqi <= 100 ? colors.moderate : day.aqi <= 150 ? colors.unhealthy : colors.veryUnhealthy;
              return (
                <View key={day.date} style={styles.trendBarCol}>
                  <Text style={[styles.trendAqi, { color: barColor }]}>{day.aqi}</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { height, backgroundColor: barColor + 'CC' }]} />
                  </View>
                  <Text style={[styles.trendDay, { color: colors.mutedForeground }]}>{day.dayName.slice(0, 3)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>DAILY BREAKDOWN</Text>
        <View style={[styles.forecastCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {FORECAST_7DAY.map((day) => <ForecastRow key={day.date} day={day} />)}
        </View>

        <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.insightTitle, { color: colors.foreground }]}>7-Day Insight</Text>
          <Text style={[styles.insightText, { color: colors.mutedForeground }]}>
            Air quality in {selectedCity.nameUz} is expected to improve through Friday before deteriorating over the
            weekend as a high-pressure system from the Karakum Desert moves in, trapping pollutants and increasing
            dust risk. Plan outdoor activities for Thursday–Friday morning for the best conditions this week.
          </Text>
        </View>

        <View style={[styles.dataCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.dataRow}>
            <Feather name="radio" size={14} color={colors.primary} />
            <Text style={[styles.dataText, { color: colors.mutedForeground }]}>
              Forecast generated from Sentinel-5P satellite + WRF numerical weather model + Iqlimoy ground station network
            </Text>
          </View>
          <Text style={[styles.updateText, { color: colors.mutedForeground }]}>Last updated: 10:30 UTC · Next update: 13:00 UTC</Text>
        </View>
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
  title: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  content: { padding: 16, gap: 14 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, gap: 3, alignItems: 'center' },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  summaryDay: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  summaryValue: { fontFamily: 'Inter_400Regular', fontSize: 12, textAlign: 'center' },
  trendCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  trendTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  trendBars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120 },
  trendBarCol: { alignItems: 'center', gap: 4, flex: 1 },
  trendAqi: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  barContainer: { height: 80, justifyContent: 'flex-end', width: '100%', alignItems: 'center' },
  bar: { width: '70%', borderRadius: 4, minHeight: 8 },
  trendDay: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.2, marginTop: 4 },
  forecastCard: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 4 },
  insightCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 8 },
  insightTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  insightText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20 },
  dataCard: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 8 },
  dataRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dataText: { fontFamily: 'Inter_400Regular', fontSize: 11, flex: 1, lineHeight: 16 },
  updateText: { fontFamily: 'Inter_400Regular', fontSize: 10 },
});
