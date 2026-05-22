import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthProfile, useApp } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

interface ConditionOption {
  id: string;
  icon: string;
  label: string;
  desc: string;
  color: string;
  aqiThreshold: number;
}

const CONDITIONS: ConditionOption[] = [
  { id: 'asthma', icon: 'wind', label: 'Astma / Bronxit', desc: 'Nafas yo\'llari kasalligi', color: '#3B82F6', aqiThreshold: 50 },
  { id: 'heart', icon: 'heart', label: 'Yurak kasalligi', desc: 'Yurak-qon tomir muammolari', color: '#EF4444', aqiThreshold: 50 },
  { id: 'hypertension', icon: 'activity', label: 'Qon bosimi yuqori', desc: 'Gipertoniya', color: '#F97316', aqiThreshold: 75 },
  { id: 'pregnant', icon: 'user', label: 'Homilador', desc: 'Homiladorlik davri', color: '#EC4899', aqiThreshold: 50 },
  { id: 'children', icon: 'users', label: 'Kichik bolalar', desc: '6 yoshgacha bolalar', color: '#22D3A5', aqiThreshold: 75 },
  { id: 'elderly', icon: 'user', label: 'Keksa odam', desc: '65 yosh va undan katta', color: '#A855F7', aqiThreshold: 75 },
  { id: 'allergy', icon: 'alert-circle', label: 'Allergiya', desc: 'Chang, gul changi, changga allergiya', color: '#F59E0B', aqiThreshold: 75 },
  { id: 'eyes', icon: 'eye', label: 'Ko\'z kasalligi', desc: 'Ko\'z muammolari yoki kontakt linza', color: '#6366F1', aqiThreshold: 100 },
  { id: 'diabetes', icon: 'thermometer', label: 'Diabet', desc: 'Qandli diabet', color: '#14B8A6', aqiThreshold: 100 },
  { id: 'skin', icon: 'sun', label: 'Teri kasalligi', desc: 'UV nurlanishga sezgirlik', color: '#F59E0B', aqiThreshold: 3 },
];

const AGE_GROUPS = [
  { id: 'child', label: '0–12 yosh' },
  { id: 'teen', label: '13–17 yosh' },
  { id: 'adult', label: '18–44 yosh' },
  { id: 'middle', label: '45–64 yosh' },
  { id: 'senior', label: '65+ yosh' },
];

export default function HealthProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? Math.max(insets.top, 67) : insets.top;
  const { healthProfile, setHealthProfile } = useApp();

  const [selected, setSelected] = useState<string[]>(healthProfile.conditions);
  const [name, setName] = useState(healthProfile.name);
  const [ageGroup, setAgeGroup] = useState(healthProfile.ageGroup);

  function toggleCondition(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleSave() {
    const profile: HealthProfile = { conditions: selected, name, ageGroup };
    setHealthProfile(profile);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  const hasChanges =
    JSON.stringify(selected.sort()) !== JSON.stringify([...healthProfile.conditions].sort()) ||
    name !== healthProfile.name ||
    ageGroup !== healthProfile.ageGroup;

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Sog'liq Profili</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Iqlimoy AI shaxsiy maslahat beradi</Text>
        </View>
        {hasChanges && (
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={[styles.saveBtnText, { color: colors.background }]}>Saqlash</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={[styles.infoBanner, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '25' }]}>
          <Feather name="cpu" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Sog'liq ma'lumotlaringizni kiritganingizdan so'ng, Iqlimoy AI havo sifati va UV darajasiga ko'ra sizga maxsus moslashtirilgan maslahat beradi.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ISMINGIZ (IXTIYORIY)</Text>
        <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="user" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Ismingizni kiriting..."
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>YOSH GURUHINGIZ</Text>
        <View style={styles.ageRow}>
          {AGE_GROUPS.map((ag) => (
            <TouchableOpacity
              key={ag.id}
              style={[
                styles.ageBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
                ageGroup === ag.id && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
              ]}
              onPress={() => { setAgeGroup(ag.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Text style={[
                styles.ageBtnText,
                { color: ageGroup === ag.id ? colors.primary : colors.mutedForeground },
              ]}>
                {ag.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>SALOMAT HOLATLAR</Text>
        <Text style={[styles.sectionDesc, { color: colors.mutedForeground }]}>
          Tegishli bo'lganlarini tanlang — AI shunga ko'ra maslahat beradi
        </Text>

        <View style={styles.conditionGrid}>
          {CONDITIONS.map((c) => {
            const isSelected = selected.includes(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.conditionCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  isSelected && { backgroundColor: c.color + '15', borderColor: c.color + '60' },
                ]}
                onPress={() => toggleCondition(c.id)}
                activeOpacity={0.75}
              >
                <View style={[styles.condIcon, { backgroundColor: isSelected ? c.color + '25' : colors.secondary }]}>
                  <Feather name={c.icon as any} size={18} color={isSelected ? c.color : colors.mutedForeground} />
                </View>
                <View style={styles.condText}>
                  <Text style={[styles.condLabel, { color: isSelected ? colors.foreground : colors.foreground }]}>
                    {c.label}
                  </Text>
                  <Text style={[styles.condDesc, { color: colors.mutedForeground }]}>{c.desc}</Text>
                </View>
                <View style={[
                  styles.checkCircle,
                  { borderColor: isSelected ? c.color : colors.border },
                  isSelected && { backgroundColor: c.color },
                ]}>
                  {isSelected && <Feather name="check" size={10} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {selected.length > 0 && (
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.summaryHeader}>
              <Feather name="shield" size={16} color={colors.primary} />
              <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Sizning profilingiz</Text>
            </View>
            <Text style={[styles.summaryText, { color: colors.mutedForeground }]}>
              {selected.length} ta holat tanlangan.{' '}
              {name ? `${name}, ` : ''}Iqlimoy AI{' '}
              {selected.includes('asthma') || selected.includes('heart') ? 'AQI 50 dan oshganda' :
               selected.includes('children') || selected.includes('pregnant') ? 'AQI 75 dan oshganda' : 'AQI 100 dan oshganda'}{' '}
              sizga ogohlantirish yuboradi.
            </Text>
            <TouchableOpacity
              style={[styles.chatBtn, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}
              onPress={() => {
                handleSave();
                setTimeout(() => router.push('/(tabs)/assistant' as any), 300);
              }}
            >
              <Feather name="cpu" size={14} color={colors.primary} />
              <Text style={[styles.chatBtnText, { color: colors.primary }]}>Iqlimoy AI ga so'rang</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.mainSaveBtn,
            { backgroundColor: hasChanges ? colors.primary : colors.card, borderColor: colors.border },
          ]}
          onPress={handleSave}
        >
          <Feather name="check" size={18} color={hasChanges ? colors.background : colors.mutedForeground} />
          <Text style={[styles.mainSaveBtnText, { color: hasChanges ? colors.background : colors.mutedForeground }]}>
            Profilni Saqlash
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  content: { padding: 16, gap: 12 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, flex: 1 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.2, marginTop: 4 },
  sectionDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: -6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15 },
  ageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ageBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  ageBtnText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  conditionGrid: { gap: 8 },
  conditionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  condIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  condText: { flex: 1 },
  condLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  condDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  summaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    marginTop: 4,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  summaryText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'center',
  },
  chatBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  mainSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
    marginTop: 8,
  },
  mainSaveBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
});
