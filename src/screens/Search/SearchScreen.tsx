import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { searchInstruments } from '../../api/search';
import type { ApiError } from '../../api/client';
import InstrumentRow from '../../components/InstrumentRow';
import OrderModal from '../../components/OrderModal';

import type { Instrument } from '../../types/instruments';

const useDebouncedValue = <T,>(value: T, delayMs: number) => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
};

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Instrument | null>(null);

  const debouncedQuery = useDebouncedValue(query.trim(), 350);

  const enabled = debouncedQuery.length >= 1;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<
    Instrument[],
    ApiError
  >({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchInstruments(debouncedQuery),
    enabled,
  });

  const results = useMemo(() => data ?? [], [data]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: '800', fontSize: 18 }}>Nueva búsqueda</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por ticker (ej: DYCA)"
          autoCapitalize="characters"
          autoCorrect={false}
          style={{
            marginTop: 12,
            padding: 12,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
          }}
        />

        {enabled && isFetching ? (
          <Text style={{ marginTop: 8, opacity: 0.6 }}>Buscando…</Text>
        ) : null}
      </View>

      {!enabled ? (
        <Text style={{ paddingHorizontal: 16, opacity: 0.7 }}>
          Escribí un ticker para buscar.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : isError ? (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ marginBottom: 8 }}>
            {error?.message ?? 'No se pudo realizar la búsqueda.'}
          </Text>
          <Text onPress={() => refetch()} style={{ fontWeight: '800' }}>
            Reintentar
          </Text>
        </View>
      ) : results.length === 0 ? (
        <Text style={{ paddingHorizontal: 16, opacity: 0.7 }}>Sin resultados.</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <InstrumentRow onPress={() => setSelected(item)} item={item} />
          )}
        />
      )}

      <OrderModal instrument={selected} onClose={() => setSelected(null)} />
    </View>
  );
};

export default SearchScreen;
