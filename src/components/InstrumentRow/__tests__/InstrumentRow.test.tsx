import React from 'react';
import '@testing-library/jest-native/extend-expect';
import { fireEvent, render } from '@testing-library/react-native';
import { InstrumentRow } from '../InstrumentRow';
import { calcReturnPct } from '../../../utils/calculations';
import { formatCurrencyARS, formatPct, getPctColor } from '../../../utils/utils';
import type { Instrument } from '../../../types/instruments';

describe('InstrumentRow', () => {
  const instrument: Instrument = {
    id: 1,
    ticker: 'ALUA',
    name: 'Aluar',
    type: 'ACCIONES',
    last_price: 110,
    close_price: 100,
  };

  it('renders ticker, name, price and return with correct color', () => {
    const onPress = jest.fn();

    const { getByText } = render(
      <InstrumentRow item={instrument} onPress={onPress} />
    );

    expect(getByText('ALUA')).toBeTruthy();
    expect(getByText('Aluar')).toBeTruthy();

    const priceLabel = formatCurrencyARS(instrument.last_price);
    expect(getByText(priceLabel)).toBeTruthy();

    const returnPct = calcReturnPct(
      instrument.last_price,
      instrument.close_price
    );
    const returnLabel = formatPct(returnPct);
    const returnText = getByText(returnLabel);
    expect(returnText).toHaveStyle({ color: getPctColor(returnPct) });
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();

    const { getByTestId } = render(
      <InstrumentRow item={instrument} onPress={onPress} />
    );

    fireEvent.press(getByTestId('instrument-row'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
