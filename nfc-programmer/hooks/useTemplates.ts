import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecordType } from '../constants/theme';

export interface NfcTemplate {
  id: string;
  name: string;
  type: RecordType;
  data: Record<string, string>;
  createdAt: number;
  usageCount: number;
}

const STORAGE_KEY = '@nfc_programmer:templates';

export function useTemplates() {
  const [templates, setTemplates] = useState<NfcTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Load templates from storage
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: NfcTemplate[] = JSON.parse(raw);
        setTemplates(parsed.sort((a, b) => b.createdAt - a.createdAt));
      }
    } catch (e) {
      console.warn('Failed to load templates:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = useCallback(async (items: NfcTemplate[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save templates:', e);
    }
  }, []);

  const addTemplate = useCallback(
    async (template: Omit<NfcTemplate, 'id' | 'createdAt' | 'usageCount'>) => {
      const newTemplate: NfcTemplate = {
        ...template,
        id: `template_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        createdAt: Date.now(),
        usageCount: 0,
      };
      const updated = [newTemplate, ...templates];
      setTemplates(updated);
      await saveToStorage(updated);
      return newTemplate;
    },
    [templates, saveToStorage]
  );

  const updateTemplate = useCallback(
    async (id: string, changes: Partial<Omit<NfcTemplate, 'id' | 'createdAt'>>) => {
      const updated = templates.map((t) => (t.id === id ? { ...t, ...changes } : t));
      setTemplates(updated);
      await saveToStorage(updated);
    },
    [templates, saveToStorage]
  );

  const deleteTemplate = useCallback(
    async (id: string) => {
      const updated = templates.filter((t) => t.id !== id);
      setTemplates(updated);
      await saveToStorage(updated);
    },
    [templates, saveToStorage]
  );

  const incrementUsage = useCallback(
    async (id: string) => {
      await updateTemplate(id, {
        usageCount: (templates.find((t) => t.id === id)?.usageCount ?? 0) + 1,
      });
    },
    [templates, updateTemplate]
  );

  return {
    templates,
    loading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    incrementUsage,
    reload: loadTemplates,
  };
}
