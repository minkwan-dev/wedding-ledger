export const AMOUNT_PRESETS = [
  { label: "5만", value: 50_000 },
  { label: "10만", value: 100_000 },
  { label: "20만", value: 200_000 },
  { label: "30만", value: 300_000 },
  { label: "50만", value: 500_000 },
  { label: "100만", value: 1_000_000 },
] as const;

export const AMOUNT_STEPS = [
  { label: "+1만", value: 10_000 },
  { label: "+5만", value: 50_000 },
  { label: "+10만", value: 100_000 },
] as const;

export const AMOUNT_BUCKETS = [
  { label: "5만 미만", min: 0, max: 50_000 },
  { label: "5만", min: 50_000, max: 100_000 },
  { label: "10만", min: 100_000, max: 200_000 },
  { label: "20~30만", min: 200_000, max: 500_000 },
  { label: "50만 이상", min: 500_000, max: Number.POSITIVE_INFINITY },
] as const;

export const SIDE_LABELS = {
  groom: "신랑측",
  bride: "신부측",
} as const;

export const RELATION_LABELS = {
  family: "가족·친척",
  parents: "부모님 지인",
  work: "직장",
  friend: "친구",
  school: "학교",
  community: "모임",
  other: "기타",
} as const;

export const PAGE_SIZE = 8;

export const LAST_SIDE_STORAGE_KEY = "wedding-ledger:last-side";

export const RECENT_ENTRY_LIMIT = 5;

export const THEME_STORAGE_KEY = "wedding-ledger:theme";
