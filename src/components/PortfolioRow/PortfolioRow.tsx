import { PortfolioPosition } from "../../types/portfolio";

import { View, Text } from "react-native";
import {
  formatCurrencyARS,
  formatPct,
  getPctColor,
} from "../../utils/utils";
import { calcGain, calcMarketValue, calcPerformancePct } from "../../utils/calculations";

const PortfolioRow = ({ position }: { position: PortfolioPosition }) => {
  const marketValue = calcMarketValue(
    position.quantity,
    position.last_price
  );
  const gain = calcGain(
    position.quantity,
    position.last_price,
    position.avg_cost_price
  );
  const performancePct = calcPerformancePct(
    position.quantity,
    position.last_price,
    position.avg_cost_price
  );

  return (
    <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '900', fontSize: 16 }}>
            {position.ticker}
          </Text>
          <Text style={{ opacity: 0.7 }}>
            Cantidad: {position.quantity}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontWeight: '800' }}>
            {formatCurrencyARS(marketValue)}
          </Text>
          <Text style={{ opacity: 0.85, color: getPctColor(performancePct) }}>
            {formatCurrencyARS(gain)} · {formatPct(performancePct)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PortfolioRow;