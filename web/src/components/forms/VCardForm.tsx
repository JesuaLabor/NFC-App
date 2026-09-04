import React from 'react';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface VCardFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export const VCardForm: React.FC<VCardFormProps> = ({ value, onChange }) => {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });

  return (
    <div className="record-form">
      <div className="form-grid-2">
        <FormField
          label="First Name"
          required
          accentColor={Colors.vcard}
          placeholder="e.g. Alex"
          value={value.firstName ?? ''}
          onChangeText={update('firstName')}
        />
        <FormField
          label="Last Name"
          accentColor={Colors.vcard}
          placeholder="e.g. Morgan"
          value={value.lastName ?? ''}
          onChangeText={update('lastName')}
        />
      </div>

      <div className="form-grid-2">
        <FormField
          label="Phone Number"
          type="tel"
          accentColor={Colors.vcard}
          placeholder="+1 555-0199"
          value={value.phone ?? ''}
          onChangeText={update('phone')}
        />
        <FormField
          label="Email Address"
          type="email"
          accentColor={Colors.vcard}
          placeholder="alex@company.com"
          value={value.email ?? ''}
          onChangeText={update('email')}
        />
      </div>

      <div className="form-grid-2">
        <FormField
          label="Company / Org"
          accentColor={Colors.vcard}
          placeholder="Tech Innovations Inc."
          value={value.organization ?? ''}
          onChangeText={update('organization')}
        />
        <FormField
          label="Job Title"
          accentColor={Colors.vcard}
          placeholder="Lead Developer"
          value={value.title ?? ''}
          onChangeText={update('title')}
        />
      </div>

      <FormField
        label="Website / Portfolio"
        type="url"
        accentColor={Colors.vcard}
        placeholder="https://alexmorgan.dev"
        value={value.website ?? ''}
        onChangeText={update('website')}
      />

      <FormField
        label="Address"
        accentColor={Colors.vcard}
        placeholder="San Francisco, CA"
        value={value.address ?? ''}
        onChangeText={update('address')}
      />
    </div>
  );
};
