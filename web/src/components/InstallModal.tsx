import React from 'react';
import { X, Download, Share, PlusSquare, Check } from 'lucide-react';
import { Colors } from '../constants/theme';

interface InstallModalProps {
  visible: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  isIos: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  visible,
  onClose,
  onNativeInstall,
  isIos,
}) => {
  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card install-guide-modal">
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="install-icon-header">
          <div className="install-app-badge">
            <img src="/icon.svg" alt="NFC Programmer" width="56" height="56" />
          </div>
          <h2 className="install-modal-title">Install NFC Programmer</h2>
          <p className="install-modal-sub">
            Add to your phone home screen for standalone full-screen experience and instant NFC access.
          </p>
        </div>

        {isIos ? (
          <div className="ios-instructions">
            <div className="ios-step">
              <div className="ios-step-num">1</div>
              <div className="ios-step-text">
                Tap the <strong>Share</strong> button at the bottom of Safari.
              </div>
              <Share size={18} color={Colors.accent} className="step-icon" />
            </div>

            <div className="ios-step">
              <div className="ios-step-num">2</div>
              <div className="ios-step-text">
                Scroll down and select <strong>Add to Home Screen</strong>.
              </div>
              <PlusSquare size={18} color={Colors.success} className="step-icon" />
            </div>

            <div className="ios-step">
              <div className="ios-step-num">3</div>
              <div className="ios-step-text">
                Tap <strong>Add</strong> in the top right corner. Done!
              </div>
              <Check size={18} color={Colors.wifi} className="step-icon" />
            </div>
          </div>
        ) : (
          <div className="android-instructions">
            <p className="android-note">
              This Progressive Web App runs natively on Android with full hardware Web NFC support.
            </p>
            {onNativeInstall && (
              <button
                type="button"
                className="btn-primary full-width install-action-btn"
                onClick={onNativeInstall}
              >
                <Download size={16} />
                <span>Add App to Home Screen</span>
              </button>
            )}
          </div>
        )}

        <button type="button" className="btn-secondary full-width mt-4" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
};
