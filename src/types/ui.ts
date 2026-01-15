export type OrderFormMode = 'QUANTITY' | 'AMOUNT';

export type OrderFormValues = {
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity?: number;
  amount?: number;
  price?: number;
};