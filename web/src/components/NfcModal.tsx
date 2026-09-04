import React from 'react';
import { NfcStatus } from '../types/nfc';
import { CheckCircle2, AlertTriangle, X, Wifi, RefreshCw } from 'lucide-react';
import { Colors } from '../constants/theme';

interface NfcModalProps {
  visible: boolean;
  status: NfcStatus;
  mode: 'read' | 'write';
  error: string | null;
  onCancel: () => void;
  onDone: () => void;
  onRetry?: () => void;
}

export const NfcModal: React.FC<NfcModalProps> = ({
  visible,
  status,
  mode,
  error,
  onCancel,
  onDone,
  onRetry,
}) => {
  if (!visible) return null;

  const isScanning = status === 'scanning';
  const isWriting = status === 'writing';
  const isPending = isScanning || isWriting;
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        {/* Close button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={isPending ? onCancel : onDone}
        >
          <X size={18} />
        </button>

        {/* Status Animation Area */}
        <div className="modal-animation-container">
          {isPending && (
            <div className="radar-scanner">
              <div className="radar-ring ring-1" />
              <div className="radar-ring ring-2" />
              <div className="radar-ring ring-3" />
              <div
                className="radar-center-circle"
                style={{
                  backgroundColor: mode === 'write' ? 'rgba(0, 212, 255, 0.18)' : 'rgba(0, 233, 106, 0.18)',
                  borderColor: mode === 'write' ? Colors.accent : Colors.success,
                }}
              >
                <Wifi
                  size={36}
                  className="radar-pulse-icon"
                  style={{ color: mode === 'write' ? Colors.accent : Colors.success }}
                />
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="status-badge-circle success">
              <CheckCircle2 size={46} color={Colors.success} className="scale-up-anim" />
            </div>
          )}

          {isError && (
            <div className="status-badge-circle error">
              <AlertTriangle size={46} color={Colors.error} className="shake-anim" />
            </div>
          )}
        </div>

        {/* Modal Text */}
        <div className="modal-content">
          <h2 className="modal-title">
            {isPending && (mode === 'write' ? 'Ready to Program' : 'Scanning NFC Tag')}
            {isSuccess && (mode === 'write' ? 'Tag Programmed!' : 'Tag Detected!')}
            {isError && 'Operation Failed'}
          </h2>

          <p className="modal-description">
            {isPending &&
              (mode === 'write'
                ? 'Hold your phone against the NFC tag to write the records. Keep it steady.'
                : 'Hold your device close to the NFC tag (within 3–4 cm) to inspect contents.')}
            {isSuccess &&
              (mode === 'write'
                ? 'NDEF record data was written and verified successfully.'
                : 'Tag contents decoded successfully.')}
            {isError && (error || 'Failed to interact with NFC tag. Please ensure tag is compatible.')}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          {isPending && (
            <button type="button" className="btn-secondary full-width" onClick={onCancel}>
              Cancel
            </button>
          )}

          {isSuccess && (
            <button type="button" className="btn-primary full-width" onClick={onDone}>
              Done
            </button>
          )}

          {isError && (
            <div className="modal-dual-actions">
              <button type="button" className="btn-secondary" onClick={onDone}>
                Dismiss
              </button>
              {onRetry && (
                <button type="button" className="btn-primary" onClick={onRetry}>
                  <RefreshCw size={14} />
                  <span>Try Again</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
