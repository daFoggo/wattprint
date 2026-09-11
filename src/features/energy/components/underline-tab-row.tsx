import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';

export interface UnderlineTabItem {
  key: string;
  label: string;
}

interface UnderlineTabRowProps {
  tabs: UnderlineTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function UnderlineTabRow({ tabs, activeKey, onChange }: UnderlineTabRowProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            hitSlop={8}
            style={styles.tabButton}>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            <View
              style={[
                styles.indicator,
                isActive && styles.indicatorActive,
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  tabLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.72, // 0.06em
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  tabLabelActive: {
    color: WattPrintTokens.colors.primary, // #164437
  },
  indicator: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
});
