import React from 'react';
import { RecordTypeConfig, Colors, RecordType } from '../constants/theme';
import { NfcTemplate } from '../types/nfc';
import { TabType } from '../components/Navbar';
import {
  Pencil,
  Scan,
  Bookmark,
  Layers,
  Radio,
  Globe,
  UserCheck,
  Wifi,
  AlignLeft,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  setActiveTab: (tab: TabType) => void;
  templates: NfcTemplate[];
  isSupported: boolean;
  isSimulation: boolean;
  onSelectTypeForWrite: (type: RecordType) => void;
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

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  templates,
  isSupported,
  isSimulation,
  onSelectTypeForWrite,
}) => {
  const totalWrites = templates.reduce((sum, t) => sum + t.usageCount, 0);

  return (
    <div className="view-container home-view">
      {/* Top Welcome Title */}
      <div className="section-head-greeting">
        <div>
          <h2 className="main-title">NFC Programmer</h2>
          <p className="main-sub">Read, program, and duplicate NFC tags in seconds</p>
        </div>

        <div
          className={`nfc-status-badge ${
            !isSimulation && isSupported ? 'badge-online' : 'badge-simulation'
          }`}
        >
          <div className="badge-dot" />
          <span>{!isSimulation && isSupported ? 'Web NFC Ready' : 'Tag Simulator Ready'}</span>
        </div>
      </div>

      {/* Hero Cyberpunk Banner */}
      <div className="hero-banner">
        <div className="hero-animation-pane">
          <div className="hero-wave wave-1" />
          <div className="hero-wave wave-2" />
          <div className="hero-wave wave-3" />
          <div className="hero-wave wave-4" />
          <div className="hero-center-node">
            <Radio size={28} color={Colors.accent} />
          </div>
        </div>

        <div className="hero-text-pane">
          <div className="hero-badge">
            <Sparkles size={12} />
            <span>High-Speed NDEF Engine</span>
          </div>
          <h3 className="hero-heading">Tap. Program. Done.</h3>
          <p className="hero-desc">
            Write websites, contacts, Wi-Fi credentials, phone triggers, and geolocation tags
            directly from your mobile browser.
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderColor: 'rgba(0, 212, 255, 0.25)' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(0, 212, 255, 0.12)' }}>
            <Bookmark size={18} color={Colors.accent} />
          </div>
          <span className="stat-number">{templates.length}</span>
          <span className="stat-label">Saved Templates</span>
        </div>

        <div className="stat-card" style={{ borderColor: 'rgba(167, 139, 250, 0.25)' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(167, 139, 250, 0.12)' }}>
            <Pencil size={18} color={Colors.vcard} />
          </div>
          <span className="stat-number">{totalWrites}</span>
          <span className="stat-label">Tag Writes</span>
        </div>

        <div className="stat-card" style={{ borderColor: 'rgba(52, 211, 153, 0.25)' }}>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(52, 211, 153, 0.12)' }}>
            <Layers size={18} color={Colors.wifi} />
          </div>
          <span className="stat-number">7</span>
          <span className="stat-label">NDEF Formats</span>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-action-cards">
          <button
            type="button"
            className="quick-action-btn write-btn"
            onClick={() => setActiveTab('write')}
          >
            <div className="quick-action-icon-wrap" style={{ backgroundColor: 'rgba(0, 212, 255, 0.18)' }}>
              <Pencil size={24} color={Colors.accent} />
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title" style={{ color: Colors.accent }}>
                Write NFC Tag
              </span>
              <span className="quick-action-sub">Format and encode new tag</span>
            </div>
            <ArrowRight size={18} className="quick-action-arrow" />
          </button>

          <button
            type="button"
            className="quick-action-btn read-btn"
            onClick={() => setActiveTab('read')}
          >
            <div className="quick-action-icon-wrap" style={{ backgroundColor: 'rgba(0, 233, 106, 0.18)' }}>
              <Scan size={24} color={Colors.success} />
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title" style={{ color: Colors.success }}>
                Read NFC Tag
              </span>
              <span className="quick-action-sub">Scan and inspect payload</span>
            </div>
            <ArrowRight size={18} className="quick-action-arrow" />
          </button>
        </div>
      </div>

      {/* Supported Formats Grid */}
      <div className="supported-formats-section">
        <div className="section-header-row">
          <h3 className="section-title">Supported Formats</h3>
          <span className="section-hint">Tap any type to write</span>
        </div>

        <div className="formats-grid">
          {(Object.entries(RecordTypeConfig) as [RecordType, any][]).map(([key, cfg]) => {
            const IconComponent = ICON_MAP[cfg.iconName] || Globe;
            return (
              <button
                key={key}
                type="button"
                className="format-chip-btn"
                onClick={() => {
                  onSelectTypeForWrite(key);
                  setActiveTab('write');
                }}
              >
                <div
                  className="format-chip-icon-box"
                  style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}
                >
                  <IconComponent size={16} />
                </div>
                <div className="format-chip-text">
                  <span className="format-chip-name">{cfg.label}</span>
                  <span className="format-chip-desc">{cfg.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Templates */}
      {templates.length > 0 && (
        <div className="recent-templates-section">
          <div className="section-header-row">
            <h3 className="section-title">Recent Templates</h3>
            <button
              type="button"
              className="link-btn"
              onClick={() => setActiveTab('templates')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="recent-templates-list">
            {templates.slice(0, 3).map((tmpl) => {
              const cfg = RecordTypeConfig[tmpl.type];
              const IconComp = ICON_MAP[cfg.iconName] || Globe;
              return (
                <div
                  key={tmpl.id}
                  className="recent-template-item"
                  onClick={() => setActiveTab('templates')}
                >
                  <div
                    className="template-icon-circle"
                    style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                  >
                    <IconComp size={16} />
                  </div>
                  <div className="template-item-details">
                    <span className="template-item-name">{tmpl.name}</span>
                    <span className="template-item-type" style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <span className="template-writes-count">{tmpl.usageCount} writes</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hardware info note */}
      <div className="web-nfc-notice-box">
        <ShieldCheck size={18} color={Colors.accent} className="notice-icon" />
        <div className="notice-content">
          <span className="notice-title">Web NFC Browser Compatibility</span>
          <p className="notice-text">
            Native tag reading & writing is supported on Google Chrome, Samsung Internet, and Edge on
            Android. When opening on desktop or iPhone, the built-in Tag Simulator activates
            automatically so you can test all NDEF records seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
};
