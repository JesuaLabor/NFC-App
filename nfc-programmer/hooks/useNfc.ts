import { useState, useCallback, useRef } from 'react';
import { NativeModules, Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { parseNdefRecords, tagIdToString, ParsedTag } from '../utils/ndefParsers';
import { encodeNdefMessage } from '../utils/ndefBuilders';

export type NfcStatus = 'idle' | 'scanning' | 'success' | 'error';

export interface NfcState {
  status: NfcStatus;
  error: string | null;
  tag: ParsedTag | null;
}

const isNativeNfcAvailable = (): boolean => {
  return !!NativeModules?.NfcManager;
};

let nfcInitialized = false;

export async function initNfc(): Promise<boolean> {
  if (!isNativeNfcAvailable()) {
    console.warn('Native NFC module is not available in standard Expo Go.');
    return false;
  }
  if (nfcInitialized) return true;
  try {
    await NfcManager.start();
    nfcInitialized = true;
    return true;
  } catch (e) {
    console.warn('NFC init failed:', e);
    return false;
  }
}

export async function checkNfcSupport(): Promise<boolean> {
  if (!isNativeNfcAvailable()) return false;
  try {
    return await NfcManager.isSupported();
  } catch {
    return false;
  }
}


export function useNfc() {
  const [state, setState] = useState<NfcState>({
    status: 'idle',
    error: null,
    tag: null,
  });

  const cancelRef = useRef(false);

  const setStatus = (status: NfcStatus, error: string | null = null) => {
    setState((s) => ({ ...s, status, error }));
  };

  // ── Read Tag ────────────────────────────────────────────────────────────────
  const readTag = useCallback(async (): Promise<ParsedTag | null> => {
    if (!isNativeNfcAvailable()) {
      setState({
        status: 'error',
        error: 'NFC native module is not included in Expo Go. Please run a Development Build (npx expo run:android).',
        tag: null,
      });
      return null;
    }

    cancelRef.current = false;
    setState({ status: 'scanning', error: null, tag: null });

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const tag = await NfcManager.getTag();
      if (!tag) throw new Error('No tag detected');

      const parsedTag: ParsedTag = {
        id: tag.id ? tagIdToString(tag.id as unknown as number[]) : undefined,
        maxSize: (tag as any).maxSize,
        isWritable: (tag as any).isWritable,
        records: tag.ndefMessage ? parseNdefRecords(tag.ndefMessage) : [],
      };

      setState({ status: 'success', error: null, tag: parsedTag });
      return parsedTag;
    } catch (e: any) {
      if (cancelRef.current) {
        setState({ status: 'idle', error: null, tag: null });
        return null;
      }
      const msg = e?.message ?? 'Failed to read tag';
      setState({ status: 'error', error: msg, tag: null });
      return null;
    } finally {
      if (isNativeNfcAvailable()) {
        NfcManager.cancelTechnologyRequest().catch(() => {});
      }
    }
  }, []);

  // ── Write Tag ───────────────────────────────────────────────────────────────
  const writeTag = useCallback(async (records: any[]): Promise<boolean> => {
    if (!isNativeNfcAvailable()) {
      setState({
        status: 'error',
        error: 'NFC native module is not included in Expo Go. Please run a Development Build (npx expo run:android).',
        tag: null,
      });
      return false;
    }

    cancelRef.current = false;
    setState({ status: 'scanning', error: null, tag: null });

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = encodeNdefMessage(records);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);

      setState({ status: 'success', error: null, tag: null });
      return true;
    } catch (e: any) {
      if (cancelRef.current) {
        setState({ status: 'idle', error: null, tag: null });
        return false;
      }
      const msg = e?.message ?? 'Failed to write tag';
      setState({ status: 'error', error: msg, tag: null });
      return false;
    } finally {
      if (isNativeNfcAvailable()) {
        NfcManager.cancelTechnologyRequest().catch(() => {});
      }
    }
  }, []);

  // ── Cancel ──────────────────────────────────────────────────────────────────
  const cancelScan = useCallback(() => {
    cancelRef.current = true;
    if (isNativeNfcAvailable()) {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
    setState({ status: 'idle', error: null, tag: null });
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', error: null, tag: null });
  }, []);

  return {
    ...state,
    readTag,
    writeTag,
    cancelScan,
    reset,
  };
}
