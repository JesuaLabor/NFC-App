import React from 'react';
import { ParsedTag } from '../types/nfc';
import { TagInfoCard } from '../components/TagInfoCard';
import { Colors } from '../constants/theme';
import {
  Scan,
  Radio,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Smartphone,
  Laptop,
  Flame,
  Globe,
  UserCheck,
  Wifi,
  MapPin,
} from 'lucide-react';

interface ReadViewProps {
  scannedTag: ParsedTag | null;
  onScanClick: () => void;
  onClear: () => void;
  onSimulatePreset: (tag: ParsedTag) => void;
  isSimulation: boolean;
  isSupported: boolean;
}

const PRESET_MOCK_TAGS: { label: string; icon: any; color: string; tag: ParsedTag }[] = [
  {
    label: 'Portfolio URL Tag',
    icon: Globe,
    color: Colors.url,
    tag: {
      id: '04:7A:B2:91:DE:33:80',
      serialNumber: '047AB291DE3380',
      isWritable: true,
      timestamp: 'Just now',
      records: [
        {
          type: 'url',
          label: 'Website URL',
          value: 'https://antigravity.google.com/portfolio',
          raw: 'https://antigravity.google.com/portfolio',
        },
      ],
    },
  },
  {
    label: 'vCard Contact Tag',
    icon: UserCheck,
    color: Colors.vcard,
    tag: {
      id: '04:1C:8E:44:A0:99:81',
      serialNumber: '041C8E44A09981',
      isWritable: true,
      timestamp: 'Just now',
      records: [
        {
          type: 'vcard',
          label: 'Contact Card',
          value: 'Samantha Vance (VP of Product)',
          raw: 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Samantha Vance\r\nTEL;TYPE=CELL:+15559821034\r\nEMAIL:samantha@techcorp.io\r\nORG:TechCorp Solutions\r\nTITLE:VP of Product\r\nURL:https://techcorp.io\r\nEND:VCARD',
        },
      ],
    },
  },
  {
    label: 'Office Wi-Fi Tag',
    icon: Wifi,
    color: Colors.wifi,
    tag: {
      id: '04:F2:19:6C:55:00:82',
      serialNumber: '04F2196C550082',
      isWritable: true,
      timestamp: 'Just now',
      records: [
        {
          type: 'wifi',
          label: 'Wi-Fi Network',
          value: 'Guest_SpeedNet_5GHz (Security: WPA2)',
          raw: 'WIFI:S:Guest_SpeedNet_5GHz;T:WPA;P:FastPass2026;;',
        },
      ],
    },
  },
  {
    label: 'Coordinates Tag',
    icon: MapPin,
    color: Colors.location,
    tag: {
      id: '04:55:CC:72:01:43:83',
      serialNumber: '0455CC72014383',
      isWritable: false,
      timestamp: 'Just now',
      records: [
        {
          type: 'location',
          label: 'Location Coordinates',
          value: '37.78825, -122.4324 (Tech Expo Center)',
          raw: 'geo:37.78825,-122.4324?q=Tech+Expo+Center',
        },
      ],
    },
  },
];

export const ReadView: React.FC<ReadViewProps> = ({
  scannedTag,
  onScanClick,
  onClear,
  onSimulatePreset,
  isSimulation,
  isSupported,
}) => {
  const handleCopyValue = (val: string) => {
    navigator.clipboard.writeText(val);
  };

  return (
    <div className="view-container read-view">
      {/* Header */}
      <div className="view-header">
        <div
          className="view-header-icon"
          style={{ backgroundColor: 'rgba(0, 233, 106, 0.15)', color: Colors.success }}
        >
          <Scan size={24} />
        </div>
        <div>
          <h2 className="main-title">Read NFC Tag</h2>
          <p className="main-sub">Scan and decode any NDEF NFC tag near your device</p>
        </div>
      </div>

      {/* Big Pulse Scan Button */}
      <div className="scan-hero-card">
        <button type="button" className="scan-touch-trigger" onClick={onScanClick}>
          <div className="scan-ring-group">
            <div className="scan-wave-circle wave-1" />
            <div className="scan-wave-circle wave-2" />
            <div className="scan-wave-circle wave-3" />
            <div className="scan-center-hub">
              <Scan size={44} color={Colors.success} />
            </div>
          </div>

          <span className="scan-cta-label">Tap to Scan Tag</span>
          <span className="scan-cta-hint">
            {!isSimulation && isSupported
              ? 'Hold tag against the back or top of your phone'
              : 'Tap to launch simulated scanner or select a test tag below'}
          </span>
        </button>
      </div>

      {/* Scanned Tag Results Area */}
      {scannedTag ? (
        <div className="results-container">
          <div className="results-header-bar">
            <div className="tag-detected-badge">
              <CheckCircle2 size={16} color={Colors.success} />
              <span>Tag Decoded</span>
            </div>
            <button type="button" className="clear-tag-btn" onClick={onClear}>
              <Trash2 size={14} />
              <span>Clear Result</span>
            </button>
          </div>

          <TagInfoCard tag={scannedTag} onCopy={handleCopyValue} />
        </div>
      ) : (
        <div className="empty-scan-placeholder">
          <div className="empty-icon-circle">
            <Radio size={36} color={Colors.textMuted} />
          </div>
          <h4 className="empty-scan-title">No Tag Scanned Yet</h4>
          <p className="empty-scan-desc">
            Tap the pulsing green button above and hold your NFC tag within 4 centimeters of your
            device.
          </p>
        </div>
      )}

      {/* Preset Test Tag Deck (Great for Testing on Desktop / iOS Safari) */}
      <div className="virtual-deck-section">
        <div className="virtual-deck-head">
          <div className="virtual-deck-title-row">
            <Laptop size={16} color={Colors.accent} />
            <span className="virtual-deck-title">Virtual Tag Test Deck</span>
          </div>
          <span className="virtual-deck-sub">Instant preview without physical tag</span>
        </div>

        <div className="virtual-deck-grid">
          {PRESET_MOCK_TAGS.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                type="button"
                className="test-preset-chip"
                onClick={() => onSimulatePreset(preset.tag)}
                style={{ borderColor: `${preset.color}35` }}
              >
                <div
                  className="preset-icon-circle"
                  style={{ backgroundColor: `${preset.color}20`, color: preset.color }}
                >
                  <Icon size={14} />
                </div>
                <span className="preset-name">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scanning Guidelines & Tips */}
      <div className="scan-tips-card">
        <div className="tips-head">
          <HelpCircle size={18} color={Colors.accent} />
          <h4 className="tips-title">Pro Scanning Tips</h4>
        </div>
        <ul className="tips-list">
          <li className="tip-item">
            <Smartphone size={14} className="tip-icon" />
            <span>
              <strong>iPhone / iOS:</strong> Hold the tag flush against the <strong>top edge</strong> of the phone near the camera bump.
            </span>
          </li>
          <li className="tip-item">
            <Smartphone size={14} className="tip-icon" />
            <span>
              <strong>Android:</strong> The NFC antenna is typically located around the <strong>center-back</strong> or upper center.
            </span>
          </li>
          <li className="tip-item">
            <Flame size={14} className="tip-icon" />
            <span>
              <strong>Keep still:</strong> Rapid movement will cause an RF collision or premature termination. Hold firmly for 1 second.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
