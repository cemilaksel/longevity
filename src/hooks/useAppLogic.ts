import { useState } from 'react';

export function useAppLogic() {
  const [activeTab, setActiveTab] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    prevStep
  };
}
