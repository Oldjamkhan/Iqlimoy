import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Partner } from '@/constants/demoData';
import { useColors } from '@/hooks/useColors';

interface PartnerCardProps {
  partner: Partner;
  onPress?: () => void;
}

export function PartnerCard({ partner, onPress }: PartnerCardProps) {
  const colors = useColors();

  const scoreColor =
    partner.cleanAirScore >= 90
      ? colors.good
      : partner.cleanAirScore >= 80
        ? colors.moderate
        : colors.unhealthy;

  const initials = partner.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.avatar, { backgroundColor: colors.primary + '18' }]}>
        <Text style={[styles.initials, { color: colors.primary }]}>{initials}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.foreground }]}>{partner.name}</Text>
          <View style={styles.scoreWrap}>
            <Feather name="wind" size={10} color={scoreColor} />
            <Text style={[styles.score, { color: scoreColor }]}>{partner.cleanAirScore}</Text>
          </View>
        </View>
        <Text style={[styles.category, { color: colors.accent }]}>{partner.category}</Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
          {partner.description}
        </Text>
        <View style={[styles.discountBadge, { backgroundColor: colors.primary + '14', borderColor: colors.primary + '30' }]}>
          <Feather name="tag" size={10} color={colors.primary} />
          <Text style={[styles.discount, { color: colors.primary }]}>{partner.discount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  initials: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    flex: 1,
  },
  scoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  score: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  category: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  discount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
});
