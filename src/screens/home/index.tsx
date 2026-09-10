import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { UsageBarChart } from '@/features/energy/components/usage-bar-chart';
import { mockDeviceBreakdown, mockSummary, mockUsageSeries } from '@/features/energy/mock';
import { formatKwh, formatVnd, formatWatts } from '@/utils/format-currency';

import { DeviceBreakdown } from './components/device-breakdown';
import { EnergyStatusBadge } from './components/energy-status-badge';

export function HomeScreen() {
  return (
    <ThemedView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <ThemedText type="subtitle">WattPrint</ThemedText>

          <EnergyStatusBadge status={mockSummary.status} message={mockSummary.statusMessage} />

          <ThemedView type="backgroundElement" style={styles.heroCard}>
            <ThemedText type="small" themeColor="textSecondary">
              Công suất hiện tại
            </ThemedText>
            <ThemedText type="title">{formatWatts(mockSummary.currentPowerW)}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Hôm nay {formatKwh(mockSummary.todayKwh)} · {formatVnd(mockSummary.todayCost)}
            </ThemedText>
          </ThemedView>

          <View style={styles.section}>
            <ThemedText type="smallBold">Phân bổ theo thiết bị</ThemedText>
            <DeviceBreakdown devices={mockDeviceBreakdown} />
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Tiêu thụ theo ngày</ThemedText>
            <UsageBarChart points={mockUsageSeries} />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
    padding: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  heroCard: {
    gap: Spacing.one,
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
  section: {
    gap: Spacing.two,
  },
});
