-- =====================================================
-- RadarIA — Migration 0004 : bucket Storage "documents"
-- =====================================================
-- Crée un bucket privé pour stocker les fichiers uploadés
-- par les utilisateurs. Les fichiers sont rangés sous :
--     <user_id>/<project_id>/<file_name>
-- Les policies vérifient que le premier segment du path
-- correspond à l'auth.uid() courant.

-- -----------------------------------------------------
-- Création du bucket (idempotent)
-- -----------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  20 * 1024 * 1024, -- 20 MB par fichier
  array[
    'application/pdf',
    'text/plain',
    -- Préparé pour la suite (formats à activer côté client plus tard) :
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- -----------------------------------------------------
-- Storage policies
-- -----------------------------------------------------
-- Storage utilise (storage.foldername(name))[1] = premier dossier
-- du path. On force ce premier dossier à être l'auth.uid().

drop policy if exists "documents_select_own" on storage.objects;
create policy "documents_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "documents_insert_own" on storage.objects;
create policy "documents_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "documents_update_own" on storage.objects;
create policy "documents_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "documents_delete_own" on storage.objects;
create policy "documents_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
