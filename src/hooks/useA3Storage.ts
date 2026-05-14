import { useState, useEffect, useCallback } from 'react';
import { A3DailyRecord, A3FormState } from '../types';

export function useA3Storage() {
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('a3_custom_categories');
    return saved ? JSON.parse(saved) : [];
  });

  const [a3Form, setA3Form] = useState<A3FormState>(() => {
    return {
      theme: localStorage.getItem('a3_last_theme') || '',
      period: (localStorage.getItem('a3_last_period') as any) || 'week',
      background: localStorage.getItem('a3_last_background') || '',
      target: localStorage.getItem('a3_last_target') || '',
    };
  });

  useEffect(() => {
    localStorage.setItem('a3_custom_categories', JSON.stringify(customCategories));
  }, [customCategories]);

  useEffect(() => {
    localStorage.setItem('a3_last_theme', a3Form.theme);
    localStorage.setItem('a3_last_period', a3Form.period);
    localStorage.setItem('a3_last_background', a3Form.background);
    localStorage.setItem('a3_last_target', a3Form.target);
  }, [a3Form]);

  const addCustomCategory = (category: string) => {
    if (!customCategories.includes(category)) {
      setCustomCategories([...customCategories, category]);
    }
  };

  const saveDailyRecord = (record: A3DailyRecord) => {
    const saved = localStorage.getItem('a3_daily_records');
    const records: { [date: string]: A3DailyRecord } = saved ? JSON.parse(saved) : {};
    records[record.date] = record;
    localStorage.setItem('a3_daily_records', JSON.stringify(records));
  };

  const getDailyRecord = (date: string): A3DailyRecord | null => {
    const saved = localStorage.getItem('a3_daily_records');
    if (!saved) return null;
    const records: { [date: string]: A3DailyRecord } = JSON.parse(saved);
    return records[date] || null;
  };

  const getRecordsForPeriod = (period: 'week' | 'month' | 'quarter', baseDate: Date): A3DailyRecord[] => {
    const saved = localStorage.getItem('a3_daily_records');
    if (!saved) return [];
    const records: { [date: string]: A3DailyRecord } = JSON.parse(saved);
    
    const now = new Date(baseDate);
    let days = 7;
    if (period === 'month') days = 30;
    if (period === 'quarter') days = 90;

    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);

    return Object.values(records).filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= startDate && recordDate <= now;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return {
    customCategories,
    addCustomCategory,
    a3Form,
    setA3Form,
    saveDailyRecord,
    getDailyRecord,
    getRecordsForPeriod
  };
}
