# 설문 로그인 설정 가이드 (구글 · 카카오)

- 설문 페이지: `/survey/` (`survey/index.html`)
- 구글 로그인: Supabase Auth가 처리
- 카카오 로그인: Vercel 서버 함수(`api/kakao/*`)가 직접 처리 → **동의항목 0개, 검수·비즈 앱 전환 필요 없음**
- 응답 저장: `api/submit.js` → Supabase `survey_responses` 테이블 (계정당 1회)

아래 `<배포주소>`는 정식 주소 `https://recopene.site`, `<프로젝트ID>`는 Supabase 프로젝트 주소의 앞부분입니다.

---

## 1. Supabase

1. 프로젝트 생성 (Region: Southeast Asia (Singapore) — 동의 문구·처리방침의 '싱가포르'와 같아야 함).
2. **SQL Editor**에 `survey/schema.sql` 붙여 넣고 **Run**.
3. **Authentication → Sign In / Providers → Google** 켜기 → 구글 클라이언트 ID / 보안 비밀번호 입력 → Save.
   (Kakao provider는 **켜지 않습니다**.)
4. **Authentication → URL Configuration**
   - Site URL: `<배포주소>`
   - Redirect URLs: `<배포주소>/survey/`, `http://localhost:3000/survey/`
5. **Project Settings → API**에서
   - `Project URL`, `anon public` 키 → `survey/config.js`에 입력 (공개돼도 되는 값)
   - `service_role` 키 → **Vercel 환경변수에만** 입력 (절대 코드에 넣지 않기)

## 2. 구글 (Google Cloud Console)

- OAuth 클라이언트(웹 애플리케이션)
  - 승인된 JavaScript 원본: `<배포주소>`, `http://localhost:3000`
  - 승인된 리디렉션 URI: `https://<프로젝트ID>.supabase.co/auth/v1/callback`
- **대상 → 앱 게시** → 프로덕션으로 변경

## 3. 카카오 (Kakao Developers)

1. 앱 만들기.
2. **카카오 로그인** 활성화 **ON**.
3. **Redirect URI**(카카오 로그인 → 일반 또는 앱 설정)에 등록 — Supabase 주소가 아닙니다:
   - `<배포주소>/api/kakao/callback`
   - `http://localhost:3000/api/kakao/callback` (로컬 테스트용)
4. **동의항목: 아무것도 켜지 않습니다** (전부 "사용 안 함" 그대로).
5. **앱 키 → REST API 키** 복사.
6. (권장) **보안 → Client Secret** 코드 생성 → 활성화 "사용함" → 코드 복사.

## 4. Vercel 환경변수

Vercel 대시보드 → 프로젝트(recopene) → **Settings → Environment Variables**에 추가 (Production·Preview·Development 모두):

| 이름 | 값 |
|---|---|
| `SUPABASE_URL` | Supabase Project URL (`https://<프로젝트ID>.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` 키 (또는 `sb_secret_...`) |
| `KAKAO_REST_API_KEY` | 카카오 REST API 키 |
| `KAKAO_CLIENT_SECRET` | 카카오 Client Secret 코드 (6번을 했다면) |
| `SESSION_SECRET` | 아무 긴 무작위 문자열 (아래 명령으로 생성) |

```bash
openssl rand -base64 32
```

환경변수를 넣은 뒤 **다시 배포**해야 적용됩니다.

## 5. 확인

1. `<배포주소>/survey/` → 카카오 로그인 → 동의 화면 없이 바로 돌아오면 정상 → 설문 제출.
2. 구글 로그인으로도 한 번 제출.
3. Supabase **Table Editor → survey_responses**에 `kakao:...`, `google:...` 두 줄이 보이면 완료.
4. 같은 계정으로 다시 들어가면 "소중한 의견 고마워요!" 화면과 '응답 수정하기' 버튼 (1인 1회, 수정하면 덮어씀).

로컬 테스트는 `vercel dev`(포트 3000)로 실행해야 `api/` 함수가 동작합니다. `python3 -m http.server`로는 화면만 보입니다.

## 결과 보기

Table Editor → **Export → CSV**, 또는 `schema.sql` 아래 주석의 쿼리를 SQL Editor에서 실행.
