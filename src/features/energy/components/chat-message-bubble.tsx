import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import type { ChatMessage } from '@/features/energy/types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onCtaPress?: (cta: string) => void;
}

export function ChatMessageBubble({ message, onCtaPress }: ChatMessageBubbleProps) {
  const isAi = message.who === 'ai';

  if (!isAi) {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiBlock}>
      {/* Editorial Block Header */}
      <View style={styles.aiHeader}>
        <View style={styles.aiBadge}>
          <View style={styles.aiDot} />
          <Text style={styles.aiBadgeText}>TRỢ LÝ AI</Text>
        </View>
        <Text style={styles.aiMetaText}>ĐÃ ĐỒNG BỘ CÔNG TƠ</Text>
      </View>

      {/* Grounded Body Text */}
      <Text style={styles.aiText}>{message.text}</Text>

      {/* Integrated Provenance Facts Grid */}
      {message.facts && message.facts.length > 0 && (
        <View style={styles.factsGrid}>
          {message.facts.map((fact, idx) => (
            <View key={idx} style={styles.factCol}>
              <Text style={styles.factKey} numberOfLines={1}>
                {fact.k}
              </Text>
              <Text style={styles.factVal}>
                {fact.v}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Action CTA Button */}
      {message.cta && (
        <Pressable
          onPress={() => onCtaPress?.(message.cta!)}
          style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>{message.cta} →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  userBubble: {
    maxWidth: '85%',
    backgroundColor: WattPrintTokens.colors.primary, // #164437
    borderRadius: WattPrintTokens.radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  userText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  aiBlock: {
    width: '100%',
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
    borderRadius: WattPrintTokens.radii.lg,
    padding: 16,
    gap: 12,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  aiBadgeText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  aiMetaText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 0.5,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  aiText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    color: WattPrintTokens.colors.primary, // #164437
  },
  factsGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  factCol: {
    flex: 1,
    gap: 3,
  },
  factKey: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 0.4,
    color: WattPrintTokens.colors.secondary, // #4A6B60
    textTransform: 'uppercase',
  },
  factVal: {
    fontFamily: Fonts.monoMedium,
    fontSize: 13,
    color: WattPrintTokens.colors.primary, // #164437
  },
  ctaBtn: {
    backgroundColor: WattPrintTokens.colors.tertiary, // #B5E930
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  ctaBtnText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
  },
});
