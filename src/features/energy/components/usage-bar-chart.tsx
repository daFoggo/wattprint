import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import type { BarDatum } from '@/features/energy/types';

interface UsageBarChartProps {
  bars: BarDatum[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  height?: number;
}

export function UsageBarChart({
  bars = [],
  selectedIndex = 0,
  onSelect,
  height = 140,
}: UsageBarChartProps) {
  const safeBars = Array.isArray(bars) ? bars : [];
  const max = safeBars.length > 0 ? Math.max(...safeBars.map((b) => b[1])) : 1;

  return (
    <View style={[styles.chartContainer, { height }]}>
      {safeBars.map((bar, i) => {
        const isSelected = selectedIndex === i;
        const barHeight = Math.max(4, Math.round((bar[1] / max) * (height - 30)));

        return (
          <Pressable
            key={i}
            onPress={() => onSelect(i)}
            hitSlop={6}
            style={styles.barColumn}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: barHeight,
                    backgroundColor: isSelected
                      ? WattPrintTokens.colors.primary // #164437
                      : '#8CD41C', // Leaf Green
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.barLabel,
                isSelected && styles.barLabelActive,
              ]}>
              {bar[0]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    width: '100%',
    paddingTop: 8,
  },
  barColumn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary, // #4A6B60
    textAlign: 'center',
    height: 14,
  },
  barLabelActive: {
    color: WattPrintTokens.colors.primary, // #164437
  },
});
