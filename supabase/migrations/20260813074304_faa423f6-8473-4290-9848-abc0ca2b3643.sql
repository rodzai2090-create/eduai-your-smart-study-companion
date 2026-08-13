-- roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- countries
CREATE TABLE public.countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.education_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  description text,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (country_id, code)
);

CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES public.education_boards(id) ON DELETE CASCADE,
  name text NOT NULL,
  level integer NOT NULL,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (board_id, name)
);

CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  description text,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id, code)
);

CREATE TABLE public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  chapter_number integer NOT NULL,
  description text,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subject_id, chapter_number)
);

CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  name text NOT NULL,
  topic_number integer NOT NULL,
  description text,
  status boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (chapter_id, topic_number)
);

CREATE INDEX idx_boards_country ON public.education_boards(country_id);
CREATE INDEX idx_classes_board ON public.classes(board_id);
CREATE INDEX idx_subjects_class ON public.subjects(class_id);
CREATE INDEX idx_chapters_subject ON public.chapters(subject_id);
CREATE INDEX idx_topics_chapter ON public.topics(chapter_id);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['countries','education_boards','classes','subjects','chapters','topics'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Public can view active %1$s" ON public.%1$I FOR SELECT USING (status = true)', t);
    EXECUTE format('CREATE POLICY "Admins can view all %1$s" ON public.%1$I FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "Admins can insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "Admins can update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "Admins can delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE TRIGGER set_updated_at_%1$s BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t);
  END LOOP;
END $$;

-- demo data
INSERT INTO public.countries (name, code) VALUES ('Pakistan', 'PK');

INSERT INTO public.education_boards (country_id, name, code, description)
SELECT id, 'Federal Board of Intermediate and Secondary Education', 'FBISE',
  'Federal board of Pakistan covering SSC (Class 9-10) and HSSC (Class 11-12).'
FROM public.countries WHERE code = 'PK';

INSERT INTO public.classes (board_id, name, level)
SELECT b.id, v.name, v.level FROM public.education_boards b,
  (VALUES ('Class 9', 9), ('Class 10', 10), ('Class 11', 11), ('Class 12', 12)) AS v(name, level)
WHERE b.code = 'FBISE';

-- SSC (9 & 10): Math, Physics, Chemistry, Biology, English
INSERT INTO public.subjects (class_id, name, code, description)
SELECT c.id, v.name, v.code, v.descr FROM public.classes c,
  (VALUES
    ('Mathematics','MATH','Demo curriculum data.'),
    ('Physics','PHY','Demo curriculum data.'),
    ('Chemistry','CHEM','Demo curriculum data.'),
    ('Biology','BIO','Demo curriculum data.'),
    ('English','ENG','Demo curriculum data.')
  ) AS v(name, code, descr)
WHERE c.level IN (9, 10);

-- HSSC (11 & 12): pre-medical/pre-engineering mix, no Mathematics for demo Biology track parity
INSERT INTO public.subjects (class_id, name, code, description)
SELECT c.id, v.name, v.code, v.descr FROM public.classes c,
  (VALUES
    ('Physics','PHY','Demo curriculum data.'),
    ('Chemistry','CHEM','Demo curriculum data.'),
    ('English','ENG','Demo curriculum data.')
  ) AS v(name, code, descr)
WHERE c.level IN (11, 12);

INSERT INTO public.subjects (class_id, name, code, description)
SELECT c.id, 'Mathematics', 'MATH', 'Demo curriculum data (pre-engineering group).'
FROM public.classes c WHERE c.level IN (11, 12);

INSERT INTO public.subjects (class_id, name, code, description)
SELECT c.id, 'Biology', 'BIO', 'Demo curriculum data (pre-medical group).'
FROM public.classes c WHERE c.level IN (11, 12);

-- Demo chapters for Class 10 Physics
INSERT INTO public.chapters (subject_id, name, chapter_number, description)
SELECT s.id, v.name, v.num, 'Demo content — not official FBISE curriculum.'
FROM public.subjects s
JOIN public.classes c ON c.id = s.class_id
CROSS JOIN (VALUES ('Demo Chapter 1: Motion and Force', 1), ('Demo Chapter 2: Electricity', 2)) AS v(name, num)
WHERE c.level = 10 AND s.code = 'PHY';

INSERT INTO public.topics (chapter_id, name, topic_number, description)
SELECT ch.id, v.name, v.num, 'Demo topic — placeholder content.'
FROM public.chapters ch
CROSS JOIN (VALUES ('Demo Topic 1', 1), ('Demo Topic 2', 2), ('Demo Topic 3', 3)) AS v(name, num);