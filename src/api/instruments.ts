import { api } from './client';
import type { Instrument } from '../types/instruments';

export const getInstruments = async (): Promise<Instrument[]> => {
  const { data } = await api.get<Instrument[]>('/instruments');
  return data;
};