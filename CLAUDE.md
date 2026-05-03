# RadarIA — Guide pour Claude Code

> SaaS B2C qui aide les étudiants à prioriser leurs révisions en analysant cours + annales + syllabus avec une IA.

## Promesse produit

- Promesse principale : **« Révise les bons chapitres, pas tout le cours. »**
- Sous-promesse : Upload cours + annales + syllabus → l'IA détecte les chapitres récurrents, score d'importance, probabilité estimée, et génère un examen blanc + plan de révision.

## Stack

| Domaine | Techno |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Style | Tailwind CSS |
| Auth & DB | Supabase (Auth + Postgres + Storage + RLS) |
| IA | Gemini API (provider principal) — abstraction `AIProvider` pour brancher OpenAI/Claude plus tard |
| Paiements | Stripe (préparé, V2) |
| Déploiement | Vercel |

## Structure de dossiers

```
src/
├── app/                    # Routes Next.js (App Router)
│   ├── (marketing)/        # Landing, pricing, FAQ (publiques)
│   ├── (auth)/             # /login, /signup, /forgot-password
│   ├── dashboard/          # Espace connecté
│   └── api/                # Route handlers (analyse, stripe, etc.)
├── components/
│   ├── marketing/          # Hero, Features, Pricing…
│   ├── dashboard/          # ProjectCard, UploadDropzone…
│   ├── results/            # Onglets de résultats
│   └── ui/                 # Boutons, inputs, modales (génériques)
├── lib/
│   ├── ai/                 # Provider Gemini, prompts, schémas Zod
│   │   ├── providers/
│   │   ├── prompts/
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   └── analyze-project.ts
│   ├── supabase/           # Clients (browser, server, admin)
│   ├── stripe.ts
│   ├── env.ts
│   ├── constants.ts
│   └── utils.ts
└── types/                  # Types DB, types métier
```

## Règles non négociables

1. **Sécurité des secrets** — Ne JAMAIS exposer côté client : `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. Toujours via une route serveur.
2. **Disclaimer juridique** — RadarIA ne promet jamais le sujet réel d'un examen. Phraséologie obligatoire : « probabilité estimée », « chapitres prioritaires », « basé uniquement sur les documents fournis », « ne garantit pas les sujets réels de l'examen ».
3. **RLS Supabase activée** sur toutes les tables. Un utilisateur ne voit jamais les données d'un autre.
4. **Architecture IA pluggable** — Toujours passer par l'interface `AIProvider`. L'app ne doit pas dépendre directement de Gemini.
5. **Freemium** — Limites côté serveur (jamais uniquement côté client).

## Commandes utiles

```bash
npm run dev         # Lance le dev server sur :3000
npm run build       # Build de prod
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

## Variables d'environnement

Voir `.env.example` pour la liste complète. Copier en `.env.local`.

## État d'avancement

Suivre le plan d'origine :

1. ✅ Étape 1 — Init projet, stack, architecture
2. ⬜ Étape 2 — Landing page complète
3. ⬜ Étape 3 — Supabase (migrations, RLS, clients)
4. ⬜ Étape 4 — Authentification
5. ⬜ Étape 5 — Dashboard
6. ⬜ Étape 6 — Création projet
7. ⬜ Étape 7 — Upload documents
8. ⬜ Étape 8 — Extraction texte
9. ⬜ Étape 9 — Gemini + analyse IA
10. ⬜ Étape 10 — Page résultats
11. ⬜ Étape 11 — Freemium + pricing
12. ⬜ Étape 12 — Stripe
13. ⬜ Étape 13 — Finitions UX
14. ⬜ Étape 14 — Checklist Vercel
