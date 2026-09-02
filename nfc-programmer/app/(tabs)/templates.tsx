import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, RecordTypeConfig } from '../../constants/theme';
import { NfcModal } from '../../components/NfcModal';
import { useNfc } from '../../hooks/useNfc';
import { useTemplates, NfcTemplate } from '../../hooks/useTemplates';
import {
  buildUrlRecord,
  buildVCardRecord,
  buildWiFiRecord,
  buildTextRecord,
  buildEmailRecord,
  buildPhoneRecord,
  buildLocationRecord,
} from '../../utils/ndefBuilders';
import { RecordType } from '../../constants/theme';

function buildRecordFromTemplate(template: NfcTemplate): any {
  const { type, data } = template;
  switch (type) {
    case 'url': return buildUrlRecord(data.url ?? '');
    case 'vcard': return buildVCardRecord({ firstName: data.firstName ?? '', ...data } as any);
    case 'wifi': return buildWiFiRecord({ ssid: data.ssid ?? '', password: data.password ?? '', security: (data.security as any) ?? 'WPA' });
    case 'text': return buildTextRecord(data.text ?? '');
    case 'email': return buildEmailRecord({ to: data.to ?? '', subject: data.subject, body: data.body });
    case 'phone': return buildPhoneRecord(data.phone ?? '');
    case 'location': return buildLocationRecord({ latitude: parseFloat(data.latitude ?? '0'), longitude: parseFloat(data.longitude ?? '0'), label: data.label });
    default: return buildTextRecord('');
  }
}

function getPreviewText(template: NfcTemplate): string {
  const { type, data } = template;
  switch (type) {
    case 'url': return data.url ?? '';
    case 'vcard': return [data.firstName, data.lastName].filter(Boolean).join(' ');
    case 'wifi': return data.ssid ?? '';
    case 'text': return (data.text ?? '').slice(0, 60);
    case 'email': return data.to ?? '';
    case 'phone': return data.phone ?? '';
    case 'location': return `${data.latitude}, ${data.longitude}`;
    default: return '';
  }
}

function TemplateCard({
  template,
  onWrite,
  onDelete,
}: {
  template: NfcTemplate;
  onWrite: () => void;
  onDelete: () => void;
}) {
  const cfg = RecordTypeConfig[template.type];
  const preview = getPreviewText(template);
  const date = new Date(template.createdAt).toLocaleDateString();

  return (
    <View style={[styles.templateCard, { borderLeftColor: cfg.color }]}>
      <View style={styles.templateTop}>
        <View style={[styles.templateIcon, { backgroundColor: `${cfg.color}20` }]}>
          <Ionicons name={cfg.icon as any} size={18} color={cfg.color} />
        </View>
        <View style={styles.templateInfo}>
          <Text style={styles.templateName}>{template.name}</Text>
          <Text style={[styles.templateType, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {!!preview && (
        <Text style={styles.templatePreview} numberOfLines={1}>
          {preview}
        </Text>
      )}

      <View style={styles.templateBottom}>
        <View style={styles.templateMeta}>
          <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.templateMetaText}>{date}</Text>
          <Ionicons name="repeat-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.templateMetaText}>{template.usageCount} writes</Text>
        </View>
        <TouchableOpacity
          style={[styles.writeBtn, { backgroundColor: `${cfg.color}20`, borderColor: `${cfg.color}40` }]}
          onPress={onWrite}
        >
          <Ionicons name="wifi" size={14} color={cfg.color} />
          <Text style={[styles.writeBtnText, { color: cfg.color }]}>Write</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TemplatesScreen() {
  const { templates, loading, deleteTemplate, incrementUsage } = useTemplates();
  const { status, error, writeTag, cancelScan, reset } = useNfc();
  const [showModal, setShowModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<NfcTemplate | null>(null);
  const [filterType, setFilterType] = useState<RecordType | 'all'>('all');

  const filteredTemplates =
    filterType === 'all' ? templates : templates.filter((t) => t.type === filterType);

  const handleWrite = async (template: NfcTemplate) => {
    setActiveTemplate(template);
    setShowModal(true);
    const record = buildRecordFromTemplate(template);
    const success = await writeTag([record]);
    if (success) {
      await incrementUsage(template.id);
    }
  };

  const handleDelete = (template: NfcTemplate) => {
    Alert.alert('Delete Template', `Delete "${template.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTemplate(template.id) },
    ]);
  };

  const handleCancel = () => {
    cancelScan();
    setShowModal(false);
  };

  const handleDone = () => {
    reset();
    setShowModal(false);
    setActiveTemplate(null);
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
            <Ionicons name="bookmark" size={22} color={Colors.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Templates</Text>
            <Text style={styles.subtitle}>{templates.length} saved configurations</Text>
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[styles.filterChipText, filterType === 'all' && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {(Object.entries(RecordTypeConfig) as [RecordType, any][]).map(([type, cfg]) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                filterType === type && { borderColor: cfg.color, backgroundColor: `${cfg.color}15` },
              ]}
              onPress={() => setFilterType(filterType === type ? 'all' : type)}
            >
              <Ionicons name={cfg.icon} size={12} color={filterType === type ? cfg.color : Colors.textMuted} />
              <Text
                style={[
                  styles.filterChipText,
                  filterType === type && { color: cfg.color, fontWeight: FontWeight.semibold },
                ]}
              >
                {cfg.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List */}
        {loading ? (
          <Text style={styles.loadingText}>Loading templates...</Text>
        ) : filteredTemplates.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bookmark-outline" size={40} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No templates yet</Text>
            <Text style={styles.emptySubtitle}>
              Save a configuration while writing a tag and it will appear here for quick reuse.
            </Text>
          </View>
        ) : (
          filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onWrite={() => handleWrite(template)}
              onDelete={() => handleDelete(template)}
            />
          ))
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <NfcModal
        visible={showModal}
        status={status}
        mode="write"
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
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentDim,
  },
  headerText: { flex: 1 },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },

  filterScroll: { marginBottom: Spacing.lg },
  filterContent: { gap: Spacing.xs, paddingRight: Spacing.lg },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  filterChipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentDim,
  },
  filterChipText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  filterChipTextActive: {
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
  },

  templateCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
  },
  templateTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  templateIcon: {
    width: 36,
    height: 36,
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
    fontWeight: FontWeight.medium,
    marginTop: 1,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  templatePreview: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginLeft: 44,
  },
  templateBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  templateMetaText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  writeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  writeBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },

  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl },
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
  loadingText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
