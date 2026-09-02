import React from 'react';
import { View } from 'react-native';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface UrlFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function UrlForm({ value, onChange }: UrlFormProps) {
  return (
    <View>
      <FormField
        label="Website URL"
        required
        accentColor={Colors.url}
        placeholder="https://example.com"
        value={value.url ?? ''}
        onChangeText={(t) => onChange({ ...value, url: t })}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        hint="Include https:// or it will be added automatically"
      />
    </View>
  );
}
