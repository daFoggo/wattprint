import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';

interface ComparisonChartProps {
  nowSeries: number[];
  lastSeries: number[];
  axisStart?: string;
  axisEnd?: string;
}

export function ComparisonChart({
  nowSeries = [],
  lastSeries = [],
  axisStart = 'SEP 1',
  axisEnd = 'SEP 14',
}: ComparisonChartProps) {
  // Compute cumulative series
  const cumul = (arr: number[]) =>
    arr.reduce((out: number[], v) => (out.push(out[out.length - 1] + v), out), [0]);

  const nowCumul = cumul(nowSeries);
  const lastCumul = cumul(lastSeries);

  const count = Math.max(nowCumul.length, lastCumul.length);
  const maxVal = Math.max(
    ...nowCumul,
    ...lastCumul,
    1
  );

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <View style={styles.chartArea}>
          {Array.from({ length: count }, (_, i) => {
            const nowVal = nowCumul[i] ?? 0;
            const lastVal = lastCumul[i] ?? 0;
            const nowHeightPct = Math.min(100, Math.max(4, (nowVal / maxVal) * 100));
            const lastHeightPct = Math.min(100, Math.max(4, (lastVal / maxVal) * 100));

            return (
              <View key={i} style={styles.barPair}>
                {/* Last month column */}
                <View
                  style={[
                    styles.column,
                    {
                      height: `${lastHeightPct}%`,
                      backgroundColor: '#D1DDD6',
                    },
                  ]}
                />
                {/* This month column */}
                <View
                  style={[
                    styles.column,
                    {
                      height: `${nowHeightPct}%`,
                      backgroundColor: WattPrintTokens.colors.primary, // #164437
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* Axis & Legend Row */}
      <View style={styles.axisRow}>
        <Text style={styles.axisLabel}>{axisStart}</Text>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: WattPrintTokens.colors.primary }]} />
            <Text style={styles.legendText}>This month</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#C3D2CB' }]} />
            <Text style={styles.legendText}>Last month</Text>
          </View>
        </View>

        <Text style={styles.axisLabel}>{axisEnd}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  chartWrapper: {
    height: 72,
    width: '100%',
    justifyContent: 'flex-end',
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  barPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2.5,
    height: '100%',
  },
  column: {
    width: 5,
    borderRadius: 2.5,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 2,
  },
  axisLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  legend: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
});
