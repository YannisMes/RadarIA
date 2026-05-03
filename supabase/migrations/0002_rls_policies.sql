-- =====================================================
-- RadarIA — Migration 0002 : Row Level Security
-- =====================================================
-- Active RLS sur toutes les tables et crée les policies
-- "owner-only" : un utilisateur ne voit que ses propres lignes.
-- Les opérations service-role (webhooks Stripe, jobs internes)
-- bypassent RLS automatiquement avec la SUPABASE_SERVICE_ROLE_KEY.

-- -----------------------------------------------------
-- profiles
-- -----------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- -----------------------------------------------------
-- projects
-- -----------------------------------------------------
alter table public.projects enable row level security;

drop policy if exists "projects_select_own" on public.projects;
create policy "projects_select_own"
  on public.projects for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own"
  on public.projects for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_delete_own"
  on public.projects for delete
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------
-- documents
-- -----------------------------------------------------
alter table public.documents enable row level security;

drop policy if exists "documents_select_own" on public.documents;
create policy "documents_select_own"
  on public.documents for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own"
  on public.documents for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "documents_update_own" on public.documents;
create policy "documents_update_own"
  on public.documents for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "documents_delete_own" on public.documents;
create policy "documents_delete_own"
  on public.documents for delete
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------
-- analyses
-- -----------------------------------------------------
alter table public.analyses enable row level security;

drop policy if exists "analyses_select_own" on public.analyses;
create policy "analyses_select_own"
  on public.analyses for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "analyses_insert_own" on public.analyses;
create policy "analyses_insert_own"
  on public.analyses for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "analyses_delete_own" on public.analyses;
create policy "analyses_delete_own"
  on public.analyses for delete
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------
-- usage_limits
-- -----------------------------------------------------
-- L'utilisateur peut LIRE ses limites mais pas les modifier.
-- L'écriture est exclusivement faite via le service role
-- (webhooks Stripe, server actions admin).
alter table public.usage_limits enable row level security;

drop policy if exists "usage_limits_select_own" on public.usage_limits;
create policy "usage_limits_select_own"
  on public.usage_limits for select
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------
-- stripe_customers
-- -----------------------------------------------------
-- L'utilisateur peut lire son mapping. Écritures = service role.
alter table public.stripe_customers enable row level security;

drop policy if exists "stripe_customers_select_own" on public.stripe_customers;
create policy "stripe_customers_select_own"
  on public.stripe_customers for select
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------
-- subscriptions
-- -----------------------------------------------------
-- Idem : lecture seule pour le user, écriture via webhooks.
alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select
  to authenticated
  using (auth.uid() = user_id);
