import axios from 'axios';

export const API_BASE_URL = 'https://dummy-api-topaz.vercel.app';

export type ApiError = {
  status?: number;
  kind: 'NETWORK' | 'TIMEOUT' | 'HTTP' | 'UNKNOWN';
  message: string;
  data?: unknown;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const apiErrorHandler = (err: unknown): ApiError => {
  const anyErr = err as any;

  if (anyErr?.code === 'ECONNABORTED') {
    return { kind: 'TIMEOUT', message: 'Tiempo de espera agotado.' };
  }

  if (anyErr?.message === 'Network Error') {
    return { kind: 'NETWORK', message: 'Sin conexión. Revisá tu internet.' };
  }

  const status = anyErr?.response?.status;
  if (typeof status === 'number') {
    return {
      kind: 'HTTP',
      status,
      message: anyErr?.response?.data?.message ?? 'Error del servidor.',
    };
  }

  return { kind: 'UNKNOWN', message: 'Ocurrió un error inesperado.' };
};

export default {
  api,
};
