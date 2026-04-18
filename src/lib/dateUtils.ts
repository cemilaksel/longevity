export const formatTurkishDate = (date: Date): { bugunDetay: string, bugun: string, ayAraligi: string } => {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  const dayName = days[date.getDay()];

  const bugun = `${d}.${m}.${y}`;
  const bugunDetay = `${bugun} (${dayName})`;

  // First and last day of current month
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const fd = firstDay.getDate().toString().padStart(2, '0');
  const fm = (firstDay.getMonth() + 1).toString().padStart(2, '0');
  const fy = firstDay.getFullYear();

  const ld = lastDay.getDate().toString().padStart(2, '0');
  const lm = (lastDay.getMonth() + 1).toString().padStart(2, '0');
  const ly = lastDay.getFullYear();

  const ayAraligi = `${fd}.${fm}.${fy} – ${ld}.${lm}.${ly}`;

  return { bugunDetay, bugun, ayAraligi };
};

export const formatTurkishLongMonth = (date: Date): string => {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
