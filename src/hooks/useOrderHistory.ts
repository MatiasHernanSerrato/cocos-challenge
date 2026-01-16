import { useCallback, useEffect, useState } from 'react';
import type { OrderHistoryItem } from '../types/ordersHistory';

import { addOrderHistoryItem, getOrdersHistory, clearOrdersHistory } from '../storage/ordersHistory';

const localErrorHandler = (err: unknown, fallback: string) => {
  if (err instanceof Error) return err.message || fallback;

  if (typeof err === 'string') return err;

  try {
    const maybeMessage = (err as { message?: unknown })?.message;
    if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) {
      return maybeMessage;
    }
  } catch {
    console.error('Error parsing error message', err);
  }

  return fallback;
};

export const useOrdersHistory = () => {
  const [items, setItems] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrdersHistory();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(localErrorHandler(err, 'No se pudo cargar el historial.'));
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (item: OrderHistoryItem) => {
    try {
      const next = await addOrderHistoryItem(item);
      setItems(next);
      setError(null);
    } catch (err) {
      setError(localErrorHandler(err, 'No se pudo guardar la orden en el historial.'));
    }
  }, []);

  const clear = useCallback(async () => {
    try {
      await clearOrdersHistory();
      setItems([]);
      setError(null);
    } catch (err) {
      setError(localErrorHandler(err, 'No se pudo limpiar el historial.'));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, refresh, add, clear };
};
