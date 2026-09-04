import React, { useState } from 'react';
import { ParsedTag, ParsedRecord } from '../types/nfc';
import { RecordTypeConfig, Colors } from '../constants/theme';
import {
  Copy,
  Check,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface TagInfoCardProps {
  tag: ParsedTag;
  onCopy: (value: string) => void;
}

export const TagInfoCard: React.FC<TagInfoCardProps> = ({ tag, onCopy }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedRaw, setExpandedRaw] = useState(false);

  const handleCopy = (key: string, text: string) => {
    onCopy(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderRecordActions = (record: ParsedRecord) => {
    if (record.type === 'url' && record.value.startsWith('http')) {
      return (
        <a
          href={record.value}
          target="_blank"
          rel="noopener noreferrer"
          className="record-action-link"
          title="Open in new tab"
        >
          <ExternalLink size={13} />
          <span>Open</span>
        </a>
      );
    }
    if (record.type === 'phone') {
      return (
        <a href={`tel:${record.value}`} className="record-action-link" title="Dial number">
          <Phone size={13} />
          <span>Call</span>
        </a>
      );
    }
    if (record.type === 'email') {
      return (
        <a href={`mailto:${record.value}`} className="record-action-link" title="Write email">
          <Mail size={13} />
          <span>Mail</span>
        </a>
      );
    }
    if (record.type === 'location') {
      return (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(record.value)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="record-action-link"
          title="Open in Maps"
        >
          <MapPin size={13} />
          <span>Maps</span>
        </a>
      );
    }
    return null;
  };

  return (
    <div className="tag-card">
      {/* Tag Metadata Header */}
      <div className="tag-header">
        <div className="tag-id-row">
          <div className="tag-chip-icon">
            <Cpu size={16} color={Colors.accent} />
          </div>
          <div className="tag-id-info">
            <span className="tag-id-label">TAG SERIAL / UID</span>
            <div className="tag-id-value-row">
              <span className="tag-id-value">{tag.id}</span>
              <button
                type="button"
                className="copy-mini-btn"
                onClick={() => handleCopy('tag-id', tag.id)}
                title="Copy Serial Number"
              >
                {copiedKey === 'tag-id' ? <Check size={12} color={Colors.success} /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>

        <div className="tag-meta-badges">
          <span className="tag-meta-badge">
            <Layers size={11} />
            {tag.records.length} {tag.records.length === 1 ? 'Record' : 'Records'}
          </span>
          {tag.isWritable !== undefined && (
            <span
              className={`tag-meta-badge ${tag.isWritable ? 'badge-success' : 'badge-warning'}`}
            >
              {tag.isWritable ? 'Writable' : 'Read Only'}
            </span>
          )}
        </div>
      </div>

      {/* Tag Records List */}
      <div className="tag-records-section">
        <h4 className="tag-section-heading">Decoded Payload Content</h4>

        {tag.records.length === 0 ? (
          <div className="tag-empty-records">
            <p>This NFC tag is empty or formatted without NDEF records.</p>
          </div>
        ) : (
          <div className="records-list">
            {tag.records.map((rec, index) => {
              const cfg =
                rec.type !== 'unknown' && RecordTypeConfig[rec.type]
                  ? RecordTypeConfig[rec.type]
                  : { label: rec.label, color: Colors.accent };
              const copyKey = `rec-${index}`;

              return (
                <div
                  key={index}
                  className="record-item-card"
                  style={{ borderLeftColor: cfg.color }}
                >
                  <div className="record-item-top">
                    <span className="record-type-label" style={{ color: cfg.color }}>
                      {rec.label}
                    </span>

                    <div className="record-top-actions">
                      {renderRecordActions(rec)}
                      <button
                        type="button"
                        className="record-copy-btn"
                        onClick={() => handleCopy(copyKey, rec.value || rec.raw || '')}
                        title="Copy to clipboard"
                      >
                        {copiedKey === copyKey ? (
                          <>
                            <Check size={12} color={Colors.success} />
                            <span style={{ color: Colors.success }}>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="record-value-box">
                    <p className="record-value-text">{rec.value || '(No text payload)'}</p>
                  </div>

                  {rec.mediaType && (
                    <span className="record-mimetype-tag">MIME: {rec.mediaType}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Raw Payload Accordion */}
      <div className="tag-raw-section">
        <button
          type="button"
          className="toggle-raw-btn"
          onClick={() => setExpandedRaw(!expandedRaw)}
        >
          <span>Raw Tag Inspector</span>
          {expandedRaw ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expandedRaw && (
          <pre className="raw-payload-viewer">
            {JSON.stringify(tag, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
