import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  Database, 
  AlertTriangle, 
  Check, 
  X,
  FileJson,
  RefreshCw,
  User,
  Leaf
} from 'lucide-react';
import { useBackup, BackupData } from '../hooks/useBackup';
import { motion, AnimatePresence } from 'motion/react';

interface BackupSectionProps {
  onNotify: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const BackupSection: React.FC<BackupSectionProps> = ({ onNotify }) => {
  const { exportData, importData, resetData, lastBackupDate, getStorageStats } = useBackup();
  const [showImportModal, setShowImportModal] = useState<BackupData | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [stats, setStats] = useState(getStorageStats());
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    // Update stats periodically or on mount
    setStats(getStorageStats());

    // Check last backup for reminder
    const checkReminder = () => {
      if (!lastBackupDate) {
        setTimeout(() => setShowReminder(true), 10000);
      } else {
        const daysSince = (new Date().getTime() - new Date(lastBackupDate).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince > 7) {
          setTimeout(() => setShowReminder(true), 5000);
        }
      }
    };
    checkReminder();
  }, [lastBackupDate, getStorageStats]);

  const handleExport = () => {
    const result = exportData();
    if (result.success) {
      onNotify(`✅ Yedek indirildi: ${result.fileName}`, 'success');
      setStats(getStorageStats());
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
    <section className="container mx-auto px-4 my-10 max-w-4xl">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 border border-white/50 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shadow-sm">
              <Database size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Veri Yedekleme</h3>
              <p className="text-sm text-slate-500 font-medium">Verilerinizi yedekleyin veya başka cihaza taşıyın</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
              Sürüm 1.0
            </span>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-amber-900 font-medium leading-relaxed">
            <strong>Önemli:</strong> Tarayıcı temizlenirse verileriniz kaybolabilir. Düzenli yedekleme yapmanızı öneriyoruz.
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleExport}
            className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold transition shadow-lg active:scale-95 flex flex-col items-center gap-2"
          >
            <Download size={24} className="group-hover:bounce" />
            <span>Verileri İndir</span>
          </button>

          <label className="group relative overflow-hidden bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-bold transition shadow-lg active:scale-95 flex flex-col items-center gap-2 cursor-pointer text-center">
            <Upload size={24} />
            <span>Verileri Yükle</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          <button 
            onClick={() => setShowResetModal(true)}
            className="group relative overflow-hidden bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-bold transition shadow-lg active:scale-95 flex flex-col items-center gap-2"
          >
            <Trash2 size={24} />
            <span>Tümünü Sıfırla</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="pt-6 border-t border-slate-100">
          <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            <RefreshCw size={14} className="text-blue-500" />
            Kayıtlı Verileriniz
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <Leaf className={stats.hasLongevity ? "text-green-500" : "text-slate-300"} size={20} />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Longevity Guide</p>
                <p className={`text-xs font-bold ${stats.hasLongevity ? "text-slate-700" : "text-slate-400"}`}>
                  {stats.hasLongevity ? "✅ Kayıt Var" : "❌ Kayıt Yok"}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <User className={stats.personsCount > 0 ? "text-purple-500" : "text-slate-300"} size={20} />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">MS Project Pro</p>
                <p className="text-xs font-bold text-slate-700">{stats.personsCount} Kişi</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
              <FileJson className="text-blue-500" size={20} />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Toplam Boyut</p>
                <p className="text-xs font-bold text-slate-700">{stats.sizeKB} KB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
              <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                <Upload className="text-green-500" size={28} />
                Yedeği Yükle
              </h3>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 space-y-2">
                <p className="text-sm font-medium text-slate-600">
                  📅 <strong>Yedek Tarihi:</strong> {showImportModal.exportDateFormatted}
                </p>
                <div className="text-sm font-medium text-slate-600">
                  📊 <strong>İçerik:</strong>
                  <ul className="mt-1 ml-4 space-y-1 list-disc text-slate-500">
                    <li>{showImportModal.data.longevity_chat_url ? "✅ Longevity Guide sohbeti" : "❌ Longevity Guide kaydı yok"}</li>
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
                  İptal
                </button>
                <button 
                  onClick={confirmImport}
                  className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200 active:scale-95"
                >
                  Yükle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <h3 className="text-2xl font-black text-red-600 mb-4 flex items-center gap-3">
                <AlertTriangle size={28} />
                Verileri Sıfırla
              </h3>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 space-y-3">
                <p className="text-sm font-bold text-red-900 leading-relaxed">
                  Bu işlem GERİ ALINAMAZ! Tüm kayıtlı sohbet URL'leri ve kişi bilgileri kalıcı olarak silinecektir.
                </p>
                <p className="text-xs text-red-700 font-medium italic">
                  * Önce "Verileri İndir" ile yedek almanızı öneriyoruz.
                </p>
              </div>

              <label className="flex items-center gap-3 mb-8 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                <input 
                  type="checkbox" 
                  checked={resetConfirmed}
                  onChange={(e) => setResetConfirmed(e.target.checked)}
                  className="w-5 h-5 accent-red-600" 
                />
                <span className="text-sm font-bold text-slate-700">Anladım, tüm verilerimi sil</span>
              </label>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  İptal
                </button>
                <button 
                  onClick={executeReset}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200 active:scale-95"
                >
                  Sıfırla
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Backup Reminder Popup */}
      <AnimatePresence>
        {showReminder && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2">
              <button onClick={() => setShowReminder(false)} className="text-amber-500 hover:text-amber-700 p-1">
                <X size={20} />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 h-fit">
                <Download size={24} />
              </div>
              <div className="flex-1">
                <h5 className="font-black text-slate-800 text-sm mb-1 uppercase tracking-tight">Yedekleme Zamanı!</h5>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                  {lastBackupDate ? "Son yedeğinizden beri zaman geçti." : "Henüz hiç yedek almadınız."} Verilerinizi korumak için şimdi yedekleyin.
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      handleExport();
                      setShowReminder(false);
                    }}
                    className="flex-1 py-2 bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition"
                  >
                    Şimdi Yedekle
                  </button>
                  <button 
                    onClick={() => setShowReminder(false)}
                    className="flex-1 py-2 bg-slate-200 text-slate-600 font-bold rounded-xl text-xs active:scale-95 transition"
                  >
                    Hatırlat
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
