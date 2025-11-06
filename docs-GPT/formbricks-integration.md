# Intégration Formbricks - Documentation

## 📋 Vue d'ensemble

Formbricks est intégré dans le projet Oveco pour collecter des feedbacks utilisateurs et analyser les soumissions du formulaire de contact. Cette documentation explique comment tout fonctionne ensemble.

## 🏗️ Architecture

### 1. Déploiement Backend (Coolify)

Formbricks nécessite un déploiement serveur avec :
- **PostgreSQL 16** : Base de données principale
- **Redis 7** : Cache et gestion des files d'attente
- **Formbricks** : Application principale (port 3000)

#### Variables d'environnement requises :

```yaml
# Domaines
WEBAPP_URL: https://admin.example.com          # Interface admin
PUBLIC_URL: https://surveys.example.com        # SDK public (optionnel si split)

# Base de données
DATABASE_URL: postgresql://formbricks:PASSWORD@postgres:5432/formbricks?schema=public
REDIS_URL: redis://:PASSWORD@redis:6379

# Secrets (générer avec: openssl rand -hex 32)
NEXTAUTH_SECRET: [32 bytes hex]
ENCRYPTION_KEY: [32 bytes hex]
CRON_SECRET: [32 bytes hex]

# Options
TELEMETRY_DISABLED: "1"
```

### 2. Configuration Traefik (SSL personnalisé)

Les certificats SSL sont placés dans `/data/coolify/proxy/certs/` :

```yaml
# /data/coolify/proxy/dynamic/certs.yml
tls:
  certificates:
    - certFile: /traefik/certs/admin.fullchain.crt
      keyFile: /traefik/certs/admin.privkey.key
    - certFile: /traefik/certs/surveys.fullchain.crt
      keyFile: /traefik/certs/surveys.privkey.key
```

### 3. Intégration Frontend (Astro)

#### Variables d'environnement (.env)

```env
PUBLIC_FORMBRICKS_APP_URL=https://surveys.example.com
PUBLIC_FORMBRICKS_ENV_ID=env_XXXXXXXX
```

**Récupération des valeurs :**
1. Connectez-vous à Formbricks admin
2. Allez dans **Settings → Setup Checklist**
3. Copiez l'**Environment ID** et l'**App URL**

#### Fichiers modifiés

**1. `src/layouts/Layout.astro`**
- Charge le script Formbricks sur toutes les pages (sauf `/admin`)
- Initialise le SDK avec `environmentId` et `appUrl`
- Utilise `is:inline` pour éviter les problèmes de bundling

**2. `src/components/Contact.astro`**
- Script de validation du formulaire
- Trigger Formbricks après soumission réussie
- Track l'événement `contact_form_submitted` avec métadonnées

**3. `.env.example`**
- Template des variables d'environnement requises

## 🎯 Événements trackés

### `contact_form_submitted`

Déclenché après l'envoi réussi du formulaire de contact.

**Propriétés :**
```typescript
{
  name: string,           // Nom du contact
  email: string,          // Email du contact
  hasPhone: boolean,      // A fourni un téléphone ?
  hasCompany: boolean,    // A fourni une entreprise ?
  messageLength: number   // Longueur du message
}
```

## 📊 Utilisation dans Formbricks

### 1. Créer une enquête basée sur un événement

1. Dans Formbricks, allez dans **Surveys → Create Survey**
2. Choisissez **Website Survey** ou **App Survey**
3. Dans **Targeting**, sélectionnez **Event-based**
4. Entrez l'événement : `contact_form_submitted`

### 2. Cibler des segments spécifiques

Exemples de conditions :
```javascript
// Utilisateurs ayant fourni leur entreprise
event.hasCompany === true

// Messages longs (plus de 200 caractères)
event.messageLength > 200

// Email d'un domaine spécifique
event.email.includes('@entreprise.com')
```

### 3. Questions suggérées

**Après soumission du formulaire :**
- "Comment avez-vous trouvé notre formulaire de contact ?"
- "Avez-vous réussi à trouver toutes les informations dont vous aviez besoin ?"
- "Sur une échelle de 1 à 10, recommanderiez-vous Oveco ?"

## 🔍 Debug & Tests

### Mode debug

Ajoutez `?formbricksDebug=true` à n'importe quelle URL :
```
https://votre-site.com/?formbricksDebug=true
```

Ouvrez la console développeur pour voir :
- Chargement du script
- Initialisation du SDK
- Événements trackés
- Erreurs éventuelles

### Vérifications dans le réseau

1. Ouvrir les DevTools → Network
2. Chercher `/js/formbricks.umd.cjs` (doit charger depuis PUBLIC_URL)
3. Vérifier les requêtes POST vers `/api/v1/client/...` après un événement

### Test de l'événement

```javascript
// Dans la console du navigateur
window.formbricks.track('contact_form_submitted', {
  name: 'Test User',
  email: 'test@example.com',
  hasPhone: true,
  hasCompany: false,
  messageLength: 150
});
```

## 🚨 Problèmes courants

### Script ne charge pas

**Symptômes :** Pas de `window.formbricks` disponible

**Solutions :**
1. Vérifier que `PUBLIC_FORMBRICKS_APP_URL` est défini dans `.env`
2. Vérifier que l'URL est accessible (pas de CORS)
3. Vérifier dans Network que le script se charge bien

### Événements non trackés

**Symptômes :** Les événements n'apparaissent pas dans Formbricks

**Solutions :**
1. Activer le mode debug (`?formbricksDebug=true`)
2. Vérifier que `window.formbricks` est initialisé
3. Vérifier l'Environment ID dans la config

### Enquête n'apparaît pas

**Symptômes :** L'enquête ne se déclenche pas après un événement

**Solutions :**
1. Vérifier le targeting dans Formbricks (bon event name)
2. Vérifier que l'enquête est **Active** (pas Draft)
3. Vérifier les conditions de déclenchement
4. Tester avec le mode debug activé

### CORS / Mixed Content

**Symptômes :** Erreurs CORS dans la console

**Solutions :**
1. Vérifier que PUBLIC_URL et WEBAPP_URL sont en HTTPS
2. Vérifier la configuration Traefik
3. Vérifier les certificats SSL

## 📝 Bonnes pratiques

### 1. Gestion des données sensibles

- ❌ **Ne jamais tracker** : mots de passe, données bancaires, informations médicales
- ✅ **OK à tracker** : nom, email (si consentement), métadonnées anonymes
- ⚠️ **Attention RGPD** : Informer les utilisateurs, obtenir le consentement

### 2. Nommage des événements

```javascript
// ✅ Bon : descriptif et cohérent
'contact_form_submitted'
'newsletter_subscribed'
'project_quote_requested'

// ❌ Mauvais : vague ou incohérent
'submit'
'ContactFormSubmit'
'form_1_sent'
```

### 3. Propriétés des événements

```javascript
// ✅ Bon : données structurées et utiles
{
  formType: 'contact',
  completionTime: 45, // secondes
  fieldsCompleted: 5,
  hasAttachment: false
}

// ❌ Mauvais : données inutiles ou redondantes
{
  timestamp: new Date(), // Formbricks l'ajoute déjà
  userId: null,
  data: '...'
}
```

### 4. Fréquence des enquêtes

- Ne pas bombarder l'utilisateur après chaque action
- Espacer les enquêtes (min 7 jours entre deux pour un même utilisateur)
- Utiliser les conditions de Formbricks pour limiter l'affichage

## 🔄 Mise à jour

### Backend (Formbricks)

```bash
# Dans Coolify, mettre à jour l'image
docker pull ghcr.io/formbricks/formbricks:latest
docker-compose up -d
```

### Frontend (SDK)

Le SDK se charge dynamiquement depuis PUBLIC_URL, donc :
- ✅ Toujours à jour automatiquement
- ✅ Pas besoin de rebuild le site Astro
- ✅ CDN cache géré par Formbricks

## 📚 Ressources

- [Documentation Formbricks](https://formbricks.com/docs)
- [Guide Coolify Traefik](https://coolify.io/docs/knowledge-base/proxy/traefik)
- [Environment Variables Formbricks](https://formbricks.com/docs/self-hosting/configuration/environment-variables)
- [Domain Configuration](https://formbricks.com/docs/self-hosting/configuration/domain-configuration)
- [Framework Guides](https://formbricks.com/docs/xm-and-surveys/surveys/website-app-surveys/framework-guides)

## 🎓 Exemples d'utilisation avancée

### Trigger manuel sur bouton CTA

```astro
---
// Dans un composant Astro
---
<button 
  class="cta-button"
  data-formbricks-trigger="project_interest"
>
  Démarrer mon projet
</button>

<script>
  document.querySelector('[data-formbricks-trigger]')?.addEventListener('click', (e) => {
    const trigger = e.currentTarget.getAttribute('data-formbricks-trigger');
    if (window.formbricks && trigger) {
      window.formbricks.track(trigger, {
        source: 'hero_cta',
        page: window.location.pathname
      });
    }
  });
</script>
```

### Enquête après temps passé sur la page

```javascript
// Dans Contact.astro ou Layout.astro
let timeOnPage = 0;
const timer = setInterval(() => {
  timeOnPage += 1;
  
  // Après 2 minutes, demander un feedback
  if (timeOnPage === 120) {
    window.formbricks?.track('long_visit', {
      page: window.location.pathname,
      duration: timeOnPage
    });
    clearInterval(timer);
  }
}, 1000);
```

### Segmentation par type de visiteur

```javascript
// Identifier le type de visiteur
const visitorType = document.referrer.includes('google') ? 'search' 
  : document.referrer ? 'referral' 
  : 'direct';

window.formbricks?.track('page_view', {
  type: visitorType,
  landingPage: window.location.pathname
});
```

---

**Dernière mise à jour :** 6 novembre 2025
**Version Formbricks :** latest (Docker)
**Version Astro :** 5.15.2
