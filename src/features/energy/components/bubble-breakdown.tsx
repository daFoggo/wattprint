import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DataRamp, Fonts } from '@/constants/theme';
import { BUBBLE_SLOTS } from '@/features/energy/mock';
import type { BubbleDevice } from '@/features/energy/types';

interface BubbleBreakdownProps {
  devices: BubbleDevice[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export function BubbleBreakdown({
  devices,
  selectedIndex,
  onSelectIndex,
}: BubbleBreakdownProps) {
  return (
    <View style={styles.container}>
      {devices.map((device, index) => {
        const slot = BUBBLE_SLOTS[index] ?? { x: 50, y: 50 };
        const ramp = DataRamp[index % DataRamp.length];
        const isSelected = selectedIndex === index;
        const size = Math.round(40 + device.pct * 2.3);

        const labelFontSize = size > 120 ? 14 : size > 85 ? 12 : 10;
        const pctFontSize = size > 120 ? 20 : size > 85 ? 14 : 11;

        return (
          <Pressable
            key={device.id}
            onPress={() => onSelectIndex(index)}
            accessibilityRole="button"
            accessibilityLabel={`${device.name}, ${device.pct} percent`}
            style={[
              styles.bubble,
              {
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: ramp.bg,
                transform: [
                  { translateX: -size / 2 },
                  { translateY: -size / 2 },
                  { scale: isSelected ? 1.05 : 1 },
                ],
                opacity: isSelected ? 1 : 0.88,
              },
            ]}>
            <Text
              numberOfLines={2}
              style={[
                styles.label,
                {
                  fontSize: labelFontSize,
                  color: ramp.fg,
                },
              ]}>
              {device.name}
            </Text>
            <Text
              style={[
                styles.pct,
                {
                  fontSize: pctFontSize,
                  color: ramp.fg,
                },
              ]}>
              {device.pct}%
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 296,
    width: '100%',
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  bubble: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    // Zero border, zero shadow as required by WattPrint design system
  },
  label: {
    fontFamily: Fonts.sansMedium,
    textAlign: 'center',
    lineHeight: 14,
  },
  pct: {
    fontFamily: Fonts.monoSemiBold,
    textAlign: 'center',
    marginTop: 2,
  },
});
