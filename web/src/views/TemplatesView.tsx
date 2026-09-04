import React, { useState } from 'react';
import { NfcTemplate } from '../types/nfc';
import { RecordType, RecordTypeConfig, Colors } from '../constants/theme';
import { buildNdefRecord } from '../utils/ndefWebBuilders';
import {
  Bookmark,
  Radio,
  Trash2,
  Calendar,
  Repeat,
  Globe,
  UserCheck,
  Wifi,
  AlignLeft,
  Mail,
  Phone,
  MapPin,
  Plus,
} from 'lucide-react';
import { TabType } from '../components/Navbar';

interface TemplatesViewProps {
  templates: NfcTemplate[];
  onWriteTemplate: (template: NfcTemplate, record: any) => void;
  onDeleteTemplate: (id: string) => void;
  setActiveTab: (tab: TabType) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  Globe,
  UserCheck,
  Wifi,
  AlignLeft,
  Mail,
  Phone,
  MapPin,
};

function getTemplatePreview(template: NfcTemplate): string {
  const { type, data } = template;
  switch (type) {
    case 'url':
      return data.url || '';
    case 'vcard':
      return [data.firstName, data.lastName, data.organization].filter(Boolean).join(' • ');
    case 'wifi':
      return `SSID: ${data.ssid || ''} (${data.security || 'WPA'})`;
    case 'text':
      return (data.text || '').slice(0, 70);
    case 'email':
      return data.to || '';
    case 'phone':
      return data.phone || '';
    case 'location':
      return `${data.latitude}, ${data.longitude}${data.label ? ` (${data.label})` : ''}`;
    default:
      return '';
  }
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onWriteTemplate,
  onDeleteTemplate,
  setActiveTab,
}) => {
  const [filterType, setFilterType] = useState<RecordType | 'all'>('all');

  const filteredTemplates =
    filterType === 'all' ? templates : templates.filter((t) => t.type === filterType);

  const handleWriteClick = (tmpl: NfcTemplate) => {
    const record = buildNdefRecord(tmpl.type, tmpl.data);
    onWriteTemplate(tmpl, record);
  };

  return (
    <div className="view-container templates-view">
      {/* Header */}
      <div className="view-header">
        <div
          className="view-header-icon"
          style={{ backgroundColor: 'rgba(0, 212, 255, 0.15)', color: Colors.accent }}
        >
          <Bookmark size={24} />
        </div>
        <div>
          <h2 className="main-title">Templates</h2>
          <p className="main-sub">{templates.length} reusable NFC tag presets</p>
        </div>
      </div>

      {/* Filter Chips Scroll Row */}
      <div className="filter-chips-container">
        <button
          type="button"
          className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          <span>All ({templates.length})</span>
        </button>

        {(Object.entries(RecordTypeConfig) as [RecordType, any][]).map(([key, cfg]) => {
          const count = templates.filter((t) => t.type === key).length;
          const isActive = filterType === key;
          const Icon = ICON_MAP[cfg.iconName] || Globe;

          return (
            <button
              key={key}
              type="button"
              className={`filter-chip ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? cfg.color : undefined,
                backgroundColor: isActive ? `${cfg.color}20` : undefined,
                color: isActive ? cfg.color : undefined,
              }}
              onClick={() => setFilterType(isActive ? 'all' : key)}
            >
              <Icon size={13} />
              <span>{cfg.shortLabel}</span>
              <span className="filter-badge-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Template Cards List */}
      {filteredTemplates.length === 0 ? (
        <div className="empty-templates-box">
          <div className="empty-icon-circle">
            <Bookmark size={36} color={Colors.textMuted} />
          </div>
          <h4 className="empty-scan-title">No Templates Found</h4>
          <p className="empty-scan-desc">
            {filterType === 'all'
              ? 'Save your favorite tag configurations while programming to write them again with one tap.'
              : `No ${RecordTypeConfig[filterType].label} templates saved yet.`}
          </p>
          <button
            type="button"
            className="btn-primary mt-4"
            onClick={() => setActiveTab('write')}
          >
            <Plus size={16} />
            <span>Create New Tag</span>
          </button>
        </div>
      ) : (
        <div className="templates-list-grid">
          {filteredTemplates.map((template) => {
            const cfg = RecordTypeConfig[template.type];
            const Icon = ICON_MAP[cfg.iconName] || Globe;
            const preview = getTemplatePreview(template);
            const dateStr = new Date(template.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={template.id}
                className="template-card"
                style={{ borderLeftColor: cfg.color }}
              >
                <div className="template-top-row">
                  <div
                    className="template-type-icon"
                    style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="template-title-meta">
                    <h3 className="template-title">{template.name}</h3>
                    <span className="template-type-tag" style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="template-delete-btn"
                    onClick={() => {
                      if (confirm(`Delete template "${template.name}"?`)) {
                        onDeleteTemplate(template.id);
                      }
                    }}
                    title="Delete template"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {preview && <p className="template-preview-text">{preview}</p>}

                <div className="template-bottom-row">
                  <div className="template-counters">
                    <span className="template-meta-item">
                      <Calendar size={12} />
                      <span>{dateStr}</span>
                    </span>
                    <span className="template-meta-item">
                      <Repeat size={12} />
                      <span>{template.usageCount} writes</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    className="template-write-btn"
                    style={{
                      backgroundColor: `${cfg.color}20`,
                      borderColor: `${cfg.color}50`,
                      color: cfg.color,
                    }}
                    onClick={() => handleWriteClick(template)}
                  >
                    <Radio size={14} />
                    <span>Write</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
