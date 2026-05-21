import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '@/hooks/useColors';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  iconName: keyof typeof Feather.glyphMap;
  accentColor?: string;
  trend?: 'up' | 'down' | 'stable';
  subLabel?: string;
}

export function MetricCard({ label, value, unit, iconName, accentColor, trend, subLabel }: MetricCardProps) {
  const colors = useColors();
  const accent = accentColor ?? colors.primary;

  const trendIcon: Record<string, keyof typeof Feather.glyphMap> = {
    up: 'trending-up',
    down: 'trending-down',
    stable: 'minus',
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: accent + '18' }]}>
        <Feather name={iconName} size={16} color={accent} />
      </View>
      <Text style={[styles.value, { color: colors.foreground }]}>
        {value}
        <Text style={[styles.unit, { color: colors.mutedForeground }]}> {unit}</Text>
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
        {trend && (
          <Feather
            name={trendIcon[trend]}
            size={11}
            color={trend === 'up' ? colors.veryUnhealthy : trend === 'down' ? colors.good : colors.mutedForeground}
          />
        )}
      </View>
      {subLabel && (
        <Text style={[styles.subLabel, { color: accent }]}>{subLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    width: 110,
    gap: 8,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  unit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  subLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    marginTop: -2,
  },
});
