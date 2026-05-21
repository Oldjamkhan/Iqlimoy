import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIBubble } from '@/components/AIBubble';
import { AI_RESPONSES } from '@/constants/demoData';
import { ChatMessage, useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const QUICK_ACTIONS = [
  { label: 'Current AQI', key: 'aqi' },
  { label: 'Best outdoor time', key: 'outdoor' },
  { label: 'Magnetic storm', key: 'magnetic' },
  { label: 'Dust storm update', key: 'dust' },
  { label: 'Health advisory', key: 'health' },
  { label: 'Aral Sea crisis', key: 'aral' },
];

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('salom')) return AI_RESPONSES.greeting;
  if (lower.includes('aqi') || lower.includes('air quality') || lower.includes('pm2') || lower.includes('pm 2')) return AI_RESPONSES.aqi;
  if (lower.includes('outdoor') || lower.includes('exercise') || lower.includes('walk') || lower.includes('run')) return AI_RESPONSES.outdoor;
  if (lower.includes('magnetic') || lower.includes('geomagnetic') || lower.includes('storm') && lower.includes('magnet')) return AI_RESPONSES.magnetic;
  if (lower.includes('dust') || lower.includes('sand') || lower.includes('wind')) return AI_RESPONSES.dust;
  if (lower.includes('forecast') || lower.includes('week') || lower.includes('tomorrow')) return AI_RESPONSES.forecast;
  if (lower.includes('b2b') || lower.includes('api') || lower.includes('business') || lower.includes('enterprise')) return AI_RESPONSES.b2b;
  if (lower.includes('construct') || lower.includes('build') || lower.includes('crane') || lower.includes('work')) return AI_RESPONSES.construction;
  if (lower.includes('health') || lower.includes('sick') || lower.includes('asthma') || lower.includes('lungs')) return AI_RESPONSES.health;
  if (lower.includes('aral') || lower.includes('sea') || lower.includes('toxic') || lower.includes('karakalpak')) return AI_RESPONSES.aral;
  return AI_RESPONSES.default;
}

export default function AssistantScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const { chatMessages, addMessage, clearChat } = useApp();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const welcomeMessage: ChatMessage = {
    id: 'welcome',
    text: AI_RESPONSES.default,
    isUser: false,
    timestamp: new Date(Date.now() - 60000),
  };

  const allMessages = chatMessages.length === 0 ? [welcomeMessage] : [welcomeMessage, ...chatMessages];

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: ChatMessage = {
      id: generateId(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setInputText('');
    setIsTyping(true);

    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: generateId(),
        text: getAIResponse(text),
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(aiMsg);
      setIsTyping(false);
    }, delay);
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '50' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>Z</Text>
            <View style={[styles.onlineDot, { backgroundColor: colors.good }]} />
          </View>
          <View>
            <Text style={[styles.botName, { color: colors.foreground }]}>ZARA</Text>
            <Text style={[styles.botDesc, { color: colors.good }]}>
              {isTyping ? 'Analyzing satellite data...' : 'AI Environmental Assistant'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => { clearChat(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
          style={[styles.clearBtn, { backgroundColor: colors.secondary }]}
        >
          <Feather name="refresh-ccw" size={14} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {chatMessages.length === 0 && (
        <View style={styles.quickActions}>
          <Text style={[styles.quickLabel, { color: colors.mutedForeground }]}>Quick questions</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((qa) => (
              <TouchableOpacity
                key={qa.key}
                style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => sendMessage(qa.label)}
              >
                <Text style={[styles.quickText, { color: colors.foreground }]}>{qa.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={allMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AIBubble message={item} />}
        contentContainerStyle={[styles.messages, { paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingRow}>
              <View style={[styles.typingAvatar, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.typingAvatarText, { color: colors.primary }]}>Z</Text>
              </View>
              <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.typingDots}>
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={[styles.dot, { backgroundColor: colors.primary }]} />
                  ))}
                </View>
              </View>
            </View>
          ) : null
        }
      />

      <View style={[styles.inputBar, { borderTopColor: colors.border, backgroundColor: colors.background, paddingBottom: Math.max(bottomPad, 12) }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          placeholder="Ask about air quality, UV, dust storms..."
          placeholderTextColor={colors.mutedForeground}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => sendMessage(inputText)}
          returnKeyType="send"
          multiline={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: inputText.trim() ? colors.primary : colors.secondary }]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isTyping}
        >
          <Feather name="send" size={16} color={inputText.trim() ? colors.background : colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0A0F1E',
  },
  botName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  botDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  clearBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    padding: 16,
    gap: 10,
  },
  quickLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  messages: {
    padding: 16,
    gap: 14,
  },
  typingRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  typingAvatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  typingBubble: {
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    opacity: 0.7,
  },
  inputBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
