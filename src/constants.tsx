import React from 'react';
import { 
  User, 
  Calendar, 
  BookOpen, 
  Moon, 
  Search, 
  Leaf, 
  BarChart3, 
  RefreshCw 
} from 'lucide-react';
import { Step } from './types';

export const STEPS: Step[] = [
  {
    id: 1,
    label: "Kayıt",
    icon: <User size={18} />,
    title: "🚀 Longevity Guide GPT'ye Kayıt",
    link: "https://chatgpt.com/g/g-GKsuaDZUU-longevity-guide",
    linkText: "Longevity Guide'a Git",
    extraContent: (
      <div className="space-y-4">
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>ChatGPT hesabınıza giriş yapın.</li>
          <li>Gmail ile üye olma adımlarını tamamlayın.</li>
          <li>Aşağıdaki butona tıklayarak GPT'ye erişin.</li>
        </ol>
      </div>
    )
  },
  {
    id: 2,
    label: "Tablo",
    icon: <Calendar size={18} />,
    title: "📝 Günlük Beslenme Tablosu Oluşturma",
    prompts: [
      {
        id: "step2-p1",
        title: "Hedef GPT: Longevity Guide",
        content: `📅 Günlük Aktivite & Beslenme Tablosu – 11.04.2026 (Cumartesi)

🎯 Amaç: Yağ yakımı • IF uyumu • Düşük insülin • Kas korunumu • Ödem azaltma • Enerji yönetimi

🕐 Saat, 📝 Öğün / Aktivite, İçerik (kalem kalem), 💬 Notlar & Hedefler, 🔥 Kalori (yaklaşık), 💪 Protein

Burada tablo olarak yazar mısın?

📋 Aktivite İçerik Detayı sütununda 🥚 1 yumurta -> 🥚 1 yumurta (70 kalori) gibi düzenler misin?`
      }
    ]
  },
  {
    id: 3,
    label: "Bilgi Gir",
    icon: <BookOpen size={18} />,
    title: "📋 Kendi Bilgilerinizi Girin",
    prompts: [
      {
        id: "step3-p1",
        title: "Hedef GPT: Longevity Guide",
        note: "Boşlukları kendi bilgilerinizle doldurun",
        content: `Bugünkü bilgilerim:

Dün akşam saat _____ de yattım
Bu sabah saat _____ de kalktım

Yediklerim:
___:___ - (ne yediyseniz yazın)
___:___ - (ne yediyseniz yazın)
___:___ - (ne yediyseniz yazın)
___:___ - (ne yediyseniz yazın)
___:___ - (ne yediyseniz yazın)`
      }
    ]
  },
  {
    id: 4,
    label: "Analiz",
    icon: <Moon size={18} />,
    title: "🌙 Gün Kapanışı Analizi (6 Metrik)",
    prompts: [
      {
        id: "step4-p1",
        title: "Hedef GPT: Longevity Guide",
        content: `Bugünkü tüm yediklerimi ve aktivitelerimi analiz et.

Şu başlıklarda değerlendirme yap:

⏳ IF (Intermittent Fasting) Analizi
- Yeme pencereme uydum mu?
- Oruç saatlerinde kural dışı bir şey yedim/içtim mi?
- IF skorum kaç?

🍭 Glisemik Yük Değerlendirmesi
- Bugün kan şekerimi ne kadar yükselttim?
- Yüksek glisemik indeksli ne tükettim?
- İnsülin direnci açısından durum nedir?

🧬 Longevity Uyumluluk Puanı
- Bugün hücre yenilenmesine katkı sağladım mı?
- Anti-aging besinler tükettim mi?
- Oksidatif stres yaratan ne yedim?

🎯 Genel Longevity Skoru (100 üzerinden)
- Tüm faktörleri değerlendirerek puan ver
- Güçlü yönlerim neler?
- Zayıf yönlerim neler?

📉 Kilo Yorumu (çok önemli)
- Bugünkü beslenme kilo hedefime uygun mu?
- Kalori açığı/fazlası var mı?
- Yarın ne yapmalıyım?

🧠 Günün Özeti (net ve dürüst)
- Bugün genel olarak nasıl geçti?
- En büyük başarım ne?
- En büyük hatam ne?
- Yarın için 1 öncelikli hedef`
      }
    ]
  },
  {
    id: 5,
    label: "IF Sorgu",
    icon: <Search size={18} />,
    title: "🍫 IF Analizi ve Yiyecek Sorguları",
    infoBox: {
      type: 'green',
      content: `🟢 YEME PENCERESİ İÇİNDE (örn: 09:00-17:00 veya 12:00-20:00)
   → Kola, çerez, boza bile tüketseniz IF BOZULMAZ!

🔴 YEME PENCERESİ DIŞINDA
   → Sadece su, sade çay, sade kahve`
    },
    prompts: [
      {
        id: "step5-p1",
        title: "Prompt 1 - Günlük Plan",
        content: "Bugün (___/___/2026) IF ve longevity için ne yapayım?"
      },
      {
        id: "step5-p2",
        title: "Prompt 2 - Çerez",
        content: `Çerez yemek istiyorum.
IF için analiz eder misin?`
      },
      {
        id: "step5-p3",
        title: "Prompt 3 - Kola",
        content: `Kola içmek istiyorum.
IF için analiz eder misin?`
      },
      {
        id: "step5-p4",
        title: "Prompt 4 - Boza",
        content: `Boza içmek istiyorum.
IF için analiz eder misin?`
      }
    ]
  },
  {
    id: 6,
    label: "İlkeler",
    icon: <Leaf size={18} />,
    title: "🌿 Longevity'nin 11 Temel İlkesi",
    link: "https://www.instagram.com/longevity.story/",
    linkText: "Longevity Story Instagram",
    extraContent: (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <tbody>
            {[
              ["🏃‍♂️", "Hareketli yaşam"],
              ["💪", "Kas kütlesi"],
              ["🛌", "Uyku kalitesi"],
              ["❤️", "Kardiyorespiratuvar sağlık"],
              ["🧠", "Duygusal sağlamlık"],
              ["🤗", "Güçlü sosyal bağlar"],
              ["💃🏻", "Stres yönetimi + iyimserlik"],
              ["🥗", "Kişiye özgü, sürdürülebilir beslenme + mikrobiyom"],
              ["🌿", "Toksik yüklerin ve enflamasyonun azaltılması"],
              ["🌳", "Sirkadiyen ritim ve doğaya bağlanmak"],
              ["💊", "Vitamin-mineral dengesi"]
            ].map(([emoji, text], idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-0">
                <td className="py-3 px-2 text-xl">{emoji}</td>
                <td className="py-3 px-2 text-gray-700 font-medium">{text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },
  {
    id: 7,
    label: "Grafik",
    icon: <BarChart3 size={18} />,
    title: "📊 Kilo Takip Grafiği (MS Project Pro)",
    link: "https://chatgpt.com/g/g-SZqNg3QPk-msproject-pro",
    linkText: "MS Project Pro'ya Git",
    prompts: [
      {
        id: "step7-p1",
        title: "Prompt 1 - Şablon",
        content: `Benim için burada bir kilo takip grafiği oluştur.

📊 GRAFİK ÖZELLİKLERİ:
- Çizgi grafik (Line Chart) olsun

📈 VERİ YAPISI:
- Başlangıç kilosu: {XX,X} kg
- Hedef: Haftalık 0.5 kg kayıp
- Süre: 24 hafta (168 gün)
- Başlangıç tarihi: XX Nisan 2026

📉 İKİ ÇİZGİ OLACAK:
1. Planlanan Kilo (Mavi çizgi): XX kg'dan başlayıp her hafta 0.5 kg düşen düz çizgi
2. Gerçekleşen Kilo (Kırmızı çizgi): Günlük tartı değerleri, noktalarla
   - XX Nisan 2026: XX.X kg
   - Her noktanın yanında değeri yazsın (örn: XX.X kg)

📅 EK ÖZELLİKLER:
- Her 2 haftada (14 günde) bir dikey kesikli kırmızı çizgi (diyetisyen randevusu)
- Y ekseni: XX-XX kg arası
- X ekseni: Tarihler
- Başlık: "24 Haftalık Kilo Takibi - Güncel Gerçekleşen Tartılar"
- Türkçe etiketler

Bugün XX.XX.2026 itibariyle kilo takibine başladık.`
      },
      {
        id: "step7-p2",
        title: "Prompt 2 - Örnek (dolu hali)",
        content: `Benim için burada bir kilo takip grafiği oluştur.

📊 GRAFİK ÖZELLİKLERİ:
- Çizgi grafik (Line Chart) olsun

📈 VERİ YAPISI:
- Başlangıç kilosu: 99,9 kg
- Hedef: Haftalık 0.5 kg kayıp
- Süre: 24 hafta (168 gün)
- Başlangıç tarihi: 11 Nisan 2026

📉 İKİ ÇİZGİ OLACAK:
1. Planlanan Kilo (Mavi çizgi): 100 kg'dan başlayıp her hafta 0.5 kg düşen düz çizgi
2. Gerçekleşen Kilo (Kırmızı çizgi): Günlük tartı değerleri, noktalarla
   - 11 Nisan 2026: 99.9 kg
   - Her noktanın yanında değeri yazsın (örn: 99.9 kg)

📅 EK ÖZELLİKLER:
- Her 2 haftada (14 günde) bir dikey kesikli kırmızı çizgi (diyetisyen randevusu)
- Y ekseni: 85-100 kg arası
- X ekseni: Tarihler
- Başlık: "24 Haftalık Kilo Takibi - Güncel Gerçekleşen Tartılar"
- Türkçe etiketler

Bugün 11.04.2026 itibariyle kilo takibine başladık.`
      }
    ]
  },
  {
    id: 8,
    label: "Ay Geçişi",
    icon: <RefreshCw size={18} />,
    title: "🔄 Ay Geçişi - Veri Taşıma",
    infoBox: {
      type: 'yellow',
      content: "ChatGPT'nin belleği sınırlıdır. Her ay yeni bir sohbet açıp eski verileri taşımalısınız."
    },
    prompts: [
      {
        id: "step8-p1",
        title: "Prompt 1 - Kilo Verileri",
        example: "Örnek: '01.04.2026 – 30.04.2026 Tarih Günlük Değişim bilgilerini yazar mısın?'",
        content: `GG.AA.YYYY – GG.AA.YYYY Tarih Günlük Değişim bilgilerini yazar mısın?`
      },
      {
        id: "step8-p2",
        title: "Prompt 2 - Tüm Oturum",
        content: `Tüm oturumu analiz eder misin?`
      },
      {
        id: "step8-p3",
        title: "Prompt 3 - Protein Tablosu",
        content: `GG.AA.YYYY – GG.AA.YYYY Tarih Bazlı Öğün & Protein Tablosu burada tablo olarak yazar mısın?`
      },
      {
        id: "step8-p4",
        title: "Prompt 4 - Uyku Tablosu",
        content: `GG.AA.YYYY – GG.AA.YYYY Tüm tarihleri, Tarih, öğün saatleri, uyku uyuma saatleri tablo olarak burada yazar mısın?`
      },
      {
        id: "step8-p5",
        title: "Prompt 5 - Yeni Sohbette",
        content: `Analiz eder misin?`
      }
    ]
  }
];
