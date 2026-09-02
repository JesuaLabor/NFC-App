import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

interface FormFieldProps extends TextInputProps {
  label: string;
  required?: boolean;
  hint?: string;
  accentColor?: string;
}

export function FormField({
  label,
  required,
  hint,
  accentColor = Colors.accent,
  style,
  ...props
}: FormFieldProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={[styles.required, { color: accentColor }]}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          focused && { borderColor: accentColor },
          style,
        ]}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  required: {
    fontWeight: FontWeight.bold,
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
