export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT';

type BaseOrderBody = {
  instrument_id: number;
  side: OrderSide;
  quantity: number;
};

export type MarketOrderBody = BaseOrderBody & {
  type: 'MARKET';
};

export type LimitOrderBody = BaseOrderBody & {
  type: 'LIMIT';
  price: number;
};

export type CreateOrderBody = MarketOrderBody | LimitOrderBody;

export type OrderStatus = 'PENDING' | 'REJECTED' | 'FILLED';

export type CreateOrderResponse = {
  id: number | string;
  status: OrderStatus;
};