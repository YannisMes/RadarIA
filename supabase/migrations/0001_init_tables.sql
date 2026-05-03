-- =====================================================
-- RadarIA — Migration 0001 : initialisation des tables
-- =====================================================
-- Crée toutes les tables métier. RLS est activé dans 0002.

set check_function_bodies = off;

-- -----------------------------------------------------
-- Extensions
-- -----------------------------------------------------
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;

-- -----------------------------------------------------
-- profiles : profil étendu lié à auth.users
-- -----------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  subscription_status text not null default 'free'
    check (subscription_status in ('free', 'pack', 'premium')),
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Profil utilisateur étendu, créé automatiquement à l''inscription via trigger.';

-- -----------------------------------------------------
-- projects : projets de révision
-- -----------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_name text not null,
  study_level text,
  exam_type text,
  exam_date date,
  target_grade text,
  available_time_per_day text,
  current_level text,
  status text not null default 'draft'
    check (status in ('draft', 'uploading', 'analyzing', 'analyzed', 'failed')),
  preparation_score int check (preparation_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx
  on public.projects(user_id);
create index if not exists projects_user_id_created_at_idx
  on public.projects(user_id, created_at desc);

comment on table public.projects is
  'Un projet de révision = une matière préparée pour un examen.';

-- -----------------------------------------------------
-- documents : fichiers uploadés liés à un projet
-- -----------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_type text,
  file_size int,
  document_category text not null
    check (document_category in ('course', 'past_exam', 'syllabus')),
  storage_path text not null,
  extracted_text text,
  created_at timestamptz not null default now()
);

create index if not exists documents_project_id_idx
  on public.documents(project_id);
create index if not exists documents_user_id_idx
  on public.documents(user_id);

comment on table public.documents is
  'Documents (cours, annales, syllabus) uploadés par l''utilisateur.';

-- -----------------------------------------------------
-- analyses : résultats d'analyse IA
-- -----------------------------------------------------
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  global_summary text,
  detected_subject text,
  exam_strategy text,
  preparation_score int check (preparation_score between 0 and 100),
  confidence_level text check (confidence_level in ('low', 'medium', 'high')),
  missing_information jsonb not null default '[]'::jsonb,
  detected_chapters jsonb not null default '[]'::jsonb,
  priority_chapters jsonb not null default '[]'::jsonb,
  revision_sheets jsonb not null default '[]'::jsonb,
  mock_exam jsonb,
  revision_plan jsonb not null default '[]'::jsonb,
  next_actions jsonb not null default '[]'::jsonb,
  disclaimer text not null default 'Ces estimations sont basées uniquement sur les documents fournis et ne garantissent pas les sujets réels de l''examen.',
  raw_ai_response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analyses_project_id_idx
  on public.analyses(project_id);
create index if not exists analyses_user_id_idx
  on public.analyses(user_id);
create index if not exists analyses_project_id_created_at_idx
  on public.analyses(project_id, created_at desc);

comment on table public.analyses is
  'Résultats structurés d''une analyse IA. Une ligne = une analyse.';

-- -----------------------------------------------------
-- usage_limits : compteurs freemium par utilisateur
-- -----------------------------------------------------
create table if not exists public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  projects_count int not null default 0,
  analyses_count int not null default 0,
  files_uploaded_count int not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists usage_limits_user_id_idx
  on public.usage_limits(user_id);

comment on table public.usage_limits is
  'Compteurs cumulés par utilisateur pour appliquer les quotas freemium.';

-- -----------------------------------------------------
-- stripe_customers : mapping user_id -> stripe_customer_id
-- -----------------------------------------------------
create table if not exists public.stripe_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists stripe_customers_user_id_idx
  on public.stripe_customers(user_id);

comment on table public.stripe_customers is
  'Lien entre un utilisateur Supabase et son customer Stripe.';

-- -----------------------------------------------------
-- subscriptions : abonnements Stripe actifs
-- -----------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text unique,
  status text,
  plan text check (plan in ('pack', 'premium')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions(user_id);
create index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions(stripe_subscription_id);

comment on table public.subscriptions is
  'Historique et état des abonnements Stripe.';
