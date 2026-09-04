import { useState, useCallback, useRef, useEffect } from 'react';
import { NfcStatus, ParsedTag, NDEFRecordInit, NDEFReadingEvent } from '../types/nfc';
import { parseWebNdefMessage } from '../utils/ndefWebParsers';

export interface UseWebNfcReturn {
  status: NfcStatus;
  error: string | null;
  tag: ParsedTag | null;
  isSupported: boolean;
  isSimulation: boolean;
  setIsSimulation: (val: boolean) => void;
  readTag: () => Promise<ParsedTag | null>;
  writeTag: (records: NDEFRecordInit[]) => Promise<boolean>;
  cancelScan: () => void;
  reset: () => void;
  simulateTagScan: (presetTag: ParsedTag) => void;
}

export function useWebNfc(): UseWebNfcReturn {
  const [status, setStatus] = useState<NfcStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [tag, setTag] = useState<ParsedTag | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSimulation, setIsSimulation] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Check hardware support on mount
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 'NDEFReader' in window;
    setIsSupported(supported);
    // If not supported natively (e.g. desktop browser, iOS Safari), default to simulation mode
    if (!supported) {
      setIsSimulation(true);
    }
  }, []);

  const triggerHaptic = (pattern: number[] = [40, 60, 40]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore vibration errors
      }
    }
  };

  // ── Read Tag ──────────────────────────────────────────────────────────────
  const readTag = useCallback(async (): Promise<ParsedTag | null> => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setError(null);
    setTag(null);
    setStatus('scanning');

    // 1. Native Web NFC Execution
    if (isSupported && !isSimulation && window.NDEFReader) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan({ signal });

        return new Promise<ParsedTag | null>((resolve) => {
          const handleReading = (event: Event) => {
            const readingEvent = event as NDEFReadingEvent;
            triggerHaptic([60, 80, 60]);
            const parsed = parseWebNdefMessage(
              readingEvent.serialNumber,
              readingEvent.message.records
            );
            setTag(parsed);
            setStatus('success');
            resolve(parsed);
          };

          const handleReadingError = () => {
            setError('Could not read NFC tag. Make sure it is positioned against your device antenna.');
            setStatus('error');
            resolve(null);
          };

          ndef.addEventListener('reading', handleReading, { once: true, signal });
          ndef.addEventListener('readingerror', handleReadingError, { once: true, signal });
        });
      } catch (err: any) {
        if (signal.aborted) {
          setStatus('idle');
          return null;
        }
        console.warn('Native Web NFC read error:', err);
        const errMsg = err?.name === 'NotAllowedError'
          ? 'NFC permission denied. Please allow NFC access in browser site settings.'
          : err?.message || 'NFC read operation failed.';
        setError(errMsg);
        setStatus('error');
        return null;
      }
    }

    // 2. Simulation Mode (Fallback for Desktop, iOS Safari, or Dev testing)
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        if (signal.aborted) {
          setStatus('idle');
          resolve(null);
          return;
        }
        triggerHaptic([50, 50]);
        const mockTag: ParsedTag = {
          id: '04:8E:72:9A:3C:6F:80',
          serialNumber: '048E729A3C6F80',
          maxSize: 888,
          isWritable: true,
          timestamp: new Date().toLocaleTimeString(),
          records: [
            {
              type: 'url',
              label: 'Website URL',
              value: 'https://antigravity.google.com',
              raw: 'https://antigravity.google.com',
            },
            {
              type: 'text',
              label: 'Plain Text',
              value: 'Virtual NFC Tag #42 - Ready for reprogramming',
              raw: 'Virtual NFC Tag #42 - Ready for reprogramming',
            },
          ],
        };
        setTag(mockTag);
        setStatus('success');
        resolve(mockTag);
      }, 1600);

      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        setStatus('idle');
        resolve(null);
      });
    });
  }, [isSupported, isSimulation]);

  // ── Write Tag ─────────────────────────────────────────────────────────────
  const writeTag = useCallback(
    async (records: NDEFRecordInit[]): Promise<boolean> => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setError(null);
      setStatus('writing');

      // 1. Native Web NFC Write
      if (isSupported && !isSimulation && window.NDEFReader) {
        try {
          const ndef = new window.NDEFReader();
          await ndef.write({ records } as any, { signal });
          triggerHaptic([40, 100, 40]);
          setStatus('success');
          return true;
        } catch (err: any) {
          if (signal.aborted) {
            setStatus('idle');
            return false;
          }
          console.warn('Native Web NFC write error:', err);
          const errMsg = err?.name === 'NotAllowedError'
            ? 'NFC permission was denied.'
            : err?.message || 'Failed to write to NFC tag. Keep device steady.';
          setError(errMsg);
          setStatus('error');
          return false;
        }
      }

      // 2. Simulation Mode
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          if (signal.aborted) {
            setStatus('idle');
            resolve(false);
            return;
          }
          triggerHaptic([60, 60]);
          setStatus('success');
          resolve(true);
        }, 1400);

        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          setStatus('idle');
          resolve(false);
        });
      });
    },
    [isSupported, isSimulation]
  );

  // ── Cancel & Reset ────────────────────────────────────────────────────────
  const cancelScan = useCallback(() => {
    abortControllerRef.current?.abort();
    setStatus('idle');
    setError(null);
  }, []);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setStatus('idle');
    setError(null);
    setTag(null);
  }, []);

  const simulateTagScan = useCallback((presetTag: ParsedTag) => {
    triggerHaptic([50, 70]);
    setTag(presetTag);
    setStatus('success');
  }, []);

  return {
    status,
    error,
    tag,
    isSupported,
    isSimulation,
    setIsSimulation,
    readTag,
    writeTag,
    cancelScan,
    reset,
    simulateTagScan,
  };
}
