import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FormField } from './FormField';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

interface WiFiFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const SECURITY_OPTIONS = [
  { label: 'WPA / WPA2', value: 'WPA' },
  { label: 'WEP', value: 'WEP' },
  { label: 'None (Open)', value: 'nopass' },
];

export function WiFiForm({ value, onChange }: WiFiFormProps) {
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });
  const security = value.security ?? 'WPA';

  return (
    <View>
      <FormField
        label="Network Name (SSID)"
        required
        accentColor={Colors.wifi}
        placeholder="My WiFi Network"
        value={value.ssid ?? ''}
        onChangeText={update('ssid')}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.securityLabel}>Security Type</Text>
      <View style={styles.securityRow}>
        {SECURITY_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.securityOption,
              security === opt.value && { borderColor: Colors.wifi, backgroundColor: `${Colors.wifi}15` },
            ]}
            onPress={() => onChange({ ...value, security: opt.value })}
          >
            <Text
              style={[
                styles.securityText,
                security === opt.value && { color: Colors.wifi, fontWeight: FontWeight.semibold },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {security !== 'nopass' && (
        <FormField
          label="Password"
          required
          accentColor={Colors.wifi}
          placeholder="••••••••"
          value={value.password ?? ''}
          onChangeText={update('password')}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

      <Text style={styles.notice}>
        📱 Android will auto-connect · iOS will show in Settings
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  securityLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  securityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  securityOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  securityText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  notice: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
