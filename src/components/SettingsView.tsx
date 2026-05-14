import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle,
  RefreshCw,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBackup, BackupData } from '../hooks/useBackup';
import { usePersonStorage } from '../hooks/usePersonStorage';
import { DataSummary } from './DataSummary';
import { PersonManager } from './PersonManager';

interface SettingsViewProps {
  onNotify: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNotify }) => {
  const { exportData, importData, resetData, getStorageStats, lastBackupDate } = useBackup();
  const { persons, deletePerson, renamePerson } = usePersonStorage();
  
  const [stats, setStats] = useState(getStorageStats());
  const [showImportModal, setShowImportModal] = useState<BackupData | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  // Refresh stats when view opens or data changes
  useEffect(() => {
    setStats(getStorageStats());
  }, [getStorageStats, lastBackupDate, persons.length]);

  const handleExport = () => {
    const result = exportData();
    if (result.success) {
      onNotify(`✅ Yedek indirildi: ${result.fileName}`, 'success');
    } else {
      onNotify('❌ Yedekleme başarısız!', 'error');
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      onNotify('❌ Lütfen JSON dosyası seçin!', 'error');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result as string) as BackupData;
        if (!data.version || !data.data) {
          onNotify('❌ Geçersiz yedek dosyası!', 'error');
          return;
        }
        setShowImportModal(data);
      } catch (error) {
        onNotify('❌ Dosya okunamadı! Hatalı format.', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const confirmImport = () => {
    if (showImportModal) {
      const success = importData(showImportModal);
      if (success) {
        onNotify('✅ Veriler yüklendi! Sayfa yenileniyor...', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        onNotify('❌ Yükleme başarısız!', 'error');
      }
    }
  };

  const executeReset = () => {
    if (!resetConfirmed) {
      onNotify('⚠️ Lütfen onay kutusunu işaretleyin!', 'error');
      return;
    }
    resetData();
    onNotify('✅ Tüm veriler silindi. Sayfa yenileniyor...', 'success');
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-slate-50 border-b border-slate-100 p-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-slate-200 rounded-2xl text-slate-600">
            <Settings size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ayarlar ve Veri Yönetimi</h2>
            <p className="text-sm text-slate-500 font-medium">Verilerinizi yönetin, yedekleyin, kişileri düzenleyin</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* 1. Data Summary Dashboard */}
        <section>
          <DataSummary stats={stats} />
        </section>

        {/* 2. Backup & Restore Section */}
        <section className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
              <Database size={20} />
            </div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Veri Yedekleme ve Kurtarma</h3>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-2">
             <p className="text-xs text-amber-900 font-bold leading-relaxed flex items-center gap-2">
               <AlertTriangle size={14} className="shrink-0" />
               Tarayıcı temizlenirse verileriniz kaybolabilir. Verilerinizi JSON olarak indirerek koruma altına alın.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
            >
              <Download size={20} />
              <span>Verileri İndir (JSON Export)</span>
            </button>
            <label className="flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-black transition-all cursor-pointer active:scale-[0.98]">
              <Upload size={20} className="text-blue-500" />
              <span>Yedek Yükle (Import)</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>
        </section>

        {/* 3. Person Management Section */}
        <section className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
          <PersonManager 
            persons={persons} 
            onRename={renamePerson} 
            onDelete={deletePerson} 
            onNotify={onNotify}
          />
        </section>

        {/* 4. Danger Zone Section */}
        <section className="bg-red-50/30 border border-red-100 rounded-[32px] p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl text-red-600">
              <Trash2 size={20} />
            </div>
            <h3 className="font-bold text-red-800 uppercase tracking-wider text-sm">Tehlikeli Bölge</h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-white rounded-2xl border border-red-100">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">Tüm Verileri Sıfırla</p>
              <p className="text-xs text-slate-500 font-medium italic">Bu işlem geri alınamaz. Lütfen önce yedek aldığınızdan emin olun.</p>
            </div>
            <button 
              onClick={() => setShowResetModal(true)}
              className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              Tümünü Sıfırla
            </button>
          </div>
        </section>
      </div>

      {/* --- Modals --- */}
      
      {/* Import Confirmation */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500" />
              <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                <RefreshCw className="text-blue-500" size={28} />
                Verileri Geri Yükle?
              </h3>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-600">
                  📅 Yedek Tarihi: {showImportModal.exportDateFormatted}
                </p>
                <div className="text-xs font-bold text-slate-600">
                  📊 İçerik Özeti:
                  <ul className="mt-1 ml-4 space-y-1 list-disc text-slate-500">
                    <li>{showImportModal.data.longevity_chat_url ? "✅ Longevity Guide aktif" : "❌ Longevity Guide boş"}</li>
                    <li>👥 MS Project Pro: {Object.keys(showImportModal.data.msproject_persons || {}).length} kişi</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
                <p className="text-xs text-amber-900 font-bold leading-relaxed">
                  ⚠️ UYARI: Mevcut tüm verileriniz silinecek ve yedektekiler yüklenecek. Bu işlem geri alınamaz!
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowImportModal(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Vazgeç
                </button>
                <button 
                  onClick={confirmImport}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
                >
                  Tamam, Yükle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <h3 className="text-2xl font-black text-red-600 mb-4 flex items-center gap-3">
                <AlertTriangle size={28} />
                SİSTEMİ SIFIRLA!
              </h3>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 space-y-3">
                <p className="text-sm font-bold text-red-900 leading-relaxed text-center">
                  DİKKAT! Tüm verileriniz kalıcı olarak silinecek. Uygulama fabrika ayarlarına dönecektir.
                </p>
              </div>

              <label className="flex items-center gap-3 mb-8 cursor-pointer p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition border-2 border-transparent hover:border-red-100">
                <input 
                  type="checkbox" 
                  checked={resetConfirmed}
                  onChange={(e) => setResetConfirmed(e.target.checked)}
                  className="w-5 h-5 accent-red-600" 
                />
                <span className="text-xs font-black text-red-800 uppercase tracking-tighter">Evet, tüm verilerimi silmek istiyorum</span>
              </label>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Vazgeç
                </button>
                <button 
                  onClick={executeReset}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg active:scale-95"
                >
                  Sıfırla
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
