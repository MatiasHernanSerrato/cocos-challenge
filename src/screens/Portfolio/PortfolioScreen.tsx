import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { getPortfolio } from '../../api/portfolio';

import PortfolioRow from '../../components/PortfolioRow';

import { formatCurrencyARS, formatPct } from '../../utils/utils';
import { calcMarketValue, consolidatePortfolio } from '../../utils/calculations';

const PortfolioScreen = () => {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
  });


  const rawPositions = useMemo(() => data ?? [], [data]);
  const positions = useMemo(() => consolidatePortfolio(rawPositions), [rawPositions]);
console.log('RAW tickers:', rawPositions.map(post => post.ticker));
console.log('CONSOLIDATED tickers:', positions.map(post => post.ticker));
  const totals = useMemo(() => {
    const totalMarket = positions.reduce(
      (acc, position) => acc + calcMarketValue(position.quantity, position.last_price),
      0
    );

    const totalCost = positions.reduce(
      (acc, position) => acc + position.quantity * position.avg_cost_price,
      0
    );

    const totalGain = totalMarket - totalCost;
    const totalPerformancePct = totalCost
      ? (totalGain / totalCost) * 100
      : 0;

    return { totalMarket, totalGain, totalPerformancePct };
  }, [positions]);

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 24 }} />;
  }

  if (isError) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ marginBottom: 12 }}>
          Error cargando el portfolio.
        </Text>
        <Text onPress={() => refetch()} style={{ fontWeight: '800' }}>
          Reintentar
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
        <Text style={{ fontWeight: '900', fontSize: 18 }}>
          Portfolio
        </Text>
        <Text style={{ marginTop: 8, opacity: 0.8 }}>
          Valor: {formatCurrencyARS(totals.totalMarket)}
        </Text>
        <Text style={{ marginTop: 4, opacity: 0.8 }}>
          Ganancia: {formatCurrencyARS(totals.totalGain)} ·{' '}
          {formatPct(totals.totalPerformancePct)}
        </Text>

        {isFetching ? (
          <Text style={{ marginTop: 6, opacity: 0.6 }}>
            Actualizando…
          </Text>
        ) : null}
      </View>

      {positions.length === 0 ? (
        <Text style={{ padding: 16, opacity: 0.7 }}>
          No hay posiciones.
        </Text>
      ) : (
        <FlatList
          data={positions}
          keyExtractor={(item) => String(item.instrument_id)}
          renderItem={({ item }) => (
            <PortfolioRow position={item} />
          )}
        />
      )}
    </View>
  );
};

export default PortfolioScreen;