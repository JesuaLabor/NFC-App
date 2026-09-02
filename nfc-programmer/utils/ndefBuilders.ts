import { Ndef } from 'react-native-nfc-manager';

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
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
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

// ── URL Record ────────────────────────────────────────────────────────────────
export function buildUrlRecord(url: string) {
  const normalized = url.startsWith('http') ? url : `https://${url}`;
  return Ndef.uriRecord(normalized);
}

// ── Text Record ───────────────────────────────────────────────────────────────
export function buildTextRecord(text: string, lang = 'en') {
  return Ndef.textRecord(text, lang);
}

// ── Phone Record ──────────────────────────────────────────────────────────────
export function buildPhoneRecord(phone: string) {
  const normalized = phone.replace(/\s+/g, '');
  return Ndef.uriRecord(`tel:${normalized}`);
}

// ── Email Record ──────────────────────────────────────────────────────────────
export function buildEmailRecord({ to, subject, body }: EmailData) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  const uri = `mailto:${to}${query ? `?${query}` : ''}`;
  return Ndef.uriRecord(uri);
}

// ── Location Record ───────────────────────────────────────────────────────────
export function buildLocationRecord({ latitude, longitude, label }: LocationData) {
  const uri = label
    ? `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(label)})`
    : `geo:${latitude},${longitude}`;
  return Ndef.uriRecord(uri);
}

// ── vCard Record ──────────────────────────────────────────────────────────────
export function buildVCardRecord(data: VCardData) {
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
  const encoded = encodeURIComponent(vCardString);

  // Use MIME record for vCard — most compatible approach
  return Ndef.record(Ndef.TNF_MIME_MEDIA, 'text/vcard', '', vCardString);
}

// ── Wi-Fi Record ──────────────────────────────────────────────────────────────
// WFA WSC format — Android will auto-connect, iOS shows in settings
export function buildWiFiRecord({ ssid, password, security, hidden = false }: WiFiData): any {
  // Build WFA WSC TLV structure
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
  const ENC_TYPE: Record<string, number> = { WPA: 0x000C, WEP: 0x0002, nopass: 0x0001 };

  const ssidField = encodeField(0x1045, ssid);
  const authField = encodeFieldBytes(0x1003, new Uint8Array([0x00, AUTH_TYPE[security] & 0xff]));
  const encField = encodeFieldBytes(0x100F, new Uint8Array([0x00, ENC_TYPE[security] & 0xff]));
  const keyField = encodeField(0x1027, password);
  const macField = encodeFieldBytes(0x1020, new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff]));

  const credential = concat(ssidField, authField, encField, keyField, macField);
  const credentialField = encodeFieldBytes(0x100E, credential);

  return Ndef.record(Ndef.TNF_MIME_MEDIA, 'application/vnd.wfa.wsc', '', Array.from(credentialField) as any);
}

// ── Encode full NDEF message ──────────────────────────────────────────────────
export function encodeNdefMessage(records: any[]): number[] {
  return Ndef.encodeMessage(records);
}
