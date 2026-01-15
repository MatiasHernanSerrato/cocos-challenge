import { api } from './client';
import type {
  CreateOrderBody,
  CreateOrderResponse,
} from '../types/orders';

export const createOrder = async (
  body: CreateOrderBody
): Promise<CreateOrderResponse> => {
  const { data } = await api.post<CreateOrderResponse>('/orders', body);
  return data;
};