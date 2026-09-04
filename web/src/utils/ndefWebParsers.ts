import { NDEFRecord, ParsedRecord, ParsedTag } from '../types/nfc';

export function decodeRecordPayload(record: NDEFRecord): string {
  if (!record.data) return '';
  try {
    const decoder = new TextDecoder(record.encoding || 'utf-8');
    return decoder.decode(record.data);
  } catch {
    return '';
  }
}

export function parseWebNdefRecord(record: NDEFRecord): ParsedRecord {
  const { recordType, mediaType, encoding, lang } = record;
  const rawText = decodeRecordPayload(record);

  // 1. URL records
  if (recordType === 'url') {
    const uri = rawText;
    if (uri.startsWith('tel:')) {
      return {
        type: 'phone',
        label: 'Phone Number',
        value: uri.replace('tel:', ''),
        raw: uri,
        recordType,
      };
    }
    if (uri.startsWith('mailto:')) {
      const email = uri.replace('mailto:', '').split('?')[0];
      return {
        type: 'email',
        label: 'Email',
        value: email,
        raw: uri,
        recordType,
      };
    }
    if (uri.startsWith('geo:')) {
      const coords = uri.replace('geo:', '').split('?')[0];
      return {
        type: 'location',
        label: 'Location Coordinates',
        value: coords,
        raw: uri,
        recordType,
      };
    }
    return {
      type: 'url',
      label: 'Website URL',
      value: uri,
      raw: uri,
      recordType,
    };
  }

  // 2. Text records
  if (recordType === 'text') {
    if (rawText.includes('BEGIN:VCARD')) {
      const fnMatch = rawText.match(/FN:(.+)/i);
      const name = fnMatch ? fnMatch[1].trim() : 'Contact Card';
      return {
        type: 'vcard',
        label: 'Contact Card',
        value: name,
        raw: rawText,
        recordType,
        lang,
        encoding,
      };
    }
    if (rawText.startsWith('WIFI:')) {
      const ssidMatch = rawText.match(/S:([^;]+)/i);
      const ssid = ssidMatch ? ssidMatch[1] : 'Wi-Fi Network';
      return {
        type: 'wifi',
        label: 'Wi-Fi Network',
        value: ssid,
        raw: rawText,
        recordType,
      };
    }
    return {
      type: 'text',
      label: 'Plain Text',
      value: rawText,
      raw: rawText,
      recordType,
      lang,
      encoding,
    };
  }

  // 3. MIME records
  if (recordType === 'mime' || mediaType) {
    const mime = (mediaType || '').toLowerCase();
    if (mime === 'text/vcard' || mime === 'text/x-vcard') {
      const fnMatch = rawText.match(/FN:(.+)/i);
      const name = fnMatch ? fnMatch[1].trim() : 'Contact Card';
      return {
        type: 'vcard',
        label: 'Contact Card',
        value: name,
        raw: rawText,
        mediaType,
        recordType,
      };
    }

    if (mime === 'application/vnd.wfa.wsc') {
      return {
        type: 'wifi',
        label: 'Wi-Fi Network Credentials',
        value: 'WFA WSC Security Profile',
        raw: 'Encrypted or TLV Binary Wi-Fi Configuration',
        mediaType,
        recordType,
      };
    }

    return {
      type: 'unknown',
      label: `MIME: ${mime}`,
      value: rawText || '(Binary Content)',
      raw: rawText,
      mediaType,
      recordType,
    };
  }

  return {
    type: 'unknown',
    label: `Record (${recordType})`,
    value: rawText || '(Binary payload)',
    raw: rawText,
    recordType,
  };
}

export function formatSerialNumber(serial: string | undefined): string {
  if (!serial) return '04:A2:3B:5C:88:9F:E1';
  // Check if already formatted with colons
  if (serial.includes(':')) return serial.toUpperCase();
  // Format continuous hex into pairs
  const clean = serial.replace(/[^0-9a-fA-F]/g, '');
  return clean.match(/.{1,2}/g)?.join(':').toUpperCase() || serial;
}

export function parseWebNdefMessage(
  serialNumber: string,
  records: readonly NDEFRecord[]
): ParsedTag {
  return {
    id: formatSerialNumber(serialNumber),
    serialNumber: serialNumber || '04:A2:3B:5C:88:9F:E1',
    isWritable: true,
    records: records.map(parseWebNdefRecord),
    timestamp: new Date().toLocaleTimeString(),
  };
}
