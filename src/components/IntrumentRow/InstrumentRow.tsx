import { Pressable, Text, View } from 'react-native';
import { calcReturnPct, formatCurrencyARS, formatPct } from '../../utils/utils';
import { Instrument } from '../../types/instruments';

type InstrumentRowProps = {
  item: Instrument;
  onPress: () => void;
};

export const InstrumentRow = ({
  item,
  onPress,
}: InstrumentRowProps) =>  {
  const ret = calcReturnPct(item.last_price, item.close_price);
  const retLabel = formatPct(ret);

  return (
    <Pressable onPress={onPress} style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '800', fontSize: 16 }}>{item.ticker}</Text>
          <Text numberOfLines={1} style={{ opacity: 0.7 }}>{item.name}</Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontWeight: '700' }}>{formatCurrencyARS(item.last_price)}</Text>
          <Text style={{ opacity: 0.9 }}>{retLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default InstrumentRow;