import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import {
  EXPERIMENT_TEMPLATES,
  type ExperimentTemplate,
} from '@/features/energy/mock';
import type { ActiveExperiment } from '@/features/energy/types';
import { ApplianceIcon } from './appliance-icon';

interface CreateExperimentSheetProps {
  visible: boolean;
  onClose: () => void;
  onStart: (experiment: ActiveExperiment) => void;
}

export function CreateExperimentSheet({
  visible,
  onClose,
  onStart,
}: CreateExperimentSheetProps) {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const currentTemplate = EXPERIMENT_TEMPLATES[selectedTemplateIndex] ?? EXPERIMENT_TEMPLATES[0];

  const [targetVal, setTargetVal] = useState<number>(currentTemplate.defaultTarget);
  const [extraOption, setExtraOption] = useState<boolean>(true); // e.g. with fan
  const [hasPredicted, setHasPredicted] = useState<boolean>(false);

  // Switch template
  const handleSelectTemplate = (index: number) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    const tmpl = EXPERIMENT_TEMPLATES[index];
    setSelectedTemplateIndex(index);
    setTargetVal(tmpl.defaultTarget);
    setHasPredicted(false);
  };

  const handleMinus = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setTargetVal((prev) => Math.max(currentTemplate.minTarget, prev - currentTemplate.step));
    setHasPredicted(false);
  };

  const handlePlus = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setTargetVal((prev) => Math.min(currentTemplate.maxTarget, prev + currentTemplate.step));
    setHasPredicted(false);
  };

  const prediction = currentTemplate.calcPrediction(targetVal, extraOption);

  const handlePredict = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setHasPredicted(true);
  };

  const handleConfirmStart = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const newExperiment: ActiveExperiment = {
      id: `exp-${Date.now()}`,
      deviceId: currentTemplate.deviceId,
      deviceName: currentTemplate.deviceName,
      title: `${currentTemplate.deviceName}: ${targetVal}${currentTemplate.unit} ${
        currentTemplate.deviceId === 'dev-0' && extraOption ? 'kèm quạt gió' : ''
      }`,
      baselineKwh: currentTemplate.baselineKwh,
      targetKwh: prediction.targetKwh,
      predictedSavedKwh: prediction.savedKwhPerDay,
      predictedSavedVnd: prediction.savedVndPerWeek,
      currentDay: 1,
      totalDays: 7,
      dailyLogs: [
        {
          day: 1,
          date: 'Hôm nay',
          kwh: prediction.targetKwh,
          runtime: 'Đang theo dõi...',
        },
      ],
    };

    onStart(newExperiment);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.scrim} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Handle bar */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>KHỞI TẠO THỬ NGHIỆM</Text>
              <Text style={styles.title}>Thiết lập mục tiêu mới</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Step 1: Device Selection Chips */}
            <Text style={styles.sectionLabel}>1. CHỌN THIẾT BỊ MỤC TIÊU</Text>
            <View style={styles.deviceRow}>
              {EXPERIMENT_TEMPLATES.map((tmpl, idx) => {
                const isSelected = idx === selectedTemplateIndex;
                return (
                  <Pressable
                    key={tmpl.deviceId}
                    onPress={() => handleSelectTemplate(idx)}
                    style={({ pressed }) => [
                      styles.deviceChip,
                      isSelected && styles.deviceChipSelected,
                      pressed && { opacity: 0.75 },
                    ]}>
                    <ApplianceIcon
                      name={tmpl.deviceName}
                      id={tmpl.deviceId}
                      size={18}
                      color={isSelected ? '#FFFFFF' : WattPrintTokens.colors.primary}
                    />
                    <Text
                      style={[
                        styles.deviceChipText,
                        isSelected && styles.deviceChipTextSelected,
                      ]}>
                      {tmpl.deviceName}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Step 2: Dynamic Adjustments */}
            <Text style={styles.sectionLabel}>2. ĐIỀU CHỈNH MỤC TIÊU THỰC TẾ</Text>
            <View style={styles.adjustCard}>
              <View style={styles.stepperRow}>
                <View style={styles.adjustInfo}>
                  <Text style={styles.adjustTitle}>{currentTemplate.title}</Text>
                  <Text style={styles.adjustSub}>
                    Mức khuyến nghị: {currentTemplate.defaultTarget} {currentTemplate.unit}
                  </Text>
                </View>

                {currentTemplate.step > 0 && (
                  <View style={styles.stepperWrap}>
                    <Pressable
                      onPress={handleMinus}
                      hitSlop={8}
                      style={({ pressed }) => [
                        styles.stepBtn,
                        pressed && styles.stepBtnPressed,
                      ]}>
                      <Text style={styles.stepBtnText}>-</Text>
                    </Pressable>
                    <Text style={styles.stepValue}>
                      {targetVal.toFixed(currentTemplate.step < 1 ? 1 : 0)} {currentTemplate.unit}
                    </Text>
                    <Pressable
                      onPress={handlePlus}
                      hitSlop={8}
                      style={({ pressed }) => [
                        styles.stepBtn,
                        pressed && styles.stepBtnPressed,
                      ]}>
                      <Text style={styles.stepBtnText}>+</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* Extra toggle for AC */}
              {currentTemplate.deviceId === 'dev-0' && (
                <Pressable
                  onPress={() => {
                    try {
                      Haptics.selectionAsync();
                    } catch {}
                    setExtraOption((prev) => !prev);
                    setHasPredicted(false);
                  }}
                  style={styles.toggleRow}>
                  <View
                    style={[
                      styles.toggleBox,
                      extraOption && styles.toggleBoxActive,
                    ]}>
                    {extraOption && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.toggleLabel}>
                    Kết hợp bật quạt gió trần/cây để làm mát đều
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Step 3: Comparison Grid (Before vs Target) */}
            <Text style={styles.sectionLabel}>3. SO SÁNH TRƯỚC VÀ SAU THỬ NGHIỆM</Text>
            <View style={styles.compareGrid}>
              {/* Baseline */}
              <View style={styles.compareBox}>
                <Text style={styles.compareBoxTag}>MỨC NỀN TRƯỚC</Text>
                <View style={styles.compareValRow}>
                  <Text style={styles.compareVal}>
                    {currentTemplate.baselineKwh.toFixed(1)}
                  </Text>
                  <Text style={styles.compareUnit}>kWh/ngày</Text>
                </View>
                <Text style={styles.compareSub}>Dữ liệu đo đạc 14 ngày</Text>
              </View>

              {/* Arrow */}
              <View style={styles.arrowBox}>
                <Text style={styles.arrowText}>→</Text>
              </View>

              {/* Target */}
              <View style={[styles.compareBox, styles.compareBoxTarget]}>
                <Text style={[styles.compareBoxTag, styles.compareBoxTagTarget]}>
                  MỤC TIÊU DỰ KIẾN
                </Text>
                <View style={styles.compareValRow}>
                  <Text style={[styles.compareVal, styles.compareValTarget]}>
                    {prediction.targetKwh.toFixed(1)}
                  </Text>
                  <Text style={[styles.compareUnit, styles.compareUnitTarget]}>
                    kWh/ngày
                  </Text>
                </View>
                <Text style={styles.compareSub}>
                  Giảm {prediction.pct}% phụ tải
                </Text>
              </View>
            </View>

            {/* Step 4: Predict Action & Prediction Box */}
            <Pressable
              onPress={handlePredict}
              style={({ pressed }) => [
                styles.predictBtn,
                pressed && { opacity: 0.75, transform: [{ scale: 0.985 }] },
              ]}>
              <Text style={styles.predictBtnSparkle}>✨</Text>
              <Text style={styles.predictBtnText}>Dự đoán thay đổi tiêu thụ</Text>
            </Pressable>

            {hasPredicted && (
              <View style={styles.predictionBox}>
                <View style={styles.predictionTop}>
                  <Text style={styles.predictionBadge}>DỰ BÁO TIẾT KIỆM</Text>
                  <Text style={styles.predictionHighlight}>
                    ~{prediction.savedVndPerWeek.toLocaleString('vi-VN')} đ/tuần
                  </Text>
                </View>
                <Text style={styles.predictionSummary}>{prediction.summary}</Text>
                <Text style={styles.predictionNote}>
                  Ước tính khoảng {prediction.savedKwhPerDay.toFixed(1)} kWh/ngày,
                  tương đương giảm rủi ro nhảy sang Bậc 4 EVN.
                </Text>
              </View>
            )}

            {/* CTA: Start Experiment */}
            <Pressable
              onPress={handleConfirmStart}
              style={({ pressed }) => [
                styles.startBtn,
                pressed && { opacity: 0.85, transform: [{ scale: 0.985 }] },
              ]}>
              <Text style={styles.startBtnText}>BẮT ĐẦU THỬ NGHIỆM (7 NGÀY)</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  scrim: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCD3C7',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  eyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  title: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 20,
    color: WattPrintTokens.colors.primary, // #164437
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E7DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  sectionLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: WattPrintTokens.colors.secondary, // #4A6B60
    marginTop: 6,
  },
  deviceRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  deviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: WattPrintTokens.radii.pill,
  },
  deviceChipSelected: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
  },
  deviceChipText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    color: WattPrintTokens.colors.primary,
  },
  deviceChipTextSelected: {
    color: '#FFFFFF',
  },
  adjustCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  adjustInfo: {
    flex: 1,
    gap: 3,
  },
  adjustTitle: {
    fontFamily: Fonts.sansMedium,
    fontSize: 15,
    color: WattPrintTokens.colors.primary,
  },
  adjustSub: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.pill,
    padding: 4,
    gap: 8,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.94 }],
  },
  stepBtnText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 16,
    color: WattPrintTokens.colors.primary,
    lineHeight: 18,
  },
  stepValue: {
    fontFamily: Fonts.monoMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary,
    minWidth: 54,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E7EBE1',
  },
  toggleBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: WattPrintTokens.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBoxActive: {
    backgroundColor: WattPrintTokens.colors.accentDeep,
    borderColor: WattPrintTokens.colors.accentDeep,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleLabel: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: WattPrintTokens.colors.primary,
    lineHeight: 17,
  },
  compareGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compareBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  compareBoxTarget: {
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
  },
  compareBoxTag: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: WattPrintTokens.colors.secondary,
  },
  compareBoxTagTarget: {
    color: WattPrintTokens.colors.accentDeep,
  },
  compareValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  compareVal: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 22,
    color: WattPrintTokens.colors.primary,
  },
  compareValTarget: {
    color: WattPrintTokens.colors.accentDeep,
  },
  compareUnit: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  compareUnitTarget: {
    color: WattPrintTokens.colors.accentDeep,
  },
  compareSub: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  arrowBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 18,
    color: WattPrintTokens.colors.secondary,
  },
  predictBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 14,
  },
  predictBtnSparkle: {
    fontSize: 15,
  },
  predictBtnText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 14,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  predictionBox: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  predictionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  predictionBadge: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  predictionHighlight: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 16,
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  predictionSummary: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  predictionNote: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: WattPrintTokens.colors.inkInverseMuted,
    lineHeight: 16,
  },
  startBtn: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  startBtnText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
});
