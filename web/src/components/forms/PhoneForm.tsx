import React from 'react';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface PhoneFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export const PhoneForm: React.FC<PhoneFormProps> = ({ value, onChange }) => {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });

  return (
    <div className="record-form">
      <FormField
        label="Phone Number"
        required
        type="tel"
        accentColor={Colors.phone}
        placeholder="+1 (555) 012-3456"
        value={value.phone ?? ''}
        onChangeText={update('phone')}
        hint="Tapping will open the device's default phone dialer."
      />
    </div>
  );
};
