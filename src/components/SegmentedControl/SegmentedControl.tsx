import React from 'react';
import { Pressable, Text, View } from 'react-native';

export type SegmentedControlOption<T extends string> = {
  label: string;
  value: T;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: ReadonlyArray<SegmentedControlOption<T>>;
  onChange: (next: T) => void;
};

const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        padding: 4,
        borderRadius: 12,
        backgroundColor: '#f2f2f2',
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: active ? 'white' : 'transparent',
              borderWidth: active ? 1 : 0,
              borderColor: active ? '#e6e6e6' : 'transparent',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontWeight: active ? '800' : '700',
                opacity: active ? 1 : 0.7,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SegmentedControl;