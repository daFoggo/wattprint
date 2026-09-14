import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import {
  BILL_DAYS,
  CROSS_DAY,
  CURRENT_TIER,
  DAYS_LEFT,
  HEADROOM,
  MONTH_COST,
  NEXT_TIER,
  PACE,
  STEP_PCT,
  TIER_USED,
  TIERS,
} from '@/features/energy/mock';
import type { CustomerType } from '@/features/energy/types';

interface BillingTariffViewProps {
  customerType?: CustomerType;
  onCustomerChange?: (type: CustomerType) => void;
  hideChart?: boolean;
}

export function BillingTariffView({
  hideChart = false,
}: BillingTariffViewProps) {
  const maxDayKwh = Math.max(...BILL_DAYS.map((d) => d.kwh)) || 1;
  const chartHeight = 110;

  const totalCostDisplay = `${Math.round(MONTH_COST).toLocaleString('vi-VN')}`;

  const warnTag = 'DỰ BÁO BẬC ĐIỆN';
  const warnText = `Bạn đang ở ${CURRENT_TIER.name.toLowerCase()} với mức dự phòng ${Math.round(
    HEADROOM
  )} kWh. ${NEXT_TIER.name} đắt hơn ${STEP_PCT}%, và với mức tiêu thụ hiện tại ${PACE.toFixed(
    1
  )} kWh/ngày, bạn sẽ chạm bậc này vào ngày ${CROSS_DAY}/9.`;

  const tableTag = 'BIỂU PHÍ SINH HOẠT (EVN)';
  const tableTitle = '6 bậc thang lũy tiến áp dụng trên tổng điện tiêu thụ tích lũy.';

  const rows = TIERS.map((t, i) => ({
    name: t.name,
    sub: t.sub,
    used: `${Math.round(TIER_USED[i])}`,
    cost: `${Math.round(TIER_USED[i] * t.price).toLocaleString('vi-VN')}`,
    color: t.color,
    symbol: t.symbol ?? '■',
    pattern: t.pattern ?? 'solid',
  }));

  return (
    <View style={styles.container}>
      {/* 1. BILL TO DATE CARD (Rendered if not hidden) */}
      {!hideChart && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.eyebrow}>HÓA ĐƠN TẠM TÍNH</Text>
            <View style={styles.tierStatusPill}>
              <Text style={styles.tierStatusText}>BẬC 3 / 6</Text>
            </View>
          </View>

          <Text style={styles.sentence}>
            Hóa đơn của bạn đã chạm {CURRENT_TIER.name.toLowerCase()} và còn {DAYS_LEFT} ngày trong chu kỳ.
          </Text>

          <View style={styles.totalRow}>
            <Text style={styles.totalValue}>{totalCostDisplay}</Text>
            <Text style={styles.totalUnit}>VND</Text>
          </View>

          {/* Stacked Daily Columns */}
          <View style={[styles.chartBox, { height: chartHeight + 20 }]}>
            {BILL_DAYS.map((d) => {
              const h = Math.round((d.kwh / maxDayKwh) * chartHeight);
              return (
                <View key={d.day} style={styles.dayCol}>
                  <View style={[styles.dayStack, { height: h }]}>
                    {d.segs.map((sg: { ti: number; kwh: number }, idx: number) => (
                      <View
                        key={idx}
                        style={{
                          height: Math.max(2, Math.round((sg.kwh / d.kwh) * h)),
                          backgroundColor: TIERS[sg.ti]?.color ?? '#164437',
                          width: '100%',
                        }}
                      />
                    ))}
                  </View>
                  <Text style={styles.dayLabel}>
                    {d.day % 4 === 1 ? String(d.day) : ''}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.chartFootnote}>
            Mỗi cột là một ngày, hiển thị theo 6 bậc giá điện lũy tiến tương ứng.
          </Text>
        </View>
      )}

      {/* 2. THE WEIGHT BLOCK: TIER FORECAST */}
      <View style={styles.weightBlock}>
        <Text style={styles.weightEyebrow}>{warnTag}</Text>
        <Text style={styles.weightText}>{warnText}</Text>

        {/* Progress bar across tiers */}
        <View style={styles.progressTrack}>
          {TIERS.map((t, i) => (
            <View
              key={t.name}
              style={[
                styles.progressSeg,
                {
                  flex: Math.max(TIER_USED[i], 6),
                  backgroundColor: TIER_USED[i] > 0 ? t.color : '#E7EBE1',
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* 3. TARIFF TABLE CARD */}
      <View style={styles.card}>
        <Text style={styles.eyebrow}>{tableTag}</Text>
        <Text style={styles.sentence}>{tableTitle}</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={{ width: 12 }} />
          <Text style={[styles.colHeader, { flex: 1 }]}>BẬC THANG EVN</Text>
          <Text style={[styles.colHeader, { width: 64, textAlign: 'right' }]}>ĐÃ DÙNG</Text>
          <Text style={[styles.colHeader, { width: 90, textAlign: 'right' }]}>THÀNH TIỀN</Text>
        </View>

        {/* Table Rows */}
        <View style={styles.rowsList}>
          {rows.map((row, idx) => (
            <View key={idx} style={styles.tableRow}>
              <View
                style={[
                  styles.symbolBadge,
                  row.pattern === 'cross'
                    ? styles.symbolBadgeCross
                    : row.pattern === 'hatch'
                    ? styles.symbolBadgeHatch
                    : row.pattern === 'grid'
                    ? styles.symbolBadgeGrid
                    : row.pattern === 'stripe-h'
                    ? styles.symbolBadgeStripe
                    : row.pattern === 'solid'
                    ? styles.symbolBadgeSolid
                    : styles.symbolBadgeMuted,
                ]}>
                <Text
                  style={[
                    styles.symbolBadgeText,
                    row.pattern === 'cross' && styles.symbolBadgeTextCross,
                    row.pattern === 'hatch' && styles.symbolBadgeTextHatch,
                    row.pattern === 'grid' && styles.symbolBadgeTextGrid,
                    row.pattern === 'solid' && styles.symbolBadgeTextSolid,
                    row.pattern === 'stripe-h' && styles.symbolBadgeTextStripe,
                    row.pattern === 'muted' && styles.symbolBadgeTextMuted,
                  ]}>
                  {row.symbol}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowName}>{row.name}</Text>
                <Text style={styles.rowSub}>{row.sub}</Text>
              </View>
              <Text style={styles.rowUsed}>{row.used}</Text>
              <Text style={styles.rowCost}>{row.cost}</Text>
            </View>
          ))}
        </View>

        {/* Subtotal with VAT container */}
        <View style={styles.vatContainer}>
          <Text style={styles.vatLabel}>Tạm tính gồm 8% VAT</Text>
          <Text style={styles.vatValue}>{totalCostDisplay} VND</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.xl, // 20px
    paddingVertical: 20,
    paddingHorizontal: 22,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  eyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  pillTrack: {
    flexDirection: 'row',
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.pill,
    padding: 3,
    gap: 2,
    flexShrink: 0,
  },
  pillItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: WattPrintTokens.radii.pill,
    backgroundColor: 'transparent',
  },
  pillItemActive: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
  },
  pillText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  pillTextActive: {
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  tierStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: WattPrintTokens.radii.pill,
    backgroundColor: WattPrintTokens.colors.primaryContainer,
  },
  tierStatusText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    color: WattPrintTokens.colors.primary,
  },
  sentence: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 18,
    lineHeight: 24.3,
    color: WattPrintTokens.colors.primary, // #164437
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  totalValue: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 46,
    letterSpacing: -1.38,
    color: WattPrintTokens.colors.primary, // #164437
  },
  totalUnit: {
    fontFamily: Fonts.monoMedium,
    fontSize: 16,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  chartBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    width: '100%',
    paddingTop: 8,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  dayStack: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  dayLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
    height: 15,
  },
  chartFootnote: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 19.5,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  weightBlock: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
    borderRadius: WattPrintTokens.radii.xl, // 20px
    paddingVertical: 20,
    paddingHorizontal: 22,
    gap: 12,
  },
  weightEyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  weightText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22.5,
    color: '#FFFFFF',
  },
  progressTrack: {
    flexDirection: 'row',
    height: 10,
    borderRadius: WattPrintTokens.radii.pill,
    overflow: 'hidden',
    gap: 2,
    marginTop: 2,
  },
  progressSeg: {
    height: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 4,
  },
  colHeader: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.72,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  rowsList: {
    gap: 2,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  symbolBadge: {
    width: 22,
    height: 22,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolBadgeCross: {
    backgroundColor: '#164437',
  },
  symbolBadgeHatch: {
    backgroundColor: '#164437',
  },
  symbolBadgeGrid: {
    backgroundColor: '#A8DC7C',
  },
  symbolBadgeStripe: {
    backgroundColor: '#DCE7CF',
  },
  symbolBadgeSolid: {
    backgroundColor: '#5AAE14',
  },
  symbolBadgeMuted: {
    backgroundColor: '#EFF4E6',
    borderWidth: 1,
    borderColor: '#B8C9C1',
  },
  symbolBadgeText: {
    fontSize: 13,
    fontFamily: Fonts.monoMedium,
    color: WattPrintTokens.colors.primary,
  },
  symbolBadgeTextCross: {
    color: '#FF5C5C',
  },
  symbolBadgeTextHatch: {
    color: '#E5A93C',
  },
  symbolBadgeTextGrid: {
    color: '#164437',
  },
  symbolBadgeTextStripe: {
    color: '#2F7A0C',
  },
  symbolBadgeTextSolid: {
    color: '#FFFFFF',
  },
  symbolBadgeTextMuted: {
    color: '#4A6B60',
  },
  rowName: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
  },
  rowSub: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  rowUsed: {
    width: 56,
    fontFamily: Fonts.monoMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary,
    textAlign: 'right',
  },
  rowCost: {
    width: 80,
    fontFamily: Fonts.monoMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary,
    textAlign: 'right',
  },
  vatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.md, // 14px
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 6,
  },
  vatLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary,
  },
  vatValue: {
    fontFamily: Fonts.monoMedium,
    fontSize: 15,
    color: WattPrintTokens.colors.primary,
  },
});
