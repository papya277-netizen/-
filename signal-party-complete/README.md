# SIGNAL PARTY Complete

## 1) Node.js 설치
- Node.js 18+ 버전을 설치하세요.

## 2) 의존성 설치
```bash
npm install
```

## 3) 환경변수 설정
```bash
cp .env.example .env.local
```
`.env.local`에 아래 값을 넣으세요.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_HOST_PIN`

## 4) Supabase 테이블 생성
Supabase SQL Editor에서 `supabase.sql` 파일 내용을 실행하세요.

## 5) 개발 서버 실행
```bash
npm run dev
```

## 6) 접속 주소
- 참가자 체크인: http://localhost:3000/join
- 참가자 메인: http://localhost:3000/party
- 하트: http://localhost:3000/heart
- 호스트: http://localhost:3000/host
- 테이블 설정: http://localhost:3000/tables
- 배치표: http://localhost:3000/assign
- O/X 투표: http://localhost:3000/play
- 내 매칭: http://localhost:3000/match

## QR 안내
입장용 QR 코드는 `/join` 주소로 생성하면 됩니다.
