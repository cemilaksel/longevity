import React, { useState } from 'react';
import { Clipboard, Check, Info, FileText, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useA3Storage } from '../hooks/useA3Storage';
import { useGPTStorage } from '../hooks/useGPTStorage';
import { useJournal } from '../hooks/useJournal';
import { GPTButtons } from './GPTButtons';

interface Step9A3ReportProps {
  baseDate: Date;
  onCopyPrompt: (text: string, id: string) => void;
  copiedId: string | null;
}

export const Step9A3Report: React.FC<Step9A3ReportProps> = ({ baseDate, onCopyPrompt, copiedId }) => {
  const { a3Form, setA3Form, getRecordsForPeriod } = useA3Storage();
  const { getEntriesForPeriod } = useJournal();
  const { showNotification } = useGPTStorage();
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [showBlankTemplate, setShowBlankTemplate] = useState(false);

  const gptUrl = 'https://chatgpt.com/g/g-GKsuaDZUU-longevity-guide';
  const gptTitle = 'Longevity Guide';

  const generatePrompt = () => {
    const records = getRecordsForPeriod(a3Form.period, baseDate);
    const journalData = getEntriesForPeriod(a3Form.period, baseDate);
    
    let statsSection = "";
    if (records.length === 0 && journalData.length === 0) {
      statsSection = "Henüz bu döneme ait kayıt yok, lütfen verilerimi soracağın sırada ben gireceğim";
    } else {
      const totalSleep = records.reduce((acc, r) => {
        if (r.sleep.bedTime && r.sleep.wakeTime) {
          const bed = new Date(`2000-01-01T${r.sleep.bedTime}`);
          const wake = new Date(`2000-01-01T${r.sleep.wakeTime}`);
          if (wake < bed) wake.setDate(wake.getDate() + 1);
          return acc + (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
        }
        return acc;
      }, 0);
      const avgSleep = records.length > 0 ? (totalSleep / records.length).toFixed(1) : "0";

      const moodTrend = records.map(r => r.mood?.score || 0).filter(s => s > 0);
      const avgMood = moodTrend.length > 0 ? (moodTrend.reduce((a, b) => a + b, 0) / moodTrend.length).toFixed(1) : "0";

      const totalHoursByCategory: { [key: string]: number } = {};
      records.forEach(r => {
        (r.categories || []).forEach(c => {
          totalHoursByCategory[c.name] = (totalHoursByCategory[c.name] || 0) + c.hours;
        });
      });
      const categoriesSummary = Object.entries(totalHoursByCategory)
        .map(([name, hours]) => `${name}: ${hours} sa`)
        .join(', ');

      const journalSummary = journalData.map(j => {
        const happy = j.entry.happy.filter(h => h.trim()).join(', ');
        const wishes = j.entry.wishes.filter(w => w.trim()).join(', ');
        return `[${j.date}] Mutlu: ${happy} | Dilek: ${wishes} | Rutin: ${j.entry.routineNote}`;
      }).join('\n');

      statsSection = `
- Gün Sayısı (Ölçüm): ${records.length} gün
- Gün Sayısı (Günlük): ${journalData.length} gün
- Uyku Ortalaması: ${avgSleep} saat
- Duygu Durumu Trendi: ${avgMood}/10
- İş/Aktivite Dağılımı: ${categoriesSummary || 'Veri yok'}
- Günlük İçerik Özetleri:
${journalSummary || 'Dönem için günlük kaydı bulunmuyor.'}
- Plan-Gerçek Özeti: ${records.length} günlük plandan önemli çıkarımlar yapılacak.
`.trim();
    }

    const periodText = a3Form.period === 'week' ? 'Bu Hafta' : (a3Form.period === 'month' ? 'Bu Ay' : 'Son 3 Ay (Çeyrek)');

    const prompt = `
═══════════════════════════════════════════
TOYOTA A3 RAPORU — Kişisel Longevity Analizi
═══════════════════════════════════════════

Aşağıdaki verilerimle bir A3 raporu oluşturmama YARDIM ET.
Sen tüm raporu tek seferde yazma — beni DÜŞÜNDÜREREK ilerle.

📋 BENİM GİRDİLERİM
───────────────────
THEME: ${a3Form.theme || 'Belirtilmedi'}
DÖNEM: ${periodText}
BACKGROUND: ${a3Form.background || 'Belirtilmedi'}
TARGET (Hedefim): ${a3Form.target || 'Belirtilmedi'}

📊 DÖNEM VERİLERİM
───────────────────
${statsSection}

🎯 SENİN GÖREVİN — A3'ün 7 bölümünü SIRAYLA işle:
───────────────────
1. THEME: Temamı tek cümlede netleştir, çok genişse daralt.

2. BACKGROUND: Arka planı, problemin önemini özetle.

3. CURRENT CONDITION: Verilerimi özetle. İDEAL durumdan
   sapmaları 'storm burst' olarak işaretle (⚡ ile). Sorunun
   boyutunu ölç (sayısal göster).

4. CAUSE ANALYSIS: Bana 5 WHY sor. KURALLAR:
   - Her seferinde TEK soru sor, yanıtımı bekle.
   - Ben yanıtladıkça derinleş.
   - Kök nedeni BEN bulayım, sen yazma.

5. TARGET CONDITION: Hedefimi kontrol et — ölçülebilir mi?
   Gerçekçi mi? Değilse uyar ve birlikte düzeltelim.

6. IMPLEMENTATION PLAN: What / Who / When tablosu öner.
   Her aksiyon için bana sor: 'Bu aksiyonu kabul ediyor musun?'
   Onaylamadığımı tabloya yazma.

7. FOLLOW-UP: Bir sonraki kontrol tarihini belirle. Neyi
   ölçeceğimi söyle. 'Tahmin vs Gerçek' karşılaştırması için
   not bırak.

⚠️ ALTIN KURAL: Her bölümün sonunda DUR. Bana sor. Onayımı al. 
Beni düşünme sürecinin İÇİNDE tut. Sen kolaylaştırıcısın, 
yazıcı değil.

Başla: Önce THEME ve BACKGROUND'u onaylat, sonra CURRENT 
CONDITION'ı göster.
`.trim();

    setGeneratedPrompt(prompt);
    showNotification("✅ A3 Promptu Hazırlandı!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl flex items-start space-x-4 shadow-xs">
        <div className="p-2 bg-blue-500 rounded-xl text-white">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-blue-900 font-bold">A3 Raporu Nedir?</p>
          <p className="text-xs text-blue-800/80 leading-relaxed">
            Toyota tarafından geliştirilen bu metodoloji, karmaşık problemleri tek bir sayfada (A3 kağıdı) özetleyerek çözmenizi sağlar. 
            Haftalık veya aylık periyotlarla <span className="font-bold underline">SADECE TEK BİR TEMAYA</span> odaklanmak gelişimin anahtarıdır.
          </p>
        </div>
      </div>

      <GPTButtons 
        gptType="longevity" 
        title={gptTitle}
        newChatUrl={gptUrl}
      />

      {/* A3 Form Card */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-6 bg-linear-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            📋 A3 Formu
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Theme */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase px-1 flex items-center justify-between">
              <span>🎯 THEME (Tema)</span>
              <span className="text-[10px] lowercase font-normal italic">Bu dönem sadece TEK bir konuyu iyileştirin</span>
            </label>
            <input 
              type="text" 
              placeholder="Örn: Öğleden sonra enerjimi artırmak"
              className="w-full p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium"
              value={a3Form.theme}
              onChange={e => setA3Form({...a3Form, theme: e.target.value})}
            />
          </div>

          {/* Period */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase px-1">📅 DÖNEM</label>
            <div className="flex gap-2">
              {(['week', 'month', 'quarter'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setA3Form({...a3Form, period: p})}
                  className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all border ${
                    a3Form.period === p 
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {p === 'week' ? '📆 Bu Hafta' : (p === 'month' ? '🗓️ Bu Ay' : '📊 Son 3 Ay')}
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase px-1">📝 BACKGROUND (Arka plan)</label>
            <textarea 
              rows={3}
              placeholder="Bu sizin için neden önemli? Örn: Ders veriyorum, yorgunken anlatımım zayıflıyor"
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium text-sm"
              value={a3Form.background}
              onChange={e => setA3Form({...a3Form, background: e.target.value})}
            ></textarea>
          </div>

          {/* Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase px-1 flex items-center justify-between">
              <span>🎯 TARGET (Hedef)</span>
              <span className="text-[10px] lowercase font-normal italic text-purple-600 font-bold">Ölçülebilir olmalı (sayı, %, süre)</span>
            </label>
            <input 
              type="text" 
              placeholder="Örn: Öğleden sonra enerji skorum 6/10 → 9/10"
              className="w-full p-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none font-medium"
              value={a3Form.target}
              onChange={e => setA3Form({...a3Form, target: e.target.value})}
            />
          </div>

          <button
            onClick={generatePrompt}
            className="w-full py-5 bg-linear-to-r from-purple-600 to-indigo-700 text-white font-extrabold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 group"
          >
            <BarChart3 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="text-lg uppercase tracking-wider">🅰️3️⃣ A3 Promptunu Oluştur</span>
          </button>
        </div>
      </div>

      {/* Generated Prompt Area */}
      {generatedPrompt && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 flex gap-2">
              <button 
                onClick={() => onCopyPrompt(generatedPrompt, 'a3-prompt')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  copiedId === 'a3-prompt' ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {copiedId === 'a3-prompt' ? <Check size={14} /> : <Clipboard size={14} />}
                <span>{copiedId === 'a3-prompt' ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>
            </div>
            
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Oluşturulan A3 Analiz Promptu</h4>
            <pre className="text-slate-100 text-sm whitespace-pre-wrap leading-relaxed font-mono">
              {generatedPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* Reference Blank Template Toggle */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={() => setShowBlankTemplate(!showBlankTemplate)}
          className="flex items-center justify-between w-full p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-colors font-bold group"
        >
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-gray-500" />
            <span>📄 Boş A3 Şablonunu Göster (Klasik Format)</span>
          </div>
          {showBlankTemplate ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showBlankTemplate && (
          <div className="mt-4 p-6 bg-white border-2 border-gray-100 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 border-2 border-slate-800 text-xs font-bold font-mono">
              <div className="border-r border-b border-slate-800 p-2">To/By/Date: __________</div>
              <div className="p-2 border-b border-slate-800">Theme: ____________________</div>
              <div className="col-span-2 p-3 border-b border-slate-800 bg-slate-50">1. BACKGROUND</div>
              <div className="col-span-2 p-6 border-b border-slate-800 italic text-slate-400">... Neden önemli? Problemin içeriği nedir? ...</div>
              <div className="col-span-2 p-3 border-b border-slate-800 bg-slate-50">2. CURRENT CONDITION</div>
              <div className="col-span-2 p-6 border-b border-slate-800 italic text-slate-400">... Mevcut durumun görsel özeti (tablo, grafik) ...</div>
              <div className="col-span-2 p-3 border-b border-slate-800 bg-slate-50">3. CAUSE ANALYSIS</div>
              <div className="col-span-2 p-6 border-b border-slate-800 italic text-slate-400">... Kök neden analizi (5 Why, Balık Kılçığı) ...</div>
              <div className="col-span-2 p-3 border-b border-slate-800 bg-slate-50">4. TARGET CONDITION</div>
              <div className="col-span-2 p-6 border-b border-slate-800 italic text-slate-400">... Hedeflenen durum nedir? ...</div>
              <div className="col-span-2 p-3 border-b border-slate-800 bg-slate-50">5. IMPLEMENTATION PLAN</div>
              <div className="col-span-2 p-6 border-b border-slate-800 italic text-slate-400">... Kim/Ne/Ne zaman tablosu ...</div>
              <div className="p-3 border-r border-slate-800 bg-slate-50">6. FOLLOW-UP</div>
              <div className="p-6 italic text-slate-400">... Takip kriterleri ...</div>
            </div>
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Bu görsel bir referanstır, Toyota standardını gösterir.</p>
          </div>
        )}
      </div>
    </div>
  );
};
