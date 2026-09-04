import { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { WriteView } from './views/WriteView';
import { ReadView } from './views/ReadView';
import { TemplatesView } from './views/TemplatesView';
import { NfcModal } from './components/NfcModal';
import { InstallModal } from './components/InstallModal';
import { useWebNfc } from './hooks/useWebNfc';
import { useTemplates } from './hooks/useTemplates';
import { RecordType } from './constants/theme';
import { NfcTemplate, ParsedTag, NDEFRecordInit } from './types/nfc';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedType, setSelectedType] = useState<RecordType>('url');
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [modalMode, setModalMode] = useState<'read' | 'write'>('read');
  const [pendingRecord, setPendingRecord] = useState<NDEFRecordInit | null>(null);
  const [pendingTemplateInfo, setPendingTemplateInfo] = useState<{
    name: string;
    type: RecordType;
    data: Record<string, string>;
  } | null>(null);

  // PWA Install states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isIos, setIsIos] = useState(false);

  // Web NFC Hook
  const {
    status,
    error,
    tag,
    isSupported,
    isSimulation,
    setIsSimulation,
    readTag,
    writeTag,
    cancelScan,
    reset,
    simulateTagScan,
  } = useWebNfc();

  // Templates Hook
  const { templates, addTemplate, deleteTemplate, incrementUsage } = useTemplates();

  // Listen for PWA installation prompts and URL query params
  useEffect(() => {
    // Check iOS user agent
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Read initial tab from URL query if opened via PWA shortcut
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'write', 'read', 'templates'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // Capture beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Register Service Worker for offline capability
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('NFC Programmer PWA Service Worker active.'))
        .catch((err) => console.warn('Service worker registration failed:', err));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // ── Handle Read Tag ───────────────────────────────────────────────────────
  const handleStartScan = async () => {
    setModalMode('read');
    setShowNfcModal(true);
    await readTag();
  };

  // ── Handle Write Tag ──────────────────────────────────────────────────────
  const handleInitiateWrite = async (
    record: NDEFRecordInit,
    templateName?: string,
    rawFormData?: Record<string, string>
  ) => {
    setPendingRecord(record);
    if (templateName && rawFormData) {
      setPendingTemplateInfo({
        name: templateName,
        type: selectedType,
        data: rawFormData,
      });
    } else {
      setPendingTemplateInfo(null);
    }

    setModalMode('write');
    setShowNfcModal(true);

    const success = await writeTag([record]);
    if (success && templateName && rawFormData) {
      await addTemplate({
        name: templateName,
        type: selectedType,
        data: rawFormData,
      });
    }
  };

  // ── Handle Write from Saved Template ──────────────────────────────────────
  const handleWriteTemplate = async (template: NfcTemplate, record: NDEFRecordInit) => {
    setPendingRecord(record);
    setPendingTemplateInfo(null);
    setModalMode('write');
    setShowNfcModal(true);

    const success = await writeTag([record]);
    if (success) {
      await incrementUsage(template.id);
    }
  };

  // ── Modal Actions ─────────────────────────────────────────────────────────
  const handleModalCancel = () => {
    cancelScan();
    setShowNfcModal(false);
  };

  const handleModalDone = () => {
    if (modalMode === 'read' && tag) {
      // Keep tag in read view
    } else {
      reset();
    }
    setShowNfcModal(false);
  };

  const handleModalRetry = async () => {
    if (modalMode === 'read') {
      await readTag();
    } else if (pendingRecord) {
      const success = await writeTag([pendingRecord]);
      if (success && pendingTemplateInfo) {
        await addTemplate(pendingTemplateInfo);
      }
    }
  };

  // ── PWA Installation Trigger ──────────────────────────────────────────────
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSupported={isSupported}
        isSimulation={isSimulation}
        onToggleSimulation={() => {
          if (isSupported) {
            setIsSimulation(!isSimulation);
          } else {
            alert(
              'Your current browser does not have the native Web NFC API (window.NDEFReader). Running in Tag Simulation mode so you can test all features.'
            );
          }
        }}
        canInstall={true}
        onInstallClick={handleInstallClick}
      />

      <main className="app-main">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            templates={templates}
            isSupported={isSupported}
            isSimulation={isSimulation}
            onSelectTypeForWrite={(type) => setSelectedType(type)}
          />
        )}

        {activeTab === 'write' && (
          <WriteView
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            onInitiateWrite={handleInitiateWrite}
          />
        )}

        {activeTab === 'read' && (
          <ReadView
            scannedTag={tag}
            onScanClick={handleStartScan}
            onClear={() => reset()}
            onSimulatePreset={(mockTag: ParsedTag) => simulateTagScan(mockTag)}
            isSimulation={isSimulation}
            isSupported={isSupported}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesView
            templates={templates}
            onWriteTemplate={handleWriteTemplate}
            onDeleteTemplate={deleteTemplate}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* NFC Interactive Scanning / Writing Modal */}
      <NfcModal
        visible={showNfcModal}
        status={status}
        mode={modalMode}
        error={error}
        onCancel={handleModalCancel}
        onDone={handleModalDone}
        onRetry={handleModalRetry}
      />

      {/* Install PWA Guide Modal */}
      <InstallModal
        visible={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onNativeInstall={
          deferredPrompt
            ? async () => {
                deferredPrompt.prompt();
                setDeferredPrompt(null);
                setShowInstallModal(false);
              }
            : undefined
        }
        isIos={isIos}
      />
    </>
  );
}
