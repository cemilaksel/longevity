import { useState, useMemo } from 'react';
import { formatTurkishDate, formatTurkishLongMonth } from '../lib/dateUtils';

export function useAppLogic() {
  const [activeTab, setActiveTab] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [baseDate, setBaseDate] = useState(new Date());

  const dynamicDates = useMemo(() => {
    const formatted = formatTurkishDate(baseDate);
    const bugunUzun = formatTurkishLongMonth(baseDate);
    return { ...formatted, bugunUzun };
  }, [baseDate]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const nextStep = () => setActiveTab(prev => Math.min(8, prev + 1));
  const prevStep = () => setActiveTab(prev => Math.max(1, prev - 1));

  return {
    activeTab,
    setActiveTab,
    copiedId,
    copyToClipboard,
    nextStep,
    prevStep,
    baseDate,
    setBaseDate,
    dynamicDates
  };
}
