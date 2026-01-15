import axios, { AxiosError } from 'axios';

export const API_BASE_URL = 'https://dummy-api-topaz.vercel.app';

export type ApiError = {
  status: number;
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

export default {
    api,
}