import React, { useState, useEffect } from 'react';
import { HardDrive, AlertCircle, Info } from 'lucide-react';
import { getStorageInfo, formatSize, StorageInfo } from '../lib/storageInfo';
import { motion } from 'motion/react';

export const StorageCard: React.FC = () => {
  const [data, setData] = useState<StorageInfo | null>(null);

  useEffect(() => {
    // Refresh on mount
    setData(getStorageInfo());
  }, []);

  if (!data) return null;

  const getProgressColor = () => {
    switch (data.level) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const getLightBgColor = () => {
    switch (data.level) {
      case 'critical': return 'bg-red-50';
      case 'warning': return 'bg-amber-50';
      default: return 'bg-emerald-50';
    }
  };

  const getTextColor = () => {
    switch (data.level) {
      case 'critical': return 'text-red-700';
      case 'warning': return 'text-amber-700';
      default: return 'text-emerald-700';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${getLightBgColor()} ${getTextColor()}`}>
            <HardDrive size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base md:text-lg">
              Storage Status
              <span className="block text-[10px] md:text-xs text-slate-400 font-medium italic mt-0.5">Depolama Durumu</span>
            </h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg md:text-xl font-black text-slate-800">{data.usedMB.toFixed(2)} <span className="text-xs text-slate-400 font-bold">MB</span></p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">~{data.limitMB} MB Limit</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${data.percentUsed}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${getProgressColor()} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
          />
        </div>
        <div className="flex justify-between items-center px-1">
          <p className="text-[10px] md:text-xs text-slate-500 font-bold">
            {data.usedMB.toFixed(2)} MB used of ~{data.limitMB} MB
            <span className="block text-[9px] md:text-[10px] italic font-medium opacity-70">
              {data.usedMB.toFixed(2)} MB / ~{data.limitMB} MB kullanıldı
            </span>
          </p>
          <p className={`text-sm md:text-base font-black ${getTextColor()}`}>
            {data.percentUsed.toFixed(0)}%
          </p>
        </div>
      </div>

      {data.level === 'critical' && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <p className="text-xs font-black text-red-900 leading-tight">
              Storage is getting full. Consider exporting a backup.
            </p>
            <p className="text-[11px] font-bold text-red-700 italic leading-tight">
              Depolama doluyor. Bir yedek almayı düşünün.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
          <Info size={12} />
          <span>Breakdown / Dağılım</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {data.breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between group py-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-base group-hover:bg-slate-100 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-slate-700">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium italic">{item.labelTr}</p>
                </div>
              </div>
              <p className="text-xs md:text-sm font-black text-slate-500">
                {formatSize(item.bytes)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
