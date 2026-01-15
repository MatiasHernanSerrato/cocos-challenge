import { api } from './client';
import type { PortfolioPosition } from '../types/portfolio';

export const getPortfolio = async (): Promise<PortfolioPosition[]> => {
  const { data } = await api.get<PortfolioPosition[]>('/portfolio');
  return data;
};