import type { OrderSide, OrderType } from './orders';

export type OrderHistoryItem = {
  id: string;
  createdAt: string;
  instrumentId: number;
  ticker: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  status: 'FILLED' | 'PENDING' | 'REJECTED';
  remoteId?: string | number;
};
