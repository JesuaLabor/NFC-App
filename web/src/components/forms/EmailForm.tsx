import React from 'react';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface EmailFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export const EmailForm: React.FC<EmailFormProps> = ({ value, onChange }) => {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });

  return (
    <div className="record-form">
      <FormField
        label="Recipient Email Address"
        required
        type="email"
        accentColor={Colors.email}
        placeholder="recipient@example.com"
        value={value.to ?? ''}
        onChangeText={update('to')}
      />

      <FormField
        label="Email Subject (Optional)"
        accentColor={Colors.email}
        placeholder="Inquiry regarding services"
        value={value.subject ?? ''}
        onChangeText={update('subject')}
      />

      <FormField
        label="Pre-filled Message Body (Optional)"
        multiline
        rows={3}
        accentColor={Colors.email}
        placeholder="Hello, I scanned your NFC tag..."
        value={value.body ?? ''}
        onChangeText={update('body')}
      />
    </div>
  );
};
