import React from 'react';
import { View } from 'react-native';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface PhoneFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function PhoneForm({ value, onChange }: PhoneFormProps) {
  return (
    <View>
      <FormField
        label="Phone Number"
        required
        accentColor={Colors.phone}
        placeholder="+1 555 000 0000"
        value={value.phone ?? ''}
        onChangeText={(t) => onChange({ ...value, phone: t })}
        keyboardType="phone-pad"
        hint="Include country code for international numbers (e.g. +1, +44)"
      />
    </View>
  );
}
