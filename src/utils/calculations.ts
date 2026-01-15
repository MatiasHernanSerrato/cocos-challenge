export const calcReturnPct = (last: number, close: number): number => {
  if (!close) return 0;
  return ((last - close) / close) * 100;
};

export const calcMarketValue = (quantity: number, lastPrice: number) => {
  return quantity * lastPrice;
};

export const calcGain = (
  quantity: number,
  lastPrice: number,
  avgCost: number
) => {
  return quantity * (lastPrice - avgCost);
};

export const calcPerformancePct = (
  quantity: number,
  lastPrice: number,
  avgCost: number
) => {
  const costBasis = quantity * avgCost;
  if (!costBasis) return 0;

  const gain = calcGain(quantity, lastPrice, avgCost);
  return (gain / costBasis) * 100;
};