import React from 'react';
import { View } from 'react-native';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface VCardFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function VCardForm({ value, onChange }: VCardFormProps) {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });

  return (
    <View>
      <FormField
        label="First Name"
        required
        accentColor={Colors.vcard}
        placeholder="John"
        value={value.firstName ?? ''}
        onChangeText={update('firstName')}
      />
      <FormField
        label="Last Name"
        accentColor={Colors.vcard}
        placeholder="Doe"
        value={value.lastName ?? ''}
        onChangeText={update('lastName')}
      />
      <FormField
        label="Phone Number"
        accentColor={Colors.vcard}
        placeholder="+1 555 000 0000"
        value={value.phone ?? ''}
        onChangeText={update('phone')}
        keyboardType="phone-pad"
      />
      <FormField
        label="Email Address"
        accentColor={Colors.vcard}
        placeholder="john@example.com"
        value={value.email ?? ''}
        onChangeText={update('email')}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField
        label="Organization"
        accentColor={Colors.vcard}
        placeholder="Acme Corp"
        value={value.organization ?? ''}
        onChangeText={update('organization')}
      />
      <FormField
        label="Job Title"
        accentColor={Colors.vcard}
        placeholder="Software Engineer"
        value={value.title ?? ''}
        onChangeText={update('title')}
      />
      <FormField
        label="Website"
        accentColor={Colors.vcard}
        placeholder="https://johndoe.com"
        value={value.website ?? ''}
        onChangeText={update('website')}
        keyboardType="url"
        autoCapitalize="none"
      />
      <FormField
        label="Address"
        accentColor={Colors.vcard}
        placeholder="123 Main St, City, State"
        value={value.address ?? ''}
        onChangeText={update('address')}
      />
    </View>
  );
}
