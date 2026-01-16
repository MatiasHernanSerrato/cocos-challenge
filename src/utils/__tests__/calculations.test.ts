import {
  calcGain,
  calcMarketValue,
  calcPerformancePct,
  calcReturnPct,
  consolidatePortfolio,
} from '../calculations';

describe('calculations', () => {
  test('calcReturnPct returns 0 when close is 0', () => {
    expect(calcReturnPct(100, 0)).toBe(0);
  });

  test('calcReturnPct calculates percent change', () => {
    expect(calcReturnPct(110, 100)).toBeCloseTo(10);
  });

  test('calcMarketValue multiplies quantity and last price', () => {
    expect(calcMarketValue(5, 12.5)).toBe(62.5);
  });

  test('calcGain computes gain based on avg cost', () => {
    expect(calcGain(10, 120, 100)).toBe(200);
  });

  test('calcPerformancePct returns 0 when cost basis is 0', () => {
    expect(calcPerformancePct(0, 120, 0)).toBe(0);
  });

  test('calcPerformancePct uses gain over cost basis', () => {
    expect(calcPerformancePct(10, 120, 100)).toBeCloseTo(20);
  });

  test('consolidatePortfolio aggregates lots and averages cost', () => {
    const lots = [
      {
        instrument_id: 1,
        ticker: 'AAA',
        quantity: 10,
        last_price: 120,
        close_price: 110,
        avg_cost_price: 100,
      },
      {
        instrument_id: 1,
        ticker: 'AAA',
        quantity: 5,
        last_price: 120,
        close_price: 110,
        avg_cost_price: 120,
      },
      {
        instrument_id: 2,
        ticker: 'BBB',
        quantity: 3,
        last_price: 50,
        close_price: 49,
        avg_cost_price: 40,
      },
    ];

    const result = consolidatePortfolio(lots);

    expect(result).toHaveLength(2);

    const first = result.find((position) => position.instrument_id === 1);
    expect(first).toBeDefined();
    if (!first) {
      throw new Error('Expected instrument 1 in consolidated result');
    }
    expect(first.quantity).toBe(15);
    expect(first.avg_cost_price).toBeCloseTo((10 * 100 + 5 * 120) / 15);

    const second = result.find((position) => position.instrument_id === 2);
    expect(second).toBeDefined();
    if (!second) {
      throw new Error('Expected instrument 2 in consolidated result');
    }
    expect(second.quantity).toBe(3);
    expect(second.avg_cost_price).toBe(40);
  });
});
