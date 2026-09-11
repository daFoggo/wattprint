import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DataRamp, Fonts, WattPrintTokens } from '@/constants/theme';
import type { BubbleDevice, UnitMode } from '@/features/energy/types';

interface BreakdownTableProps {
  devices: BubbleDevice[];
  selectedIndex: number;
  unitMode: UnitMode;
  onSelect: (index: number) => void;
  onDevicePress?: (device: BubbleDevice) => void;
}

export function BreakdownTable({
  devices,
  selectedIndex,
  unitMode,
  onSelect,
  onDevicePress,
}: BreakdownTableProps) {
  return (
    <View style={styles.table}>
      {devices.map((device, index) => {
        const isSelected = selectedIndex === index;
        const color = DataRamp[index % DataRamp.length].bg;
        const displayValue =
          unitMode === 'cost'
            ? `${device.cost.toLocaleString('en-US')} VND`
            : `${device.kwh.toFixed(1)} kWh`;

        return (
          <Pressable
            key={device.id}
            onPress={() => {
              onSelect(index);
              onDevicePress?.(device);
            }}
            style={[
              styles.row,
              isSelected && styles.rowSelected,
            ]}>
            <View style={[styles.colorChip, { backgroundColor: color }]} />
            <Text style={styles.name}>{device.name}</Text>
            <Text style={styles.value}>{displayValue}</Text>
            <Text style={styles.pct}>{device.pct}%</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    width: '100%',
    gap: 2,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: WattPrintTokens.radii.md, // 14px
    backgroundColor: 'transparent',
  },
  rowSelected: {
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6 (once per depth inside white card)
  },
  colorChip: {
    width: 11,
    height: 11,
    borderRadius: WattPrintTokens.radii.xs, // 4px
  },
  name: {
    flex: 1,
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
  },
  value: {
    fontFamily: Fonts.monoMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
  },
  pct: {
    fontFamily: Fonts.monoMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.secondary, // #4A6B60
    width: 40,
    textAlign: 'right',
  },
});
