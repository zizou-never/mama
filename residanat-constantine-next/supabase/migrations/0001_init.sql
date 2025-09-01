-- Extensions
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text default 'student',
  created_at timestamptz default now()
);

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text check (category in ('medecine','chirurgie','pediatrie')) not null,
  price int default 0,
  hours int default 0,
  image text,
  created_at timestamptz default now()
);

-- Enrollments
create table if not exists public.enrollments (
  user_id uuid references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, course_id)
);

-- QCM Categories
create table if not exists public.qcm_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique
);

-- QCM Questions
create table if not exists public.qcms (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.qcm_categories(id) on delete cascade,
  question text not null,
  options jsonb not null,
  answer_index int not null,
  explanation text,
  created_at timestamptz default now()
);

-- Attempts
create table if not exists public.qcm_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category_id uuid references public.qcm_categories(id) on delete set null,
  question_id uuid references public.qcms(id) on delete set null,
  answer_index int,
  correct boolean,
  created_at timestamptz default now()
);

-- Spaced repetition cards (SM-2)
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  front text not null,
  back text not null,
  hint text,
  ef float default 2.5,
  reps int default 0,
  interval int default 0,
  due_date date default (now()::date),
  last_grade int default 0,
  deck text default 'default',
  source_type text,
  source_id uuid,
  created_at timestamptz default now()
);

-- Contact messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.qcm_categories enable row level security;
alter table public.qcms enable row level security;
alter table public.qcm_attempts enable row level security;
alter table public.cards enable row level security;
alter table public.messages enable row level security;

-- Policies

-- profiles: user sees only self
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

-- courses: public read, no write (admin via service role)
create policy "read courses" on public.courses for select using (true);

-- enrollments: user manages own
create policy "insert own enrollment" on public.enrollments for insert with check (auth.uid() = user_id);
create policy "read own enrollment" on public.enrollments for select using (auth.uid() = user_id);
create policy "delete own enrollment" on public.enrollments for delete using (auth.uid() = user_id);

-- qcm_categories: public read
create policy "read qcm categories" on public.qcm_categories for select using (true);

-- qcms: public read
create policy "read qcms" on public.qcms for select using (true);

-- attempts: user only
create policy "write attempts" on public.qcm_attempts for insert with check (auth.uid() = user_id);
create policy "read own attempts" on public.qcm_attempts for select using (auth.uid() = user_id);

-- cards (SM-2): user only
create policy "write cards" on public.cards for insert with check (auth.uid() = user_id);
create policy "read cards" on public.cards for select using (auth.uid() = user_id);
create policy "update cards" on public.cards for update using (auth.uid() = user_id);

-- messages: allow insert by anyone (rate-limit côté app)
create policy "create messages" on public.messages for insert with check (true);
