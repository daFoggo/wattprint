import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import { Card } from '@/components/ui/card';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { BillingTariffView } from '@/features/energy/components/billing-tariff-view';
import { BreakdownTable } from '@/features/energy/components/breakdown-table';
import { BubbleBreakdown } from '@/features/energy/components/bubble-breakdown';
import { ComparisonChart } from '@/features/energy/components/comparison-chart';
import { DonutBreakdown } from '@/features/energy/components/donut-breakdown';
import { NeighbourComparison } from '@/features/energy/components/neighbour-comparison';
import { StackedBarBreakdown } from '@/features/energy/components/stacked-bar-breakdown';
import { UnderlineTabRow } from '@/features/energy/components/underline-tab-row';
import { UsageBarChart } from '@/features/energy/components/usage-bar-chart';
import {
  DAILY,
  getUsageDevices,
  LAST_DAILY,
  LAST_TOTAL,
  MONTH_DELTA,
  MONTH_KWH,
  RATE,
  USAGE_RANGES,
} from '@/features/energy/mock';
import type { BubbleDevice, BreakdownView, UsageTab } from '@/features/energy/types';
import { useEnergyStore } from '@/features/energy/use-energy-store';

const TABS: { key: UsageTab; label: string }[] = [
  { key: 'day', label: 'DAY' },
  { key: 'week', label: 'WK' },
  { key: 'month', label: 'MO' },
  { key: 'year', label: 'YR' },
  { key: 'bill', label: 'BILL' },
];

const VIEWS: { key: BreakdownView; label: string }[] = [
  { key: 'bubble', label: 'Bubble' },
  { key: 'donut', label: 'Donut' },
  { key: 'bars', label: 'Bar' },
];

export function UsageScreen() {
  const router = useRouter();
  const {
    unit,
    toggleUnit,
    usageTab,
    setUsageTab,
    breakdownView,
    setBreakdownView,
    selectedDeviceIndex,
    setSelectedDeviceIndex,
    selectedUsageBar,
    setSelectedUsageBar,
    customerType,
    setCustomerType,
  } = useEnergyStore();

  const isBill = usageTab === 'bill';
  const rangeKey = isBill ? 'month' : usageTab;
  const currentRangeData = USAGE_RANGES[rangeKey] ?? USAGE_RANGES.week;
  const devices = getUsageDevices(rangeKey);

  const deltaText =
    currentRangeData.deltaPct < 0
      ? `${Math.abs(currentRangeData.deltaPct)}% less`
      : `${currentRangeData.deltaPct}% more`;

  const heroValue =
    unit === 'cost'
      ? `${Math.round(currentRangeData.kwh * RATE).toLocaleString('en-US')}`
      : `${currentRangeData.kwh.toLocaleString('en-US')}`;
  const heroUnit = unit === 'cost' ? 'VND' : 'kWh';
  const otherUnit = unit === 'cost' ? 'kWh' : 'VND';

  const bars = currentRangeData?.bars ?? [];
  const pickedBar =
    bars[Math.min(selectedUsageBar, Math.max(0, bars.length - 1))] ?? ['-', 0, ''];

  const monthDeltaText =
    MONTH_DELTA < 0
      ? `${Math.abs(MONTH_DELTA)}% less`
      : `${MONTH_DELTA}% more`;

  const handleDevicePress = (device: BubbleDevice) => {
    router.push('/device-detail');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* Ground Header */}
      <View style={styles.groundHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Usage</Text>
          <Text style={styles.monthTag}>SEP 2026</Text>
        </View>

        {/* Underline Range Tabs */}
        <UnderlineTabRow
          tabs={TABS}
          activeKey={usageTab}
          onChange={(key) => setUsageTab(key as UsageTab)}
        />
      </View>

      {/* Content Scroll View */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {!isBill ? (
          <>
            {/* CARD 1: USAGE TOTAL & BARS */}
            <Card
              className="border-0 shadow-none bg-white rounded-[20px] p-5 gap-4"
              style={styles.card}>
              <Text style={styles.eyebrow}>USAGE</Text>
              <Text style={styles.sentence}>
                You are using {deltaText} energy {currentRangeData.period}.
              </Text>

              {/* Tappable Hero Value with Unit Switcher */}
              <Pressable onPress={toggleUnit} style={styles.heroRow}>
                <View style={styles.heroValueGroup}>
                  <Text style={styles.heroValue}>{heroValue}</Text>
                  <Text style={styles.heroUnit}>{heroUnit}</Text>
                </View>
                <View style={styles.unitChip}>
                  <Text style={styles.unitChipSymbol}>⇄</Text>
                  <Text style={styles.unitChipLabel}>{otherUnit}</Text>
                </View>
              </Pressable>

              {/* Responsive Bar Chart */}
              <UsageBarChart
                bars={currentRangeData.bars}
                selectedIndex={selectedUsageBar}
                onSelect={setSelectedUsageBar}
                height={140}
              />

              <Text style={styles.pickNote}>
                {pickedBar[2]}, {pickedBar[1]} kWh
              </Text>
            </Card>

            {/* CARD 2: BREAKDOWN WITH 3 VIEWS */}
            <Card
              className="border-0 shadow-none bg-white rounded-[20px] p-5 gap-4"
              style={styles.card}>
              <View style={styles.breakdownHeader}>
                <Text style={styles.eyebrow}>BREAKDOWN</Text>

                {/* 3 Views Segmented Pill */}
                <View style={styles.pillTrack}>
                  {VIEWS.map((v) => {
                    const isActive = breakdownView === v.key;
                    return (
                      <Pressable
                        key={v.key}
                        onPress={() => setBreakdownView(v.key)}
                        style={[
                          styles.pillBtn,
                          isActive && styles.pillBtnActive,
                        ]}>
                        <Text
                          style={[
                            styles.pillLabel,
                            isActive && styles.pillLabelActive,
                          ]}>
                          {v.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Text style={styles.sentence}>
                {devices[0].name} took {devices[0].pct}% of it,{' '}
                {devices[0].kwh.toFixed(1)} kWh.
              </Text>

              {/* Interactive Visualizations */}
              {breakdownView === 'bubble' && (
                <View style={styles.bubbleBox}>
                  <BubbleBreakdown
                    devices={devices}
                    selectedIndex={selectedDeviceIndex}
                    onSelectIndex={setSelectedDeviceIndex}
                  />
                </View>
              )}

              {breakdownView === 'donut' && (
                <DonutBreakdown
                  devices={devices}
                  selectedIndex={selectedDeviceIndex}
                />
              )}

              {breakdownView === 'bars' && (
                <StackedBarBreakdown devices={devices} />
              )}

              {/* Ranked Breakdown Table */}
              <BreakdownTable
                devices={devices}
                selectedIndex={selectedDeviceIndex}
                unitMode={unit}
                onSelect={setSelectedDeviceIndex}
                onDevicePress={handleDevicePress}
              />
            </Card>

            {/* CARD 3: MONTH COMPARISON */}
            <Card
              className="border-0 shadow-none bg-white rounded-[20px] p-5 gap-4"
              style={styles.card}>
              <Text style={styles.eyebrow}>COMPARE</Text>
              <Text style={styles.sentence}>
                You are using {monthDeltaText} energy so far this month.
              </Text>

              <View style={styles.compareStatsRow}>
                <View style={styles.compareStatCol}>
                  <Text style={styles.compareStatLabel}>THIS MONTH</Text>
                  <Text style={styles.compareStatVal}>
                    {MONTH_KWH.toLocaleString('en-US')} kWh
                  </Text>
                </View>
                <View style={styles.compareStatCol}>
                  <Text
                    style={[
                      styles.compareStatLabel,
                      { color: WattPrintTokens.colors.secondary },
                    ]}>
                    SAME POINT LAST
                  </Text>
                  <Text
                    style={[
                      styles.compareStatVal,
                      { color: WattPrintTokens.colors.secondary },
                    ]}>
                    {LAST_TOTAL.toLocaleString('en-US')} kWh
                  </Text>
                </View>
              </View>

              <ComparisonChart
                nowSeries={DAILY}
                lastSeries={LAST_DAILY}
                axisStart="SEP 1"
                axisEnd="SEP 14"
              />
            </Card>

            {/* CARD 4: NEIGHBOUR COMPARISON */}
            <NeighbourComparison
              sentence="Your average use is lower than 62% of similar neighbouring homes."
              wattage={960}
            />
          </>
        ) : (
          /* BILL TAB: EVN TARIFFS & TIME OF USE */
          <BillingTariffView
            customerType={customerType}
            onCustomerChange={setCustomerType}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
  },
  groundHeader: {
    paddingTop: 14,
    paddingHorizontal: 24,
    paddingBottom: 10,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 24,
    color: WattPrintTokens.colors.primary, // #164437
  },
  monthTag: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 0.88,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.xl, // 20px
    paddingVertical: 20,
    paddingHorizontal: 22,
    gap: 16,
  },
  eyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 1.1,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  sentence: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 18,
    lineHeight: 24.3,
    color: WattPrintTokens.colors.primary, // #164437
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroValueGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  heroValue: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 46,
    letterSpacing: -1.38,
    color: WattPrintTokens.colors.primary, // #164437
  },
  heroUnit: {
    fontFamily: Fonts.monoMedium,
    fontSize: 15,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  unitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  unitChipSymbol: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    color: WattPrintTokens.colors.primary,
  },
  unitChipLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11.5,
    color: WattPrintTokens.colors.primary,
  },
  pickNote: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  pillTrack: {
    flexDirection: 'row',
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.pill,
    padding: 3,
    gap: 2,
  },
  pillBtn: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: WattPrintTokens.radii.pill,
    backgroundColor: 'transparent',
  },
  pillBtnActive: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
  },
  pillLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 11.5,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  pillLabelActive: {
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  bubbleBox: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  compareStatsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  compareStatCol: {
    gap: 2,
  },
  compareStatLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 0.66,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  compareStatVal: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 21,
    color: WattPrintTokens.colors.primary, // #164437
  },
});
