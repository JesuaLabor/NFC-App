import { useState } from 'react';
import { RecordType, RecordTypeConfig, Colors } from '../constants/theme';
import { UrlForm } from '../components/forms/UrlForm';
import { VCardForm } from '../components/forms/VCardForm';
import { WiFiForm } from '../components/forms/WiFiForm';
import { TextForm } from '../components/forms/TextForm';
import { EmailForm } from '../components/forms/EmailForm';
import { PhoneForm } from '../components/forms/PhoneForm';
import { LocationForm } from '../components/forms/LocationForm';
import { buildNdefRecord } from '../utils/ndefWebBuilders';
import {
  Globe,
  UserCheck,
  Wifi,
  AlignLeft,
  Mail,
  Phone,
  MapPin,
  Bookmark,
  Radio,
  AlertCircle,
} from 'lucide-react';

interface WriteViewProps {
  selectedType: RecordType;
  setSelectedType: (type: RecordType) => void;
  onInitiateWrite: (record: any, templateName?: string, rawFormData?: Record<string, string>) => void;
}

const RECORD_TYPES: RecordType[] = ['url', 'vcard', 'wifi', 'text', 'email', 'phone', 'location'];

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  Globe,
  UserCheck,
  Wifi,
  AlignLeft,
  Mail,
  Phone,
  MapPin,
};

function validateFormData(type: RecordType, data: Record<string, string>): string | null {
  switch (type) {
    case 'url':
      if (!data.url?.trim()) return 'Please enter a website URL.';
      break;
    case 'vcard':
      if (!data.firstName?.trim()) return 'First name is required for contact card.';
      break;
    case 'wifi':
      if (!data.ssid?.trim()) return 'Network name (SSID) is required.';
      if (data.security !== 'nopass' && !data.password?.trim()) {
        return 'Wi-Fi password is required for secured network.';
      }
      break;
    case 'text':
      if (!data.text?.trim()) return 'Please enter some text or notes to encode.';
      break;
    case 'email':
      if (!data.to?.trim()) return 'Recipient email address is required.';
      break;
    case 'phone':
      if (!data.phone?.trim()) return 'Phone number is required.';
      break;
    case 'location':
      if (!data.latitude?.trim() || !data.longitude?.trim()) {
        return 'Latitude and Longitude coordinates are required.';
      }
      if (isNaN(parseFloat(data.latitude)) || isNaN(parseFloat(data.longitude))) {
        return 'Invalid latitude or longitude numbers.';
      }
      break;
  }
  return null;
}

export const WriteView: React.FC<WriteViewProps> = ({
  selectedType,
  setSelectedType,
  onInitiateWrite,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [templateName, setTemplateName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const cfg = RecordTypeConfig[selectedType];
  const CurrentIcon = ICON_MAP[cfg.iconName] || Globe;

  const handleTypeChange = (type: RecordType) => {
    setSelectedType(type);
    setFormData({});
    setValidationError(null);
  };

  const handleWriteClick = () => {
    const errorMsg = validateFormData(selectedType, formData);
    if (errorMsg) {
      setValidationError(errorMsg);
      // Smooth scroll to top of form
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setValidationError(null);
    const nfcRecord = buildNdefRecord(selectedType, formData);
    onInitiateWrite(nfcRecord, templateName.trim() || undefined, formData);
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'url':
        return <UrlForm value={formData} onChange={setFormData} />;
      case 'vcard':
        return <VCardForm value={formData} onChange={setFormData} />;
      case 'wifi':
        return <WiFiForm value={formData} onChange={setFormData} />;
      case 'text':
        return <TextForm value={formData} onChange={setFormData} />;
      case 'email':
        return <EmailForm value={formData} onChange={setFormData} />;
      case 'phone':
        return <PhoneForm value={formData} onChange={setFormData} />;
      case 'location':
        return <LocationForm value={formData} onChange={setFormData} />;
    }
  };

  return (
    <div className="view-container write-view">
      {/* View Header */}
      <div className="view-header">
        <div className="view-header-icon" style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}>
          <CurrentIcon size={24} />
        </div>
        <div>
          <h2 className="main-title">Write NFC Tag</h2>
          <p className="main-sub">Encode custom NDEF records onto any standard NFC chip</p>
        </div>
      </div>

      {/* Validation Banner */}
      {validationError && (
        <div className="validation-error-banner">
          <AlertCircle size={18} color={Colors.error} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step 1: Type Selection */}
      <div className="form-section">
        <div className="step-badge-row">
          <span className="step-badge" style={{ color: Colors.accent }}>
            STEP 1
          </span>
          <span className="step-title">Choose Record Type</span>
        </div>

        <div className="record-types-grid">
          {RECORD_TYPES.map((type) => {
            const itemCfg = RecordTypeConfig[type];
            const Icon = ICON_MAP[itemCfg.iconName] || Globe;
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                type="button"
                className={`type-selector-card ${isSelected ? 'selected' : ''}`}
                style={{
                  borderColor: isSelected ? itemCfg.color : undefined,
                  boxShadow: isSelected ? `0 0 16px ${itemCfg.color}35` : undefined,
                }}
                onClick={() => handleTypeChange(type)}
              >
                <div
                  className="type-icon-box"
                  style={{
                    backgroundColor: isSelected ? `${itemCfg.color}25` : 'rgba(255, 255, 255, 0.05)',
                    color: itemCfg.color,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div className="type-meta">
                  <span className="type-title" style={{ color: isSelected ? itemCfg.color : Colors.text }}>
                    {itemCfg.label}
                  </span>
                  <span className="type-short-desc">{itemCfg.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Form Fields */}
      <div className="form-section">
        <div className="step-badge-row">
          <span className="step-badge" style={{ color: cfg.color }}>
            STEP 2
          </span>
          <span className="step-title">Enter Record Details</span>
        </div>

        <div className="form-card-wrapper" style={{ borderTopColor: cfg.color }}>
          {renderForm()}
        </div>
      </div>

      {/* Step 3: Optional Template Name */}
      <div className="form-section">
        <div className="step-badge-row">
          <span className="step-badge" style={{ color: Colors.textSecondary }}>
            OPTIONAL
          </span>
          <span className="step-title">Save as Reusable Template</span>
        </div>

        <div className="template-save-card">
          <Bookmark size={18} color={Colors.textSecondary} className="template-save-icon" />
          <input
            type="text"
            className="template-name-input"
            placeholder="Template name (e.g. My Business Card, Office Wi-Fi)"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="form-action-bar">
        <button
          type="button"
          className="write-tag-main-btn"
          style={{
            backgroundColor: cfg.color,
            boxShadow: `0 8px 24px ${cfg.color}40`,
          }}
          onClick={handleWriteClick}
        >
          <Radio size={22} className="btn-wave-icon" />
          <span>Write to NFC Tag</span>
        </button>
      </div>
    </div>
  );
};
