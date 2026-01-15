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


type PortfolioLot = {
  instrument_id: number;
  ticker: string;
  quantity: number;
  last_price: number;
  close_price?: number;
  avg_cost_price: number;
};

type ConsolidatedLot = PortfolioLot & {
  totalCost: number;
};

export const consolidatePortfolio = (lots:PortfolioLot[]) => {
  const result:Record<number, ConsolidatedLot> = {};

  for (const lot of lots) {
    if (!result[lot.instrument_id]) {
      result[lot.instrument_id] = {
        ...lot,
        totalCost: lot.quantity * lot.avg_cost_price,
      };
    } else {
      result[lot.instrument_id].quantity += lot.quantity;
      result[lot.instrument_id].totalCost +=
        lot.quantity * lot.avg_cost_price;
    }
  }

  return Object.values(result).map((position) => ({
    ...position,
    avg_cost_price: position.totalCost / position.quantity,
  }));
};