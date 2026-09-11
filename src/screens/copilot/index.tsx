import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import { ChatMessageBubble } from '@/features/energy/components/chat-message-bubble';
import { MOCK_SUGGESTIONS } from '@/features/energy/mock';
import { useEnergyStore } from '@/features/energy/use-energy-store';

export function CopilotScreen() {
  const router = useRouter();
  const { chatMessages, sendChatMessage, setExperimentState } = useEnergyStore();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      sendChatMessage(inputText);
      setInputText('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSuggestionPress = (query: string) => {
    sendChatMessage(query);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleCtaPress = (cta: string) => {
    setExperimentState('suggest');
    router.push('/experiment');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}>
        {/* MSU Green Header */}
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>ENERGY COPILOT</Text>
          <Text style={styles.headerTitle}>Grounded in your meter</Text>
        </View>

        <View style={styles.contentWrap}>
          {/* White Conversation Area */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatScroll}
            showsVerticalScrollIndicator={false}>
            {chatMessages.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                onCtaPress={handleCtaPress}
              />
            ))}

            {/* Suggestion Chips */}
            <View style={styles.suggestionsWrap}>
              {MOCK_SUGGESTIONS.map((sg, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSuggestionPress(sg.q)}
                  style={styles.suggestionChip}>
                  <Text style={styles.suggestionLabel}>{sg.q}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Bottom Input Field */}
          <View style={styles.inputContainer}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about your usage"
              placeholderTextColor={WattPrintTokens.colors.secondary}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              style={styles.input}
            />
            <Pressable onPress={handleSend} style={styles.sendBtn}>
              <Text style={styles.sendBtnText}>→</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WattPrintTokens.colors.primary, // #164437
  },
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentWrap: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: WattPrintTokens.colors.primary, // #164437
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 4,
  },
  headerEyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 1.1,
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
  headerTitle: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 22,
    color: '#FFFFFF',
  },
  chatScroll: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 14,
  },
  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  suggestionChip: {
    backgroundColor: WattPrintTokens.colors.primaryContainer, // #EFF4E6
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  suggestionLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 12.5,
    color: '#2C5145',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: WattPrintTokens.radii.pill,
    backgroundColor: WattPrintTokens.colors.primary, // #164437
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    fontFamily: Fonts.monoMedium,
    fontSize: 18,
    color: WattPrintTokens.colors.tertiary, // #B5E930
  },
});
