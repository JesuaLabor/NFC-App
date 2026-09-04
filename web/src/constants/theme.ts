// Design tokens and record configurations for NFC Programmer Web
export const Colors = {
  background: '#0A0E1A',
  surface: '#111827',
  surfaceElevated: '#1A2235',
  surfaceCard: '#151D2F',
  border: 'rgba(0, 212, 255, 0.15)',
  borderStrong: 'rgba(0, 212, 255, 0.35)',

  accent: '#00D4FF',
  accentDim: 'rgba(0, 212, 255, 0.12)',
  accentGlow: 'rgba(0, 212, 255, 0.25)',

  success: '#00E96A',
  successDim: 'rgba(0, 233, 106, 0.12)',
  warning: '#FFB800',
  warningDim: 'rgba(255, 184, 0, 0.12)',
  error: '#FF4D6A',
  errorDim: 'rgba(255, 77, 106, 0.12)',

  text: '#F0F4FF',
  textSecondary: '#8A9BBE',
  textMuted: '#52607D',

  white: '#FFFFFF',
  black: '#000000',

  // Record type brand colors
  url: '#00D4FF',
  vcard: '#A78BFA',
  wifi: '#34D399',
  textRecord: '#FB923C',
  email: '#F472B6',
  phone: '#60A5FA',
  location: '#FBBF24',
} as const;

export type RecordType = 'url' | 'vcard' | 'wifi' | 'text' | 'email' | 'phone' | 'location';

export interface RecordTypeInfo {
  label: string;
  shortLabel: string;
  iconName: string;
  color: string;
  description: string;
}

export const RecordTypeConfig: Record<RecordType, RecordTypeInfo> = {
  url: {
    label: 'Website URL',
    shortLabel: 'URL',
    iconName: 'Globe',
    color: Colors.url,
    description: 'Direct link to any website or web page',
  },
  vcard: {
    label: 'Contact Card',
    shortLabel: 'Contact',
    iconName: 'UserCheck',
    color: Colors.vcard,
    description: 'Share digital business card & phone contacts',
  },
  wifi: {
    label: 'Wi-Fi Network',
    shortLabel: 'Wi-Fi',
    iconName: 'Wifi',
    color: Colors.wifi,
    description: 'Instant Wi-Fi connection credentials',
  },
  text: {
    label: 'Plain Text',
    shortLabel: 'Text',
    iconName: 'AlignLeft',
    color: Colors.textRecord,
    description: 'Notes, tokens, IDs, or raw messages',
  },
  email: {
    label: 'Email',
    shortLabel: 'Email',
    iconName: 'Mail',
    color: Colors.email,
    description: 'Open mail client with recipient & subject',
  },
  phone: {
    label: 'Phone Number',
    shortLabel: 'Phone',
    iconName: 'Phone',
    color: Colors.phone,
    description: 'Trigger direct phone dialer',
  },
  location: {
    label: 'Location',
    shortLabel: 'Map',
    iconName: 'MapPin',
    color: Colors.location,
    description: 'Open coordinates in Google / Apple Maps',
  },
};
