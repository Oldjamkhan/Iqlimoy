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

import { AQIBadge } from '@/components/AQIBadge';
import { RegionMap } from '@/components/RegionMap';
import { CITIES, getAQILabel, getAQILevel } from '@/constants/demoData';
import { useColors } from '@/hooks/useColors';

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  const sortedCities = [...CITIES].sort((a, b) => b.aqi - a.aqi);

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 56, paddingBottom: Platform.OS === 'web' ? 100 : 80 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { top: topPad, backgroundColor: colors.background + 'EE', borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Ekologik Xarita</Text>
        <View style={[styles.satBadge, { backgroundColor: colors.primary + '15' }]}>
          <Feather name="radio" size={10} color={colors.primary} />
          <Text style={[styles.satText, { color: colors.primary }]}>SATELLITE</Text>
        </View>
      </View>

      <View style={styles.content}>
        <RegionMap
          onRegionPress={(id) => {
            const city = CITIES.find((c) => c.id === id);
            if (city) router.push(`/city/${city.id}` as any);
          }}
        />

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>CITIES BY AIR QUALITY</Text>

        <View style={styles.cityList}>
          {sortedCities.map((city, idx) => {
            const level = getAQILevel(city.aqi);
            const aqiColors: Record<string, string> = {
              good: colors.good,
              moderate: colors.moderate,
              unhealthy: colors.unhealthy,
              veryUnhealthy: colors.veryUnhealthy,
              hazardous: colors.hazardous,
            };
            const ac = aqiColors[level];
            return (
              <TouchableOpacity
                key={city.id}
                style={[styles.cityRow, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: ac }]}
                onPress={() => router.push(`/city/${city.id}` as any)}
                activeOpacity={0.75}
              >
                <View style={styles.cityRank}>
                  <Text style={[styles.rankNum, { color: colors.mutedForeground }]}>#{idx + 1}</Text>
                </View>
                <View style={styles.cityInfo}>
                  <Text style={[styles.cityName, { color: colors.foreground }]}>{city.nameUz}</Text>
                  <Text style={[styles.cityRegion, { color: colors.mutedForeground }]}>{city.region}</Text>
                </View>
                <View style={styles.cityMetrics}>
                  <Text style={[styles.cityCondition, { color: colors.mutedForeground }]}>{city.conditions}</Text>
                  <Text style={[styles.cityTemp, { color: colors.foreground }]}>{city.temperature}°C</Text>
                </View>
                <AQIBadge aqi={city.aqi} size="md" showLabel />
                <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoHeader}>
            <Feather name="info" size={14} color={colors.accent} />
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>Data Sources</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Environmental data sourced from Iqlimoy's network of ground stations and integrated with
            ESA Sentinel-5P satellite observations. Updated every 30 minutes.
          </Text>
          <View style={styles.sourceRow}>
            {['Sentinel-5P', 'Ground Stations', 'NASA FIRMS', 'NOAA'].map((s) => (
              <View key={s} style={[styles.sourcePill, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <Text style={[styles.sourceText, { color: colors.mutedForeground }]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
  },
  satBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  satText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 6,
  },
  cityList: {
    gap: 8,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 3,
    gap: 10,
  },
  cityRank: {
    width: 24,
    alignItems: 'center',
  },
  rankNum: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  cityRegion: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  cityMetrics: {
    alignItems: 'flex-end',
    gap: 2,
  },
  cityCondition: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  cityTemp: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  sourceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sourcePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  sourceText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
});
