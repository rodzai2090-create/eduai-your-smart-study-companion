-- ENUMS
CREATE TYPE public.question_type AS ENUM ('mcq','short','long','conceptual','numerical');
CREATE TYPE public.difficulty_level AS ENUM ('easy','medium','hard');
CREATE TYPE public.flashcard_state AS ENUM ('new','review','known');
CREATE TYPE public.task_type AS ENUM ('lesson','practice','quiz','revision','mock_test');

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  country_id uuid REFERENCES public.countries(id) ON DELETE SET NULL,
  board_id uuid REFERENCES public.education_boards(id) ON DELETE SET NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  onboarded boolean NOT NULL DEFAULT false,
  daily_study_minutes integer NOT NULL DEFAULT 90,
  preferred_days text[] NOT NULL DEFAULT ARRAY['mon','tue','wed','thu','fri'],
  exam_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STUDENT SUBJECTS
CREATE TABLE public.student_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_subjects TO authenticated;
GRANT ALL ON public.student_subjects TO service_role;
ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subjects" ON public.student_subjects FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_student_subjects_user ON public.student_subjects(user_id);

-- LESSONS
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  explanation text,
  key_concepts text[] NOT NULL DEFAULT '{}',
  formulas text[] NOT NULL DEFAULT '{}',
  examples text,
  summary text,
  notes text,
  is_demo boolean NOT NULL DEFAULT true,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT SELECT ON public.lessons TO anon;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active lessons" ON public.lessons FOR SELECT USING (status = true);
CREATE POLICY "Admins manage lessons" ON public.lessons FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE INDEX idx_lessons_topic ON public.lessons(topic_id);
CREATE TRIGGER set_updated_at_lessons BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- VIDEOS
CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  source_label text,
  duration_seconds integer,
  transcript text,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT SELECT ON public.videos TO anon;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active videos" ON public.videos FOR SELECT USING (status = true);
CREATE POLICY "Admins manage videos" ON public.videos FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE INDEX idx_videos_topic ON public.videos(topic_id);
CREATE TRIGGER set_updated_at_videos BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- QUESTIONS
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  type public.question_type NOT NULL DEFAULT 'mcq',
  difficulty public.difficulty_level NOT NULL DEFAULT 'easy',
  prompt text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer text,
  explanation text,
  is_demo boolean NOT NULL DEFAULT true,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT SELECT ON public.questions TO anon;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active questions" ON public.questions FOR SELECT USING (status = true);
CREATE POLICY "Admins manage questions" ON public.questions FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE INDEX idx_questions_topic ON public.questions(topic_id);
CREATE TRIGGER set_updated_at_questions BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FLASHCARDS
CREATE TABLE public.flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  is_demo boolean NOT NULL DEFAULT true,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.flashcards TO authenticated;
GRANT SELECT ON public.flashcards TO anon;
GRANT ALL ON public.flashcards TO service_role;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active flashcards" ON public.flashcards FOR SELECT USING (status = true);
CREATE POLICY "Admins manage flashcards" ON public.flashcards FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE INDEX idx_flashcards_topic ON public.flashcards(topic_id);
CREATE TRIGGER set_updated_at_flashcards BEFORE UPDATE ON public.flashcards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FLASHCARD REVIEWS
CREATE TABLE public.flashcard_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  flashcard_id uuid NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  state public.flashcard_state NOT NULL DEFAULT 'new',
  interval_days integer NOT NULL DEFAULT 1,
  due_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, flashcard_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.flashcard_reviews TO authenticated;
GRANT ALL ON public.flashcard_reviews TO service_role;
ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own flashcard reviews" ON public.flashcard_reviews FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_flashcard_reviews_user ON public.flashcard_reviews(user_id);

-- QUIZ ATTEMPTS
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  scope_type text NOT NULL DEFAULT 'topic',
  scope_id uuid,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  total_questions integer NOT NULL DEFAULT 0,
  correct_answers integer NOT NULL DEFAULT 0,
  score_percent numeric(5,2) NOT NULL DEFAULT 0,
  duration_seconds integer NOT NULL DEFAULT 0,
  details jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own quiz attempts" ON public.quiz_attempts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id, created_at DESC);

-- QUESTION ATTEMPTS
CREATE TABLE public.question_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  is_correct boolean NOT NULL DEFAULT false,
  given_answer text,
  time_seconds integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.question_attempts TO authenticated;
GRANT ALL ON public.question_attempts TO service_role;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own question attempts" ON public.question_attempts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_question_attempts_user ON public.question_attempts(user_id, topic_id);

-- TOPIC PROGRESS
CREATE TABLE public.topic_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  lesson_completed boolean NOT NULL DEFAULT false,
  notes_completed boolean NOT NULL DEFAULT false,
  study_seconds integer NOT NULL DEFAULT 0,
  last_viewed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.topic_progress TO authenticated;
GRANT ALL ON public.topic_progress TO service_role;
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own topic progress" ON public.topic_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_topic_progress_user ON public.topic_progress(user_id);
CREATE TRIGGER set_updated_at_topic_progress BEFORE UPDATE ON public.topic_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BOOKMARKS
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ACTIVITY LOG (study time + streak)
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  topic_id uuid REFERENCES public.topics(id) ON DELETE SET NULL,
  minutes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own activity" ON public.activity_log FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id, created_at DESC);

-- STUDY PLANS
CREATE TABLE public.study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'My study plan',
  exam_date date,
  target_date date,
  daily_minutes integer NOT NULL DEFAULT 90,
  preferred_days text[] NOT NULL DEFAULT ARRAY['mon','tue','wed','thu','fri'],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_plans TO authenticated;
GRANT ALL ON public.study_plans TO service_role;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own study plans" ON public.study_plans FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER set_updated_at_study_plans BEFORE UPDATE ON public.study_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- STUDY TASKS
CREATE TABLE public.study_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  topic_id uuid REFERENCES public.topics(id) ON DELETE SET NULL,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  title text NOT NULL,
  task_type public.task_type NOT NULL DEFAULT 'lesson',
  scheduled_date date NOT NULL,
  estimated_minutes integer NOT NULL DEFAULT 30,
  priority integer NOT NULL DEFAULT 3,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_tasks TO authenticated;
GRANT ALL ON public.study_tasks TO service_role;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own study tasks" ON public.study_tasks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_study_tasks_user_date ON public.study_tasks(user_id, scheduled_date);

-- COMPUTER SCIENCE SUBJECT FOR EACH FBISE CLASS
INSERT INTO public.subjects (class_id, name, code, description, status)
SELECT c.id, 'Computer Science', 'CS',
       'Demo subject record — replace with verified FBISE curriculum data.', true
FROM public.classes c
WHERE NOT EXISTS (
  SELECT 1 FROM public.subjects s WHERE s.class_id = c.id AND s.code = 'CS'
);

-- DEMO LESSONS / QUESTIONS / FLASHCARDS FOR EXISTING DEMO TOPICS
INSERT INTO public.lessons (topic_id, title, explanation, key_concepts, formulas, examples, summary, notes, is_demo)
SELECT t.id,
       'Demo lesson — ' || t.name,
       'DEMO CONTENT (not official FBISE material). This lesson placeholder shows how a topic explanation is stored and rendered. Replace it with verified curriculum content.',
       ARRAY['Demo key concept A','Demo key concept B','Demo key concept C'],
       ARRAY['s = v × t','a = (v − u) / t'],
       'Demo worked example: a body moving at 10 m/s for 5 s covers 50 m.',
       'Demo summary of the topic in two or three lines.',
       'Demo study notes for this topic. Official notes can be imported later.',
       true
FROM public.topics t
WHERE NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.topic_id = t.id);

INSERT INTO public.questions (topic_id, type, difficulty, prompt, options, correct_answer, explanation, is_demo)
SELECT t.id, 'mcq', 'easy',
       'DEMO QUESTION — Which quantity is defined as distance travelled per unit time?',
       '["Speed","Mass","Force","Charge"]'::jsonb,
       'Speed',
       'Speed is distance divided by time. This is a demo question, not an official FBISE question.',
       true
FROM public.topics t
WHERE NOT EXISTS (SELECT 1 FROM public.questions q WHERE q.topic_id = t.id);

INSERT INTO public.questions (topic_id, type, difficulty, prompt, options, correct_answer, explanation, is_demo)
SELECT t.id, 'short', 'medium',
       'DEMO QUESTION — Define acceleration and state its SI unit.',
       '[]'::jsonb,
       'Acceleration is the rate of change of velocity; SI unit m/s².',
       'Demo model answer for practice purposes only.',
       true
FROM public.topics t;

INSERT INTO public.flashcards (topic_id, front, back, is_demo)
SELECT t.id, 'DEMO — What is velocity?', 'Speed in a stated direction (a vector quantity).', true
FROM public.topics t
WHERE NOT EXISTS (SELECT 1 FROM public.flashcards f WHERE f.topic_id = t.id);

INSERT INTO public.flashcards (topic_id, front, back, is_demo)
SELECT t.id, 'DEMO — SI unit of force?', 'The newton (N), equal to kg·m/s².', true
FROM public.topics t;