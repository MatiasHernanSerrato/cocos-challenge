export type InstrumentType = 'ACCIONES';

export type Instrument = {
  id: number;
  ticker: string;
  name: string;
  type: InstrumentType;
  last_price: number;
  close_price: number;
};