import React from "react";
import { TextInput, View, Text } from "react-native";
const LabeledInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  hasError,
  onFocus,
}: {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
  hasError: boolean;
  onFocus?: () => void;
}) => {
  return (
    <View>
      <Text style={{ fontWeight: '800', marginBottom: 8 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        keyboardType={keyboardType}
        placeholder={placeholder}
        enablesReturnKeyAutomatically
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 12,
          borderColor: hasError ? '#B00020' : '#ddd',
          backgroundColor: hasError ? '#FDECEC' : 'white',
        }}
      />
    </View>
  );
};

export default LabeledInput;