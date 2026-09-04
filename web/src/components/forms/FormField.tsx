import React from 'react';
import { Colors } from '../../constants/theme';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  accentColor?: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'number' | 'password';
  multiline?: boolean;
  rows?: number;
  hint?: string;
  helperAction?: {
    label: string;
    onAction: () => void;
  };
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  accentColor = Colors.accent,
  type = 'text',
  multiline = false,
  rows = 3,
  hint,
  helperAction,
}) => {
  return (
    <div className="form-field-group">
      <div className="form-field-header">
        <label className="form-field-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
        {helperAction && (
          <button
            type="button"
            className="form-helper-btn"
            style={{ color: accentColor }}
            onClick={helperAction.onAction}
          >
            {helperAction.label}
          </button>
        )}
      </div>

      {multiline ? (
        <textarea
          rows={rows}
          className="form-input form-textarea"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          style={{ '--focus-color': accentColor } as React.CSSProperties}
        />
      ) : (
        <input
          type={type}
          className="form-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          style={{ '--focus-color': accentColor } as React.CSSProperties}
        />
      )}

      {hint && <span className="form-field-hint">{hint}</span>}
    </div>
  );
};
