import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getAQILevel, REGIONS_GRID } from '@/constants/demoData';
import { useColors } from '@/hooks/useColors';

export type MapLayer = 'aqi' | 'temp' | 'uv' | 'dust';

const LAYER_LABELS: Record<MapLayer, string> = {
  aqi: 'Havo Sifati',
  temp: 'Harorat',
  uv: 'UV Indeks',
  dust: 'Chang Xavfi',
};

const TEMP_DATA: Record<string, number> = {
  karakalpak: 38, xorazm: 35, buxoro: 36, navoiy: 33, samarqand: 31,
  jizzax: 30, toshkent: 28, qashqa: 34, surxon: 37, sirdaryo: 29,
  fargona: 25, namangan: 26, andijon: 27,
};

const UV_DATA: Record<string, number> = {
  karakalpak: 10, xorazm: 9, buxoro: 9, navoiy: 8, samarqand: 7,
  jizzax: 6, toshkent: 5, qashqa: 8, surxon: 9, sirdaryo: 6,
  fargona: 5, namangan: 6, andijon: 6,
};

const DUST_DATA: Record<string, number> = {
  karakalpak: 96, xorazm: 72, buxoro: 82, navoiy: 55, samarqand: 15,
  jizzax: 30, toshkent: 35, qashqa: 68, surxon: 40, sirdaryo: 28,
  fargona: 18, namangan: 20, andijon: 25,
};

interface RegionMapProps {
  onRegionPress?: (regionId: string) => void;
}

export function RegionMap({ onRegionPress }: RegionMapProps) {
  const colors = useColors();
  const [activeLayer, setActiveLayer] = useState<MapLayer>('aqi');

  function getRegionColor(regionId: string): string {
    if (activeLayer === 'aqi') {
      const region = REGIONS_GRID.find((r) => r.id === regionId);
      if (!region) return colors.muted;
      const level = getAQILevel(region.aqi);
      const cm: Record<string, string> = {
        good: colors.good,
        moderate: colors.moderate,
        unhealthy: colors.unhealthy,
        veryUnhealthy: colors.veryUnhealthy,
        hazardous: colors.hazardous,
      };
      return cm[level] + 'CC';
    }
    if (activeLayer === 'temp') {
      const t = TEMP_DATA[regionId] ?? 30;
      if (t <= 25) return colors.accent + 'CC';
      if (t <= 30) return colors.moderate + 'CC';
      if (t <= 35) return colors.unhealthy + 'CC';
      return colors.hazardous + 'CC';
    }
    if (activeLayer === 'uv') {
      const u = UV_DATA[regionId] ?? 5;
      if (u <= 3) return colors.good + 'CC';
      if (u <= 6) return colors.moderate + 'CC';
      if (u <= 8) return colors.unhealthy + 'CC';
      return colors.hazardous + 'CC';
    }
    const d = DUST_DATA[regionId] ?? 30;
    if (d <= 20) return colors.good + 'CC';
    if (d <= 40) return colors.moderate + 'CC';
    if (d <= 70) return colors.unhealthy + 'CC';
    return colors.hazardous + 'CC';
  }

  function getRegionValue(regionId: string): string {
    if (activeLayer === 'aqi') {
      const r = REGIONS_GRID.find((re) => re.id === regionId);
      return r ? String(r.aqi) : '-';
    }
    if (activeLayer === 'temp') return `${TEMP_DATA[regionId] ?? '-'}°`;
    if (activeLayer === 'uv') return `UV${UV_DATA[regionId] ?? '-'}`;
    return `${DUST_DATA[regionId] ?? '-'}%`;
  }

  const rows: (typeof REGIONS_GRID)[] = [];
  REGIONS_GRID.forEach((r) => {
    if (!rows[r.gridRow]) rows[r.gridRow] = [];
    rows[r.gridRow].push(r);
  });

  const legendItems =
    activeLayer === 'aqi'
      ? [
          { color: colors.good, label: 'Yaxshi' },
          { color: colors.moderate, label: "O'rtacha" },
          { color: colors.unhealthy, label: 'Zararli' },
          { color: colors.veryUnhealthy, label: 'J. Zararli' },
          { color: colors.hazardous, label: 'Xavfli' },
        ]
      : [
          { color: colors.good, label: 'Past' },
          { color: colors.moderate, label: "O'rtacha" },
          { color: colors.unhealthy, label: 'Yuqori' },
          { color: colors.hazardous, label: 'Ekstremal' },
        ];

  return (
    <View style={styles.container}>
      <View style={[styles.layerBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {(Object.keys(LAYER_LABELS) as MapLayer[]).map((layer) => (
          <TouchableOpacity
            key={layer}
            style={[styles.layerBtn, activeLayer === layer && { backgroundColor: colors.primary }]}
            onPress={() => setActiveLayer(layer)}
          >
            <Text
              style={[
                styles.layerText,
                { color: activeLayer === layer ? colors.background : colors.mutedForeground },
              ]}
            >
              {LAYER_LABELS[layer]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.mapContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.mapTitle, { color: colors.mutedForeground }]}>O'ZBEKISTON EKOLOGIK XARITASI</Text>

        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.mapRow}>
            {row.map((region) => (
              <TouchableOpacity
                key={region.id}
                style={[
                  styles.regionCell,
                  {
                    flex: region.gridColSpan,
                    backgroundColor: getRegionColor(region.id),
                    borderColor: colors.background + '30',
                  },
                ]}
                onPress={() => onRegionPress?.(region.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.regionName} numberOfLines={1}>
                  {region.name}
                </Text>
                <Text style={styles.regionValue}>{getRegionValue(region.id)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={[styles.legend, { borderTopColor: colors.border }]}>
          {legendItems.map((item) => (
            <LegendItem key={item.label} color={item.color} label={item.label} />
          ))}
        </View>
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  const colors = useColors();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  layerBar: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  layerBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  layerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
  },
  mapContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 3,
  },
  mapTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  mapRow: {
    flexDirection: 'row',
    gap: 3,
    minHeight: 44,
  },
  regionCell: {
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 2,
  },
  regionName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  regionValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
});
