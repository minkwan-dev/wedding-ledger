export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatNumber(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

/** 1,250,000 → "125만원", 105,000 → "10만 5,000원", 120,000,000 → "1억 2,000만원" */
export function formatKoreanAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "0원";
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);
  const rest = amount % 10_000;
  const parts: string[] = [];
  if (eok) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man) parts.push(`${man.toLocaleString("ko-KR")}만`);
  if (rest) parts.push(rest.toLocaleString("ko-KR"));
  return `${parts.join(" ")}원`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelative(iso: string, now: number = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export function maskCurrency(amount: number): string {
  const digits = String(amount).length;
  return `${"•".repeat(Math.max(digits, 4))}원`;
}
