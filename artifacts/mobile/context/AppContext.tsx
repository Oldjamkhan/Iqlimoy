import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { CITIES, CityData } from '@/constants/demoData';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface HealthProfile {
  conditions: string[];
  name: string;
  ageGroup: string;
}

export const DEFAULT_HEALTH_PROFILE: HealthProfile = {
  conditions: [],
  name: '',
  ageGroup: '',
};

interface AppContextValue {
  selectedCity: CityData;
  setSelectedCityById: (id: string) => void;
  chatMessages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  activeAlertCount: number;
  isDemoMode: boolean;
  healthProfile: HealthProfile;
  setHealthProfile: (profile: HealthProfile) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedCityId, setSelectedCityId] = useState<string>('toshkent');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [healthProfile, setHealthProfileState] = useState<HealthProfile>(DEFAULT_HEALTH_PROFILE);

  useEffect(() => {
    AsyncStorage.getItem('selectedCityId').then((id) => {
      if (id && CITIES.find((c) => c.id === id)) {
        setSelectedCityId(id);
      }
    });
    AsyncStorage.getItem('healthProfile').then((raw) => {
      if (raw) {
        try {
          setHealthProfileState(JSON.parse(raw) as HealthProfile);
        } catch {}
      }
    });
  }, []);

  const setSelectedCityById = useCallback((id: string) => {
    setSelectedCityId(id);
    AsyncStorage.setItem('selectedCityId', id);
  }, []);

  const setHealthProfile = useCallback((profile: HealthProfile) => {
    setHealthProfileState(profile);
    AsyncStorage.setItem('healthProfile', JSON.stringify(profile));
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  const selectedCity = CITIES.find((c) => c.id === selectedCityId) ?? CITIES[0];

  return (
    <AppContext.Provider
      value={{
        selectedCity,
        setSelectedCityById,
        chatMessages,
        addMessage,
        clearChat,
        activeAlertCount: 3,
        isDemoMode: true,
        healthProfile,
        setHealthProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
