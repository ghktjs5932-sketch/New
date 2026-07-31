-- Supabase SQL Editor에 복사하여 실행하세요.

-- 1. wrong_answers 테이블 생성 (틀린 문제 원본 저장)
CREATE TABLE IF NOT EXISTS wrong_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  wrong_answer_submitted TEXT NOT NULL,
  is_reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. review_logs 테이블 생성 (복습 기록 저장)
CREATE TABLE IF NOT EXISTS review_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wrong_answer_id UUID REFERENCES wrong_answers(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS(Row Level Security) 설정 (필요 시 활성화, 현재는 공개 접근 허용을 위해 비활성화 또는 공개 정책 추가)
ALTER TABLE wrong_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_logs ENABLE ROW LEVEL SECURITY;

-- 익명 사용자 누구나 읽고 쓸 수 있도록 허용하는 정책 (테스트/초기 개발용)
CREATE POLICY "Allow public all access on wrong_answers" 
ON wrong_answers FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all access on review_logs" 
ON review_logs FOR ALL USING (true) WITH CHECK (true);
