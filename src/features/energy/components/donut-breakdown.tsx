import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DataRamp, Fonts, WattPrintTokens } from '@/constants/theme';
import type { BubbleDevice } from '@/features/energy/types';

interface DonutBreakdownProps {
  devices: BubbleDevice[];
  selectedIndex: number;
}

export function DonutBreakdown({ devices = [], selectedIndex = 0 }: DonutBreakdownProps) {
  const size = 210;
  const selectedDev = devices[selectedIndex] ?? devices[0];

  // Map 48 radial ticks around 360 degrees to device segments
  const totalTicks = 48;
  const tickAngles = Array.from({ length: totalTicks }, (_, i) => (i * 360) / totalTicks);

  // Calculate cumulative percentage thresholds
  let cumPct = 0;
  const ranges = devices.map((d, index) => {
    const start = cumPct;
    cumPct += d.pct;
    return {
      name: d.name,
      start,
      end: cumPct,
      color: DataRamp[index % DataRamp.length].bg,
    };
  });

  const getTickColor = (deg: number) => {
    const pct = (deg / 360) * 100;
    const match = ranges.find((r) => pct >= r.start && pct < r.end);
    return match ? match.color : WattPrintTokens.colors.tertiary;
  };

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size, position: 'relative' }}>
        {/* Radial Precision Gauge Ring */}
        {tickAngles.map((deg, i) => {
          const color = getTickColor(deg);
          return (
            <View
              key={i}
              style={[
                styles.tickWrapper,
                {
                  transform: [{ rotate: `${deg}deg` }],
                },
              ]}>
              <View style={[styles.tick, { backgroundColor: color }]} />
            </View>
          );
        })}

        {/* Center Hole Content */}
        <View style={styles.hole}>
          <Text style={styles.centerPct}>{selectedDev?.pct ?? 0}%</Text>
          <Text style={styles.centerName} numberOfLines={1}>
            {selectedDev?.name ?? '-'}
          </Text>
          {selectedDev?.kwh !== undefined && (
            <Text style={styles.centerKwh}>{selectedDev.kwh} kWh</Text>
          )}
        </View>
      </View>

      {/* Proportional Segment Bar Below */}
      <View style={styles.segmentBar}>
        {devices.map((d, index) => (
          <View
            key={d.name}
            style={[
              styles.segmentItem,
              {
                flex: Math.max(d.pct, 1),
                backgroundColor: DataRamp[index % DataRamp.length].bg,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  hole: {
    position: 'absolute',
    top: 42,
    left: 42,
    right: 42,
    bottom: 42,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  centerPct: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 26,
    color: WattPrintTokens.colors.primary, // #164437
  },
  centerName: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.inkBody,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  tickWrapper: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 3.5,
    height: '100%',
    marginLeft: -1.75,
    alignItems: 'center',
  },
  tick: {
    width: 3.5,
    height: 18,
    borderRadius: 2,
  },
  segmentBar: {
    flexDirection: 'row',
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 18,
    gap: 2,
  },
  segmentItem: {
    height: '100%',
    borderRadius: 3,
  },
  centerKwh: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
});
