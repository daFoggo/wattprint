import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomSheet, Host } from '@expo/ui';
import { useRouter } from 'expo-router';

import { DataRamp, Fonts, WattPrintTokens } from '@/constants/theme';
import type { BubbleDevice } from '@/features/energy/types';

interface DeviceQuickSheetProps {
  device: BubbleDevice | null;
  color?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeviceQuickSheet({ device, color, isOpen, onClose }: DeviceQuickSheetProps) {
  const router = useRouter();

  if (!device) return null;

  const handleOpenFullDetail = () => {
    onClose();
    router.push('/device-detail');
  };

  const dotColor = color || DataRamp[0].bg;

  return (
    <Host>
      <BottomSheet
        isPresented={isOpen}
        onDismiss={onClose}
        snapPoints={['half']}
        showDragIndicator>
        <View style={styles.sheetContent}>
          {/* Header with Color Chip */}
          <View style={styles.headerRow}>
            <View style={[styles.colorDot, { backgroundColor: dotColor }]} />
            <Text style={styles.deviceName}>{device.name}</Text>
            <View style={styles.shareBadge}>
              <Text style={styles.shareBadgeText}>{device.pct}% share</Text>
            </View>
          </View>

          {/* Quick Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>CONSUMPTION</Text>
              <Text style={styles.metricValue}>
                {device.kwh} <Text style={styles.metricUnit}>kWh</Text>
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>EST. COST</Text>
              <Text style={styles.metricValue}>
                {Math.round(device.kwh * 2500).toLocaleString('vi-VN')}{' '}
                <Text style={styles.metricUnit}>VND</Text>
              </Text>
            </View>
          </View>

          {/* Action Button to Full Screen */}
          <Pressable style={styles.fullDetailBtn} onPress={handleOpenFullDetail}>
            <Text style={styles.fullDetailText}>Open Device Analytics</Text>
            <Text style={styles.fullDetailArrow}>›</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </Host>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  deviceName: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 20,
    color: WattPrintTokens.colors.primary,
    flex: 1,
  },
  shareBadge: {
    backgroundColor: WattPrintTokens.colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: WattPrintTokens.radii.pill,
  },
  shareBadgeText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.accentDeep,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: WattPrintTokens.colors.neutralGround,
    borderRadius: WattPrintTokens.radii.md,
    padding: 14,
    gap: 4,
  },
  metricLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    letterSpacing: 0.8,
    color: WattPrintTokens.colors.secondary,
  },
  metricValue: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 18,
    color: WattPrintTokens.colors.primary,
  },
  metricUnit: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary,
  },
  fullDetailBtn: {
    backgroundColor: WattPrintTokens.colors.primary,
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  fullDetailText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 15,
    color: WattPrintTokens.colors.tertiary,
  },
  fullDetailArrow: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 20,
    color: WattPrintTokens.colors.tertiary,
  },
});
