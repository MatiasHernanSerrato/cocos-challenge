import AsyncStorage from '@react-native-async-storage/async-storage';
import type { OrderHistoryItem } from '../types/ordersHistory';

const KEY = 'orders_history_v1';

export const getOrdersHistory = async (): Promise<OrderHistoryItem[]> => {
  let raw: string | null = null;
  try {
    raw = await AsyncStorage.getItem(KEY);
  } catch {
    throw new Error('No se pudo leer el historial local.');
  }

  if (!raw) return [];
  try {
    return JSON.parse(raw) as OrderHistoryItem[];
  } catch {
    return [];
  }
};

export const addOrderHistoryItem = async (item: OrderHistoryItem) => {
  try {
    const current = await getOrdersHistory();
    const next = [item, ...current].slice(0, 100);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    throw new Error('No se pudo guardar la orden en el historial.');
  }
};

export const clearOrdersHistory = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    throw new Error('No se pudo limpiar el historial.');
  }
};
