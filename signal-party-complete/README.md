# SIGNAL PARTY Complete

SIGNAL PARTY 현장 운영용 웹앱입니다. 참가자는 QR(`/join`)로 체크인하고, 호스트는 `/host`에서 운영 기능을 실행할 수 있습니다.

## 1) Node.js 설치
- Node.js **18 이상** 설치 (권장: 20 LTS)
- 설치 확인:
```bash
node -v
npm -v
```

## 2) 프로젝트 의존성 설치
```bash
npm install
```

## 3) 환경변수 설정
```bash
cp .env.example .env.local
```
`.env.local` 파일에 아래 값을 넣으세요.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_HOST_PIN` (예: 2024)

## 4) Supabase 테이블 생성
1. Supabase 프로젝트 생성
2. 좌측 **SQL Editor** 이동
3. `supabase.sql` 전체 내용을 붙여넣고 실행

## 5) 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000` 접속.

## 6) 페이지 주소
- 참가자 체크인: http://localhost:3000/join
- 참가자 메인: http://localhost:3000/party
- 하트: http://localhost:3000/heart
- 호스트: http://localhost:3000/host
- 테이블 설정: http://localhost:3000/tables
- 배치표: http://localhost:3000/assign
- O/X 투표: http://localhost:3000/play
- 내 매칭: http://localhost:3000/match

## 7) 실제 운영 순서 (권장)
1. 호스트가 `/host` 로그인 (PIN 입력)
2. `/tables`에서 테이블/좌석 수 등록
3. 참가자는 QR로 `/join` 접속해 체크인
4. 호스트가 자동 좌석 배치 실행
5. 필요 시 라운드 시작 → 참가자 `/play`에서 O/X 투표
6. 호스트가 same/cross 랜덤 매칭 실행
7. 참가자는 `/match`에서 결과 확인

## QR 안내
입장용 QR은 `http://localhost:3000/join` 주소로 생성하면 됩니다.

## 문제 해결
- `npm install` 실패 시: 회사/기관 네트워크 정책, 프록시, npm registry 차단 여부 확인
- Supabase 에러 시: `.env.local` 값 오탈자 확인 + SQL 실행 여부 확인
