import { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '../types';

export function useJournal() {
  const [entries, setEntries] = useState<Record<string, JournalEntry>>({});

  useEffect(() => {
    const saved = localStorage.getItem('journal_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = (date: string, entry: JournalEntry) => {
    const newEntries = { ...entries, [date]: entry };
    setEntries(newEntries);
    localStorage.setItem('journal_entries', JSON.stringify(newEntries));
  };

  const deleteEntry = (date: string) => {
    const newEntries = { ...entries };
    delete newEntries[date];
    setEntries(newEntries);
    localStorage.setItem('journal_entries', JSON.stringify(newEntries));
  };

  const getStats = useCallback(() => {
    const dates = Object.keys(entries);
    const now = new Date();
    const thisMonth = now.toISOString().substring(0, 7);
    const countThisMonth = dates.filter(d => d.startsWith(thisMonth)).length;
    
    return {
      total: dates.length,
      thisMonth: countThisMonth
    };
  }, [entries]);

  const getEntriesForPeriod = useCallback((period: 'week' | 'month' | 'quarter', baseDate: Date) => {
    const dates = Object.keys(entries).sort().reverse();
    const result: { date: string, entry: JournalEntry }[] = [];
    
    const start = new Date(baseDate);
    if (period === 'week') start.setDate(start.getDate() - 7);
    else if (period === 'month') start.setMonth(start.getMonth() - 1);
    else if (period === 'quarter') start.setMonth(start.getMonth() - 3);

    dates.forEach(date => {
      const d = new Date(date);
      if (d >= start && d <= baseDate) {
        result.push({ date, entry: entries[date] });
      }
    });

    return result;
  }, [entries]);

  return {
    entries,
    saveEntry,
    deleteEntry,
    getStats,
    getEntriesForPeriod
  };
}
