import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AQIBadge } from '@/components/AQIBadge';
import { MetricCard } from '@/components/MetricCard';
import { ALERTS, CITIES, HOURLY_FORECAST, getAQILabel, getAQILevel } from '@/constants/demoData';
import { useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const AQI_COLORS_LEVEL: Record<string, readonly [string, string]> = {
  good: ['#064e3b', '#065f46'],
  moderate: ['#451a03', '#78350f'],
  unhealthy: ['#431407', '#7c2d12'],
  veryUnhealthy: ['#450a0a', '#7f1d1d'],
  hazardous: ['#2e1065', '#3b0764'],
};

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity, setSelectedCityById, activeAlertCount } = useApp();
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const level = getAQILevel(selectedCity.aqi);
  const gradColors = AQI_COLORS_LEVEL[level] ?? ['#1a1a2e', '#16213e'];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: false }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 2000, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  const activeAlerts = ALERTS.filter((a) => a.status === 'active');

  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 120 : 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
      }
    >
      <LinearGradient
        colors={[gradColors[0], gradColors[1], colors.background]}
        style={[styles.hero, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.locationWrap}>
            <Feather name="radio" size={12} color={colors.primary} />
            <Text style={[styles.liveLabel, { color: colors.primary }]}>LIVE SATELLITE</Text>
          </View>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: colors.card + 'AA' }]}
            onPress={() => router.push('/alerts' as any)}
          >
            <Feather name="bell" size={18} color={colors.foreground} />
            {activeAlertCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.veryUnhealthy }]}>
                <Text style={styles.badgeText}>{activeAlertCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.citySelector}
          onPress={() => setShowCityPicker((v) => !v)}
        >
          <Feather name="map-pin" size={16} color={colors.foreground} />
          <Text style={[styles.cityName, { color: colors.foreground }]}>{selectedCity.nameUz}</Text>
          <Feather name={showCityPicker ? 'chevron-up' : 'chevron-down'} size={16} color={colors.mutedForeground} />
        </TouchableOpacity>

        {showCityPicker && (
          <Animated.View style={[styles.cityPicker, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {CITIES.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={[styles.cityOption, selectedCity.id === city.id && { backgroundColor: colors.primary + '20' }]}
                onPress={() => { setSelectedCityById(city.id); setShowCityPicker(false); }}
              >
                <Text style={[styles.cityOptionText, { color: colors.foreground }]}>{city.nameUz}</Text>
                <AQIBadge aqi={city.aqi} size="sm" />
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        <Animated.View style={[styles.aqiHero, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.aqiCircle, { borderColor: getAQIColor(level, colors), transform: [{ scale: pulseAnim }] }]}>
            <Text style={[styles.aqiNumber, { color: getAQIColor(level, colors) }]}>{selectedCity.aqi}</Text>
            <Text style={[styles.aqiUnit, { color: colors.mutedForeground }]}>AQI</Text>
          </Animated.View>

          <View style={styles.aqiInfo}>
            <Text style={[styles.aqiLevel, { color: getAQIColor(level, colors) }]}>{getAQILabel(selectedCity.aqi)}</Text>
            <Text style={[styles.aqiCondition, { color: colors.foreground }]}>{selectedCity.conditions}</Text>
            <Text style={[styles.aqiTemp, { color: colors.mutedForeground }]}>
              {selectedCity.temperature}°C · {selectedCity.humidity}% Humidity
            </Text>
            {selectedCity.magneticField !== 'normal' && (
              <View style={[styles.magneticBadge, { backgroundColor: colors.hazardous + '30' }]}>
                <Feather name="zap" size={10} color={colors.hazardous} />
                <Text style={[styles.magneticText, { color: colors.hazardous }]}>
                  Magnetic {selectedCity.magneticField === 'storm' ? 'Storm' : 'Disturbance'}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        {activeAlerts.length > 0 && (
          <TouchableOpacity
            style={[styles.alertBanner, { backgroundColor: colors.veryUnhealthy + '18', borderColor: colors.veryUnhealthy + '50' }]}
            onPress={() => router.push('/(tabs)/alerts' as any)}
          >
            <View style={[styles.alertDot, { backgroundColor: colors.veryUnhealthy }]} />
            <Text style={[styles.alertBannerText, { color: colors.veryUnhealthy }]}>
              {activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''} — {activeAlerts[0].title}
            </Text>
            <Feather name="chevron-right" size={14} color={colors.veryUnhealthy} />
          </TouchableOpacity>
        )}

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>CURRENT CONDITIONS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsScroll}>
          <MetricCard label="PM2.5" value={selectedCity.pm25} unit="μg/m³" iconName="wind" accentColor={getPM25Color(selectedCity.pm25, colors)} trend="stable" />
          <MetricCard label="PM10" value={selectedCity.pm10} unit="μg/m³" iconName="cloud" accentColor={colors.moderate} trend="up" />
          <MetricCard label="UV Index" value={selectedCity.uvIndex} unit="" iconName="sun" accentColor={getUVColor(selectedCity.uvIndex, colors)} subLabel={getUVLabel(selectedCity.uvIndex)} />
          <MetricCard label="Temperature" value={selectedCity.temperature} unit="°C" iconName="thermometer" accentColor={colors.unhealthy} trend="up" />
          <MetricCard label="Humidity" value={selectedCity.humidity} unit="%" iconName="droplet" accentColor={colors.accent} />
          <MetricCard label="Wind" value={selectedCity.windSpeed} unit="km/h" iconName="wind" accentColor={colors.foreground} />
          <MetricCard label="Dust Risk" value={selectedCity.dustRisk} unit="/100" iconName="alert-triangle" accentColor={getDustColor(selectedCity.dustRisk, colors)} subLabel={getDustLabel(selectedCity.dustRisk)} />
          <MetricCard label="Solar Rad." value={selectedCity.solarRadiation} unit="W/m²" iconName="sun" accentColor={colors.moderate} />
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>TODAY'S FORECAST</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyScroll}>
          {HOURLY_FORECAST.map((h) => (
            <View key={h.hour} style={[styles.hourlyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.hourlyTime, { color: colors.mutedForeground }]}>{h.hour}</Text>
              <Feather name={h.icon as any} size={18} color={colors.foreground} />
              <Text style={[styles.hourlyTemp, { color: colors.foreground }]}>{h.temp}°</Text>
              <View style={[styles.hourlyAqiDot, { backgroundColor: getAQIColor(getAQILevel(h.aqi), colors) + '40' }]}>
                <Text style={[styles.hourlyAqi, { color: getAQIColor(getAQILevel(h.aqi), colors) }]}>{h.aqi}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>RECOMMENDATIONS</Text>
        <View style={[styles.recCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.recRow}>
            <View style={[styles.recIcon, { backgroundColor: colors.good + '20' }]}>
              <Feather name="activity" size={16} color={colors.good} />
            </View>
            <View style={styles.recText}>
              <Text style={[styles.recTitle, { color: colors.foreground }]}>Best Outdoor Window</Text>
              <Text style={[styles.recDesc, { color: colors.mutedForeground }]}>06:00–09:00 — Morning hours have lowest pollution</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.recRow}>
            <View style={[styles.recIcon, { backgroundColor: colors.moderate + '20' }]}>
              <Feather name="shield" size={16} color={colors.moderate} />
            </View>
            <View style={styles.recText}>
              <Text style={[styles.recTitle, { color: colors.foreground }]}>Health Advisory</Text>
              <Text style={[styles.recDesc, { color: colors.mutedForeground }]}>
                {selectedCity.aqi > 100 ? 'Sensitive groups should avoid outdoor exposure today' : 'Air quality acceptable — exercise with standard precautions'}
              </Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.recRow}>
            <View style={[styles.recIcon, { backgroundColor: colors.accent + '20' }]}>
              <Feather name="map-pin" size={16} color={colors.accent} />
            </View>
            <View style={styles.recText}>
              <Text style={[styles.recTitle, { color: colors.foreground }]}>Cleanest City Today</Text>
              <Text style={[styles.recDesc, { color: colors.mutedForeground }]}>Samarqand — AQI 42 (Good) · 298 km away</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.forecastBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/forecast' as any)}
        >
          <Text style={[styles.forecastBtnText, { color: colors.foreground }]}>7-Day Environmental Forecast</Text>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>

        <View style={[styles.demoTag, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
          <Feather name="radio" size={10} color={colors.primary} />
          <Text style={[styles.demoText, { color: colors.primary }]}>DEMO MODE — Simulated satellite data for Uzbekistan</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function getAQIColor(level: string, colors: ReturnType<typeof useColors>): string {
  const map: Record<string, string> = {
    good: colors.good,
    moderate: colors.moderate,
    unhealthy: colors.unhealthy,
    veryUnhealthy: colors.veryUnhealthy,
    hazardous: colors.hazardous,
  };
  return map[level] ?? colors.mutedForeground;
}

function getPM25Color(val: number, colors: ReturnType<typeof useColors>): string {
  if (val <= 12) return colors.good;
  if (val <= 35) return colors.moderate;
  if (val <= 55) return colors.unhealthy;
  return colors.veryUnhealthy;
}

function getUVColor(val: number, colors: ReturnType<typeof useColors>): string {
  if (val <= 2) return colors.good;
  if (val <= 5) return colors.moderate;
  if (val <= 7) return colors.unhealthy;
  return colors.hazardous;
}

function getUVLabel(val: number): string {
  if (val <= 2) return 'Low';
  if (val <= 5) return 'Moderate';
  if (val <= 7) return 'High';
  if (val <= 10) return 'Very High';
  return 'Extreme';
}

function getDustColor(val: number, colors: ReturnType<typeof useColors>): string {
  if (val <= 25) return colors.good;
  if (val <= 50) return colors.moderate;
  if (val <= 75) return colors.unhealthy;
  return colors.hazardous;
}

function getDustLabel(val: number): string {
  if (val <= 25) return 'Low';
  if (val <= 50) return 'Moderate';
  if (val <= 75) return 'High';
  return 'Severe';
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: '#fff',
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    flex: 1,
  },
  cityPicker: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 4,
  },
  cityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cityOptionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  aqiHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 8,
  },
  aqiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  aqiNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    lineHeight: 40,
  },
  aqiUnit: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  aqiInfo: {
    flex: 1,
    gap: 4,
  },
  aqiLevel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
  },
  aqiCondition: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  aqiTemp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  magneticBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  magneticText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertBannerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  metricsScroll: {
    paddingRight: 20,
    gap: 10,
  },
  hourlyScroll: {
    paddingRight: 20,
    gap: 10,
  },
  hourlyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    width: 68,
  },
  hourlyTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  hourlyTemp: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  hourlyAqiDot: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hourlyAqi: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
  },
  recCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
  },
  recIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recText: {
    flex: 1,
    gap: 3,
  },
  recTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  recDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  divider: {
    height: 1,
    marginLeft: 62,
  },
  forecastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  forecastBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
  },
  demoText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
