import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import type { ExperimentLogItem } from '@/features/energy/types';

interface ExperimentHistorySheetProps {
  visible: boolean;
  logs: ExperimentLogItem[];
  onClose: () => void;
}

const EMOTION_MAP: Record<string, { emoji: string; label: string }> = {
  comfortable: { emoji: '😃', label: 'Thoải mái' },
  neutral: { emoji: '😐', label: 'Bình thường' },
  uncomfortable: { emoji: '😓', label: 'Bất tiện' },
};

export function ExperimentHistorySheet({
  visible,
  logs,
  onClose,
}: ExperimentHistorySheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.scrim} onPress={onClose} />

        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.eyebrow}>LỊCH SỬ THỬ NGHIỆM</Text>
              <Text style={styles.title}>Tất cả thử nghiệm ({logs.length})</Text>
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
            <View style={styles.listCard}>
              {logs.map((item, index) => {
                const emotionInfo = item.emotion ? EMOTION_MAP[item.emotion] : null;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.itemRow,
                      index > 0 && styles.itemRowBorder,
                    ]}>
                    <View style={styles.itemMain}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <View style={styles.itemMetaRow}>
                        <Text style={styles.itemDate}>{item.date}</Text>
                        {item.note ? (
                          <>
                            <Text style={styles.itemMetaDot}>•</Text>
                            <Text style={styles.itemNote} numberOfLines={1}>
                              {item.note}
                            </Text>
                          </>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.itemRight}>
                      {item.savedVnd > 0 ? (
                        <Text style={styles.itemSaved}>
                          +{item.savedVnd.toLocaleString('vi-VN')} đ
                        </Text>
                      ) : (
                        <Text style={styles.itemSavedZero}>0 đ</Text>
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
    maxHeight: '85%',
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
    paddingBottom: 14,
  },
  eyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  title: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 22,
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
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  itemRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E7EBE1',
  },
  itemMain: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
    lineHeight: 19,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemDate: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  itemMetaDot: {
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  itemNote: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
    flex: 1,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  itemSaved: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 14,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  itemSavedZero: {
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
