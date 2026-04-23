import { useState, useEffect, useCallback } from 'react';

export type GPTType = 'longevity' | 'msproject';

export interface GPTSession {
  url: string;
  date: string;
}

export function useGPTStorage() {
  const [longevitySession, setLongevitySession] = useState<GPTSession | null>(null);
  const [msprojectSession, setMsprojectSession] = useState<GPTSession | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const cleanOldChats = useCallback(() => {
    ['longevity', 'msproject'].forEach(type => {
      const dateStr = localStorage.getItem(`${type}_chat_date`);
      if (dateStr) {
        const days = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
        if (days > 7) {
          localStorage.removeItem(`${type}_chat_url`);
          localStorage.removeItem(`${type}_chat_date`);
        }
      }
    });
  }, []);

  const loadSessions = useCallback(() => {
    const lUrl = localStorage.getItem('longevity_chat_url');
    const lDate = localStorage.getItem('longevity_chat_date');
    const mUrl = localStorage.getItem('msproject_chat_url');
    const mDate = localStorage.getItem('msproject_chat_date');

    if (lUrl && lDate) setLongevitySession({ url: lUrl, date: lDate });
    else setLongevitySession(null);

    if (mUrl && mDate) setMsprojectSession({ url: mUrl, date: mDate });
    else setMsprojectSession(null);
  }, []);

  useEffect(() => {
    cleanOldChats();
    loadSessions();
  }, [cleanOldChats, loadSessions]);

  const saveChatURL = (gptType: GPTType, url: string) => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      showNotification('❌ URL boş olamaz!', 'error');
      return false;
    }
    if (!trimmedUrl.includes('chatgpt.com')) {
      showNotification('❌ Geçersiz URL! chatgpt.com içermeli', 'error');
      return false;
    }

    try {
      localStorage.setItem(`${gptType}_chat_url`, trimmedUrl);
      localStorage.setItem(`${gptType}_chat_date`, new Date().toISOString());
      loadSessions();
      showNotification('✅ Sohbet kaydedildi!', 'success');
      return true;
    } catch (e) {
      showNotification('❌ Kayıt hatası!', 'error');
      return false;
    }
  };

  const getSession = (gptType: GPTType) => {
    return gptType === 'longevity' ? longevitySession : msprojectSession;
  };

  return {
    saveChatURL,
    getSession,
    notification,
    showNotification
  };
}

export function formatChatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const saat = date.getHours().toString().padStart(2, '0');
  const dakika = date.getMinutes().toString().padStart(2, '0');
  
  if (hours < 24) return `Bugün ${saat}:${dakika}`;
  if (hours < 48) return `Dün ${saat}:${dakika}`;
  
  const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${date.getDate()} ${aylar[date.getMonth()]} ${saat}:${dakika}`;
}
