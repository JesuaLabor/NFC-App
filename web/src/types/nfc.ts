import { RecordType } from '../constants/theme';

export interface VCardData {
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  organization?: string;
  title?: string;
  website?: string;
  address?: string;
}

export interface WiFiData {
  ssid: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'nopass';
}

export interface EmailData {
  to: string;
  subject?: string;
  body?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  label?: string;
}

export interface ParsedRecord {
  type: RecordType | 'unknown';
  label: string;
  value: string;
  raw?: string;
  recordType?: string;
  mediaType?: string;
  encoding?: string;
  lang?: string;
}

export interface ParsedTag {
  id: string;
  serialNumber?: string;
  maxSize?: number;
  isWritable?: boolean;
  records: ParsedRecord[];
  timestamp: string;
}

export interface NfcTemplate {
  id: string;
  name: string;
  type: RecordType;
  data: Record<string, string>;
  createdAt: number;
  usageCount: number;
}

export type NfcStatus = 'idle' | 'scanning' | 'writing' | 'success' | 'error';

// Web NFC standard types
export interface NDEFRecordInit {
  recordType: 'empty' | 'text' | 'url' | 'mime' | 'unknown';
  mediaType?: string;
  id?: string;
  encoding?: string;
  lang?: string;
  data?: any;
}

export interface NDEFMessageInit {
  records: NDEFRecordInit[];
}

export interface NDEFRecord {
  recordType: string;
  mediaType?: string;
  id?: string;
  data?: DataView;
  encoding?: string;
  lang?: string;
  toRecords?: () => NDEFRecord[];
}

export interface NDEFMessage {
  records: readonly NDEFRecord[];
}

export interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: NDEFMessage;
}

// Global declaration for Window
declare global {
  interface Window {
    NDEFReader?: {
      new (): NDEFReaderInstance;
    };
  }
}

export interface NDEFReaderInstance extends EventTarget {
  scan: (options?: { signal?: AbortSignal }) => Promise<void>;
  write: (
    message: NDEFMessageInit | string,
    options?: { signal?: AbortSignal; overwrite?: boolean }
  ) => Promise<void>;
  onreading: ((this: NDEFReaderInstance, ev: NDEFReadingEvent) => any) | null;
  onreadingerror: ((this: NDEFReaderInstance, ev: Event) => any) | null;
}
