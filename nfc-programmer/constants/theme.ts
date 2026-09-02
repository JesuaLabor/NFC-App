// Design tokens for NFC Programmer app
export const Colors = {
  background: '#0A0E1A',
  surface: '#111827',
  surfaceElevated: '#1A2235',
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
  textMuted: '#4A5568',


  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Record type colors
  url: '#00D4FF',
  vcard: '#A78BFA',
  wifi: '#34D399',
  textRecord: '#FB923C',
  email: '#F472B6',
  phone: '#60A5FA',
  location: '#FBBF24',
};

export const Gradients = {
  background: ['#0A0E1A', '#0D1526'],
  accent: ['#00D4FF', '#0088CC'],
  card: ['rgba(26, 34, 53, 0.95)', 'rgba(17, 24, 39, 0.95)'],
  success: ['#00E96A', '#00B854'],
  error: ['#FF4D6A', '#CC2244'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  glow: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const RecordTypeConfig = {
  url: {
    label: 'Website URL',
    icon: 'globe-outline',
    color: Colors.url,
    description: 'Link to any website',
  },
  vcard: {
    label: 'Contact Card',
    icon: 'person-circle-outline',
    color: Colors.vcard,
    description: 'Share contact details',
  },
  wifi: {
    label: 'Wi-Fi Network',
    icon: 'wifi-outline',
    color: Colors.wifi,
    description: 'Connect to Wi-Fi',
  },
  text: {
    label: 'Plain Text',
    icon: 'text-outline',
    color: Colors.textRecord,
    description: 'Any custom text',
  },
  email: {
    label: 'Email',
    icon: 'mail-outline',
    color: Colors.email,
    description: 'Open email composer',
  },
  phone: {
    label: 'Phone Number',
    icon: 'call-outline',
    color: Colors.phone,
    description: 'Dial a number',
  },
  location: {
    label: 'Location',
    icon: 'location-outline',
    color: Colors.location,
    description: 'Open in Maps',
  },
} as const;

export type RecordType = keyof typeof RecordTypeConfig;
