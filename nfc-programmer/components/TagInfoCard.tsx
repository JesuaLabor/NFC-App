import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, RecordTypeConfig } from '../constants/theme';
import { ParsedTag, ParsedRecord } from '../utils/ndefParsers';

interface TagInfoCardProps {
  tag: ParsedTag;
  onCopy?: (value: string) => void;
}

function RecordRow({ record, onCopy }: { record: ParsedRecord; onCopy?: (v: string) => void }) {
  const config = RecordTypeConfig[record.type as keyof typeof RecordTypeConfig];
  const color = config?.color ?? Colors.textSecondary;
  const icon = config?.icon ?? 'document-outline';

  return (
    <View style={styles.recordRow}>
      <View style={[styles.recordIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={16} color={color} />
      </View>
      <View style={styles.recordContent}>
        <Text style={styles.recordLabel}>{record.label}</Text>
        <Text style={styles.recordValue} numberOfLines={2}>
          {record.value}
        </Text>
      </View>
      {onCopy && (
        <TouchableOpacity onPress={() => onCopy(record.value)} style={styles.copyBtn}>
          <Ionicons name="copy-outline" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export function TagInfoCard({ tag, onCopy }: TagInfoCardProps) {
  return (
    <View style={styles.card}>
      {/* Tag metadata */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Tag ID</Text>
          <Text style={styles.metaValue} numberOfLines={1}>
            {tag.id ?? 'Unknown'}
          </Text>
        </View>
        {tag.maxSize != null && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Memory</Text>
            <Text style={styles.metaValue}>{tag.maxSize} bytes</Text>
          </View>
        )}
        {tag.isWritable != null && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Writable</Text>
            <Text style={[styles.metaValue, { color: tag.isWritable ? Colors.success : Colors.error }]}>
              {tag.isWritable ? 'Yes' : 'Locked'}
            </Text>
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Records */}
      {tag.records.length === 0 ? (
        <Text style={styles.emptyText}>No NDEF records found on this tag.</Text>
      ) : (
        tag.records.map((record, i) => (
          <RecordRow key={i} record={record} onCopy={onCopy} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  recordIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordContent: {
    flex: 1,
  },
  recordLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  recordValue: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
    marginTop: 1,
  },
  copyBtn: {
    padding: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: Spacing.sm,
  },
});
