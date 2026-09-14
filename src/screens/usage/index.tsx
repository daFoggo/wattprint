import React, { useEffect, useMemo } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import Animated, { Easing, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import { Card } from '@/components/common/card';
import { BillingTariffView } from '@/features/energy/components/billing-tariff-view';
import { BreakdownTable } from '@/features/energy/components/breakdown-table';
import { ComparisonChart } from '@/features/energy/components/comparison-chart';
import { DonutBreakdown } from '@/features/energy/components/donut-breakdown';
import { NeighbourComparison } from '@/features/energy/components/neighbour-comparison';
import { UnderlineTabRow } from '@/features/energy/components/underline-tab-row';
import { UsageBarChart } from '@/features/energy/components/usage-bar-chart';
import { TierVisualBox } from '@/features/energy/components/tier-visual-box';
import {
  CROSS_DAY,
  getUsageDevices,
  HEADROOM,
  LAST_MONTH_30_DAYS,
  MONTH_COST,
  NEXT_TIER,
  PACE,
  RATE,
  STEP_PCT,
  THIS_MONTH_DAYS,
  TIER_USED,
  TIERS,
  USAGE_RANGES,
} from '@/features/energy/mock';
import type { BubbleDevice, UsageTab } from '@/features/energy/types';
import { useEnergyStore } from '@/features/energy/use-energy-store';
import { DeviceDetailScreen } from '@/screens/device-detail/index';

const TABS: { key: UsageTab; label: string }[] = [
  { key: 'day', label: 'NGÀY' },
  { key: 'week', label: 'TUẦN' },
  { key: 'month', label: 'THÁNG' },
];

export function UsageScreen() {
  const navigation = useNavigation();
  const {
    unit,
    toggleUnit,
    usageTab,
    setUsageTab,
    selectedDeviceIndex,
    setSelectedDeviceIndex,
    selectedUsageBar,
    setSelectedUsageBar,
    activeDeviceDetail,
    setActiveDeviceDetail,
    isBillingOpen,
    setIsBillingOpen,
  } = useEnergyStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress' as any, () => {
      setActiveDeviceDetail(null);
      setIsBillingOpen(false);
    });
    return unsubscribe;
  }, [navigation, setActiveDeviceDetail, setIsBillingOpen]);

  // Hardware back press listener for Android
  useEffect(() => {
    if (!activeDeviceDetail) return;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setActiveDeviceDetail(null);
      return true;
    });
    return () => backHandler.remove();
  }, [activeDeviceDetail, setActiveDeviceDetail]);

  const rangeKey = usageTab;
  const currentRangeData = USAGE_RANGES[rangeKey] ?? USAGE_RANGES.week;
  const devices = getUsageDevices(rangeKey);

  const heroValue =
    unit === 'cost'
      ? `${Math.round(currentRangeData.kwh * RATE).toLocaleString('vi-VN')}`
      : `${currentRangeData.kwh.toLocaleString('vi-VN')}`;
  const heroUnit = unit === 'cost' ? 'VND' : 'kWh';
  const otherUnit = unit === 'cost' ? 'kWh' : 'VND';

  const bars = currentRangeData?.bars ?? [];
  const chartItems = currentRangeData?.chartItems ?? [];
  const pickedBar =
    bars[Math.min(selectedUsageBar, Math.max(0, bars.length - 1))] ?? ['-', 0, ''];
  const pickedItem =
    chartItems[Math.min(selectedUsageBar, Math.max(0, chartItems.length - 1))] ?? {
      label: pickedBar[0],
      tooltip: pickedBar[2],
      kwh: pickedBar[1],
      cost: Math.round(pickedBar[1] * RATE),
    };

  const handleDevicePress = (device: BubbleDevice) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setActiveDeviceDetail(device);
  };

  const datePeriodLabel = useMemo(() => {
    if (usageTab === 'day') {
      return 'Hôm nay, 14 tháng 9';
    }
    if (usageTab === 'week') {
      return 'Tuần 37 (08/09 - 14/09/2026)';
    }
    return 'Tháng 09/2026';
  }, [usageTab]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* UNIFIED HERO SECTION: Header + Time Tabs + Date Navigator + Hero Metric + Bar Chart + Selection Banner */}
        <View style={styles.topHeroBlock}>
          {/* Header Row: Title & Unit Pill Switch */}
          <View style={styles.titleRow}>
            <Text style={styles.screenTitle}>Tiêu thụ</Text>

            {/* Metric Mode Pill Switch: kWh ⇄ VND */}
            <View style={styles.pillTrack}>
              <Pressable
                onPress={() => unit !== 'kwh' && toggleUnit()}
                accessibilityRole="button"
                accessibilityLabel="Xem theo số điện kWh"
                style={[
                  styles.pillBtn,
                  unit === 'kwh' && styles.pillBtnActive,
                ]}>
                <Text
                  style={[
                    styles.pillLabel,
                    unit === 'kwh' && styles.pillLabelActive,
                  ]}>
                  kWh
                </Text>
              </Pressable>
              <Pressable
                onPress={() => unit !== 'cost' && toggleUnit()}
                accessibilityRole="button"
                accessibilityLabel="Xem theo tiền VND"
                style={[
                  styles.pillBtn,
                  unit === 'cost' && styles.pillBtnActive,
                ]}>
                <Text
                  style={[
                    styles.pillLabel,
                    unit === 'cost' && styles.pillLabelActive,
                  ]}>
                  VND
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Underline Range Tabs with continuous subtle rail */}
          <UnderlineTabRow
            tabs={TABS}
            activeKey={usageTab}
            onChange={(key) => setUsageTab(key as UsageTab)}
            fullWidth={true}
          />

          {/* Date Range Navigation Context */}
          <View style={styles.dateNavRow}>
            <Pressable
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Kỳ trước"
              style={styles.dateNavBtn}>
              <Text style={styles.dateNavChevron}>‹</Text>
            </Pressable>
            <Text style={styles.dateNavLabel}>{datePeriodLabel}</Text>
            <Pressable
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Kỳ tiếp theo"
              style={[styles.dateNavBtn, styles.dateNavBtnDisabled]}>
              <Text style={[styles.dateNavChevron, styles.dateNavChevronDisabled]}>›</Text>
            </Pressable>
          </View>

          {/* Subtle Period Summary Banner (Matching reference design) */}
          <View style={styles.estimationBanner}>
            <Text style={styles.estimationText}>
              Ước tính cả kỳ: <Text style={styles.estimationHighlight}>{heroValue} {heroUnit}</Text>
              {` (${currentRangeData.deltaPct <= 0 ? 'giảm' : 'tăng'} ${Math.abs(currentRangeData.deltaPct)}%)`}
            </Text>
          </View>

          {/* Responsive Bar Chart with Numbers on Each Column */}
          <UsageBarChart
            items={chartItems}
            bars={bars}
            selectedIndex={selectedUsageBar}
            onSelect={setSelectedUsageBar}
            height={160}
            unitMode={unit}
            showLegend={true}
          />
        </View>

        {/* REMAINING SECTION CARDS */}
        <View style={styles.cardsContainer}>
        {/* CARD: BREAKDOWN - DONUT + TABLE */}
        <Card
          className="border-0 shadow-none bg-white rounded-[20px] p-5 gap-4"
          style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.eyebrow}>PHÂN BỔ THIẾT BỊ</Text>
          </View>

          <DonutBreakdown
            devices={devices}
            selectedIndex={selectedDeviceIndex}
            onSelectIndex={setSelectedDeviceIndex}
            unitMode={unit}
            totalKwh={currentRangeData.kwh}
            periodLabel={currentRangeData.period}
            onDevicePress={handleDevicePress}
          />

          <BreakdownTable
            devices={devices}
            selectedIndex={selectedDeviceIndex}
            unitMode={unit}
            onSelect={setSelectedDeviceIndex}
            onDevicePress={handleDevicePress}
          />
        </Card>

        {/* CARD: RANGE-AWARE COMPARISON CHART */}
        <Card
          className="border-0 shadow-none bg-white rounded-[20px] p-5 gap-4"
          style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.eyebrow}>SO SÁNH CÙNG KỲ</Text>
          </View>

          <ComparisonChart
            currentSeries={THIS_MONTH_DAYS}
            previousSeries={LAST_MONTH_30_DAYS}
            currentDayIndex={THIS_MONTH_DAYS.length - 1}
            currentLabel="Tháng này"
            previousLabel="Tháng trước"
            currentDateLabel="14/09"
            axisStart="01/09"
            axisEnd="30/09"
            unitMode={unit}
            rate={RATE}
          />
        </Card>

        {/* CONTEXTUAL BILLING & TIER FORECAST CARD */}
        {(usageTab === 'month' || isBillingOpen) && (
          <Card
            className="border-0 shadow-none bg-white rounded-[20px] p-5 gap-3"
            style={styles.card}>
            <View style={styles.billingCardHeader}>
              <Text style={styles.eyebrow}>DỰ TÍNH HÓA ĐƠN THÁNG 9</Text>
              <View style={styles.tierBadge}>
                <Text style={styles.tierBadgeText}>BẬC 3 / 6</Text>
              </View>
            </View>

            <View style={styles.billingCardPriceRow}>
              <Text style={styles.billingCardPrice}>
                {Math.round(MONTH_COST).toLocaleString('vi-VN')}
              </Text>
              <Text style={styles.billingCardCurrency}>VND</Text>
            </View>

            <Text style={styles.billingCardNotice}>
              Còn {Math.round(HEADROOM)} kWh dự phòng trước khi chạm {NEXT_TIER.name} (đắt hơn {STEP_PCT}%). Với tốc độ dùng hiện tại ({PACE.toFixed(1)} kWh/ngày), bạn sẽ chạm bậc mới vào ngày {CROSS_DAY}/9.
            </Text>

            {/* Progress bar across tiers */}
            <View style={styles.tierProgressTrack}>
              {TIERS.map((t, i) => (
                <View
                  key={t.name}
                  style={[
                    styles.tierProgressSeg,
                    {
                      flex: Math.max(TIER_USED[i], 6),
                      backgroundColor: TIER_USED[i] > 0 ? t.color : '#E7EBE1',
                    },
                  ]}
                />
              ))}
            </View>

            <Pressable
              onPress={() => setIsBillingOpen(!isBillingOpen)}
              accessibilityRole="button"
              accessibilityLabel="Xem chi tiết bảng tính 6 bậc thang và hóa đơn"
              style={({ pressed }) => [
                styles.billingCardAction,
                pressed && styles.billingCardActionPressed,
              ]}>
              <Text style={styles.billingCardActionText}>
                {isBillingOpen
                  ? 'Thu gọn bảng tính biểu phí'
                  : 'Bảng tính 6 bậc thang & hóa đơn chi tiết'}
              </Text>
              <Text style={styles.billingCardActionArrow}>
                {isBillingOpen ? '▲' : '›'}
              </Text>
            </Pressable>

            {/* Expanded Full Tariff Schedule Table */}
            {isBillingOpen && (
              <View style={styles.expandedBillingWrap}>
                <BillingTariffView hideChart={true} />
              </View>
            )}
          </Card>
        )}

            <NeighbourComparison
              wattage={960}
              percentile={62}
              unitMode={unit}
            />
        </View>
      </ScrollView>
    </SafeAreaView>

      {/* ANIMATED DRILL-DOWN: Device Detail Screen */}
      {activeDeviceDetail && (
        <Animated.View
          entering={SlideInRight.duration(280).easing(Easing.bezier(0.23, 1, 0.32, 1))}
          exiting={SlideOutRight.duration(240).easing(Easing.bezier(0.23, 1, 0.32, 1))}
          style={styles.detailOverlay}>
          <DeviceDetailScreen
            device={activeDeviceDetail}
            onBack={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
              setActiveDeviceDetail(null);
            }}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
    zIndex: 999,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  scrollContent: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 0,
  },
  topHeroBlock: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 2,
  },
  screenTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 28,
    color: WattPrintTokens.colors.primary, // #164437
  },
  dateNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 2,
  },
  dateNavBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNavBtnDisabled: {
    opacity: 0.35,
  },
  dateNavChevron: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 18,
    color: WattPrintTokens.colors.primary, // #164437
    lineHeight: 20,
  },
  dateNavChevronDisabled: {
    color: WattPrintTokens.colors.secondary,
  },
  dateNavLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
    letterSpacing: -0.2,
  },
  estimationBanner: {
    alignSelf: 'center',
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.sm,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginVertical: 2,
  },
  estimationText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: WattPrintTokens.colors.secondary, // #4A6B60
    textAlign: 'center',
  },
  estimationHighlight: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    color: WattPrintTokens.colors.primary, // #164437
    fontWeight: '700',
  },
  cardsContainer: {
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 88,
    gap: 14,
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
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  sentence: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 18,
    lineHeight: 24.3,
    color: WattPrintTokens.colors.primary, // #164437
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
    fontSize: 13,
    color: WattPrintTokens.colors.primary,
  },
  pickNote: {
    fontFamily: Fonts.sans,
    fontSize: 14,
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
    fontSize: 13,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  pillLabelActive: {
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  bubbleBox: {
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
    fontSize: 12,
    letterSpacing: 0.5,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  compareStatVal: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 21,
    color: WattPrintTokens.colors.primary, // #164437
  },
  billingTopActions: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  billingBackBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: WattPrintTokens.radii.sm,
    backgroundColor: WattPrintTokens.colors.primaryContainer,
  },
  billingBackBtnText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.primary,
    letterSpacing: 0.5,
  },
  billingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tierBadge: {
    backgroundColor: WattPrintTokens.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: WattPrintTokens.radii.xs,
  },
  tierBadgeText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: WattPrintTokens.colors.accentDeep,
    letterSpacing: 0.5,
  },
  billingCardPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  billingCardPrice: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 28,
    color: WattPrintTokens.colors.primary,
    letterSpacing: -0.5,
  },
  billingCardCurrency: {
    fontFamily: Fonts.monoMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.secondary,
  },
  billingCardNotice: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: WattPrintTokens.colors.inkBody,
  },
  billingCardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WattPrintTokens.colors.neutralGround,
    borderRadius: WattPrintTokens.radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  billingCardActionPressed: {
    backgroundColor: WattPrintTokens.colors.primaryContainer,
  },
  billingCardActionText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: WattPrintTokens.colors.primary,
  },
  billingCardActionArrow: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 16,
    color: WattPrintTokens.colors.accentDeep,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartSubFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  chartSubFilterLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  selectionDetailCard: {
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.lg, // 16px
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  selectionDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionTitleGroup: {
    gap: 2,
  },
  selectionDetailTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 15,
    color: WattPrintTokens.colors.primary, // #164437
  },
  selectionDetailSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  selectionDetailTotal: {
    fontFamily: Fonts.monoSemiBold,
    fontSize: 15,
    color: WattPrintTokens.colors.primary,
  },
  selectionProgressTrack: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
  },
  selectionProgressSeg: {
    height: 6,
    overflow: 'hidden',
    borderRadius: 1.5,
  },
  selectionChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: WattPrintTokens.radii.pill,
    borderWidth: 1,
    borderColor: '#E2E8DC',
  },
  selectionChipLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  selectionChipVal: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.primary,
  },
  disclosureBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF4EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclosureArrow: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 16,
    color: '#4A6B60',
    marginTop: -2,
  },
  tierProgressTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 2,
    marginVertical: 4,
  },
  tierProgressSeg: {
    height: '100%',
    borderRadius: 1,
  },
  expandedBillingWrap: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFF4E6',
    paddingTop: 10,
  },
});
