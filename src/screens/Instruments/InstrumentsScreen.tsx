import { useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getInstruments } from '../../api/instruments';
import type { Instrument } from '../../types/instruments';
import OrderModal from '../../components/OrderModal';
import InstrumentRow from '../../components/IntrumentRow';

const InstrumentsScreen = () => {
  const [selected, setSelected] = useState<Instrument | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['instruments'],
    queryFn: getInstruments,
  });

  if (isLoading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  if (isError) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ marginBottom: 12 }}>Error cargando instrumentos.</Text>
        <Text onPress={() => refetch()} style={{ fontWeight: '700' }}>
          Reintentar
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isFetching ? <Text style={{ padding: 8, opacity: 0.6 }}>Actualizando…</Text> : null}

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <InstrumentRow item={item} onPress={() => setSelected(item)} />}
      />

      <OrderModal instrument={selected} onClose={() => setSelected(null)} />
    </View>
  );
};

export default InstrumentsScreen;