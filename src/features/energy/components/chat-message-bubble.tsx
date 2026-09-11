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

  return (
    <View style={[styles.row, isAi ? styles.rowAi : styles.rowMe]}>
      <View style={[styles.bubble, isAi ? styles.bubbleAi : styles.bubbleMe]}>
        {/* Message Text */}
        <Text style={[styles.text, isAi ? styles.textAi : styles.textMe]}>
          {message.text}
        </Text>

        {/* Embedded Fact Rows */}
        {isAi && message.facts && message.facts.length > 0 && (
          <View style={styles.factsList}>
            {message.facts.map((fact, idx) => (
              <View key={idx} style={styles.factCard}>
                <Text style={styles.factKey}>{fact.k}</Text>
                <Text style={styles.factVal}>{fact.v}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Button */}
        {isAi && message.cta && (
          <Pressable
            onPress={() => onCtaPress?.(message.cta!)}
            style={styles.ctaBtn}>
            <Text style={styles.ctaBtnText}>{message.cta}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  rowAi: {
    justifyContent: 'flex-start',
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: 290,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 9,
  },
  bubbleAi: {
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 6,
  },
  bubbleMe: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
  textAi: {
    fontFamily: Fonts.sans,
    color: WattPrintTokens.colors.primary, // #164437
  },
  textMe: {
    fontFamily: Fonts.sans,
    color: '#FFFFFF',
  },
  factsList: {
    gap: 6,
    marginTop: 2,
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  factKey: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  factVal: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
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
    fontSize: 12.5,
    color: WattPrintTokens.colors.primary, // #164437
  },
});
