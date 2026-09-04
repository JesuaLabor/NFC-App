import { useState, useEffect, useCallback } from 'react';
import { NfcTemplate } from '../types/nfc';
import { RecordType } from '../constants/theme';

const STORAGE_KEY = 'nfc_templates_v1';

const DEFAULT_TEMPLATES: NfcTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Company Website',
    type: 'url',
    data: { url: 'https://example.com' },
    createdAt: Date.now() - 86400000 * 3,
    usageCount: 14,
  },
  {
    id: 'tmpl-2',
    name: 'Executive Contact',
    type: 'vcard',
    data: {
      firstName: 'Alex',
      lastName: 'Chen',
      phone: '+1 (555) 382-9011',
      email: 'alex.chen@innovate.tech',
      organization: 'Innovate Labs',
      title: 'Principal Engineer',
      website: 'https://innovate.tech',
    },
    createdAt: Date.now() - 86400000 * 7,
    usageCount: 28,
  },
  {
    id: 'tmpl-3',
    name: 'Guest Lounge Wi-Fi',
    type: 'wifi',
    data: {
      ssid: 'Guest_HighSpeed_5G',
      password: 'WelcomeGuest2026',
      security: 'WPA',
    },
    createdAt: Date.now() - 86400000 * 12,
    usageCount: 45,
  },
  {
    id: 'tmpl-4',
    name: 'Conference Room B',
    type: 'location',
    data: {
      latitude: '37.7749',
      longitude: '-122.4194',
      label: 'Main HQ Entrance',
    },
    createdAt: Date.now() - 86400000 * 18,
    usageCount: 8,
  },
];

export function useTemplates() {
  const [templates, setTemplates] = useState<NfcTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTemplates(JSON.parse(stored));
      } else {
        // Initialize with default templates
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TEMPLATES));
        setTemplates(DEFAULT_TEMPLATES);
      }
    } catch (e) {
      console.warn('Failed to load templates from localStorage:', e);
      setTemplates(DEFAULT_TEMPLATES);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTemplates = (newTemplates: NfcTemplate[]) => {
    setTemplates(newTemplates);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
    } catch (e) {
      console.warn('Failed to save templates to localStorage:', e);
    }
  };

  const addTemplate = useCallback(
    async (item: { name: string; type: RecordType; data: Record<string, string> }) => {
      const newTemplate: NfcTemplate = {
        id: `tmpl-${Date.now()}`,
        name: item.name,
        type: item.type,
        data: item.data,
        createdAt: Date.now(),
        usageCount: 1,
      };

      setTemplates((prev) => {
        const updated = [newTemplate, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save template:', e);
        }
        return updated;
      });

      return newTemplate;
    },
    []
  );

  const deleteTemplate = useCallback(async (id: string) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to delete template:', e);
      }
      return updated;
    });
  }, []);

  const incrementUsage = useCallback(async (id: string) => {
    setTemplates((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update template usage:', e);
      }
      return updated;
    });
  }, []);

  return {
    templates,
    loading,
    addTemplate,
    deleteTemplate,
    incrementUsage,
    saveTemplates,
  };
}
