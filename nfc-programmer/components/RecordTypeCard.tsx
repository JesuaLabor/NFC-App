import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, RecordTypeConfig, RecordType } from '../constants/theme';

interface RecordTypeCardProps {
  type: RecordType;
  selected: boolean;
  onPress: () => void;
}

export function RecordTypeCard({ type, selected, onPress }: RecordTypeCardProps) {
  const config = RecordTypeConfig[type];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && { borderColor: config.color, backgroundColor: `${config.color}12` },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${config.color}20` }]}>
        <Ionicons name={config.icon as any} size={22} color={config.color} />
      </View>
      <Text style={[styles.label, selected && { color: config.color }]} numberOfLines={1}>
        {config.label}
      </Text>
      <Text style={styles.desc} numberOfLines={1}>
        {config.description}
      </Text>
      {selected && (
        <View style={[styles.selectedDot, { backgroundColor: config.color }]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  desc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  selectedDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
