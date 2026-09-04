import React from 'react';
import { Home, Pencil, Scan, Bookmark, Download, Radio, ShieldCheck, Laptop } from 'lucide-react';

export type TabType = 'home' | 'write' | 'read' | 'templates';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isSupported: boolean;
  isSimulation: boolean;
  onToggleSimulation: () => void;
  canInstall: boolean;
  onInstallClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isSupported,
  isSimulation,
  onToggleSimulation,
  canInstall,
  onInstallClick,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'write' as TabType, label: 'Write', icon: Pencil },
    { id: 'read' as TabType, label: 'Read', icon: Scan },
    { id: 'templates' as TabType, label: 'Templates', icon: Bookmark },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand" onClick={() => setActiveTab('home')}>
            <div className="brand-logo-wrap">
              <Radio size={20} className="brand-logo-icon" />
            </div>
            <div>
              <h1 className="brand-title">NFC Programmer</h1>
              <p className="brand-subtitle">Web & PWA Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`desktop-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {isActive && <div className="active-dot-glow" />}
                </button>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Hardware / Simulation Mode Badge */}
            <button
              type="button"
              className={`nfc-status-pill ${
                !isSimulation && isSupported ? 'status-native' : 'status-simulation'
              }`}
              onClick={onToggleSimulation}
              title={
                isSupported
                  ? isSimulation
                    ? 'Click to switch to Native Web NFC'
                    : 'Native Web NFC Active (Click to test Simulation)'
                  : 'Web NFC hardware not detected in this browser. Running in Tag Simulation mode.'
              }
            >
              <div className="pulse-indicator-dot" />
              <span className="status-pill-text">
                {!isSimulation && isSupported ? (
                  <>
                    <ShieldCheck size={13} className="pill-icon" /> Native NFC
                  </>
                ) : (
                  <>
                    <Laptop size={13} className="pill-icon" /> Simulator
                  </>
                )}
              </span>
            </button>

            {/* Install PWA button */}
            {canInstall && (
              <button
                type="button"
                className="install-pwa-btn"
                onClick={onInstallClick}
                title="Install Progressive Web App on your device"
              >
                <Download size={14} />
                <span className="install-text">Install App</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav className="mobile-bottom-nav">
        <div className="bottom-nav-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`bottom-tab-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="tab-icon-wrapper">
                  <Icon size={20} className="tab-icon" />
                  {isActive && <div className="tab-indicator-bar" />}
                </div>
                <span className="tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
