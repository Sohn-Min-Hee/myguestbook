방명록 포트폴리오 웹 앱 — Next.js (App Router) + Supabase

## 기능

- 방명록 목록 보기 (최신순)
- 이름 + 메시지 작성
- 빈 입력 시 에러 메시지 표시
- 로그인/댓글 기능 없음

## Supabase 연결하기

1. [supabase.com](https://supabase.com) → New Project (이름: my-guestbook)
2. SQL Editor에서 [supabase/schema.sql](supabase/schema.sql) 내용을 실행해 `posts` 테이블과 RLS 정책(모두 읽기/쓰기 가능)을 만듭니다.
3. Project Settings → API 에서 Project URL과 anon public key를 복사합니다.
4. `.env.local` 파일에 값을 채워 넣습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
```

Supabase가 설정되지 않은 상태에서도 앱은 실행되며, 화면 하단에 연결 안내 메시지가 표시됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.
