import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertItem } from '@/components/AlertItem';
import { ALERTS, AlertData } from '@/constants/demoData';
import { useColors } from '@/hooks/useColors';

type FilterKey = 'all' | 'active' | 'monitoring' | 'resolved';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'resolved', label: 'Resolved' },
];

export default function AlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const [filter, setFilter] = useState<FilterKey>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredAlerts: AlertData[] =
    filter === 'all' ? ALERTS : ALERTS.filter((a) => a.status === filter);

  const activeCount = ALERTS.filter((a) => a.status === 'active').length;
  const criticalCount = ALERTS.filter((a) => a.severity === 'critical').length;

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  const bottomPad = Platform.OS === 'web' ? 100 : 80;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: colors.foreground }]}>Ogohlantirishlar</Text>
          <View style={styles.countBadges}>
            {criticalCount > 0 && (
              <View style={[styles.countBadge, { backgroundColor: colors.hazardous + '20', borderColor: colors.hazardous + '40' }]}>
                <View style={[styles.pulseDot, { backgroundColor: colors.hazardous }]} />
                <Text style={[styles.countText, { color: colors.hazardous }]}>{criticalCount} CRITICAL</Text>
              </View>
            )}
            <View style={[styles.countBadge, { backgroundColor: colors.veryUnhealthy + '20', borderColor: colors.veryUnhealthy + '40' }]}>
              <Text style={[styles.countText, { color: colors.veryUnhealthy }]}>{activeCount} ACTIVE</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const count = f.key === 'all' ? ALERTS.length : ALERTS.filter((a) => a.status === f.key).length;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterBtn,
                  filter === f.key && { backgroundColor: colors.primary, borderColor: colors.primary },
                  filter !== f.key && { borderColor: colors.border },
                ]}
                onPress={() => setFilter(f.key)}
              >
                <Text style={[styles.filterText, { color: filter === f.key ? colors.background : colors.mutedForeground }]}>
                  {f.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.filterCount, { backgroundColor: filter === f.key ? colors.background + '30' : colors.secondary }]}>
                    <Text style={[styles.filterCountText, { color: filter === f.key ? colors.background : colors.mutedForeground }]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlertItem alert={item} />}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="check-circle" size={40} color={colors.good} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No alerts</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {filter === 'all' ? 'All clear across the region' : `No ${filter} alerts right now`}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
  },
  countBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  countText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  filterCount: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 18,
    alignItems: 'center',
  },
  filterCountText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
  },
  list: {
    padding: 16,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
});
