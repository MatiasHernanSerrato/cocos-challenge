import { api, apiErrorHandler } from './client';
import type {
  CreateOrderBody,
  CreateOrderResponse,
} from '../types/orders';

export const createOrder = async (
  body: CreateOrderBody
): Promise<CreateOrderResponse> => {
  try {
    console.log('Creating order with body:', body);
    const { data } = await api.post<CreateOrderResponse>('/orders', body);
    return data;
  } catch (err) {
    throw apiErrorHandler(err);
  }
};
