

import React from 'react';
import { Text, View } from 'react-native';

export type OrderStatus = 'FILLED' | 'PENDING' | 'REJECTED';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; border: string; text: string }
> = {
  FILLED: {
    label: 'Ejecutada',
    bg: '#E7F7ED',
    border: '#B7E3C6',
    text: '#1E7A3D',
  },
  PENDING: {
    label: 'Pendiente',
    bg: '#FFF6E5',
    border: '#F2D7A6',
    text: '#8A5A00',
  },
  REJECTED: {
    label: 'Rechazada',
    bg: '#FDECEC',
    border: '#F3B5B5',
    text: '#B00020',
  },
};

type StatusChipProps = {
  status: OrderStatus;
};

const StatusChip = ({ status }: StatusChipProps) => {
  const statusConfig = STATUS_CONFIG[status];

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: statusConfig.bg,
        borderWidth: 1,
        borderColor: statusConfig.border,
      }}
    >
      <Text style={{ fontWeight: '900', color: statusConfig.text }}>
        {statusConfig.label}
      </Text>
    </View>
  );
};

export default StatusChip;