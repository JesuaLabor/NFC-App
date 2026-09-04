import React from 'react';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';
import { ShieldCheck, Lock, Unlock } from 'lucide-react';

interface WiFiFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const SECURITY_OPTIONS = [
  { label: 'WPA / WPA2', value: 'WPA', icon: ShieldCheck },
  { label: 'WEP', value: 'WEP', icon: Lock },
  { label: 'Open (None)', value: 'nopass', icon: Unlock },
];

export const WiFiForm: React.FC<WiFiFormProps> = ({ value, onChange }) => {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });
  const security = value.security ?? 'WPA';

  return (
    <div className="record-form">
      <FormField
        label="Network Name (SSID)"
        required
        accentColor={Colors.wifi}
        placeholder="My_Office_WiFi"
        value={value.ssid ?? ''}
        onChangeText={update('ssid')}
      />

      <div className="form-field-group">
        <label className="form-field-label">Security Protocol</label>
        <div className="security-selector-row">
          {SECURITY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = security === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`security-pill-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onChange({ ...value, security: opt.value })}
                style={{
                  borderColor: isSelected ? Colors.wifi : undefined,
                  backgroundColor: isSelected ? 'rgba(52, 211, 153, 0.15)' : undefined,
                  color: isSelected ? Colors.wifi : undefined,
                }}
              >
                <Icon size={14} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {security !== 'nopass' && (
        <FormField
          label="Network Password"
          required
          type="password"
          accentColor={Colors.wifi}
          placeholder="••••••••••••"
          value={value.password ?? ''}
          onChangeText={update('password')}
        />
      )}

      <div className="info-banner" style={{ borderColor: `${Colors.wifi}30` }}>
        <span>📱 Android devices will instantly connect upon tap. iOS devices will prompt to join network.</span>
      </div>
    </div>
  );
};
