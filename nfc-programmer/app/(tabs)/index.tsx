import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, RecordTypeConfig } from '../../constants/theme';
import { useTemplates } from '../../hooks/useTemplates';
import { checkNfcSupport } from '../../hooks/useNfc';

const { width } = Dimensions.get('window');

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderColor: `${color}30` }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickActionButton({
  label,
  icon,
  color,
  onPress,
}: {
  label: string;
  icon: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[`${color}25`, `${color}10`]}
        style={styles.quickActionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: `${color}30` }]}>
          <Ionicons name={icon as any} size={28} color={color} />
        </View>
        <Text style={[styles.quickActionLabel, { color }]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { templates } = useTemplates();
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);

  useEffect(() => {
    checkNfcSupport().then(setNfcSupported);
  }, []);

  const totalWrites = templates.reduce((sum, t) => sum + t.usageCount, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>NFC Programmer</Text>
            <Text style={styles.subtitle}>Write & read NFC tags instantly</Text>
          </View>
          <View style={[styles.nfcBadge, { backgroundColor: nfcSupported ? Colors.successDim : Colors.errorDim }]}>
            <View style={[styles.nfcDot, { backgroundColor: nfcSupported ? Colors.success : Colors.error }]} />
            <Text style={[styles.nfcBadgeText, { color: nfcSupported ? Colors.success : Colors.error }]}>
              {nfcSupported === null ? 'Checking...' : nfcSupported ? 'NFC Ready' : 'No NFC'}
            </Text>
          </View>
        </View>

        {/* Hero Banner */}
        <LinearGradient
          colors={['#001A2E', '#002A44', '#001A2E']}
          style={styles.heroBanner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroNfcWaves}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.heroWave,
                  {
                    width: 40 + i * 28,
                    height: 40 + i * 28,
                    borderRadius: 20 + i * 14,
                    borderColor: `${Colors.accent}${Math.max(10, 50 - i * 12).toString(16).padStart(2, '0')}`,
                  },
                ]}
              />
            ))}
            <Ionicons name="wifi" size={32} color={Colors.accent} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Tap. Program. Done.</Text>
            <Text style={styles.heroSubtitle}>
              Program any NFC tag with URLs, contacts, Wi-Fi and more in seconds.
            </Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label="Templates"
            value={templates.length}
            icon="bookmark"
            color={Colors.accent}
          />
          <StatCard label="Tag Writes" value={totalWrites} icon="pencil" color={Colors.vcard} />
          <StatCard label="Tag Types" value="7" icon="layers" color={Colors.wifi} />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <QuickActionButton
            label="Write Tag"
            icon="pencil"
            color={Colors.accent}
            onPress={() => router.push('/(tabs)/write')}
          />
          <QuickActionButton
            label="Read Tag"
            icon="scan"
            color={Colors.success}
            onPress={() => router.push('/(tabs)/read')}
          />
        </View>

        {/* Supported Formats */}
        <Text style={styles.sectionTitle}>Supported Formats</Text>
        <View style={styles.formatsGrid}>
          {(Object.entries(RecordTypeConfig) as [string, any][]).map(([key, cfg]) => (
            <TouchableOpacity
              key={key}
              style={styles.formatChip}
              onPress={() => router.push('/(tabs)/write')}
              activeOpacity={0.7}
            >
              <Ionicons name={cfg.icon} size={16} color={cfg.color} />
              <Text style={[styles.formatLabel, { color: cfg.color }]}>{cfg.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Templates */}
        {templates.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Templates</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/templates')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {templates.slice(0, 3).map((tmpl) => {
              const cfg = RecordTypeConfig[tmpl.type];
              return (
                <View key={tmpl.id} style={styles.templateRow}>
                  <View style={[styles.templateIcon, { backgroundColor: `${cfg.color}20` }]}>
                    <Ionicons name={cfg.icon as any} size={18} color={cfg.color} />
                  </View>
                  <View style={styles.templateInfo}>
                    <Text style={styles.templateName}>{tmpl.name}</Text>
                    <Text style={styles.templateType}>{cfg.label}</Text>
                  </View>
                  <Text style={styles.templateUsage}>{tmpl.usageCount}×</Text>
                </View>
              );
            })}
          </>
        )}

        {/* Bottom padding */}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
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
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  greeting: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  nfcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  nfcDot: { width: 7, height: 7, borderRadius: 4 },
  nfcBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },

  heroBanner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  heroNfcWaves: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroWave: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  heroText: { flex: 1 },
  heroTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
  },

  quickActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickAction: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },

  formatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  formatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formatLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },

  templateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  templateIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateInfo: { flex: 1 },
  templateName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  templateType: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  templateUsage: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
});
