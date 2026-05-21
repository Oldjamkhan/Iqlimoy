import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { CITIES, CityData } from '@/constants/demoData';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AppContextValue {
  selectedCity: CityData;
  setSelectedCityById: (id: string) => void;
  chatMessages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  activeAlertCount: number;
  isDemoMode: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedCityId, setSelectedCityId] = useState<string>('toshkent');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('selectedCityId').then((id) => {
      if (id && CITIES.find((c) => c.id === id)) {
        setSelectedCityId(id);
      }
    });
  }, []);

  const setSelectedCityById = useCallback((id: string) => {
    setSelectedCityId(id);
    AsyncStorage.setItem('selectedCityId', id);
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
