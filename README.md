# wedding-ledger

결혼식 축의금 관리 서비스

## 기술 스택

- Next.js (App Router)
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL)
- Zod

## 로컬 실행

```bash
npm install
cp .env.example .env.local
# .env.local에 Supabase URL과 Service Role Key 입력
npm run dev
```

## Supabase 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_create_entries.sql` 실행
3. Project Settings → API에서 URL과 `service_role` key를 `.env.local`에 설정

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## 주요 기능

- 축의금 입력 (이름, 금액 원터치/직접 입력, 메모)
- 실시간 현황 (총액, 건수, 최근 5건)
- 목록 검색, 수정, soft delete
- 엑셀 전체 내보내기

## 폴더 구조

```
src/
├── app/           # 라우팅, API
├── features/      # 기능별 components, hooks, lib
└── shared/        # 공통 components, hooks, lib
```

features → shared 참조만 허용 (역참조 금지)
