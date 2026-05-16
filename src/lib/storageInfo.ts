export interface StorageBreakdownItem {
  label: string;
  labelTr: string;
  icon: string;
  bytes: number;
}

export interface StorageInfo {
  usedBytes: number;
  usedKB: number;
  usedMB: number;
  limitMB: number;
  percentUsed: number;
  breakdown: StorageBreakdownItem[];
  level: "ok" | "warning" | "critical";
}

const LIMIT_MB = 5; // common browser origin limit (approx 5MB)

export function getStorageInfo(): StorageInfo {
  let total = 0;
  const categories: Record<string, number> = {
    longevity: 0,
    members: 0,
    journal: 0,
    reports: 0,
    other: 0,
  };

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key) || "";
    // UTF-16: each character is 2 bytes in memory for most strings
    const size = (key.length + value.length) * 2;
    total += size;

    if (key.startsWith("longevity_chat")) {
      categories.longevity += size;
    } else if (key.startsWith("msproject_")) {
      categories.members += size;
    } else if (key.startsWith("journal_")) {
      categories.journal += size;
    } else if (key.startsWith("a3_")) {
      categories.reports += size;
    } else {
      categories.other += size;
    }
  }

  const usedMB = total / 1024 / 1024;
  const percentUsed = Math.min(100, (usedMB / LIMIT_MB) * 100);

  let level: "ok" | "warning" | "critical" = "ok";
  if (percentUsed >= 85) level = "critical";
  else if (percentUsed >= 60) level = "warning";

  const breakdown: StorageBreakdownItem[] = [
    { label: "Longevity Guide", labelTr: "Longevity Rehberi", icon: "🌿",
      bytes: categories.longevity },
    { label: "Member Profiles", labelTr: "Kişi Profilleri", icon: "👥",
      bytes: categories.members },
    { label: "Journal Entries", labelTr: "Günlük Kayıtları", icon: "📔",
      bytes: categories.journal },
    { label: "A3 Reports", labelTr: "A3 Raporları", icon: "📊",
      bytes: categories.reports },
    { label: "Other Systems", labelTr: "Diğer Sistemler", icon: "⚙️",
      bytes: categories.other },
  ].filter(item => item.bytes > 0)
   .sort((a, b) => b.bytes - a.bytes);

  return {
    usedBytes: total,
    usedKB: total / 1024,
    usedMB: usedMB,
    limitMB: LIMIT_MB,
    percentUsed: percentUsed,
    breakdown: breakdown,
    level: level,
  };
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) {
    return kb.toFixed(1) + " KB";
  }
  return (kb / 1024).toFixed(2) + " MB";
}
