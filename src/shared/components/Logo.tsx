import { cn } from "cn";

/** 부케 일러스트 + 스크립트 타이포그래피 "Wedding Ledger" 로고 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <Bouquet className="h-12 w-auto shrink-0 sm:h-14" />
      <span className="flex flex-col leading-none">
        <span className="font-script text-[2.1rem] leading-[0.9] text-foreground sm:text-[2.4rem]">
          Wedding
        </span>
        <span className="mt-0.5 pl-6 text-[10px] font-semibold tracking-[0.42em] text-muted-foreground sm:text-[11px]">
          LEDGER
        </span>
      </span>
    </span>
  );
}

function Rose({
  x,
  y,
  r,
  tone,
}: {
  x: number;
  y: number;
  r: number;
  tone: "bride" | "groom" | "ivory" | "rose";
}) {
  const fill = {
    rose: "var(--brand-soft)",
    bride: "var(--bride-soft)",
    groom: "var(--groom-soft)",
    ivory: "var(--card)",
  }[tone];
  const stroke = {
    rose: "var(--brand)",
    bride: "var(--bride)",
    groom: "var(--groom)",
    ivory: "var(--muted-foreground)",
  }[tone];
  return (
    <g stroke={stroke} strokeWidth="1.1" strokeLinecap="round" fill="none">
      <circle cx={x} cy={y} r={r} fill={fill} />
      {/* 꽃잎 소용돌이 */}
      <path
        d={`M ${x - r * 0.15} ${y - r * 0.1}
            a ${r * 0.25} ${r * 0.25} 0 1 1 ${r * 0.35} ${r * 0.25}
            a ${r * 0.5} ${r * 0.5} 0 1 1 ${-r * 0.75} ${-r * 0.4}
            a ${r * 0.72} ${r * 0.72} 0 0 1 ${r * 1.15} ${-r * 0.2}`}
      />
    </g>
  );
}

function Bouquet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 60" className={className} aria-hidden>
      {/* 줄기 */}
      <g stroke="oklch(0.62 0.07 150)" strokeWidth="1.1" strokeLinecap="round" fill="none">
        <path d="M24 34 L21 57" />
        <path d="M24 34 L24 58" />
        <path d="M24 34 L27 57" />
      </g>
      {/* 잎 */}
      <g fill="oklch(0.9 0.04 150 / 0.7)" stroke="oklch(0.62 0.07 150)" strokeWidth="1">
        <path d="M14 30 C 6 30, 3 24, 5 20 C 10 21, 14 25, 14 30 Z" />
        <path d="M34 30 C 42 30, 45 24, 43 20 C 38 21, 34 25, 34 30 Z" />
        <path d="M17 36 C 11 39, 6 37, 5 33 C 10 31, 15 33, 17 36 Z" />
        <path d="M31 36 C 37 39, 42 37, 43 33 C 38 31, 33 33, 31 36 Z" />
      </g>
      {/* 안개꽃 */}
      <g fill="var(--muted-foreground)">
        <circle cx="9" cy="14" r="1" />
        <circle cx="12" cy="10" r="0.9" />
        <circle cx="39" cy="14" r="1" />
        <circle cx="36" cy="9" r="0.9" />
        <circle cx="24" cy="5" r="1" />
      </g>
      {/* 장미 */}
      <Rose x={16} y={22} r={7} tone="groom" />
      <Rose x={32} y={22} r={7} tone="bride" />
      <Rose x={24} y={14} r={7.5} tone="ivory" />
      <Rose x={24} y={28} r={6.5} tone="rose" />
      {/* 리본 */}
      <g stroke="var(--brand)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="var(--brand-soft)">
        <path d="M24 44 C 19 40, 15 42, 17 46 C 19 48, 22 46, 24 44 Z" />
        <path d="M24 44 C 29 40, 33 42, 31 46 C 29 48, 26 46, 24 44 Z" />
        <path d="M23 45 L 20 53 M25 45 L 28 53" fill="none" />
        <circle cx="24" cy="44" r="1.4" />
      </g>
    </svg>
  );
}
