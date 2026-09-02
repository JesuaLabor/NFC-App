import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';

interface TextFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function TextForm({ value, onChange }: TextFormProps) {
  return (
    <View>
      <FormField
        label="Text Content"
        required
        accentColor={Colors.textRecord}
        placeholder="Enter any text to store on the NFC tag..."
        value={value.text ?? ''}
        onChangeText={(t) => onChange({ ...value, text: t })}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        style={styles.multiline}
        hint="Store any plain text: notes, codes, instructions, etc."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  multiline: {
    minHeight: 120,
    paddingTop: 12,
  },
});
