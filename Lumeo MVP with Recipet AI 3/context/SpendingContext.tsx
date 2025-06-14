import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Purchase } from '../types';

interface SpendingContextType {
  spending: Purchase[];
  setSpending: React.Dispatch<React.SetStateAction<Purchase[]>>;
  addPurchase: (purchase: Purchase) => void;
  deletePurchase: (id: string) => void;
  clearSpending: () => void;
  toggleLike: (id: string) => void;
}

const SpendingContext = createContext<SpendingContextType | undefined>(undefined);

const STORAGE_KEY = '@spending_data';

export function SpendingProvider({ children }: { children: React.ReactNode }) {
  const [spending, setSpending] = useState<Purchase[]>([]);

  // Load spending data from AsyncStorage when the app starts
  useEffect(() => {
    loadSpendingData();
  }, []);

  // Save spending data to AsyncStorage whenever it changes
  useEffect(() => {
    saveSpendingData();
  }, [spending]);

  const loadSpendingData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setSpending(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Error loading spending data:', error);
    }
  };

  const saveSpendingData = async () => {
    try {
      const jsonValue = JSON.stringify(spending);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving spending data:', error);
    }
  };

  const addPurchase = (purchase: Purchase) => {
    setSpending(prevSpending => [...prevSpending, purchase]);
  };

  const deletePurchase = (id: string) => {
    setSpending(prevSpending => prevSpending.filter(purchase => purchase.id !== id));
  };

  const clearSpending = () => {
    setSpending([]);
  };

  const toggleLike = (id: string) => {
    setSpending(prevSpending => 
      prevSpending.map(purchase => 
        purchase.id === id 
          ? { ...purchase, liked: !purchase.liked }
          : purchase
      )
    );
  };

  return (
    <SpendingContext.Provider value={{ 
      spending, 
      setSpending,
      addPurchase, 
      deletePurchase, 
      clearSpending,
      toggleLike 
    }}>
      {children}
    </SpendingContext.Provider>
  );
}

export function useSpending() {
  const context = useContext(SpendingContext);
  if (context === undefined) {
    throw new Error('useSpending must be used within a SpendingProvider');
  }
  return context;
} 