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

import { PartnerCard } from '@/components/PartnerCard';
import { PARTNERS } from '@/constants/demoData';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const { selectedCity } = useApp();

  const activityScore = Math.max(0, 100 - selectedCity.aqi * 0.5 - selectedCity.dustRisk * 0.3 - selectedCity.uvIndex * 2);
  const scoreColor = activityScore >= 70 ? colors.good : activityScore >= 40 ? colors.moderate : colors.unhealthy;

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 56, paddingBottom: Platform.OS === 'web' ? 100 : 80 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { top: topPad, backgroundColor: colors.background + 'EE', borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Explore</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.activityHeader}>
            <View>
              <Text style={[styles.activityTitle, { color: colors.foreground }]}>Today's Outdoor Score</Text>
              <Text style={[styles.activityCity, { color: colors.mutedForeground }]}>{selectedCity.nameUz}</Text>
            </View>
            <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>{Math.round(activityScore)}</Text>
              <Text style={[styles.scoreMax, { color: colors.mutedForeground }]}>/100</Text>
            </View>
          </View>

          <View style={[styles.scoreMeter, { backgroundColor: colors.secondary }]}>
            <View style={[styles.scoreFill, { width: `${activityScore}%` as any, backgroundColor: scoreColor }]} />
          </View>

          <View style={styles.activityFactors}>
            <FactorPill label={`AQI ${selectedCity.aqi}`} ok={selectedCity.aqi <= 100} colors={colors} />
            <FactorPill label={`UV ${selectedCity.uvIndex}`} ok={selectedCity.uvIndex <= 6} colors={colors} />
            <FactorPill label={`Dust ${selectedCity.dustRisk}%`} ok={selectedCity.dustRisk <= 40} colors={colors} />
            <FactorPill label={`${selectedCity.temperature}°C`} ok={selectedCity.temperature <= 35} colors={colors} />
          </View>

          <Text style={[styles.activityRec, { color: colors.mutedForeground }]}>
            {activityScore >= 70
              ? 'Good conditions for outdoor activities. Morning hours are optimal.'
              : activityScore >= 40
                ? 'Moderate conditions. Limit strenuous activities and wear sun protection.'
                : 'Poor conditions today. Prefer indoor activities or travel to a cleaner region.'}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/b2b' as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.accent + '20' }]}>
              <Feather name="code" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.foreground }]}>B2B API</Text>
            <Text style={[styles.actionDesc, { color: colors.mutedForeground }]}>Environmental data for businesses</Text>
            <View style={[styles.betaBadge, { backgroundColor: colors.accent + '20' }]}>
              <Text style={[styles.betaText, { color: colors.accent }]}>BETA</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/construction' as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.moderate + '20' }]}>
              <Feather name="tool" size={20} color={colors.moderate} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.foreground }]}>Construction</Text>
            <Text style={[styles.actionDesc, { color: colors.mutedForeground }]}>Climate analytics for projects</Text>
            <View style={[styles.betaBadge, { backgroundColor: colors.moderate + '20' }]}>
              <Text style={[styles.betaText, { color: colors.moderate }]}>PRO</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.sponsorBanner, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
          <View style={styles.sponsorLeft}>
            <Text style={[styles.sponsorTag, { color: colors.primary }]}>PARTNER SPOTLIGHT</Text>
            <Text style={[styles.sponsorTitle, { color: colors.foreground }]}>Ecopark Chimyon</Text>
            <Text style={[styles.sponsorDesc, { color: colors.mutedForeground }]}>Escape the city — AQI 12, Mountain fresh air, 1,600m elevation</Text>
          </View>
          <View style={[styles.sponsorAqi, { borderColor: colors.good + '60' }]}>
            <Text style={[styles.sponsorAqiNum, { color: colors.good }]}>12</Text>
            <Text style={[styles.sponsorAqiLabel, { color: colors.good }]}>AQI</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>CLEAN AIR PARTNERS</Text>
        <View style={styles.partnerList}>
          {PARTNERS.map((p) => (
            <PartnerCard key={p.id} partner={p} />
          ))}
        </View>

        <View style={[styles.pitchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.pitchHeader}>
            <Feather name="globe" size={20} color={colors.primary} />
            <Text style={[styles.pitchTitle, { color: colors.foreground }]}>About Iqlimoy</Text>
          </View>
          <Text style={[styles.pitchText, { color: colors.mutedForeground }]}>
            Iqlimoy ("Climate" in Uzbek) is Central Asia's first AI-powered satellite environmental monitoring platform.
            We combine ESA Sentinel-5P satellite data with ground station networks to provide real-time air quality,
            UV radiation, dust storm tracking, and geomagnetic activity monitoring for 8+ cities in Uzbekistan.
          </Text>
          <View style={styles.statRow}>
            {[
              { num: '8+', label: 'Cities' },
              { num: '30m', label: 'Update' },
              { num: '6', label: 'Alert Types' },
              { num: '13', label: 'Regions' },
            ].map((s) => (
              <View key={s.label} style={styles.stat}>
                <Text style={[styles.statNum, { color: colors.primary }]}>{s.num}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function FactorPill({ label, ok, colors }: { label: string; ok: boolean; colors: ReturnType<typeof useColors> }) {
  const color = ok ? colors.good : colors.unhealthy;
  return (
    <View style={[styles.factorPill, { backgroundColor: color + '18', borderColor: color + '40' }]}>
      <Feather name={ok ? 'check' : 'x'} size={10} color={color} />
      <Text style={[styles.factorText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  activityCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  activityCity: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 2,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    lineHeight: 22,
  },
  scoreMax: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
  },
  scoreMeter: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  activityFactors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  activityRec: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  actionDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  betaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  betaText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  sponsorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  sponsorLeft: {
    flex: 1,
    gap: 3,
  },
  sponsorTag: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1,
  },
  sponsorTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  sponsorDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  sponsorAqi: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorAqiNum: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  sponsorAqiLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  partnerList: {
    gap: 10,
  },
  pitchCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    marginTop: 4,
  },
  pitchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pitchTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  pitchText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  statNum: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  factorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  factorText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
});
