export const formatCurrencyARS = (value: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPct = (value: number): string => {
  return `${value.toFixed(2)}%`;
};