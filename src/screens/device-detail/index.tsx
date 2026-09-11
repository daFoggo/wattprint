import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import { Card } from '@/components/common/card';
import { UnderlineTabRow } from '@/features/energy/components/underline-tab-row';
import { UsageBarChart } from '@/features/energy/components/usage-bar-chart';
import {
  DEVICE_DETAIL_AIRCON,
  DEVICE_WEEK_BARS,
} from '@/features/energy/mock';

const DEV_TABS = [
  { key: 'day', label: 'NGÀY' },
  { key: 'week', label: 'TUẦN' },
  { key: 'month', label: 'THÁNG' },
  { key: 'year', label: 'NĂM' },
];

export function DeviceDetailScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('week');
  const [selectedBar, setSelectedBar] = useState(2);

  const device = DEVICE_DETAIL_AIRCON;

  const handleStartTest = () => {
    router.push('/experiment');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* Scrollable Container */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Bar Actions on Ground */}
        <View style={styles.topActionsRow}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Text style={styles.backBtn}>QUAY LẠI</Text>
          </Pressable>
          <Pressable hitSlop={10}>
            <Text style={styles.editBtn}>SỬA</Text>
          </Pressable>
        </View>

        {/* Identity Block on Ground */}
        <View style={styles.identityBlock}>
          <View style={styles.deviceIconBox} />
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceMeta}>{device.meta}</Text>
        </View>

        {/* Paired Stat Cards (1fr 1fr) */}
        <View style={styles.pairedGrid}>
          {/* Card 1: Average */}
          <Card
            className="border-0 shadow-none bg-white rounded-[20px] p-4 gap-1.5"
            style={styles.statCard}>
            <Text style={styles.statEyebrow}>CÔNG SUẤT TRUNG BÌNH</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{device.avgW}</Text>
              <Text style={styles.statUnit}>W</Text>
            </View>
            <Text style={styles.statLede}>khi đang bật</Text>
          </Card>

          {/* Card 2: Cost */}
          <Card
            className="border-0 shadow-none bg-white rounded-[20px] p-4 gap-1.5"
            style={styles.statCard}>
            <Text style={styles.statEyebrow}>CHI PHÍ</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{device.costMonth}</Text>
              <Text style={styles.statUnit}>nghìn/tháng</Text>
            </View>
            <Text style={styles.statLede}>theo mức dùng của bạn</Text>
          </Card>
        </View>

        {/* Card 3: Usage Breakdown Card */}
        <Card
          className="border-0 shadow-none bg-white rounded-[20px] p-5 gap-4"
          style={styles.card}>
          <Text style={styles.cardEyebrow}>MỨC TIÊU THỤ</Text>

          {/* Underline Range Tabs */}
          <UnderlineTabRow
            tabs={DEV_TABS}
            activeKey={activeTab}
            onChange={setActiveTab}
          />

          {/* 7-Day Bar Chart */}
          <UsageBarChart
            bars={DEVICE_WEEK_BARS}
            selectedIndex={selectedBar}
            onSelect={setSelectedBar}
            height={130}
          />

          {/* 4 Stat Rows */}
          <View style={styles.statsList}>
            {device.stats.map((st: { label: string; value: string }, idx: number) => (
              <View key={idx} style={styles.statRow}>
                <Text style={styles.statRowLabel}>{st.label}</Text>
                <Text style={styles.statRowValue}>{st.value}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Card 4: Weight Block (Copilot Note) */}
        <Card
          className="border-0 shadow-none bg-[#164437] rounded-[20px] p-5 gap-3"
          style={styles.weightBlock}>
          <Text style={styles.weightEyebrow}>GHI CHÚ TỪ TRỢ LÝ AI</Text>
          <Text style={styles.weightText}>{device.note}</Text>

          <Pressable onPress={handleStartTest} style={styles.weightBtn}>
            <Text style={styles.weightBtnText}>Bắt đầu thử nghiệm 3 ngày</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 12,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  backBtn: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  editBtn: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  identityBlock: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  deviceIconBox: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: WattPrintTokens.colors.tertiary, // #B5E930
  },
  deviceName: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 28,
    lineHeight: 32,
    color: WattPrintTokens.colors.primary, // #164437
  },
  deviceMeta: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 0.52,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  pairedGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.xl, // 20px
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 6,
  },
  statEyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 26,
    color: WattPrintTokens.colors.primary, // #164437
  },
  statUnit: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    color: WattPrintTokens.colors.secondary,
  },
  statLede: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: WattPrintTokens.colors.secondary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.xl, // 20px
    paddingVertical: 20,
    paddingHorizontal: 22,
    gap: 16,
  },
  cardEyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  statsList: {
    gap: 2,
    paddingTop: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  statRowLabel: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  statRowValue: {
    fontFamily: Fonts.monoMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
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
  weightBtn: {
    backgroundColor: WattPrintTokens.colors.tertiary, // #B5E930
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  weightBtnText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
  },
});
