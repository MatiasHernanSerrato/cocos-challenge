import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { createOrder } from '../../api/orders';

import StatusChip, { OrderStatus } from '../StatusChip';
import LabeledInput from '../LabeledInput';
import SegmentedControl from '../SegmentedControl';

import { formatCurrencyARS } from '../../utils/utils';

import type { Instrument } from '../../types/instruments';
import { CreateOrderBody, CreateOrderResponse, InputMode, OrderSide, OrderType } from '../../types/orders';
import { addOrderHistoryItem } from '../../storage/ordersHistory';

type OrderModalProps = {
  instrument: Instrument | null;
  onClose: () => void;
};

const ORDER_SIDE_BUY: OrderSide = 'BUY';
const ORDER_SIDE_SELL: OrderSide = 'SELL';

const ORDER_TYPE_MARKET: OrderType = 'MARKET';
const ORDER_TYPE_LIMIT: OrderType = 'LIMIT';

const INPUT_MODE_QUANTITY: InputMode = 'QUANTITY';
const INPUT_MODE_AMOUNT: InputMode = 'AMOUNT';

const AUTO_CLOSE_DELAY_MS = 1400;
const TERMINAL_STATUSES: OrderStatus[] = ['FILLED', 'REJECTED'];

const parseNumericInput = (raw: string) => {
  const cleaned = raw.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

const OrderModal = ({ instrument, onClose }: OrderModalProps) => {
  const [side, setSide] = useState<OrderSide>(ORDER_SIDE_BUY);
  const [type, setType] = useState<OrderType>(ORDER_TYPE_MARKET);
  const [mode, setMode] = useState<InputMode>(INPUT_MODE_QUANTITY);

  const [quantityText, setQuantityText] = useState('');
  const [amountText, setAmountText] = useState('');
  const [quantityTouched, setQuantityTouched] = useState(false);
  const [amountTouched, setAmountTouched] = useState(false);
  const [priceText, setPriceText] = useState('');
  const [priceTouched, setPriceTouched] = useState(false);

  const [submitted, setSubmitted] = useState<{ id: string | number; status: OrderStatus } | null>(null);

  useEffect(() => {
    if (!submitted) return;
    if (!TERMINAL_STATUSES.includes(submitted.status)) return;

    const timer = setTimeout(() => {
      onClose();
    }, AUTO_CLOSE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [submitted, onClose]);

  useEffect(() => {
    if (!instrument) return;
    setSide(ORDER_SIDE_BUY);
    setType(ORDER_TYPE_MARKET);
    setMode(INPUT_MODE_QUANTITY);
    setQuantityText('');
    setQuantityTouched(false);
    setAmountText('');
    setAmountTouched(false);
    setPriceText('');
    setPriceTouched(false);
    setSubmitted(null);
  }, [instrument?.id]);

  const lastPrice = instrument?.last_price ?? 0;

  const derivedQuantity = useMemo(() => {
    if (!instrument) return 0;

    if (mode === INPUT_MODE_QUANTITY) {
      const parsedQuantity = parseNumericInput(quantityText);
      if (parsedQuantity === null) return 0;
      return Math.floor(parsedQuantity);
    }

    const parsedAmount = parseNumericInput(amountText);
    if (parsedAmount === null) return 0;
    if (!lastPrice) return 0;
    return Math.floor(parsedAmount / lastPrice);
  }, [instrument, mode, quantityText, amountText, lastPrice]);

  const limitPrice = useMemo(() => {
    if (type !== ORDER_TYPE_LIMIT) return null;
    const parsedLimitPrice = parseNumericInput(priceText);
    return parsedLimitPrice && parsedLimitPrice > 0 ? parsedLimitPrice : null;
  }, [type, priceText]);

  const validationError = useMemo(() => {
    if (!instrument) return null;

    if (mode === INPUT_MODE_QUANTITY) {
      const parsedQuantity = parseNumericInput(quantityText);
      if (parsedQuantity === null) return 'Ingresá una cantidad.';
      if (Math.floor(parsedQuantity) < 1) return 'La cantidad debe ser al menos 1.';
      if (parsedQuantity !== Math.floor(parsedQuantity)) return 'No se admiten fracciones de acciones.';
    } else {
      const parsedAmount = parseNumericInput(amountText);
      if (parsedAmount === null) return 'Ingresá un monto en pesos.';
      if (parsedAmount <= 0) return 'El monto debe ser mayor a 0.';
      if (lastPrice > 0 && Math.floor(parsedAmount / lastPrice) < 1) {
        return 'El monto no alcanza para comprar 1 acción al precio actual.';
      }
    }

    if (type === ORDER_TYPE_LIMIT) {
      if (limitPrice === null) return 'Ingresá un precio límite válido.';
    }

    if (derivedQuantity < 1) return 'La orden requiere al menos 1 acción.';

    return null;
  }, [instrument, mode, quantityText, amountText, type, limitPrice, derivedQuantity, lastPrice]);

  const hasPriceError =
    priceTouched &&
    type === ORDER_TYPE_LIMIT &&
    validationError?.toLowerCase().includes('precio');

  const lowerValidationError = validationError?.toLowerCase() ?? '';

  const hasQuantityError =
    quantityTouched &&
    mode === INPUT_MODE_QUANTITY &&
    !!validationError &&
    (lowerValidationError.includes('cantidad') ||
      lowerValidationError.includes('acciones') ||
      lowerValidationError.includes('orden requiere'));

  const hasAmountError =
    amountTouched &&
    mode === INPUT_MODE_AMOUNT &&
    !!validationError &&
    (lowerValidationError.includes('monto') ||
      lowerValidationError.includes('pesos') ||
      lowerValidationError.includes('orden requiere'));

  const mutation = useMutation<CreateOrderResponse, Error, CreateOrderBody>({
    mutationFn: createOrder,
    onSuccess: async (data) => {
      setSubmitted({ id: data?.id, status: data?.status as OrderStatus });

      try {
        await addOrderHistoryItem({
          id: String(Date.now()),
          createdAt: new Date().toISOString(),
          instrumentId: instrument!.id,
          ticker: instrument!.ticker,
          side,
          type,
          quantity: derivedQuantity,
          price: type === 'LIMIT' ? limitPrice ?? undefined : undefined,
          status: data.status,
          remoteId: data.id,
        });
      } catch (err) {
        console.warn('No se pudo guardar el historial local.', err);
      }
    },
    onError: async () => {
      try {
        await addOrderHistoryItem({
          id: String(Date.now()),
          createdAt: new Date().toISOString(),
          instrumentId: instrument!.id,
          ticker: instrument!.ticker,
          side,
          type,
          quantity: derivedQuantity,
          price: type === 'LIMIT' ? limitPrice ?? undefined : undefined,
          status: 'REJECTED',
        });
      } catch (err) {
        console.warn('No se pudo guardar el historial local.', err);
      }
    },
  });

  const submit = () => {
    if (!instrument) return;
    if (validationError) return;

    if (type === ORDER_TYPE_LIMIT) {
      if (limitPrice === null) return;

      const limitOrderBody: CreateOrderBody = {
        instrument_id: instrument.id,
        side,
        type: ORDER_TYPE_LIMIT,
        quantity: derivedQuantity,
        price: limitPrice,
      };

      mutation.mutate(limitOrderBody);
      return;
    }

    const marketOrderBody: CreateOrderBody = {
      instrument_id: instrument.id,
      side,
      type: ORDER_TYPE_MARKET,
      quantity: derivedQuantity,
    };

    mutation.mutate(marketOrderBody);
  };

  const close = () => {
    if (mutation.isPending) return;
    onClose();
  };

  return (
    <Modal
      visible={!!instrument}
      animationType="slide"
      transparent
      onRequestClose={close}
    >
      <Pressable
        onPress={close}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}
      />

      <View
        style={{
          padding: 16,
          backgroundColor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <Text style={{ fontWeight: '900', fontSize: 18 }}>
          {instrument?.ticker} — {instrument?.name}
        </Text>
        <Text style={{ marginTop: 6, opacity: 0.7 }}>
          Último: {formatCurrencyARS(lastPrice)}
        </Text>

        <View style={{ marginTop: 14 }}>
          <Text style={{ fontWeight: '800', marginBottom: 8 }}>Side</Text>
          <SegmentedControl
            value={side}
            options={[
              { label: ORDER_SIDE_BUY, value: ORDER_SIDE_BUY },
              { label: ORDER_SIDE_SELL, value: ORDER_SIDE_SELL },
            ]}
            onChange={setSide}
          />
        </View>

        <View style={{ marginTop: 14 }}>
          <Text style={{ fontWeight: '800', marginBottom: 8 }}>Order Type</Text>
          <SegmentedControl
            value={type}
            options={[
              { label: ORDER_TYPE_MARKET, value: ORDER_TYPE_MARKET },
              { label: ORDER_TYPE_LIMIT, value: ORDER_TYPE_LIMIT },
            ]}
            onChange={setType}
          />
        </View>

        <View style={{ marginTop: 14 }}>
          <Text style={{ fontWeight: '800', marginBottom: 8 }}>Input Mode</Text>
          <SegmentedControl
            value={mode}
            options={[
              { label: 'Cantidad', value: INPUT_MODE_QUANTITY },
              { label: 'Monto (ARS)', value: INPUT_MODE_AMOUNT },
            ]}
            onChange={setMode}
          />
        </View>

        <View style={{ marginTop: 14 }}>
          {mode === INPUT_MODE_QUANTITY ? (
            <>
              <LabeledInput
                label="Cantidad"
                value={quantityText}
                onChangeText={setQuantityText}
                onFocus={() => setQuantityTouched(true)}
                keyboardType="number-pad"
                placeholder="Ej: 10"
                hasError={hasQuantityError}
              />
            </>
          ) : (
            <>
              <LabeledInput
                label="Monto (ARS)"
                value={amountText}
                onChangeText={setAmountText}
                onFocus={() => setAmountTouched(true)}
                keyboardType="decimal-pad"
                placeholder="Ej: 50000"
                hasError={hasAmountError}
              />
              <Text style={{ marginTop: 8, opacity: 0.7 }}>
                Cantidad estimada (sin fracciones): {derivedQuantity}
              </Text>
            </>
          )}
        </View>

        {type === ORDER_TYPE_LIMIT ? (
          <View style={{ marginTop: 14 }}>
            <LabeledInput
              label="Precio límite"
              value={priceText}
              onChangeText={setPriceText}
              onFocus={() => setPriceTouched(true)}
              keyboardType="decimal-pad"
              placeholder={`Ej: ${String(lastPrice)}`}
              hasError={Boolean(hasPriceError)}
            />
          </View>
        ) : null}

        {validationError ? (
          <Text style={{ marginTop: 12, color: '#b00020', fontWeight: '700' }}>
            {validationError}
          </Text>
        ) : null}

        {mutation.isError ? (
          <Text style={{ marginTop: 12, color: '#b00020', fontWeight: '700' }}>
            No se pudo enviar la orden. Probá de nuevo.
          </Text>
        ) : null}

        {submitted ? (
          <View
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#f7f7f7',
              borderWidth: 1,
              borderColor: '#eee',
            }}
          >
            <Text style={{ fontWeight: '900' }}>Order Result</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <Text style={{ fontWeight: '800' }}>Estado</Text>
              <StatusChip status={submitted.status} />
            </View>

            <Text style={{ marginTop: 8 }}>ID: {String(submitted.id)}</Text>

            <Text style={{ marginTop: 8, opacity: 0.8 }}>
              {submitted.status === 'FILLED'
                ? 'La orden fue ejecutada.'
                : submitted.status === 'PENDING'
                  ? 'La orden quedó pendiente (limit).'
                  : 'La orden fue rechazada por el mercado. Revisá el monto o la cantidad e intentá de nuevo.'}
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={submit}
          disabled={!!validationError || mutation.isPending || !instrument}
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 12,
            backgroundColor: !!validationError || mutation.isPending ? '#ddd' : '#111',
          }}
        >
          {mutation.isPending ? (
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
              <ActivityIndicator />
              <Text style={{ color: 'white', fontWeight: '900' }}>Enviando…</Text>
            </View>
          ) : (
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: '900' }}>
              Enviar orden
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={close}
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 12,
            backgroundColor: '#eee',
          }}
        >
          <Text style={{ textAlign: 'center', fontWeight: '800' }}>Cerrar</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default OrderModal;
