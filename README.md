# RadarIA

> **Révise les bons chapitres, pas tout le cours.**

SaaS B2C qui aide les étudiants à prioriser leurs révisions en croisant
cours + annales + syllabus avec une IA. Score d'importance par chapitre,
probabilité estimée à l'examen, fiches de révision ciblées, examen blanc
réaliste et plan de révision jour par jour.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** : Auth + Postgres + Storage + RLS
- **Gemini API** (architecture pluggable `AIProvider`)
- **Stripe** : pack one-shot + abonnement Premium
- **Vercel** pour le déploiement

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'env
cp .env.example .env.local
# … et remplir les valeurs (voir DEPLOYMENT.md §5)

# 3. Appliquer les migrations Supabase
# (cf. supabase/README.md ou DEPLOYMENT.md §2.2)

# 4. Lancer le dev server
npm run dev
```

## Scripts

```bash
npm run dev         # Dev server sur :3000
npm run build       # Build de prod
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
```

## Documentation

- `CLAUDE.md` : guide architecture + règles non négociables
- `DEPLOYMENT.md` : checklist complète Vercel + Supabase + Stripe
- `supabase/README.md` : structure des migrations SQL et RLS

## Disclaimer

RadarIA fournit une **analyse indicative** basée uniquement sur les
documents fournis. RadarIA **ne garantit pas** les sujets réels d'examen.
