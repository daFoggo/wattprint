import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import { Card } from '@/components/common/card';
import { ExperimentStateCard } from '@/features/energy/components/experiment-state-card';
import { MOCK_EXP_LOG } from '@/features/energy/mock';
import type { ExperimentState } from '@/features/energy/types';
import { useEnergyStore } from '@/features/energy/use-energy-store';

const EXP_STATES: { key: ExperimentState; label: string }[] = [
  { key: 'running', label: 'Đang chạy' },
  { key: 'summary', label: 'Tạm dừng' },
  { key: 'suggest', label: 'Gợi ý' },
  { key: 'locked', label: 'Chưa có mức nền' },
];

export function ExperimentScreen() {
  const {
    experimentState,
    setExperimentState,
    experimentTemp,
    setExperimentTemp,
  } = useEnergyStore();

  const handleMinusTemp = () => {
    setExperimentTemp((prev) => Math.max(24, prev - 0.5));
  };

  const handlePlusTemp = () => {
    setExperimentTemp((prev) => Math.min(29, prev + 0.5));
  };

  const handleAction = () => {
    if (experimentState === 'running') {
      setExperimentState('summary');
    } else if (experimentState === 'summary') {
      setExperimentState('suggest');
    } else if (experimentState === 'suggest') {
      setExperimentState('running');
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Ground Title & Lede */}
        <View style={styles.groundHeader}>
          <Text style={styles.title}>Thử nghiệm</Text>
          <Text style={styles.lede}>
            Thay đổi một thói quen trong vài ngày. Mức tiêu thụ nền đã được ghi nhận tự động,
            không cần nhập liệu thủ công.
          </Text>
        </View>

        {/* Dynamic Active Experiment Card */}
        <ExperimentStateCard
          state={experimentState}
          temp={experimentTemp}
          onMinusTemp={handleMinusTemp}
          onPlusTemp={handlePlusTemp}
          onAction={handleAction}
        />

        {/* Interactive State Switcher for Demoing */}
        <View style={styles.statePicker}>
          {EXP_STATES.map((st) => {
            const isActive = experimentState === st.key;
            return (
              <Pressable
                key={st.key}
                onPress={() => setExperimentState(st.key)}
                style={[
                  styles.statePickerBtn,
                  isActive && styles.statePickerBtnActive,
                ]}>
                <Text
                  style={[
                    styles.statePickerLabel,
                    isActive && styles.statePickerLabelActive,
                  ]}>
                  {st.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Past Experiments Section */}
        <View style={styles.pastHeader}>
          <Text style={styles.pastEyebrow}>THỬ NGHIỆM ĐÃ QUA</Text>
          <Text style={styles.pastCount}>TỔNG CỘNG {MOCK_EXP_LOG.length}</Text>
        </View>

        <View style={styles.logList}>
          {MOCK_EXP_LOG.map((log) => (
            <Card
              key={log.id}
              className="border-0 shadow-none bg-white rounded-[18px] p-4 gap-2.5"
              style={styles.logCard}>
              <View style={styles.logTopRow}>
                <Text style={styles.logTitle}>{log.title}</Text>
                <View
                  style={[
                    styles.resultBadge,
                    log.good ? styles.resultBadgeGood : styles.resultBadgeDropped,
                  ]}>
                  <Text
                    style={[
                      styles.resultText,
                      log.good ? styles.resultTextGood : styles.resultTextDropped,
                    ]}>
                    {log.result}
                  </Text>
                </View>
              </View>

              <View style={styles.logBottomRow}>
                <Text style={styles.logDate}>{log.date}</Text>
                <Text
                  style={[
                    styles.logSaved,
                    log.good ? styles.logSavedGood : styles.logSavedDropped,
                  ]}>
                  {log.savedVnd > 0
                    ? `tiết kiệm ${log.savedVnd.toLocaleString('vi-VN')} đ`
                    : log.note}
                </Text>
              </View>
            </Card>
          ))}
        </View>
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
  groundHeader: {
    paddingHorizontal: 8,
    gap: 6,
    paddingBottom: 4,
  },
  title: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 24,
    color: WattPrintTokens.colors.primary, // #164437
  },
  lede: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  statePicker: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.pill,
    padding: 4,
    gap: 2,
    marginVertical: 2,
  },
  statePickerBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: WattPrintTokens.radii.pill,
  },
  statePickerBtnActive: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
  },
  statePickerLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: WattPrintTokens.colors.secondary,
  },
  statePickerLabelActive: {
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  pastHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  pastEyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  pastCount: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  logList: {
    gap: 10,
  },
  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 10,
  },
  logTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 10,
  },
  logTitle: {
    flex: 1,
    fontFamily: Fonts.sansMedium,
    fontSize: 15,
    lineHeight: 21,
    color: WattPrintTokens.colors.primary, // #164437
  },
  resultBadge: {
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  resultBadgeGood: {
    backgroundColor: '#DEEEBD',
  },
  resultBadgeDropped: {
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
  },
  resultText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  resultTextGood: {
    color: '#1E5A08',
  },
  resultTextDropped: {
    color: WattPrintTokens.colors.secondary,
  },
  logBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logDate: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  logSaved: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
  },
  logSavedGood: {
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  logSavedDropped: {
    color: WattPrintTokens.colors.secondary,
  },
});
