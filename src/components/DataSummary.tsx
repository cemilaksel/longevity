import React from 'react';
import { Leaf, Users, ShieldCheck, HardDrive, Book } from 'lucide-react';

interface DataSummaryProps {
  stats: {
    hasLongevity: boolean;
    longevityDate: string | null;
    personsCount: number;
    allPersonsHaveChat: boolean;
    journalCount: number;
    sizeKB: string;
    lastBackupDate: string | null;
  };
}

export const DataSummary: React.FC<DataSummaryProps> = ({ stats }) => {
  const formatDate = (isoStr: string | null) => {
    if (!isoStr) return 'Yok';
    try {
      return new Date(isoStr).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return 'Geçersiz';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {/* Longevity Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-xl ${stats.hasLongevity ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
          <Leaf size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Longevity</p>
          <p className="text-sm font-black text-slate-800">
            {stats.hasLongevity ? '✅ Kayıtlı' : '❌ Kayıt yok'}
          </p>
          {stats.hasLongevity && stats.longevityDate && (
            <p className="text-[10px] text-slate-400">{formatDate(stats.longevityDate)}</p>
          )}
        </div>
      </div>

      {/* Persons Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-xl ${stats.personsCount > 0 ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
          <Users size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MS Project</p>
          <p className="text-sm font-black text-slate-800">
            {stats.personsCount} Kişi {stats.allPersonsHaveChat && stats.personsCount > 0 && <span className="text-blue-500">✓</span>}
          </p>
        </div>
      </div>

      {/* Journal Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-xl ${stats.journalCount > 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
          <Book size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Günlük</p>
          <p className="text-sm font-black text-slate-800">
            {stats.journalCount} Kayıt
          </p>
        </div>
      </div>

      {/* Backup Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-xl ${stats.lastBackupDate ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Son Yedek</p>
          <p className="text-sm font-black text-slate-800">
            {stats.lastBackupDate ? formatDate(stats.lastBackupDate) : 'Yedek yok'}
          </p>
        </div>
      </div>

      {/* Size Box */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
          <HardDrive size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Boyut</p>
          <p className="text-sm font-black text-slate-800">{stats.sizeKB} KB</p>
        </div>
      </div>
    </div>
  );
};
