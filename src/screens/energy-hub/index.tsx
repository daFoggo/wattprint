import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { UsageBarChart } from '@/features/energy/components/usage-bar-chart';
import { mockSummary, mockUsageSeries } from '@/features/energy/mock';
import type { TariffPlan } from '@/features/energy/types';
import { useEnergyStore } from '@/features/energy/use-energy-store';
import { formatVnd } from '@/utils/format-currency';

import { RangeTabs } from './components/range-tabs';

const tariffLabels: Record<TariffPlan, string> = {
  tiered: 'Bậc 5',
  tou: 'TOU',
};

export function EnergyHubScreen() {
  const { range, setRange, tariff, setTariff } = useEnergyStore();

  return (
    <ThemedView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <ThemedText type="subtitle">Energy Hub</ThemedText>

          <RangeTabs value={range} onChange={setRange} />

          <View style={styles.section}>
            <ThemedText type="smallBold">Dự báo hóa đơn cuối tháng</ThemedText>
            <ThemedView type="backgroundElement" style={styles.forecastCard}>
              <ThemedText type="title">
                {formatVnd(mockSummary.projectedMonthlyCost)}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Dựa trên mức tiêu thụ hiện tại theo biểu giá {tariffLabels[tariff]}
              </ThemedText>
            </ThemedView>
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Tiêu thụ theo thời gian</ThemedText>
            <UsageBarChart points={mockUsageSeries} />
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Biểu giá</ThemedText>
            <View style={styles.tariffRow}>
              {(['tiered', 'tou'] as TariffPlan[]).map((option) => {
                const selected = option === tariff;
                return (
                  <Pressable key={option} style={styles.tariffItem} onPress={() => setTariff(option)}>
                    <ThemedView
                      type={selected ? 'backgroundSelected' : 'backgroundElement'}
                      style={styles.tariffPill}>
                      <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
                        {tariffLabels[option]}
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
                );
              })}
            </View>
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
  section: {
    gap: Spacing.two,
  },
  forecastCard: {
    gap: Spacing.one,
    padding: Spacing.four,
    borderRadius: Spacing.three,
  },
  tariffRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  tariffItem: {
    flex: 1,
  },
  tariffPill: {
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
});
