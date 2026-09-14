import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import { CreateExperimentSheet } from '@/features/energy/components/create-experiment-sheet';
import { ExperimentDetailModal } from '@/features/energy/components/experiment-detail-modal';
import { ExperimentHistorySheet } from '@/features/energy/components/experiment-history-sheet';
import { ExperimentStateCard } from '@/features/energy/components/experiment-state-card';
import { useEnergyStore } from '@/features/energy/use-energy-store';

const EMOTION_MAP: Record<string, { emoji: string; label: string }> = {
  comfortable: { emoji: '😃', label: 'Thoải mái' },
  neutral: { emoji: '😐', label: 'Bình thường' },
  uncomfortable: { emoji: '😓', label: 'Bất tiện' },
};

export function ExperimentScreen() {
  const {
    experimentState,
    activeExperiment,
    experimentLogs,
    startExperiment,
    endExperiment,
  } = useEnergyStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const visibleLogs = experimentLogs.slice(0, 3);

  const handleOpenHistory = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setIsHistoryOpen(true);
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

        {/* Dynamic Single Active Experiment Card */}
        <ExperimentStateCard
          state={experimentState}
          activeExperiment={activeExperiment}
          onOpenCreate={() => setIsCreateOpen(true)}
          onOpenDetail={() => setIsDetailOpen(true)}
        />

        {/* Past Experiments Section */}
        <View style={styles.pastHeader}>
          <Text style={styles.pastEyebrow}>THỬ NGHIỆM ĐÃ QUA</Text>
          {experimentLogs.length > 0 && (
            <Pressable
              onPress={handleOpenHistory}
              hitSlop={8}
              style={({ pressed }) => [styles.seeAllBtn, pressed && { opacity: 0.6 }]}>
              <Text style={styles.seeAllText}>
                XEM TẤT CẢ ({experimentLogs.length}) ›
              </Text>
            </Pressable>
          )}
        </View>

        {/* Unified List Container */}
        <View style={styles.logListCard}>
          {visibleLogs.map((item, index) => {
            const emotionInfo = item.emotion ? EMOTION_MAP[item.emotion] : null;

            return (
              <View
                key={item.id}
                style={[
                  styles.logRow,
                  index > 0 && styles.logRowBorder,
                ]}>
                <View style={styles.logMain}>
                  <Text style={styles.logTitle}>{item.title}</Text>
                  <View style={styles.logMetaRow}>
                    <Text style={styles.logDate}>{item.date}</Text>
                    {item.note ? (
                      <>
                        <Text style={styles.logMetaDot}>•</Text>
                        <Text style={styles.logNote} numberOfLines={1}>
                          {item.note}
                        </Text>
                      </>
                    ) : null}
                  </View>
                </View>

                <View style={styles.logRight}>
                  {item.savedVnd > 0 ? (
                    <Text style={styles.logSaved}>
                      +{item.savedVnd.toLocaleString('vi-VN')} đ
                    </Text>
                  ) : (
                    <Text style={styles.logSavedZero}>0 đ</Text>
                  )}

                  {emotionInfo && (
                    <View style={styles.emotionPill}>
                      <Text style={styles.emotionEmoji}>{emotionInfo.emoji}</Text>
                      <Text style={styles.emotionText}>{emotionInfo.label}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* S2: Create / Configure Sheet */}
      <CreateExperimentSheet
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onStart={startExperiment}
      />

      {/* S3: Detail & Ending View */}
      <ExperimentDetailModal
        visible={isDetailOpen}
        experiment={activeExperiment}
        onClose={() => setIsDetailOpen(false)}
        onEnd={endExperiment}
      />

      {/* Full History Sheet */}
      <ExperimentHistorySheet
        visible={isHistoryOpen}
        logs={experimentLogs}
        onClose={() => setIsHistoryOpen(false)}
      />
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
    fontSize: 26,
    color: WattPrintTokens.colors.primary, // #164437
  },
  lede: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  pastHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 2,
  },
  pastEyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  seeAllBtn: {
    paddingVertical: 2,
  },
  seeAllText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  logListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  logRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E7EBE1',
  },
  logMain: {
    flex: 1,
    gap: 4,
  },
  logTitle: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    lineHeight: 20,
    color: WattPrintTokens.colors.primary, // #164437
  },
  logMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logDate: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  logMetaDot: {
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  logNote: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
    flex: 1,
  },
  logRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  logSaved: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 14,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  logSavedZero: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    color: WattPrintTokens.colors.secondary,
  },
  emotionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: WattPrintTokens.radii.pill,
  },
  emotionEmoji: {
    fontSize: 12,
  },
  emotionText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: WattPrintTokens.colors.primary,
  },
});
