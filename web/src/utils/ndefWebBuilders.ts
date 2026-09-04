import { NDEFRecordInit, VCardData, WiFiData, EmailData, LocationData } from '../types/nfc';
import { RecordType } from '../constants/theme';

export function buildUrlRecord(url: string): NDEFRecordInit {
  const normalized = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  return {
    recordType: 'url',
    data: normalized,
  };
}

export function buildTextRecord(text: string): NDEFRecordInit {
  return {
    recordType: 'text',
    data: text,
  };
}

export function buildPhoneRecord(phone: string): NDEFRecordInit {
  const normalized = phone.replace(/\s+/g, '');
  return {
    recordType: 'url',
    data: `tel:${normalized}`,
  };
}

export function buildEmailRecord({ to, subject, body }: EmailData): NDEFRecordInit {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  const uri = `mailto:${to}${query ? `?${query}` : ''}`;
  return {
    recordType: 'url',
    data: uri,
  };
}

export function buildLocationRecord({ latitude, longitude, label }: LocationData): NDEFRecordInit {
  const uri = label
    ? `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(label)})`
    : `geo:${latitude},${longitude}`;
  return {
    recordType: 'url',
    data: uri,
  };
}

export function buildVCardRecord(data: VCardData): NDEFRecordInit {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${fullName}`,
    `N:${data.lastName || ''};${data.firstName};;;`,
  ];
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.website) lines.push(`URL:${data.website}`);
  if (data.address) lines.push(`ADR:;;${data.address};;;;`);
  lines.push('END:VCARD');

  const vCardString = lines.join('\r\n');
  return {
    recordType: 'mime',
    mediaType: 'text/vcard',
    data: new TextEncoder().encode(vCardString),
  };
}

export function buildWiFiRecord({ ssid, password, security }: WiFiData): NDEFRecordInit {
  // We provide the standard Android/iOS WFA WSC TLV credential payload
  function encodeField(type: number, value: string): Uint8Array {
    const valueBytes = new TextEncoder().encode(value);
    const buf = new Uint8Array(4 + valueBytes.length);
    const view = new DataView(buf.buffer);
    view.setUint16(0, type, false);
    view.setUint16(2, valueBytes.length, false);
    buf.set(valueBytes, 4);
    return buf;
  }

  function encodeFieldBytes(type: number, value: Uint8Array): Uint8Array {
    const buf = new Uint8Array(4 + value.length);
    const view = new DataView(buf.buffer);
    view.setUint16(0, type, false);
    view.setUint16(2, value.length, false);
    buf.set(value, 4);
    return buf;
  }

  function concat(...arrays: Uint8Array[]): Uint8Array {
    const total = arrays.reduce((sum, a) => sum + a.length, 0);
    const result = new Uint8Array(total);
    let offset = 0;
    for (const a of arrays) {
      result.set(a, offset);
      offset += a.length;
    }
    return result;
  }

  const AUTH_TYPE: Record<string, number> = { WPA: 0x0022, WEP: 0x0002, nopass: 0x0001 };
  const ENC_TYPE: Record<string, number> = { WPA: 0x000c, WEP: 0x0002, nopass: 0x0001 };

  const ssidField = encodeField(0x1045, ssid);
  const authField = encodeFieldBytes(0x1003, new Uint8Array([0x00, AUTH_TYPE[security] & 0xff]));
  const encField = encodeFieldBytes(0x100f, new Uint8Array([0x00, ENC_TYPE[security] & 0xff]));
  const keyField = encodeField(0x1027, password || '');
  const macField = encodeFieldBytes(0x1020, new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));

  const credential = concat(ssidField, authField, encField, keyField, macField);
  const credentialField = encodeFieldBytes(0x100e, credential);

  return {
    recordType: 'mime',
    mediaType: 'application/vnd.wfa.wsc',
    data: credentialField,
  };
}

export function buildNdefRecord(type: RecordType, data: Record<string, string>): NDEFRecordInit {
  switch (type) {
    case 'url':
      return buildUrlRecord(data.url ?? '');
    case 'vcard':
      return buildVCardRecord({
        firstName: data.firstName ?? '',
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        organization: data.organization,
        title: data.title,
        website: data.website,
        address: data.address,
      });
    case 'wifi':
      return buildWiFiRecord({
        ssid: data.ssid ?? '',
        password: data.password,
        security: (data.security as any) ?? 'WPA',
      });
    case 'text':
      return buildTextRecord(data.text ?? '');
    case 'email':
      return buildEmailRecord({
        to: data.to ?? '',
        subject: data.subject,
        body: data.body,
      });
    case 'phone':
      return buildPhoneRecord(data.phone ?? '');
    case 'location':
      return buildLocationRecord({
        latitude: parseFloat(data.latitude || '0'),
        longitude: parseFloat(data.longitude || '0'),
        label: data.label,
      });
  }
}
