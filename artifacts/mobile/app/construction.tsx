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

import { FORECAST_7DAY } from '@/constants/demoData';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const CONSTRUCTION_METRICS = [
  { icon: 'wind', label: 'Wind Speed', value: '12 km/h', limit: '50 km/h crane limit', risk: 'low', desc: 'Safe for all crane operations up to 80m height' },
  { icon: 'sun', label: 'UV Index', value: '5 (Moderate)', limit: 'PPE required above 3', risk: 'medium', desc: 'Standard PPE required. Rotate outdoor workers every 2 hours' },
  { icon: 'alert-triangle', label: 'Dust Risk', value: '35/100', limit: 'Stop above 80/100', risk: 'low', desc: 'Acceptable. Use dust suppression for earthworks' },
  { icon: 'thermometer', label: 'Temperature', value: '28°C', limit: 'Heat stop above 38°C', risk: 'low', desc: 'Comfortable conditions. Hydration breaks every 2 hours' },
  { icon: 'droplet', label: 'Humidity', value: '45%', limit: 'Monitor above 80%', risk: 'low', desc: 'Optimal for concrete curing (40-70% range)' },
  { icon: 'cloud-lightning', label: 'Storm Risk', value: 'None', limit: 'Stop if lightning within 15km', risk: 'low', desc: 'No thunderstorm activity in the next 24 hours' },
];

const WEEKLY_SCHEDULE = [
  { day: 'Today (Wed)', overall: 'good', crane: true, concrete: true, earthwork: true, roofing: true },
  { day: 'Thursday', overall: 'good', crane: true, concrete: true, earthwork: true, roofing: true },
  { day: 'Friday', overall: 'good', crane: true, concrete: true, earthwork: true, roofing: true },
  { day: 'Saturday', overall: 'medium', crane: true, concrete: false, earthwork: true, roofing: false },
  { day: 'Sunday', overall: 'bad', crane: false, concrete: false, earthwork: false, roofing: false },
  { day: 'Monday', overall: 'medium', crane: true, concrete: true, earthwork: true, roofing: false },
  { day: 'Tuesday', overall: 'good', crane: true, concrete: true, earthwork: true, roofing: true },
];

export default function ConstructionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const { selectedCity } = useApp();

  const riskColors: Record<string, string> = {
    low: colors.good,
    medium: colors.moderate,
    high: colors.unhealthy,
    critical: colors.hazardous,
  };

  const overallColors: Record<string, string> = {
    good: colors.good,
    medium: colors.moderate,
    bad: colors.veryUnhealthy,
  };

  const overallRisk = 'LOW-MEDIUM';
  const overallScore = 74;

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
          <Text style={[styles.title, { color: colors.foreground }]}>Construction Analytics</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{selectedCity.nameUz} · Today</Text>
        </View>
        <View style={[styles.proBadge, { backgroundColor: colors.moderate + '20' }]}>
          <Text style={[styles.proText, { color: colors.moderate }]}>PRO</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.good + '50', borderLeftColor: colors.good }]}>
          <View style={styles.heroLeft}>
            <Text style={[styles.riskLabel, { color: colors.mutedForeground }]}>Overall Risk</Text>
            <Text style={[styles.riskValue, { color: colors.good }]}>{overallRisk}</Text>
            <View style={[styles.scoreMeter, { backgroundColor: colors.secondary }]}>
              <View style={[styles.scoreFill, { width: `${overallScore}%` as any, backgroundColor: colors.good }]} />
            </View>
            <Text style={[styles.scoreText, { color: colors.good }]}>{overallScore}/100 Safety Score</Text>
          </View>
          <View style={[styles.recommendBadge, { backgroundColor: colors.good + '18', borderColor: colors.good + '40' }]}>
            <Feather name="check-circle" size={20} color={colors.good} />
            <Text style={[styles.recommendText, { color: colors.good }]}>WORK{'\n'}PERMITTED</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>SITE CONDITIONS</Text>
        <View style={styles.metricsGrid}>
          {CONSTRUCTION_METRICS.map((m) => (
            <View key={m.label} style={[styles.metricCard, { backgroundColor: colors.card, borderColor: riskColors[m.risk] + '40', borderLeftColor: riskColors[m.risk] }]}>
              <View style={styles.metricTop}>
                <View style={[styles.metricIcon, { backgroundColor: riskColors[m.risk] + '18' }]}>
                  <Feather name={m.icon as any} size={16} color={riskColors[m.risk]} />
                </View>
                <View style={styles.metricInfo}>
                  <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{m.label}</Text>
                  <Text style={[styles.metricValue, { color: colors.foreground }]}>{m.value}</Text>
                </View>
                <View style={[styles.riskPill, { backgroundColor: riskColors[m.risk] + '20' }]}>
                  <Text style={[styles.riskText, { color: riskColors[m.risk] }]}>{m.risk.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={[styles.limitText, { color: colors.mutedForeground }]}>{m.limit}</Text>
              <Text style={[styles.descText, { color: colors.foreground }]}>{m.desc}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>WEEKLY WORK SCHEDULE</Text>
        <View style={[styles.scheduleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.scheduleHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.schedCol, { color: colors.mutedForeground, flex: 2 }]}>Day</Text>
            {['Crane', 'Concrete', 'Earthwork', 'Roofing'].map((h) => (
              <Text key={h} style={[styles.schedColHead, { color: colors.mutedForeground }]}>{h}</Text>
            ))}
          </View>
          {WEEKLY_SCHEDULE.map((row) => (
            <View key={row.day} style={[styles.schedRow, { borderBottomColor: colors.border }]}>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={[styles.dayDot, { backgroundColor: overallColors[row.overall] }]} />
                <Text style={[styles.dayText, { color: colors.foreground }]} numberOfLines={1}>{row.day}</Text>
              </View>
              {[row.crane, row.concrete, row.earthwork, row.roofing].map((ok, i) => (
                <View key={i} style={styles.schedCell}>
                  <Feather name={ok ? 'check' : 'x'} size={14} color={ok ? colors.good : colors.veryUnhealthy} />
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={[styles.optimalCard, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
          <Feather name="star" size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.optimalTitle, { color: colors.foreground }]}>Optimal Concrete Pour Window</Text>
            <Text style={[styles.optimalDesc, { color: colors.mutedForeground }]}>
              Friday, May 23 — Morning (06:00–11:00){'\n'}
              AQI 55 · UV 6 · Temp 16-28°C · Humidity 38% (ideal curing range)
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.infoTitle, { color: colors.foreground }]}>Iqlimoy Construction API</Text>
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Integrate daily construction risk scores, weather-stop triggers, and work schedule recommendations
            directly into your project management software via our B2B API.
          </Text>
          <TouchableOpacity
            style={[styles.apiBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/b2b' as any)}
          >
            <Text style={[styles.apiBtnText, { color: colors.background }]}>Learn about B2B API</Text>
            <Feather name="arrow-right" size={14} color={colors.background} />
          </TouchableOpacity>
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
  proBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 'auto' },
  proText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 },
  content: { padding: 16, gap: 14 },
  heroCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, borderLeftWidth: 4, padding: 16, gap: 16 },
  heroLeft: { flex: 1, gap: 6 },
  riskLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, letterSpacing: 0.5 },
  riskValue: { fontFamily: 'Inter_700Bold', fontSize: 24 },
  scoreMeter: { height: 6, borderRadius: 3, overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: 3 },
  scoreText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  recommendBadge: { alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 4 },
  recommendText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5, textAlign: 'center' },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.2, marginTop: 4 },
  metricsGrid: { gap: 8 },
  metricCard: { borderRadius: 12, borderWidth: 1, borderLeftWidth: 3, padding: 12, gap: 6 },
  metricTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metricIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  metricInfo: { flex: 1 },
  metricLabel: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  metricValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  riskPill: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  riskText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.4 },
  limitText: { fontFamily: 'Inter_400Regular', fontSize: 11, fontStyle: 'italic' },
  descText: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17 },
  scheduleCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  scheduleHeader: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  schedCol: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  schedColHead: { fontFamily: 'Inter_600SemiBold', fontSize: 10, width: 52, textAlign: 'center' },
  schedRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1 },
  dayDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  dayText: { fontFamily: 'Inter_500Medium', fontSize: 12, flex: 1 },
  schedCell: { width: 52, alignItems: 'center' },
  optimalCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  optimalTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginBottom: 4 },
  optimalDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 19 },
  infoCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
  infoTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  apiBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  apiBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
