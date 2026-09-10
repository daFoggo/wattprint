import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/constants/theme';

import type { UsagePoint } from '../types';

interface UsageBarChartProps {
  points: UsagePoint[];
}

function maxOf(points: UsagePoint[]): number {
  return Math.max(...points.map((point) => point.kwh), 1);
}

function weekdayLabel(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('vi-VN', { weekday: 'short' });
}

export function UsageBarChart({ points }: UsageBarChartProps) {
  const max = maxOf(points);

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      {points.map((point) => (
        <View key={point.timestamp} style={styles.column}>
          <View style={styles.track}>
            <View
              style={[
                styles.bar,
                { height: `${Math.max((point.kwh / max) * 100, 4)}%` },
              ]}
            />
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {weekdayLabel(point.timestamp)}
          </ThemedText>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  track: {
    width: '100%',
    height: 96,
    justifyContent: 'flex-end',
    borderRadius: Spacing.one,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: Spacing.one,
    backgroundColor: '#3c87f7',
  },
});
