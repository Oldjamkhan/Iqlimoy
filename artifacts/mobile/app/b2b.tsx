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

const API_TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    color: 'good' as const,
    features: ['500 API calls/day', '1-hour data delay', '3 cities', 'AQI + Temperature', 'Basic support'],
    notIncluded: ['Forecast data', 'Dust storm alerts', 'Custom webhooks'],
  },
  {
    name: 'Pro',
    price: '$299',
    period: '/month',
    color: 'accent' as const,
    popular: true,
    features: ['10,000 API calls/day', 'Real-time data', '8+ cities', 'Full 18 metrics', '6-hour forecast', 'Webhook alerts', 'Priority support'],
    notIncluded: ['Custom satellite tasking', 'Dedicated CSM'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    color: 'primary' as const,
    features: ['Unlimited API calls', 'Real-time data', 'All of Uzbekistan', 'Full 18 metrics', '7-day forecast', 'Custom satellite tasking', 'Dedicated CSM', 'SLA 99.9%', 'On-premise option'],
    notIncluded: [],
  },
];

const USE_CASES = [
  { icon: 'tool', title: 'Construction', desc: 'Daily risk scores, crane wind limits, UV worker safety, concrete pour windows' },
  { icon: 'sun', title: 'Agriculture', desc: 'Frost alerts, UV crop stress, irrigation planning, dust contamination warnings' },
  { icon: 'calendar', title: 'Events & Tourism', desc: 'Venue air quality scoring, outdoor event safety ratings, visitor advisories' },
  { icon: 'shield', title: 'Government', desc: 'Public health dashboards, school closure triggers, emergency response data' },
  { icon: 'truck', title: 'Logistics', desc: 'Dust storm routing, visibility alerts, driver safety notifications' },
  { icon: 'activity', title: 'Healthcare', desc: 'Patient advisory triggers, respiratory risk forecasting, asthma management' },
];

const SAMPLE_RESPONSE = `{
  "city": "tashkent",
  "timestamp": "2026-05-21T10:30:00Z",
  "aqi": 87,
  "aqi_level": "moderate",
  "pm25_ugm3": 32,
  "pm10_ugm3": 68,
  "uv_index": 5,
  "uv_level": "moderate",
  "temperature_c": 28,
  "humidity_pct": 45,
  "wind_kmh": 12,
  "dust_risk": 35,
  "solar_rad_wm2": 420,
  "magnetic_field": "disturbed",
  "alerts_active": 1,
  "data_source": "sentinel5p+ground",
  "next_update": "2026-05-21T11:00:00Z"
}`;

export default function B2BScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const [selectedTier, setSelectedTier] = useState(1);

  const tierColors: Record<string, string> = {
    good: colors.good,
    accent: colors.accent,
    primary: colors.primary,
    moderate: colors.moderate,
  };

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
          <Text style={[styles.title, { color: colors.foreground }]}>B2B API Platform</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Environmental data for enterprises</Text>
        </View>
        <View style={[styles.betaBadge, { backgroundColor: colors.accent + '20' }]}>
          <Text style={[styles.betaText, { color: colors.accent }]}>BETA</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.heroBanner, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            Real-time satellite environmental intelligence for your business
          </Text>
          <Text style={[styles.heroDesc, { color: colors.mutedForeground }]}>
            Integrate Iqlimoy's 30-minute-update environmental data into your construction ERP, farming platform, event management system, or government dashboard via a single REST API.
          </Text>
          <View style={styles.statsRow}>
            {[['99.8%', 'Uptime'], ['30min', 'Data Refresh'], ['18+', 'Metrics'], ['12', 'Enterprise Clients']].map(([num, label]) => (
              <View key={label} style={styles.stat}>
                <Text style={[styles.statNum, { color: colors.primary }]}>{num}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>PRICING PLANS</Text>
        <View style={styles.tiers}>
          {API_TIERS.map((tier, idx) => {
            const tc = tierColors[tier.color];
            return (
              <TouchableOpacity
                key={tier.name}
                style={[styles.tierCard, { backgroundColor: colors.card, borderColor: selectedTier === idx ? tc : colors.border, borderWidth: selectedTier === idx ? 2 : 1 }]}
                onPress={() => setSelectedTier(idx)}
                activeOpacity={0.8}
              >
                {tier.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: tc }]}>
                    <Text style={[styles.popularText, { color: colors.background }]}>POPULAR</Text>
                  </View>
                )}
                <Text style={[styles.tierName, { color: colors.foreground }]}>{tier.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.tierPrice, { color: tc }]}>{tier.price}</Text>
                  <Text style={[styles.tierPeriod, { color: colors.mutedForeground }]}>{tier.period}</Text>
                </View>
                {tier.features.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check" size={12} color={tc} />
                    <Text style={[styles.featureText, { color: colors.foreground }]}>{f}</Text>
                  </View>
                ))}
                {tier.notIncluded.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="x" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.featureText, { color: colors.mutedForeground }]}>{f}</Text>
                  </View>
                ))}
                <TouchableOpacity style={[styles.tierBtn, { backgroundColor: selectedTier === idx ? tc : colors.secondary }]}>
                  <Text style={[styles.tierBtnText, { color: selectedTier === idx ? colors.background : colors.mutedForeground }]}>
                    {tier.price === 'Custom' ? 'Contact Sales' : tier.price === 'Free' ? 'Get Started' : 'Subscribe'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>USE CASES</Text>
        <View style={styles.useCaseGrid}>
          {USE_CASES.map((uc) => (
            <View key={uc.title} style={[styles.useCaseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.useCaseIcon, { backgroundColor: colors.primary + '18' }]}>
                <Feather name={uc.icon as any} size={18} color={colors.primary} />
              </View>
              <Text style={[styles.useCaseTitle, { color: colors.foreground }]}>{uc.title}</Text>
              <Text style={[styles.useCaseDesc, { color: colors.mutedForeground }]}>{uc.desc}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>SAMPLE API RESPONSE</Text>
        <View style={[styles.codeBlock, { backgroundColor: '#0a1628', borderColor: colors.border }]}>
          <View style={styles.codeHeader}>
            <Text style={[styles.codeMethod, { backgroundColor: colors.good + '20', color: colors.good }]}>GET</Text>
            <Text style={[styles.codeUrl, { color: colors.mutedForeground }]}>/v1/environment/tashkent/current</Text>
          </View>
          <Text style={[styles.codeText, { color: '#a8d8b0' }]}>{SAMPLE_RESPONSE}</Text>
        </View>

        <View style={[styles.contactCard, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
          <Feather name="mail" size={20} color={colors.primary} />
          <View style={styles.contactText}>
            <Text style={[styles.contactTitle, { color: colors.foreground }]}>Ready to integrate?</Text>
            <Text style={[styles.contactDesc, { color: colors.mutedForeground }]}>Contact our team for a free API trial and technical onboarding</Text>
          </View>
          <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.primary }]}>
            <Text style={[styles.contactBtnText, { color: colors.background }]}>Get Access</Text>
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
  betaBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 'auto' },
  betaText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 },
  content: { padding: 16, gap: 14 },
  heroBanner: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 12 },
  heroTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, lineHeight: 22 },
  heroDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
  stat: { alignItems: 'center', gap: 2 },
  statNum: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.2, marginTop: 4 },
  tiers: { gap: 12 },
  tierCard: { borderRadius: 14, padding: 16, gap: 8 },
  popularBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 2 },
  popularText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.5 },
  tierName: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  tierPrice: { fontFamily: 'Inter_700Bold', fontSize: 28 },
  tierPeriod: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 13, flex: 1 },
  tierBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  tierBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  useCaseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  useCaseCard: { width: '47%', borderRadius: 12, borderWidth: 1, padding: 12, gap: 6 },
  useCaseIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  useCaseTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  useCaseDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16 },
  codeBlock: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  codeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderBottomWidth: 1, borderBottomColor: '#1a2a40' },
  codeMethod: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontFamily: 'Inter_700Bold', fontSize: 11 },
  codeUrl: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  codeText: { fontFamily: 'Inter_400Regular', fontSize: 11, padding: 12, lineHeight: 18 },
  contactCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, padding: 16 },
  contactText: { flex: 1, gap: 3 },
  contactTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  contactDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17 },
  contactBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  contactBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
