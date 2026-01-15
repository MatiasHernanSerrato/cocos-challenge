import { api } from './client';
import type { Instrument } from '../types/instruments';

export const searchInstruments = async (
  query: string
): Promise<Instrument[]> => {
  const { data } = await api.get<Instrument[]>('/search', {
    params: { query },
  });
  return data;
};