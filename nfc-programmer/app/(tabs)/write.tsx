import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, RecordTypeConfig, RecordType } from '../../constants/theme';
import { NfcModal } from '../../components/NfcModal';
import { RecordTypeCard } from '../../components/RecordTypeCard';
import { UrlForm } from '../../components/forms/UrlForm';
import { VCardForm } from '../../components/forms/VCardForm';
import { WiFiForm } from '../../components/forms/WiFiForm';
import { TextForm } from '../../components/forms/TextForm';
import { EmailForm } from '../../components/forms/EmailForm';
import { PhoneForm } from '../../components/forms/PhoneForm';
import { LocationForm } from '../../components/forms/LocationForm';
import { useNfc } from '../../hooks/useNfc';
import { useTemplates } from '../../hooks/useTemplates';
import {
  buildUrlRecord,
  buildVCardRecord,
  buildWiFiRecord,
  buildTextRecord,
  buildEmailRecord,
  buildPhoneRecord,
  buildLocationRecord,
} from '../../utils/ndefBuilders';

const RECORD_TYPES: RecordType[] = ['url', 'vcard', 'wifi', 'text', 'email', 'phone', 'location'];

function buildRecord(type: RecordType, data: Record<string, string>): any {
  switch (type) {
    case 'url':
      return buildUrlRecord(data.url ?? '');
    case 'vcard':
      return buildVCardRecord({
        firstName: data.firstName ?? '',
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        organization: data.organization,
        title: data.title,
        website: data.website,
        address: data.address,
      });
    case 'wifi':
      return buildWiFiRecord({
        ssid: data.ssid ?? '',
        password: data.password ?? '',
        security: (data.security as any) ?? 'WPA',
      });
    case 'text':
      return buildTextRecord(data.text ?? '');
    case 'email':
      return buildEmailRecord({ to: data.to ?? '', subject: data.subject, body: data.body });
    case 'phone':
      return buildPhoneRecord(data.phone ?? '');
    case 'location':
      return buildLocationRecord({
        latitude: parseFloat(data.latitude ?? '0'),
        longitude: parseFloat(data.longitude ?? '0'),
        label: data.label,
      });
  }
}

function validateData(type: RecordType, data: Record<string, string>): string | null {
  switch (type) {
    case 'url':
      if (!data.url?.trim()) return 'Please enter a URL';
      break;
    case 'vcard':
      if (!data.firstName?.trim()) return 'First name is required';
      break;
    case 'wifi':
      if (!data.ssid?.trim()) return 'Network name (SSID) is required';
      if (data.security !== 'nopass' && !data.password?.trim()) return 'Password is required';
      break;
    case 'text':
      if (!data.text?.trim()) return 'Please enter some text';
      break;
    case 'email':
      if (!data.to?.trim()) return 'Email address is required';
      break;
    case 'phone':
      if (!data.phone?.trim()) return 'Phone number is required';
      break;
    case 'location':
      if (!data.latitude?.trim() || !data.longitude?.trim())
        return 'Latitude and longitude are required';
      if (isNaN(parseFloat(data.latitude)) || isNaN(parseFloat(data.longitude)))
        return 'Invalid coordinates';
      break;
  }
  return null;
}

export default function WriteScreen() {
  const [selectedType, setSelectedType] = useState<RecordType>('url');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);

  const { status, error, writeTag, cancelScan, reset } = useNfc();
  const { addTemplate } = useTemplates();

  const handleTypeSelect = (type: RecordType) => {
    setSelectedType(type);
    setFormData({});
  };

  const handleWrite = async () => {
    const validationError = validateData(selectedType, formData);
    if (validationError) {
      Alert.alert('Missing Information', validationError);
      return;
    }

    setShowModal(true);
    const record = buildRecord(selectedType, formData);
    const success = await writeTag([record]);

    if (success && templateName.trim()) {
      await addTemplate({ name: templateName.trim(), type: selectedType, data: formData });
    }
  };

  const handleCancel = () => {
    cancelScan();
    setShowModal(false);
  };

  const handleDone = () => {
    reset();
    setShowModal(false);
    if (status === 'error') {
      // Re-open for retry
      setShowModal(false);
    }
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'url': return <UrlForm value={formData} onChange={setFormData} />;
      case 'vcard': return <VCardForm value={formData} onChange={setFormData} />;
      case 'wifi': return <WiFiForm value={formData} onChange={setFormData} />;
      case 'text': return <TextForm value={formData} onChange={setFormData} />;
      case 'email': return <EmailForm value={formData} onChange={setFormData} />;
      case 'phone': return <PhoneForm value={formData} onChange={setFormData} />;
      case 'location': return <LocationForm value={formData} onChange={setFormData} />;
    }
  };

  const cfg = RecordTypeConfig[selectedType];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.headerIcon, { backgroundColor: `${cfg.color}20` }]}>
              <Ionicons name={cfg.icon as any} size={22} color={cfg.color} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Write NFC Tag</Text>
              <Text style={styles.subtitle}>Program a tag with your data</Text>
            </View>
          </View>

          {/* Step 1: Type Selection */}
          <View style={styles.section}>
            <Text style={styles.stepLabel}>
              <Text style={{ color: Colors.accent }}>Step 1</Text> — Choose Record Type
            </Text>
            <View style={styles.typeGrid}>
              {RECORD_TYPES.map((type) => (
                <RecordTypeCard
                  key={type}
                  type={type}
                  selected={selectedType === type}
                  onPress={() => handleTypeSelect(type)}
                />
              ))}
            </View>
          </View>

          {/* Step 2: Form */}
          <View style={styles.section}>
            <Text style={styles.stepLabel}>
              <Text style={{ color: cfg.color }}>Step 2</Text> — Fill in Details
            </Text>
            <View style={styles.formCard}>
              {renderForm()}
            </View>
          </View>

          {/* Step 3: Save as Template (optional) */}
          <View style={styles.section}>
            <Text style={styles.stepLabel}>
              <Text style={{ color: Colors.textMuted }}>Optional</Text> — Save as Template
            </Text>
            <View style={styles.templateRow}>
              <Ionicons name="bookmark-outline" size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.templateInput}
                placeholder="Template name (e.g. My Business Card)"
                placeholderTextColor={Colors.textMuted}
                value={templateName}
                onChangeText={setTemplateName}
              />
            </View>
          </View>

          {/* Write Button */}
          <TouchableOpacity
            style={[styles.writeButton, { backgroundColor: cfg.color }]}
            onPress={handleWrite}
            activeOpacity={0.85}
          >
            <Ionicons name="wifi" size={20} color={Colors.background} />
            <Text style={styles.writeButtonText}>Write to NFC Tag</Text>
          </TouchableOpacity>

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>

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
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  section: { marginBottom: Spacing.lg },
  stepLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  formCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  templateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  templateInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },

  writeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    marginTop: Spacing.sm,
  },
  writeButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.background,
  },
});
