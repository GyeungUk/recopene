-- Supabase → SQL Editor에 그대로 붙여 넣고 Run 하세요.
-- 응답은 Vercel 서버 함수(/api/submit)가 service_role 키로만 저장합니다.
-- 공개 정책이 없으므로 브라우저(anon key)에서는 읽기·쓰기가 모두 막힙니다.
-- respondent: 'kakao:<회원번호>' 또는 'google:<Supabase 사용자 ID>' → 계정당 1회.

create table if not exists public.survey_responses (
  respondent text primary key,
  provider   text not null,
  answers    jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.survey_responses enable row level security;

-- 결과 보기용(SQL Editor에서 실행)
-- select created_at, provider,
--        answers->>'age'                 as 연령대,
--        answers->>'priority'            as 중요요소,
--        answers->>'concept'             as 선호제품,      -- A: 토마토 스킨, B: 토마토 로션
--        answers->>'copy'                as 선호문구_이전, -- 3번이 소개 문구 A/B였을 때의 응답
--        (answers->>'intent')::int       as 구매의향,
--        answers->>'max_price'           as 최대지불금액,
--        answers->>'no_buy_reason'       as 비구매이유,
--        answers->>'no_buy_reason_other' as 비구매이유_기타,
--        answers->>'prize_entry'         as 경품응모,
--        answers->>'prize_name'          as 이름,
--        answers->>'launch_alert'        as 출시알림,
--        answers->>'phone'               as 휴대전화
-- from public.survey_responses
-- order by created_at desc;
--
-- 이름 칸이 생기기 전에 응모한 사람은 이름이 비어 있어요(null). 추첨 대상은 prize_entry만 보고 고르세요.
--
-- 3번 문항은 2026-10-31에 소개 문구 A/B(copy)에서 제품 카드 A/B(concept)로 바뀌었어요.
-- 그 전에 낸 응답은 copy만 있고 concept는 비어 있어요(null). 이런 응답을 '응답 수정하기'로 다시 저장하면
-- 3번을 새로 고르게 되고, 예전 copy 값도 그대로 남아요. 제품 A/B 집계는 concept가 있는 응답만 세세요.
--
-- 경품 전달을 마친 뒤(처리방침 2번): 이름은 모두 지우고, 출시 알림을 신청하지 않은 응모자는 번호도 지웁니다.
-- 내려받은 CSV 파일도 함께 지우세요.
-- (순서대로: 번호 먼저, 그다음 이름과 응모 표시. 응모 표시를 끄지 않으면 '응답 수정하기'에서 빈 이름 칸 때문에 저장이 막혀요)
-- update public.survey_responses set answers = answers - 'phone'
--  where answers->>'prize_entry' = 'true' and answers->>'launch_alert' is distinct from 'true';
-- update public.survey_responses set answers = jsonb_set(answers - 'prize_name', '{prize_entry}', 'false')
--  where answers->>'prize_entry' = 'true';
