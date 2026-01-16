import { api, apiErrorHandler } from './client';
import type { Instrument } from '../types/instruments';

export const searchInstruments = async (
  query: string
): Promise<Instrument[]> => {
  try {
    const { data } = await api.get<Instrument[]>('/search', {
      params: { query },
    });
    return data;
  } catch (err) {
    throw apiErrorHandler(err);
  }
};