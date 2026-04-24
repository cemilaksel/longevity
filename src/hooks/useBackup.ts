import { useState, useCallback, useEffect } from 'react';

export interface BackupData {
  version: string;
  appName: string;
  exportDate: string;
  exportDateFormatted: string;
  user: string;
  data: {
    [key: string]: any;
  };
}

export function useBackup() {
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(
    localStorage.getItem('last_backup_date')
  );

  const getAllStorageData = useCallback(() => {
    const data: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        try {
          data[key] = JSON.parse(value || '');
        } catch (e) {
          data[key] = value;
        }
      }
    }
    return data;
  }, []);

  const exportData = useCallback(() => {
    try {
      const backup: BackupData = {
        version: '1.0',
        appName: 'Longevity Guide',
        exportDate: new Date().toISOString(),
        exportDateFormatted: new Date().toLocaleString('tr-TR'),
        user: 'Cemil Aksel Akademi Öğrencisi',
        data: getAllStorageData()
      };

      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const today = new Date().toISOString().split('T')[0];
      const fileName = `longevity-yedek-${today}.json`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      const now = new Date().toISOString();
      localStorage.setItem('last_backup_date', now);
      setLastBackupDate(now);
      
      return { success: true, fileName };
    } catch (error) {
      console.error('Export error:', error);
      return { success: false };
    }
  }, [getAllStorageData]);

  const importData = useCallback((backup: BackupData) => {
    try {
      localStorage.clear();
      
      const storageData = backup.data;
      Object.keys(storageData).forEach(key => {
        const val = storageData[key];
        if (typeof val === 'object' && val !== null) {
          localStorage.setItem(key, JSON.stringify(val));
        } else if (val !== null && val !== undefined) {
          localStorage.setItem(key, String(val));
        }
      });
      
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }, []);

  const resetData = useCallback(() => {
    localStorage.clear();
  }, []);

  const getStorageStats = useCallback(() => {
    const longevityURL = localStorage.getItem('longevity_chat_url');
    const personsStr = localStorage.getItem('msproject_persons');
    const persons = personsStr ? JSON.parse(personsStr) : {};
    const personsCount = Object.keys(persons).length;
    
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) totalSize += (localStorage.getItem(key) || '').length;
    }
    
    return {
      hasLongevity: !!longevityURL,
      personsCount,
      sizeKB: (totalSize / 1024).toFixed(2)
    };
  }, []);

  return {
    exportData,
    importData,
    resetData,
    lastBackupDate,
    getStorageStats
  };
}
