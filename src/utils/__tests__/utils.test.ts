import { formatCurrencyARS, formatPct } from '../utils';

describe('utils', () => {
  test('formatCurrencyARS uses es-AR currency formatting', () => {
    const value = 1234.5;
    const expected = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2,
    }).format(value);

    expect(formatCurrencyARS(value)).toBe(expected);
  });

  test('formatPct formats with two decimals', () => {
    expect(formatPct(1)).toBe('1.00%');
    expect(formatPct(1.235)).toBe('1.24%');
  });
});
