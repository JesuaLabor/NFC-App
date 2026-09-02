import React from 'react';
import { View } from 'react-native';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface LocationFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function LocationForm({ value, onChange }: LocationFormProps) {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });

  return (
    <View>
      <FormField
        label="Latitude"
        required
        accentColor={Colors.location}
        placeholder="37.7749"
        value={value.latitude ?? ''}
        onChangeText={update('latitude')}
        keyboardType="numbers-and-punctuation"
        hint="Decimal degrees (e.g. 37.7749)"
      />
      <FormField
        label="Longitude"
        required
        accentColor={Colors.location}
        placeholder="-122.4194"
        value={value.longitude ?? ''}
        onChangeText={update('longitude')}
        keyboardType="numbers-and-punctuation"
        hint="Decimal degrees (e.g. -122.4194)"
      />
      <FormField
        label="Location Label"
        accentColor={Colors.location}
        placeholder="Golden Gate Bridge"
        value={value.label ?? ''}
        onChangeText={update('label')}
        hint="Optional label shown in Maps"
      />
    </View>
  );
}
