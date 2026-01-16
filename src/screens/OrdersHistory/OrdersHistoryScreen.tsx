import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import StatusChip from '../../components/StatusChip';
import { formatCurrencyARS } from '../../utils/utils';
import { useOrdersHistory } from '../../hooks/useOrderHistory';

const OrdersHistoryScreen = () => {
  const { items, loading, error, clear, refresh } = useOrdersHistory();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const runRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh, isRefreshing]);

  const onRefresh = runRefresh;

  useFocusEffect(
    useCallback(() => {
      runRefresh();
    }, [runRefresh])
  );

  if (loading && items.length === 0) {
    return <ActivityIndicator style={{ marginTop: 24 }} />;
  }

  if (error && items.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ marginBottom: 12 }}>{error}</Text>
        <Text onPress={() => refresh()} style={{ fontWeight: '800' }}>
          Reintentar
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderColor: '#eee',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '900' }}>
          Historial de órdenes
        </Text>

        {items.length > 0 ? (
          <Pressable onPress={clear}>
            <Text style={{ fontWeight: '800', opacity: 0.7 }}>
              Limpiar
            </Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text style={{ paddingHorizontal: 16, paddingTop: 12, color: '#b00020' }}>
          {error}
        </Text>
      ) : null}

      {items.length === 0 ? (
        <Text style={{ padding: 16, opacity: 0.7 }}>
          Todavía no hay órdenes.
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => (
            <View style={{ height: 12 }} />
          )}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: '#fafafa',
                  borderWidth: 1,
                  borderColor: '#eee',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontWeight: '900' }}>
                    {item.ticker}
                  </Text>

                  <StatusChip status={item.status} />
                </View>

                <Text style={{ marginTop: 6, opacity: 0.8 }}>
                  {item.side} · {item.type}
                </Text>

                <Text style={{ marginTop: 4, opacity: 0.8 }}>
                  Cantidad: {item.quantity}
                </Text>

                {item.price != null ? (
                  <Text style={{ marginTop: 4, opacity: 0.8 }}>
                    Precio límite: {formatCurrencyARS(item.price)}
                  </Text>
                ) : null}

                <Text style={{ marginTop: 6, opacity: 0.6, fontSize: 12 }}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default OrdersHistoryScreen;
