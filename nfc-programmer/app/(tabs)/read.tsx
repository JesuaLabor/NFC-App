import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';
import { NfcModal } from '../../components/NfcModal';
import { TagInfoCard } from '../../components/TagInfoCard';
import { useNfc } from '../../hooks/useNfc';
import { ParsedTag } from '../../utils/ndefParsers';

export default function ReadScreen() {
  const [showModal, setShowModal] = useState(false);
  const [scannedTag, setScannedTag] = useState<ParsedTag | null>(null);
  const { status, error, readTag, cancelScan, reset } = useNfc();

  const handleScan = async () => {
    setShowModal(true);
    setScannedTag(null);
    const result = await readTag();
    if (result) {
      setScannedTag(result);
    }
  };

  const handleCancel = () => {
    cancelScan();
    setShowModal(false);
  };

  const handleDone = () => {
    reset();
    setShowModal(false);
  };

  const handleCopy = (value: string) => {
    Clipboard.setString(value);
    Alert.alert('Copied!', 'Value copied to clipboard.');
  };

  const handleClear = () => {
    setScannedTag(null);
    reset();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="scan" size={22} color={Colors.success} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Read NFC Tag</Text>
            <Text style={styles.subtitle}>Scan any NFC tag to inspect its data</Text>
          </View>
        </View>

        {/* Scan Button */}
        <TouchableOpacity style={styles.scanButton} onPress={handleScan} activeOpacity={0.85}>
          <View style={styles.scanButtonInner}>
            {/* Rings */}
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.scanRing,
                  {
                    width: 100 + i * 36,
                    height: 100 + i * 36,
                    borderRadius: 50 + i * 18,
                    borderColor: `${Colors.success}${['50', '30', '15'][i]}`,
                  },
                ]}
              />
            ))}
            <View style={styles.scanIcon}>
              <Ionicons name="scan" size={40} color={Colors.success} />
            </View>
          </View>
          <Text style={styles.scanButtonLabel}>Tap to Scan Tag</Text>
          <Text style={styles.scanButtonHint}>Hold your device near an NFC tag</Text>
        </TouchableOpacity>

        {/* Result */}
        {scannedTag ? (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <View style={styles.resultBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.resultBadgeText}>Tag Scanned</Text>
              </View>
              <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                <Ionicons name="trash-outline" size={16} color={Colors.error} />
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <TagInfoCard tag={scannedTag} onCopy={handleCopy} />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="radio-outline" size={40} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No tag scanned yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the scan button above and hold your phone near an NFC tag
            </Text>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>📡 Scanning Tips</Text>
          {[
            'Hold tag within 4cm of your phone',
            'Keep still while scanning — motion breaks the connection',
            'iPhone: hold near the top of the device',
            'Android: hold near the center-back',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <NfcModal
        visible={showModal}
        status={status}
        mode="read"
        error={error}
        onCancel={handleCancel}
        onDone={handleDone}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.lg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.successDim,
  },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },

  scanButton: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: `${Colors.success}30`,
  },
  scanButtonInner: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  scanRing: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  scanIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.successDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${Colors.success}60`,
  },
  scanButtonLabel: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.success,
    marginBottom: 4,
  },
  scanButtonHint: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  resultSection: { marginBottom: Spacing.lg },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.successDim,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  resultBadgeText: {
    fontSize: FontSize.sm,
    color: Colors.success,
    fontWeight: FontWeight.semibold,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.errorDim,
  },
  clearBtnText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 20,
  },

  tipsCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipsTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
