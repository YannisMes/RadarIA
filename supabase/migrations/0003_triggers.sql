-- =====================================================
-- RadarIA — Migration 0003 : triggers et fonctions
-- =====================================================
-- - Création automatique d'un profile et d'un usage_limits
--   à l'inscription d'un nouveau user (auth.users).
-- - Mise à jour automatique des champs updated_at.

-- -----------------------------------------------------
-- handle_updated_at : maj du champ updated_at
-- -----------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.projects;
create trigger set_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.usage_limits;
create trigger set_updated_at
  before update on public.usage_limits
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at on public.subscriptions;
create trigger set_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- -----------------------------------------------------
-- handle_new_user : crée profile + usage_limits à l'inscription
-- -----------------------------------------------------
-- SECURITY DEFINER pour pouvoir écrire dans public.profiles
-- même quand l'appel vient du flow auth (RLS bypass safe ici
-- car la fonction est figée et ne fait que des INSERTs maîtrisés).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;

  insert into public.usage_limits (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
