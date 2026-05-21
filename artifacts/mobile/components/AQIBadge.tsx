import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getAQILabel, getAQILevel } from '@/constants/demoData';
import { useColors } from '@/hooks/useColors';

interface AQIBadgeProps {
  aqi: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export function AQIBadge({ aqi, size = 'md', showLabel = false }: AQIBadgeProps) {
  const colors = useColors();
  const level = getAQILevel(aqi);

  const colorMap: Record<string, string> = {
    good: colors.good,
    moderate: colors.moderate,
    unhealthy: colors.unhealthy,
    veryUnhealthy: colors.veryUnhealthy,
    hazardous: colors.hazardous,
  };

  const badgeColor = colorMap[level];

  const sizeMap = {
    sm: { container: 28, text: 10, labelSize: 8 },
    md: { container: 40, text: 13, labelSize: 9 },
    lg: { container: 56, text: 17, labelSize: 10 },
    xl: { container: 88, text: 28, labelSize: 12 },
  };
  const s = sizeMap[size];

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.badge,
          {
            width: s.container,
            height: s.container,
            borderRadius: s.container / 2,
            backgroundColor: badgeColor + '22',
            borderColor: badgeColor,
          },
        ]}
      >
        <Text style={[styles.aqiText, { color: badgeColor, fontSize: s.text }]}>{aqi}</Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: badgeColor, fontSize: s.labelSize }]}>
          {getAQILabel(aqi)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aqiText: {
    fontFamily: 'Inter_700Bold',
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
});
