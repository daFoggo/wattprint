import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import {
  BILL_DAYS,
  CROSS_DAY,
  CURRENT_TIER,
  DAYS_LEFT,
  HEADROOM,
  MONTH_COST,
  MONTH_KWH,
  NEXT_TIER,
  PACE,
  STEP_PCT,
  TIER_USED,
  TIERS,
  TOU,
} from '@/features/energy/mock';
import type { CustomerType } from '@/features/energy/types';

interface BillingTariffViewProps {
  customerType: CustomerType;
  onCustomerChange: (type: CustomerType) => void;
}

export function BillingTariffView({
  customerType,
  onCustomerChange,
}: BillingTariffViewProps) {
  const isHome = customerType === 'home';

  const maxDayKwh = Math.max(...BILL_DAYS.map((d) => d.kwh)) || 1;
  const chartHeight = 110;

  const bizCost = Math.round(
    TOU.reduce((sum, t) => sum + MONTH_KWH * t.share * t.price, 0) * 1.08
  );
  const totalCostDisplay = isHome
    ? `${Math.round(MONTH_COST).toLocaleString('en-US')}`
    : `${bizCost.toLocaleString('en-US')}`;

  const warnTag = isHome ? 'DỰ BÁO BẬC ĐIỆN' : 'CẢNH BÁO GIỜ CAO ĐIỂM';
  const warnText = isHome
    ? `Bạn đang ở ${CURRENT_TIER.name.toLowerCase()} với mức dự phòng ${Math.round(
        HEADROOM
      )} kWh. ${NEXT_TIER.name} đắt hơn ${STEP_PCT}%, và với mức tiêu thụ hiện tại ${PACE.toFixed(
        1
      )} kWh/ngày, bạn sẽ chạm bậc này vào ngày ${CROSS_DAY}/9.`
    : 'Điện giờ cao điểm đắt gấp 2,8 lần giờ thấp điểm. Chuyển chu trình giặt sang sau 22:00 sẽ tiết kiệm khoảng 340.000 đ mỗi tháng.';

  const tableTag = isHome ? 'BIỂU PHÍ SINH HOẠT' : 'BIỂU PHÍ THEO KHUNG GIỜ (TOU)';
  const tableTitle = isHome
    ? '6 bậc thang lũy tiến áp dụng trên tổng điện tiêu thụ tích lũy.'
    : '3 khung giờ có mức giá riêng biệt trong ngày.';

  const rows = isHome
    ? TIERS.map((t, i) => ({
        name: t.name,
        sub: t.sub,
        used: `${Math.round(TIER_USED[i])}`,
        cost: `${Math.round(TIER_USED[i] * t.price).toLocaleString('vi-VN')}`,
        color: t.color,
      }))
    : TOU.map((t) => ({
        name: t.name,
        sub: t.sub,
        used: `${Math.round(MONTH_KWH * t.share)}`,
        cost: `${Math.round(MONTH_KWH * t.share * t.price).toLocaleString('vi-VN')}`,
        color: t.color,
      }));

  return (
    <View style={styles.container}>
      {/* 1. BILL TO DATE CARD */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.eyebrow}>HÓA ĐƠN TẠM TÍNH</Text>

          {/* Segmented pill switch: Household / Business */}
          <View style={styles.pillTrack}>
            <Pressable
              onPress={() => onCustomerChange('home')}
              style={[
                styles.pillItem,
                isHome && styles.pillItemActive,
              ]}>
              <Text
                style={[
                  styles.pillText,
                  isHome && styles.pillTextActive,
                ]}>
                Sinh hoạt
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onCustomerChange('biz')}
              style={[
                styles.pillItem,
                !isHome && styles.pillItemActive,
              ]}>
              <Text
                style={[
                  styles.pillText,
                  !isHome && styles.pillTextActive,
                ]}>
                Kinh doanh
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sentence}>
          {isHome
            ? `Hóa đơn của bạn đã chạm ${CURRENT_TIER.name.toLowerCase()} và còn ${DAYS_LEFT} ngày trong chu kỳ.`
            : 'Một phần tư lượng điện tiêu thụ của bạn rơi vào khung giờ cao điểm.'}
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
                  {isHome
                    ? d.segs.map((sg: { ti: number; kwh: number }, idx: number) => (
                        <View
                          key={idx}
                          style={{
                            height: Math.max(2, Math.round((sg.kwh / d.kwh) * h)),
                            backgroundColor: TIERS[sg.ti]?.color ?? '#164437',
                            width: '100%',
                          }}
                        />
                      ))
                    : TOU.map((t, idx) => (
                        <View
                          key={idx}
                          style={{
                            height: Math.max(2, Math.round(t.share * h)),
                            backgroundColor: t.color,
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
          {isHome
            ? 'Mỗi cột là một ngày, hiển thị theo bậc giá điện tương ứng. Màu càng sáng thì giá càng cao.'
            : 'Mỗi cột là một ngày, chia theo ba khung giờ sử dụng.'}
        </Text>
      </View>

      {/* 2. THE WEIGHT BLOCK: TIER FORECAST */}
      <View style={styles.weightBlock}>
        <Text style={styles.weightEyebrow}>{warnTag}</Text>
        <Text style={styles.weightText}>{warnText}</Text>

        {/* Progress bar across tiers */}
        <View style={styles.progressTrack}>
          {isHome
            ? TIERS.map((t, i) => (
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
              ))
            : TOU.map((t) => (
                <View
                  key={t.name}
                  style={[
                    styles.progressSeg,
                    {
                      flex: t.share * 100,
                      backgroundColor: t.color,
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
          <Text style={[styles.colHeader, { flex: 1 }]}>BẬC / KHUNG GIỜ</Text>
          <Text style={[styles.colHeader, { width: 64, textAlign: 'right' }]}>ĐÃ DÙNG</Text>
          <Text style={[styles.colHeader, { width: 90, textAlign: 'right' }]}>THÀNH TIỀN</Text>
        </View>

        {/* Table Rows */}
        <View style={styles.rowsList}>
          {rows.map((row, idx) => (
            <View key={idx} style={styles.tableRow}>
              <View style={[styles.colorChip, { backgroundColor: row.color }]} />
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
  colorChip: {
    width: 12,
    height: 12,
    borderRadius: WattPrintTokens.radii.xs, // 4px
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
