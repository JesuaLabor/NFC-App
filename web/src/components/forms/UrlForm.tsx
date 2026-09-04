import React from 'react';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface UrlFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export const UrlForm: React.FC<UrlFormProps> = ({ value, onChange }) => {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });

  const QUICK_URLS = ['https://', 'https://instagram.com/', 'https://linkedin.com/in/', 'https://github.com/'];

  return (
    <div className="record-form">
      <FormField
        label="Website or Link URL"
        required
        type="url"
        accentColor={Colors.url}
        placeholder="https://mywebsite.com"
        value={value.url ?? ''}
        onChangeText={update('url')}
        hint="Must include https:// or http://"
      />

      <div className="quick-fill-row">
        <span className="quick-fill-label">Presets:</span>
        <div className="quick-fill-tags">
          {QUICK_URLS.map((prefix) => (
            <button
              key={prefix}
              type="button"
              className="quick-fill-tag"
              onClick={() => {
                if (!value.url || value.url === 'https://') {
                  onChange({ ...value, url: prefix });
                }
              }}
            >
              {prefix.replace('https://', '').replace('/', '') || 'https://'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
