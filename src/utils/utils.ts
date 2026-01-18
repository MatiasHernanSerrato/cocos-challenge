export const formatCurrencyARS = (value: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPct = (value: number): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const getPctColor = (value: number) => {
  if (value > 0) return '#0a9d58';
  if (value < 0) return '#d32f2f';
  return '#6b7280';
};
