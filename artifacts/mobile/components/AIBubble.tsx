import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ChatMessage } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

interface AIBubbleProps {
  message: ChatMessage;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AIBubble({ message }: AIBubbleProps) {
  const colors = useColors();

  if (message.isUser) {
    return (
      <View style={styles.userRow}>
        <View style={[styles.userBubble, { backgroundColor: colors.primary }]}>
          <Text style={[styles.userText, { color: colors.background }]}>{message.text}</Text>
        </View>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>{formatTime(message.timestamp)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.botRow}>
      <View style={[styles.botAvatar, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
        <Text style={[styles.avatarText, { color: colors.primary }]}>I</Text>
      </View>
      <View style={styles.botContent}>
        <Text style={[styles.botName, { color: colors.primary }]}>IQLIMOY AI</Text>
        <View style={[styles.botBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.botText, { color: colors.foreground }]}>{message.text}</Text>
        </View>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>{formatTime(message.timestamp)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: {
    alignItems: 'flex-end',
    gap: 4,
    paddingLeft: 40,
  },
  userBubble: {
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  userText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  botRow: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 40,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginTop: 18,
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  botContent: {
    flex: 1,
    gap: 3,
  },
  botName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  botBubble: {
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  botText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  time: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
});
