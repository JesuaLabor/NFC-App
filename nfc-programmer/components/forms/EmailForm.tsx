import React from 'react';
import { View } from 'react-native';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface EmailFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function EmailForm({ value, onChange }: EmailFormProps) {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });

  return (
    <View>
      <FormField
        label="Email Address"
        required
        accentColor={Colors.email}
        placeholder="recipient@example.com"
        value={value.to ?? ''}
        onChangeText={update('to')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormField
        label="Subject"
        accentColor={Colors.email}
        placeholder="Hello from NFC!"
        value={value.subject ?? ''}
        onChangeText={update('subject')}
      />
      <FormField
        label="Body"
        accentColor={Colors.email}
        placeholder="Message body (optional)..."
        value={value.body ?? ''}
        onChangeText={update('body')}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={{ minHeight: 100, paddingTop: 12 }}
      />
    </View>
  );
}
