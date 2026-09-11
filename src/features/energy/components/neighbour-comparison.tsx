import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';

interface NeighbourComparisonProps {
  sentence: string;
  wattage?: number;
  footnote?: string;
}

export function NeighbourComparison({
  sentence,
  wattage = 960,
  footnote = 'Compared to 132 WattPrint homes in your district over the last 30 days.',
}: NeighbourComparisonProps) {
  const bands = [
    { label: 'under 1,000 W', active: true },
    { label: '1,000 to 1,660', active: false },
    { label: 'over 1,660', active: false },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>COMPARE</Text>
      <Text style={styles.sentence}>{sentence}</Text>

      <View style={styles.metricSection}>
        <View style={styles.heroRow}>
          <Text style={styles.value}>{wattage}</Text>
          <Text style={styles.unit}>W AVERAGE, YOU</Text>
        </View>

        {/* 3 Distribution Bands */}
        <View style={styles.bandsRow}>
          {bands.map((band, idx) => (
            <View
              key={idx}
              style={[
                styles.bandBar,
                {
                  backgroundColor: band.active
                    ? WattPrintTokens.colors.primary // #164437
                    : '#DDE3D6',
                },
              ]}
            />
          ))}
        </View>

        {/* Band Labels */}
        <View style={styles.bandLabelsRow}>
          {bands.map((band, idx) => (
            <Text
              key={idx}
              style={[
                styles.bandLabel,
                band.active && styles.bandLabelActive,
              ]}>
              {band.label}
            </Text>
          ))}
        </View>
      </View>

      <Text style={styles.footnote}>{footnote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.xl, // 20px
    paddingVertical: 20,
    paddingHorizontal: 22,
    gap: 14,
  },
  eyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 1.1, // 0.1em
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  sentence: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 18,
    lineHeight: 24.3,
    color: WattPrintTokens.colors.primary, // #164437
  },
  metricSection: {
    gap: 8,
    marginVertical: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  value: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 22,
    color: WattPrintTokens.colors.primary, // #164437
  },
  unit: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 0.66,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  bandsRow: {
    flexDirection: 'row',
    gap: 4,
    height: 14,
    width: '100%',
  },
  bandBar: {
    flex: 1,
    height: '100%',
    borderRadius: WattPrintTokens.radii.pill,
  },
  bandLabelsRow: {
    flexDirection: 'row',
    gap: 4,
    width: '100%',
  },
  bandLabel: {
    flex: 1,
    fontFamily: Fonts.monoMedium,
    fontSize: 10,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  bandLabelActive: {
    color: WattPrintTokens.colors.primary, // #164437
  },
  footnote: {
    fontFamily: Fonts.sans,
    fontSize: 12.5,
    lineHeight: 18.75,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
});
