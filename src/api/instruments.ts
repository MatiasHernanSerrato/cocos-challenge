import { api, apiErrorHandler } from './client';
import type { Instrument } from '../types/instruments';

export const getInstruments = async (): Promise<Instrument[]> => {
  try {
    const { data } = await api.get<Instrument[]>('/instruments');
    return data;
  } catch (err) {
    throw apiErrorHandler(err);
  }
};