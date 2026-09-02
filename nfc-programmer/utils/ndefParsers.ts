import { Ndef, NdefRecord } from 'react-native-nfc-manager';

export interface ParsedRecord {
  type: string;
  label: string;
  value: string;
  raw?: string;
}

export interface ParsedTag {
  id?: string;
  maxSize?: number;
  isWritable?: boolean;
  records: ParsedRecord[];
}

function bytesToHex(bytes: number[] | Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(':');
}

function bytesToString(bytes: number[] | Uint8Array): string {
  try {
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return '';
  }
}

function parseUriRecord(record: NdefRecord): ParsedRecord {
  try {
    const uri = Ndef.uri.decodePayload(record.payload as unknown as Uint8Array);
    if (uri.startsWith('tel:')) {
      return { type: 'phone', label: 'Phone Number', value: uri.replace('tel:', '') };
    }
    if (uri.startsWith('mailto:')) {
      return { type: 'email', label: 'Email', value: uri.replace('mailto:', '') };
    }
    if (uri.startsWith('geo:')) {
      const coords = uri.replace('geo:', '').split('?')[0];
      return { type: 'location', label: 'Location', value: coords };
    }
    return { type: 'url', label: 'Website URL', value: uri };
  } catch {
    return { type: 'url', label: 'URL', value: bytesToString(record.payload as any) };
  }
}

function parseTextRecord(record: NdefRecord): ParsedRecord {
  try {
    const text = Ndef.text.decodePayload(record.payload as unknown as Uint8Array);
    // Check if it's a vCard
    if (text.includes('BEGIN:VCARD')) {
      const fnMatch = text.match(/FN:(.+)/);
      const name = fnMatch ? fnMatch[1].trim() : 'Contact';
      return { type: 'vcard', label: 'Contact Card', value: name, raw: text };
    }
    return { type: 'text', label: 'Plain Text', value: text };
  } catch {
    return { type: 'text', label: 'Text', value: bytesToString(record.payload as any) };
  }
}

function parseMimeRecord(record: NdefRecord): ParsedRecord {
  const mimeType = bytesToString(record.type as any).toLowerCase();

  if (mimeType === 'text/vcard') {
    const text = bytesToString(record.payload as any);
    const fnMatch = text.match(/FN:(.+)/);
    const name = fnMatch ? fnMatch[1].trim() : 'Contact';
    return { type: 'vcard', label: 'Contact Card', value: name, raw: text };
  }

  if (mimeType === 'application/vnd.wfa.wsc') {
    return { type: 'wifi', label: 'Wi-Fi Network', value: 'Wi-Fi credentials (WFA WSC)' };
  }

  return {
    type: 'unknown',
    label: `MIME: ${mimeType}`,
    value: bytesToString(record.payload as any),
  };
}

export function parseNdefRecords(records: NdefRecord[]): ParsedRecord[] {
  return records.map((record) => {
    const tnf = record.tnf;

    switch (tnf) {
      case Ndef.TNF_WELL_KNOWN: {
        const type = bytesToString(record.type as any);
        if (type === 'U') return parseUriRecord(record);
        if (type === 'T') return parseTextRecord(record);
        break;
      }
      case Ndef.TNF_MIME_MEDIA:
        return parseMimeRecord(record);
      default:
        break;
    }

    return {
      type: 'unknown',
      label: 'Unknown Record',
      value: bytesToString(record.payload as any),
    };
  });
}

export function tagIdToString(id: number[] | undefined): string {
  if (!id) return 'Unknown';
  return bytesToHex(id);
}
