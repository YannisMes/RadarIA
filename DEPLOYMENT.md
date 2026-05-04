# Guide de déploiement RadarIA

Ce document récapitule, étape par étape, ce qu'il faut faire pour déployer
RadarIA en production sur Vercel + Supabase + Gemini + Stripe.

> ⚠️ Toutes les commandes supposent que tu es à la racine du repo et que
> tu as Node 20+ installé.

---

## 1. Pré-requis

- [ ] Compte **Vercel** (`vercel.com`)
- [ ] Compte **Supabase** (`supabase.com`)
- [ ] Compte **Google AI Studio** pour Gemini (`aistudio.google.com`)
- [ ] Compte **Stripe** (mode test pour démarrer)
- [ ] Un nom de domaine pointable sur Vercel (optionnel)

---

## 2. Supabase — base de données et auth

### 2.1 Créer le projet
1. Crée un nouveau projet Supabase, région UE recommandée
2. Choisis un mot de passe Postgres robuste, conserve-le

### 2.2 Appliquer les migrations
Deux options :

**A. Via le SQL Editor du dashboard** (le plus simple)

Coller le contenu des fichiers ci-dessous **dans l'ordre** :

1. `supabase/migrations/0001_init_tables.sql`
2. `supabase/migrations/0002_rls_policies.sql`
3. `supabase/migrations/0003_triggers.sql`
4. `supabase/migrations/0004_storage_bucket.sql`

**B. Via la CLI Supabase**

```bash
npm install -g supabase
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

### 2.3 Vérifications post-migration
- [ ] Dans **Database > Tables** : `profiles`, `projects`, `documents`, `analyses`, `usage_limits`, `stripe_customers`, `subscriptions` sont bien créées
- [ ] Dans **Authentication > Policies** : chaque table a ses policies RLS owner-only
- [ ] Dans **Storage** : un bucket `documents` existe, **privé**
- [ ] Dans **Database > Triggers** : `on_auth_user_created` est actif sur `auth.users`

### 2.4 Auth — URLs autorisées
Dans **Authentication > URL Configuration** :

- **Site URL** : `https://<ton-domaine>` (ou `https://<projet>.vercel.app` au début)
- **Redirect URLs** : ajoute
  - `https://<ton-domaine>/auth/callback`
  - `https://<projet>.vercel.app/auth/callback` (preview Vercel)
  - `http://localhost:3000/auth/callback` (dev)

### 2.5 Email templates
Dans **Authentication > Email Templates**, vérifie que les liens de
confirmation email et de reset de mot de passe utilisent bien
`{{ .SiteURL }}/auth/callback?...`.

---

## 3. Gemini API

1. Aller sur https://aistudio.google.com/app/apikey
2. Créer une API key dans un projet Google Cloud
3. Récupérer la clé (`AIza...`)
4. (Optionnel) configurer un quota / billing pour passer le free tier

> Modèle utilisé par défaut : `gemini-2.5-flash`. Tu peux surcharger via
> `GEMINI_MODEL` (ex. `gemini-2.5-pro` pour plus de qualité, plus cher).

---

## 4. Stripe — paiements

### 4.1 Produits et prix

Dans le dashboard Stripe (en mode **test** pour commencer) :

1. **Pack Examen**
   - Type : Produit
   - Tarification : **One-time**, 6,99 €
   - Récupérer le **price ID** (`price_...`)
2. **Premium RadarIA**
   - Type : Produit
   - Tarification : **Recurring**, 9,99 €/mois
   - Récupérer le **price ID** (`price_...`)

### 4.2 Webhook

Dans **Developers > Webhooks > Add endpoint** :

- **Endpoint URL** : `https://<ton-domaine>/api/stripe/webhook`
- **Events à écouter** :
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Récupérer le **signing secret** (`whsec_...`)

### 4.3 Test local du webhook

```bash
# Installer la CLI Stripe
brew install stripe/stripe-cli/stripe   # ou autre installer
stripe login

# Forwarder vers le serveur local
stripe listen --forward-to http://localhost:3000/api/stripe/webhook

# La commande affiche un STRIPE_WEBHOOK_SECRET de test, à mettre dans .env.local
```

Tester un paiement avec une carte test :
- Numéro : `4242 4242 4242 4242`
- Date : n'importe quelle date future
- CVC : n'importe quels 3 chiffres

---

## 5. Variables d'environnement

Voir `.env.example` pour la liste complète. À ajouter dans **Vercel > Project
Settings > Environment Variables** (Production, Preview et Development).

### Publiques (peuvent être exposées)
- [ ] `NEXT_PUBLIC_APP_URL` → `https://<ton-domaine>`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` → URL du projet Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` → clé publique anon
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_live_...`

### Secrètes (jamais côté client)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` → clé service role (⚠️ très puissante)
- [ ] `GEMINI_API_KEY` → clé Google AI Studio
- [ ] `STRIPE_SECRET_KEY` → `sk_live_...`
- [ ] `STRIPE_WEBHOOK_SECRET` → `whsec_...` du webhook prod
- [ ] `STRIPE_PRICE_PACK_EXAM` → `price_...` (Pack)
- [ ] `STRIPE_PRICE_PREMIUM_MONTHLY` → `price_...` (Premium)
- [ ] (Optionnel) `GEMINI_MODEL` → `gemini-2.5-flash` (défaut) ou `gemini-2.5-pro`

> ⚠️ Pour les **Preview deployments** Vercel, utiliser idéalement les clés
> Stripe **test** et un projet Supabase **dev** distinct, pour ne pas
> mélanger les vraies données.

---

## 6. Déploiement Vercel

### 6.1 Première mise en ligne

1. Push la branche sur GitHub
2. Dans Vercel : **Add New Project > Import** depuis GitHub
3. Vercel détecte automatiquement Next.js — laisser les valeurs par défaut
4. Renseigner toutes les variables d'environnement (cf. §5)
5. Sélectionner la région **Paris (cdg1)** ou **Frankfurt (fra1)**
6. Cliquer **Deploy**

### 6.2 Function timeouts

La route `POST /api/projects/[id]/analyze` a `maxDuration = 300` (5 min).

| Plan Vercel | Limite hard |
|---|---|
| Hobby | 60 s — l'analyse échouera sur les gros documents |
| Pro | 300 s — OK |
| Enterprise | 900 s |

Si tu restes en Hobby, prévoir de :
- réduire `MAX_TEXT_LENGTH` dans `src/lib/extract.ts`
- ou switcher sur `gemini-2.5-flash-lite` (plus rapide)

### 6.3 Domain custom

Dans **Project > Settings > Domains** :
1. Ajouter le domaine, suivre les instructions DNS (CNAME ou A record)
2. Une fois propagé, mettre à jour `NEXT_PUBLIC_APP_URL`
3. Mettre à jour les **Redirect URLs** Supabase (§2.4)
4. Mettre à jour l'**endpoint webhook** Stripe (§4.2)

---

## 7. Tests post-déploiement

### Auth
- [ ] Inscription : email reçu, lien de confirmation fonctionne, redirection vers `/dashboard`
- [ ] Login : redirection vers `/dashboard` (ou `redirectTo`)
- [ ] Forgot password : email reçu, reset fonctionne

### Création de projet
- [ ] `/dashboard/new` accessible authentifié
- [ ] Validation des champs obligatoires côté client + serveur
- [ ] Création OK → redirection vers `/dashboard/projects/[id]/upload`

### Upload
- [ ] PDF de test < 20 MB accepté
- [ ] TXT accepté
- [ ] Texte extrait visible dans la liste ("Texte extrait" en vert)
- [ ] PDF scanné → message "Texte non extrait" sans bloquer

### Analyse IA
- [ ] Bouton "Lancer l'analyse" actif quand ≥ 1 cours + ≥ 1 annale/syllabus
- [ ] Page `/analyze` affiche bien les étapes animées
- [ ] Au succès : redirection vers `/results`
- [ ] Vérifier dans Supabase que `analyses.raw_ai_response` est rempli

### Résultats
- [ ] Onglet **Vue d'ensemble** : score, résumé, top 5 chapitres
- [ ] Onglet **Chapitres** : free user → 3 visibles + paywall
- [ ] Onglet **Fiches** : free user → 1 visible + paywall
- [ ] Onglet **Examen blanc** : free user → 1 question + paywall
- [ ] Onglet **Plan** : free user → 2 jours + paywall

### Stripe
- [ ] CTA "Choisir le pack" sur `/pricing` → redirection Stripe Checkout
- [ ] Paiement test 4242… → retour sur `/dashboard?checkout=success`
- [ ] Bannière de succès affichée
- [ ] `profiles.subscription_status` mis à jour sur `pack` ou `premium`
- [ ] Annulation d'abonnement → status repasse à `free`

---

## 8. Monitoring

- **Vercel Logs** : `vercel logs <deployment>` ou onglet Logs du dashboard
- **Supabase** : onglet **Logs** > sélectionner Postgres ou Auth ou Storage
- **Stripe** : onglet **Developers > Events**, vérifier les retentries du webhook
- **Erreurs serveur Next** : capturées par `app/error.tsx`, voir `error.digest` côté Vercel

Pour le RadarIA en prod, penser à activer **Sentry** ou équivalent.

---

## 9. Sécurité — checklist finale

- [ ] **RLS activée** sur toutes les tables (vérifier dans Supabase)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` uniquement utilisée côté serveur (non exposée)
- [ ] `GEMINI_API_KEY` non visible côté client (pas de `NEXT_PUBLIC_*`)
- [ ] `STRIPE_SECRET_KEY` non visible côté client
- [ ] Webhook Stripe : signature vérifiée (déjà implémenté)
- [ ] Bucket Supabase `documents` est **privé** (pas public)
- [ ] Variables Vercel : marquées Production / Preview / Development séparément
- [ ] HTTPS forcé (Vercel le fait par défaut)
- [ ] Cookies Supabase : `httpOnly` + `secure` (gérés par `@supabase/ssr`)

---

## 10. Mises à jour ultérieures

| Action | Procédure |
|---|---|
| Déployer une nouvelle version | `git push` sur la branche connectée à Vercel |
| Ajouter une migration SQL | Créer `supabase/migrations/000X_*.sql`, appliquer via le SQL Editor ou la CLI |
| Changer un prix Stripe | Créer un **nouveau price**, mettre à jour `STRIPE_PRICE_*` dans Vercel, redéployer |
| Rotater un secret | Mettre à jour la valeur dans Vercel > redéployer |

---

Bon ship 🚀
