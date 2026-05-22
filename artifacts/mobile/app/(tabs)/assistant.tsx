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
import { ChatMessage, useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const CONDITION_LABELS: Record<string, string> = {
  asthma: 'Astma/Bronxit',
  heart: 'Yurak kasalligi',
  hypertension: 'Qon bosimi yuqori',
  pregnant: 'Homilador',
  children: 'Kichik bolalar',
  elderly: 'Keksa odam',
  allergy: 'Allergiya',
  eyes: "Ko'z kasalligi",
  diabetes: 'Diabet',
  skin: 'Teri kasalligi',
};

const QUICK_ACTIONS = [
  { label: 'Joriy AQI', key: 'aqi' },
  { label: 'Eng yaxshi vaqt', key: 'outdoor' },
  { label: 'Magnit bo\'roni', key: 'magnetic' },
  { label: 'Chang bo\'roni', key: 'dust' },
  { label: 'Sog\'liq maslahati', key: 'health' },
  { label: 'Orol dengizi', key: 'aral' },
];

const WELCOME_TEXT = "Assalomu alaykum! Men Iqlimoy AI — O'zbekiston sun'iy yo'ldosh ekologiya monitoring tizimining yordamchisiman. Havo sifati, UV nurlanish, chang bo'ronlari, geomagnetik faollik va iqlim xavflari haqida yordam bera olaman. Nima so'ramoqchisiz?";

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

const BASE_URL = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : '';

async function callGeminiAPI(
  history: { role: 'user' | 'model'; text: string }[],
  healthContext?: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history, healthContext }),
  });
  if (!res.ok) {
    throw new Error(`Server xatosi: ${res.status}`);
  }
  const data = await res.json() as { text?: string; error?: string };
  if (data.error) throw new Error(data.error);
  return data.text ?? '';
}

export default function AssistantScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const { chatMessages, addMessage, clearChat, healthProfile } = useApp();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const welcomeMessage: ChatMessage = {
    id: 'welcome',
    text: WELCOME_TEXT,
    isUser: false,
    timestamp: new Date(Date.now() - 60000),
  };

  const allMessages = chatMessages.length === 0
    ? [welcomeMessage]
    : [welcomeMessage, ...chatMessages];

  function buildHistory(userText: string): { role: 'user' | 'model'; text: string }[] {
    const history = chatMessages.map((m) => ({
      role: m.isUser ? ('user' as const) : ('model' as const),
      text: m.text,
    }));
    history.push({ role: 'user', text: userText });
    return history;
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError(null);

    const userMsg: ChatMessage = {
      id: generateId(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setInputText('');
    setIsTyping(true);

    try {
      const history = buildHistory(text.trim());
      const healthParts: string[] = [];
      if (healthProfile.name) healthParts.push(`Ism: ${healthProfile.name}`);
      if (healthProfile.ageGroup) {
        const ageLabels: Record<string, string> = { child: '0-12 yosh', teen: '13-17 yosh', adult: '18-44 yosh', middle: '45-64 yosh', senior: '65+ yosh' };
        healthParts.push(`Yosh guruhi: ${ageLabels[healthProfile.ageGroup] ?? healthProfile.ageGroup}`);
      }
      if (healthProfile.conditions.length > 0) {
        const labels = healthProfile.conditions.map((c) => CONDITION_LABELS[c] ?? c);
        healthParts.push(`Sog'liq holatlari: ${labels.join(', ')}`);
      }
      const healthContext = healthParts.length > 0 ? healthParts.join('\n') : undefined;
      const aiText = await callGeminiAPI(history, healthContext);
      const aiMsg: ChatMessage = {
        id: generateId(),
        text: aiText,
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(aiMsg);
    } catch (err: any) {
      setError("Javob olishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 0}
    >
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '50' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>I</Text>
            <View style={[styles.onlineDot, { backgroundColor: colors.good }]} />
          </View>
          <View>
            <Text style={[styles.botName, { color: colors.foreground }]}>Iqlimoy AI</Text>
            <Text style={[styles.botDesc, { color: isTyping ? colors.moderate : colors.good }]}>
              {isTyping ? 'Ma\'lumotlar tahlil qilinmoqda...' : 'Sun\'iy yo\'ldosh ekologiya yordamchisi'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => { clearChat(); setError(null); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
          style={[styles.clearBtn, { backgroundColor: colors.secondary }]}
        >
          <Feather name="refresh-ccw" size={14} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {chatMessages.length === 0 && (
        <View style={styles.quickActions}>
          <Text style={[styles.quickLabel, { color: colors.mutedForeground }]}>Tezkor savollar</Text>
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
                <Text style={[styles.typingAvatarText, { color: colors.primary }]}>I</Text>
              </View>
              <View style={[styles.typingBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.typingDots}>
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={[styles.dot, { backgroundColor: colors.primary }]} />
                  ))}
                </View>
              </View>
            </View>
          ) : error ? (
            <View style={[styles.errorBubble, { backgroundColor: colors.veryUnhealthy + '18', borderColor: colors.veryUnhealthy + '40' }]}>
              <Feather name="alert-circle" size={14} color={colors.veryUnhealthy} />
              <Text style={[styles.errorText, { color: colors.veryUnhealthy }]}>{error}</Text>
            </View>
          ) : null
        }
      />

      <View style={[styles.inputBar, { borderTopColor: colors.border, backgroundColor: colors.background, paddingBottom: Math.max(bottomPad, 12) }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          placeholder="Havo sifati, UV, chang bo'roni haqida so'rang..."
          placeholderTextColor={colors.mutedForeground}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => sendMessage(inputText)}
          returnKeyType="send"
          multiline={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: inputText.trim() && !isTyping ? colors.primary : colors.secondary }]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isTyping}
        >
          <Feather name="send" size={16} color={inputText.trim() && !isTyping ? colors.background : colors.mutedForeground} />
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
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
  botName: { fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: 1 },
  botDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 },
  clearBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: { padding: 16, gap: 10 },
  quickLabel: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  messages: { padding: 16, gap: 14 },
  typingRow: { flexDirection: 'row', gap: 10, paddingTop: 14 },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  typingAvatarText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  typingBubble: {
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingDots: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 3.5, opacity: 0.7 },
  errorBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 13, flex: 1 },
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
