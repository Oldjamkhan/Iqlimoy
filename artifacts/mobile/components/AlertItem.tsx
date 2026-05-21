import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AlertData } from '@/constants/demoData';
import { useColors } from '@/hooks/useColors';

interface AlertItemProps {
  alert: AlertData;
  onPress?: () => void;
}

const ALERT_ICONS: Record<AlertData['type'], { icon: string; lib: 'feather' | 'mci' }> = {
  dust: { icon: 'wind', lib: 'feather' },
  smog: { icon: 'air-filter', lib: 'mci' },
  uv: { icon: 'sun', lib: 'feather' },
  magnetic: { icon: 'flash', lib: 'mci' },
  heat: { icon: 'thermometer', lib: 'feather' },
  chemical: { icon: 'biohazard', lib: 'mci' },
};

const SEVERITY_LABELS: Record<AlertData['severity'], string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
};

const STATUS_LABELS: Record<AlertData['status'], string> = {
  active: 'ACTIVE',
  monitoring: 'MONITORING',
  resolved: 'RESOLVED',
};

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AlertItem({ alert, onPress }: AlertItemProps) {
  const colors = useColors();

  const severityColors: Record<AlertData['severity'], string> = {
    critical: colors.hazardous,
    high: colors.veryUnhealthy,
    medium: colors.moderate,
    low: colors.mutedForeground,
  };

  const statusColors: Record<AlertData['status'], string> = {
    active: colors.veryUnhealthy,
    monitoring: colors.moderate,
    resolved: colors.good,
  };

  const sevColor = severityColors[alert.severity];
  const statusColor = statusColors[alert.status];
  const iconInfo = ALERT_ICONS[alert.type];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderColor: sevColor + '40', borderLeftColor: sevColor }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, { backgroundColor: sevColor + '18' }]}>
        {iconInfo.lib === 'feather' ? (
          <Feather name={iconInfo.icon as keyof typeof Feather.glyphMap} size={18} color={sevColor} />
        ) : (
          <MaterialCommunityIcons name={iconInfo.icon as any} size={18} color={sevColor} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {alert.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{STATUS_LABELS[alert.status]}</Text>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
          {alert.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.regionsRow}>
            <Feather name="map-pin" size={10} color={colors.mutedForeground} />
            <Text style={[styles.region, { color: colors.mutedForeground }]}>
              {alert.regions.slice(0, 2).join(', ')}
              {alert.regions.length > 2 ? ` +${alert.regions.length - 2}` : ''}
            </Text>
          </View>
          <View style={[styles.sevBadge, { backgroundColor: sevColor + '18' }]}>
            <Text style={[styles.sevText, { color: sevColor }]}>{SEVERITY_LABELS[alert.severity]}</Text>
          </View>
          <Text style={[styles.time, { color: colors.mutedForeground }]}>{formatTime(alert.timestamp)}</Text>
        </View>
      </View>

      <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: 14,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  regionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  region: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  sevBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  sevText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.4,
  },
  time: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
});
