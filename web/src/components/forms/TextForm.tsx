import React from 'react';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface TextFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export const TextForm: React.FC<TextFormProps> = ({ value, onChange }) => {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });

  return (
    <div className="record-form">
      <FormField
        label="Text Content / Payload"
        required
        multiline
        rows={4}
        accentColor={Colors.textRecord}
        placeholder="Enter custom text message, raw serial token, instructions, or notes..."
        value={value.text ?? ''}
        onChangeText={update('text')}
        hint={`${(value.text || '').length} characters`}
      />
    </div>
  );
};
