import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ForecastDay, getAQILevel } from '@/constants/demoData';
import { useColors } from '@/hooks/useColors';

interface ForecastRowProps {
  day: ForecastDay;
}

const CONDITION_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  'Clear Sky': 'sun',
  'Partly Cloudy': 'cloud',
  'Mostly Cloudy': 'cloud',
  Hazy: 'wind',
  'Dust Storm': 'wind',
  Rain: 'cloud-rain',
};

export function ForecastRow({ day }: ForecastRowProps) {
  const colors = useColors();
  const aqiLevel = getAQILevel(day.aqi);

  const aqiColors: Record<string, string> = {
    good: colors.good,
    moderate: colors.moderate,
    unhealthy: colors.unhealthy,
    veryUnhealthy: colors.veryUnhealthy,
    hazardous: colors.hazardous,
  };
  const aqiColor = aqiColors[aqiLevel];

  const iconName = CONDITION_ICONS[day.conditions] ?? 'cloud';

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.dayName, { color: colors.foreground }]}>{day.dayName}</Text>

      <View style={styles.conditionWrap}>
        <Feather name={iconName} size={14} color={colors.mutedForeground} />
        <Text style={[styles.condition, { color: colors.mutedForeground }]} numberOfLines={1}>
          {day.conditions}
        </Text>
      </View>

      <View style={styles.metrics}>
        <View style={[styles.aqiPill, { backgroundColor: aqiColor + '22', borderColor: aqiColor + '60' }]}>
          <Text style={[styles.aqiVal, { color: aqiColor }]}>{day.aqi}</Text>
        </View>
        <Text style={[styles.uv, { color: colors.mutedForeground }]}>UV {day.uvIndex}</Text>
      </View>

      <View style={styles.temps}>
        <Text style={[styles.tempHigh, { color: colors.foreground }]}>{day.tempMax}°</Text>
        <Text style={[styles.tempLow, { color: colors.mutedForeground }]}>{day.tempMin}°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  dayName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    width: 44,
  },
  conditionWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  condition: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aqiPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  aqiVal: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
  },
  uv: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    width: 32,
  },
  temps: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'baseline',
  },
  tempHigh: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  tempLow: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
});
