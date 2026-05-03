# Supabase — RadarIA

Schéma de base, RLS et bucket Storage pour RadarIA.

## Structure

```
supabase/
└── migrations/
    ├── 0001_init_tables.sql      # Tables métier
    ├── 0002_rls_policies.sql     # Row Level Security
    ├── 0003_triggers.sql         # Triggers (auto-profile, updated_at)
    └── 0004_storage_bucket.sql   # Bucket "documents" + policies
```

## Tables

| Table | Description |
|---|---|
| `profiles` | Profil étendu lié à `auth.users` (créé automatiquement à l'inscription) |
| `projects` | Un projet de révision = une matière préparée pour un examen |
| `documents` | Fichiers uploadés rangés en `course` / `past_exam` / `syllabus` |
| `analyses` | Résultats structurés (JSONB) d'une analyse IA |
| `usage_limits` | Compteurs cumulés pour les quotas freemium |
| `stripe_customers` | Mapping `user_id` → `stripe_customer_id` |
| `subscriptions` | État des abonnements Stripe |

## Storage

Bucket `documents` (privé, max 20 MB par fichier, MIME : PDF / TXT / DOCX / PNG / JPEG).

Chemin obligatoire : `<user_id>/<project_id>/<file_name>`. Les RLS policies vérifient que le premier dossier du path est bien l'utilisateur courant.

## Appliquer les migrations

### Option 1 — Dashboard Supabase (recommandé pour démarrer)

1. Aller dans **SQL Editor** sur https://supabase.com/dashboard
2. Coller le contenu de chaque migration **dans l'ordre** (0001 → 0004)
3. Vérifier dans **Database > Tables** et **Authentication > Policies** que tout est bien créé
4. Vérifier dans **Storage** que le bucket `documents` est privé

### Option 2 — Supabase CLI

```bash
# Installer la CLI
npm install -g supabase

# Lier au projet
supabase login
supabase link --project-ref <project-ref>

# Appliquer les migrations
supabase db push
```

## Règles non négociables

- **RLS activée sur toutes les tables**. Aucune fuite croisée entre utilisateurs.
- **Service role uniquement côté serveur**. Le webhook Stripe et les jobs internes utilisent `SUPABASE_SERVICE_ROLE_KEY` qui bypasse RLS.
- **Trigger d'inscription** : à chaque nouvelle ligne dans `auth.users`, on crée automatiquement un `profile` et un `usage_limits` (statut `free`).
- **`updated_at`** géré automatiquement via trigger sur `profiles`, `projects`, `usage_limits`, `subscriptions`.

## Régénérer les types TypeScript

Quand le schéma évolue :

```bash
npx supabase gen types typescript --project-id <id> --schema public > src/types/database.ts
```

Pour le moment les types sont écrits à la main dans `src/types/database.ts` — fidèles aux migrations.
