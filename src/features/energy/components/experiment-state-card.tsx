import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import { EXP_KEPT, EXP_LOG, EXP_SAVED } from '@/features/energy/mock';
import type { ExperimentState } from '@/features/energy/types';

interface ExperimentStateCardProps {
  state: ExperimentState;
  temp: number;
  onMinusTemp: () => void;
  onPlusTemp: () => void;
  onAction: () => void;
}

export function ExperimentStateCard({
  state,
  temp,
  onMinusTemp,
  onPlusTemp,
  onAction,
}: ExperimentStateCardProps) {
  const isRunning = state === 'running';
  const isSummary = state === 'summary';
  const isSuggest = state === 'suggest';
  const isLocked = state === 'locked';

  let tag = '';
  let title = '';
  let note = '';
  let btnLabel = '';
  let leftLabel = '';
  let leftVal = '';
  let leftUnit = '';
  let rightLabel = '';
  let rightVal = '';
  let rightUnit = '';

  if (isRunning) {
    tag = 'RUNNING, DAY 3 OF 7';
    title = 'Living room air con at 27 with a fan, instead of 24';
    note = 'Down 38%, about 85,000 VND a week. Four days left before the comfort check.';
    btnLabel = 'Finish the experiment';
    leftLabel = 'BASELINE';
    leftVal = '8.2';
    leftUnit = 'kWh/day';
    rightLabel = 'NOW';
    rightVal = '5.1';
    rightUnit = 'kWh/day';
  } else if (isSummary) {
    tag = 'NOTHING RUNNING';
    title = `${EXP_KEPT} of ${EXP_LOG.length} experiments kept so far`;
    note = 'Air con is still the largest single load. A second pass on the water heater window is the next best target.';
    btnLabel = 'Start a new experiment';
    leftLabel = 'SAVED TO DATE';
    leftVal = `${Math.round(EXP_SAVED / 1000)}k`;
    leftUnit = 'VND';
    rightLabel = 'HABITS KEPT';
    rightVal = String(EXP_KEPT);
    rightUnit = `of ${EXP_LOG.length}`;
  } else if (isSuggest) {
    tag = 'SUGGESTED FOR YOU';
    title = `Hold the living room air con at ${temp.toFixed(1)} with a fan`;
    note = 'Three days, then one question about how it felt. Adjust the target before you start.';
    btnLabel = 'Start the 3 day experiment';
    leftLabel = 'BASELINE';
    leftVal = '8.2';
    leftUnit = 'kWh/day';
    rightLabel = 'ESTIMATED';
    rightVal = '5.4';
    rightUnit = 'kWh/day';
  } else {
    tag = 'LOCKED';
    title = 'Still learning your baseline';
    note = 'Experiments compare against your own history, so the meter needs 4 more days of clean readings. Nothing to do until then.';
    btnLabel = 'Available in 4 days';
  }

  return (
    <View style={[styles.card, isRunning && styles.cardRunning]}>
      {/* Tag */}
      <Text style={[styles.tag, isRunning && styles.tagRunning]}>{tag}</Text>

      {/* Title */}
      <Text style={[styles.title, isRunning && styles.titleRunning]}>{title}</Text>

      {/* Comparison Grid (if not locked) */}
      {!isLocked && (
        <View style={styles.compareGrid}>
          {/* Left Box */}
          <View style={[styles.statBox, isRunning && styles.statBoxDark]}>
            <Text style={[styles.boxLabel, isRunning && styles.boxLabelDark]}>
              {leftLabel}
            </Text>
            <View style={styles.valRow}>
              <Text style={[styles.boxVal, isRunning && styles.boxValDark]}>
                {leftVal}
              </Text>
              <Text style={[styles.boxUnit, isRunning && styles.boxUnitDark]}>
                {leftUnit}
              </Text>
            </View>
          </View>

          {/* Right Box */}
          <View style={[styles.statBox, isRunning && styles.statBoxDark]}>
            <Text style={[styles.boxLabel, isRunning && styles.boxLabelDark]}>
              {rightLabel}
            </Text>
            <View style={styles.valRow}>
              <Text
                style={[
                  styles.boxVal,
                  styles.boxValAccent,
                  isRunning && styles.boxValAccentDark,
                ]}>
                {rightVal}
              </Text>
              <Text style={[styles.boxUnit, isRunning && styles.boxUnitDark]}>
                {rightUnit}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Temperature Stepper (only in suggested mode) */}
      {isSuggest && (
        <View style={styles.stepperContainer}>
          <Text style={styles.stepperLabel}>Target temperature</Text>
          <View style={styles.stepperControls}>
            <Pressable onPress={onMinusTemp} style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>-</Text>
            </Pressable>
            <Text style={styles.stepVal}>{temp.toFixed(1)} °C</Text>
            <Pressable onPress={onPlusTemp} style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Note */}
      <Text style={[styles.note, isRunning && styles.noteRunning]}>{note}</Text>

      {/* CTA Button */}
      <Pressable
        onPress={isLocked ? undefined : onAction}
        style={[
          styles.actionBtn,
          isRunning && styles.actionBtnRunning,
          isLocked && styles.actionBtnLocked,
        ]}>
        <Text
          style={[
            styles.actionBtnText,
            isRunning && styles.actionBtnTextRunning,
            isLocked && styles.actionBtnTextLocked,
          ]}>
          {btnLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.xl, // 20px
    paddingVertical: 20,
    paddingHorizontal: 22,
    gap: 14,
  },
  cardRunning: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
  },
  tag: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  tagRunning: {
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  title: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 19,
    lineHeight: 25,
    color: WattPrintTokens.colors.primary, // #164437
  },
  titleRunning: {
    color: '#FFFFFF',
  },
  compareGrid: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.lg, // 16px
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  statBoxDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  boxLabel: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  boxLabelDark: {
    color: WattPrintTokens.colors.inkInverseMuted, // #BBD2C9
  },
  valRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  boxVal: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 26,
    color: WattPrintTokens.colors.primary,
  },
  boxValDark: {
    color: '#FFFFFF',
  },
  boxValAccent: {
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  boxValAccentDark: {
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  boxUnit: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    color: WattPrintTokens.colors.secondary,
  },
  boxUnitDark: {
    color: WattPrintTokens.colors.inkInverseMuted,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.lg, // 16px
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  stepperLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
    color: WattPrintTokens.colors.primary,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: WattPrintTokens.radii.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 18,
    color: WattPrintTokens.colors.primary,
  },
  stepVal: {
    fontFamily: Fonts.monoMedium,
    fontSize: 16,
    color: WattPrintTokens.colors.primary,
    minWidth: 60,
    textAlign: 'center',
  },
  note: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: WattPrintTokens.colors.secondary,
  },
  noteRunning: {
    color: WattPrintTokens.colors.inkInverseBody, // #DCEBD3
  },
  actionBtn: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 4,
  },
  actionBtnRunning: {
    backgroundColor: WattPrintTokens.colors.tertiary, // #B5E930
  },
  actionBtnLocked: {
    backgroundColor: WattPrintTokens.colors.primaryContainer,
  },
  actionBtnText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 14,
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  actionBtnTextRunning: {
    color: WattPrintTokens.colors.primary, // #164437
  },
  actionBtnTextLocked: {
    color: WattPrintTokens.colors.secondary,
  },
});
