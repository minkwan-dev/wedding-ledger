const CHOSUNG = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

/** "김민수" → "ㄱㅁㅅ" */
export function toChosung(text: string): string {
  let result = "";
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= HANGUL_START && code <= HANGUL_END) {
      result += CHOSUNG[Math.floor((code - HANGUL_START) / 588)];
    } else {
      result += char;
    }
  }
  return result;
}

const CHOSUNG_ONLY = /^[ㄱ-ㅎ\s]+$/;

/** 일반 부분 일치 + 초성 검색("ㄱㅁ" → "김민수")을 지원한다. */
export function matchesKorean(target: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  if (CHOSUNG_ONLY.test(q)) {
    return toChosung(t).replace(/\s/g, "").includes(q.replace(/\s/g, ""));
  }
  return false;
}
