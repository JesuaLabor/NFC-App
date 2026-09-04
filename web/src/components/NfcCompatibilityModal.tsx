import { X, CheckCircle2, AlertCircle, Smartphone, ShieldCheck } from 'lucide-react';
import { Colors } from '../constants/theme';

interface NfcCompatibilityModalProps {
  visible: boolean;
  onClose: () => void;
  isSupported: boolean;
  isSecure: boolean;
  osName: 'iOS' | 'Android' | 'Desktop/Other';
  browserName: string;
}

export const NfcCompatibilityModal: React.FC<NfcCompatibilityModalProps> = ({
  visible,
  onClose,
  isSupported,
  isSecure,
  osName,
  browserName,
}) => {
  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card install-guide-modal">
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="install-icon-header">
          <div
            className="status-badge-circle"
            style={{
              backgroundColor: isSupported ? 'var(--success-dim)' : 'rgba(255, 184, 0, 0.15)',
              border: `2px solid ${isSupported ? Colors.success : Colors.warning}`,
              width: 58,
              height: 58,
              marginBottom: 10,
            }}
          >
            {isSupported ? (
              <ShieldCheck size={32} color={Colors.success} />
            ) : (
              <AlertCircle size={32} color={Colors.warning} />
            )}
          </div>
          <h2 className="install-modal-title">Device NFC Compatibility</h2>
          <p className="install-modal-sub">
            {isSupported
              ? 'Your device and browser support native Web NFC reading and writing!'
              : 'Web NFC hardware access is currently unavailable in this browser.'}
          </p>
        </div>

        {/* Diagnostics Checklist */}
        <div className="ios-instructions" style={{ marginBottom: 16 }}>
          <div className="ios-step">
            {isSupported ? (
              <CheckCircle2 size={20} color={Colors.success} />
            ) : (
              <AlertCircle size={20} color={Colors.error} />
            )}
            <div className="ios-step-text">
              <strong>Web NFC API (`NDEFReader`):</strong>{' '}
              {isSupported ? 'Supported' : 'Not Supported'}
            </div>
          </div>

          <div className="ios-step">
            {isSecure ? (
              <CheckCircle2 size={20} color={Colors.success} />
            ) : (
              <AlertCircle size={20} color={Colors.error} />
            )}
            <div className="ios-step-text">
              <strong>Secure Context (HTTPS):</strong>{' '}
              {isSecure ? 'Active (HTTPS / Localhost)' : 'Inactive (Requires HTTPS)'}
            </div>
          </div>

          <div className="ios-step">
            <Smartphone size={20} color={Colors.accent} />
            <div className="ios-step-text">
              <strong>Device / OS:</strong> {osName} ({browserName})
            </div>
          </div>
        </div>

        {/* Guidance section */}
        {osName === 'iOS' && (
          <div className="info-banner" style={{ borderColor: 'rgba(255, 77, 106, 0.4)', marginBottom: 12 }}>
            <strong style={{ color: Colors.error, display: 'block', marginBottom: 4 }}>
              🍎 Apple iOS Limitation
            </strong>
            <span>
              Apple prohibits Safari and all iOS browsers from accessing the NFC chip. To scan/write
              NFC tags on an iPhone, you must use a native app (such as the Expo build in{' '}
              <code>nfc-programmer/</code>). This web app runs in <strong>Tag Simulator</strong> mode on iOS.
            </span>
          </div>
        )}

        {osName === 'Android' && !isSupported && (
          <div className="info-banner" style={{ borderColor: 'rgba(255, 184, 0, 0.4)', marginBottom: 12 }}>
            <strong style={{ color: Colors.warning, display: 'block', marginBottom: 4 }}>
              🤖 Android Requirements
            </strong>
            <ul style={{ paddingLeft: 18, fontSize: '0.78rem', lineHeight: 1.5 }}>
              <li>Must open in <strong>Google Chrome</strong> (not Firefox, Opera Mini, or in-app webview).</li>
              <li>Must be served over <strong>HTTPS</strong> (e.g. your Cloudflare URL).</li>
              <li>Turn ON NFC in Android phone Settings &rarr; Connected Devices &rarr; NFC.</li>
            </ul>
          </div>
        )}

        {isSupported && (
          <div className="info-banner" style={{ borderColor: 'rgba(0, 233, 106, 0.4)', marginBottom: 12 }}>
            <strong style={{ color: Colors.success, display: 'block', marginBottom: 4 }}>
              ✅ Ready to Scan & Program
            </strong>
            <span>
              Hold any standard NTAG (NTAG213 / 215 / 216) or Mifare Ultralight tag firmly against the back of your phone.
            </span>
          </div>
        )}

        <button type="button" className="btn-primary full-width" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
