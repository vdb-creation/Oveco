# Guide Rapide - Formbricks avec Oveco

## 🚀 Démarrage rapide

### 1️⃣ Configuration Backend

**Prérequis :**
- Serveur Coolify avec Traefik
- Certificats SSL (fullchain + privkey)
- Domaine(s) configuré(s)

**Déploiement :**

1. Copiez vos certificats sur le serveur :
```bash
scp admin.fullchain.crt root@serveur:/data/coolify/proxy/certs/
scp admin.privkey.key root@serveur:/data/coolify/proxy/certs/
```

2. Créez `/data/coolify/proxy/dynamic/certs.yml` :
```yaml
tls:
  certificates:
    - certFile: /traefik/certs/admin.fullchain.crt
      keyFile: /traefik/certs/admin.privkey.key
```

3. Dans Coolify, créez une nouvelle app **Docker Compose** :
```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: formbricks
      POSTGRES_USER: formbricks
      POSTGRES_PASSWORD: CHANGEME_STRONG_PASSWORD
    volumes:
      - pg:/var/lib/postgresql/data

  redis:
    image: redis:7
    command: ["redis-server", "--requirepass", "CHANGEME_REDIS_PASSWORD"]
    volumes:
      - redis:/data

  formbricks:
    image: ghcr.io/formbricks/formbricks:latest
    depends_on: [postgres, redis]
    environment:
      WEBAPP_URL: https://admin.example.com
      NEXTAUTH_URL: https://admin.example.com
      DATABASE_URL: postgresql://formbricks:CHANGEME_STRONG_PASSWORD@postgres:5432/formbricks?schema=public
      REDIS_URL: redis://:CHANGEME_REDIS_PASSWORD@redis:6379
      NEXTAUTH_SECRET: CHANGEME_USE_openssl_rand_hex_32
      ENCRYPTION_KEY: CHANGEME_USE_openssl_rand_hex_32
      CRON_SECRET: CHANGEME_USE_openssl_rand_hex_32
      TELEMETRY_DISABLED: "1"
    labels:
      - traefik.enable=true
      - traefik.http.routers.formbricks.rule=Host(`admin.example.com`)
      - traefik.http.routers.formbricks.entrypoints=websecure
      - traefik.http.routers.formbricks.tls=true
      - traefik.http.services.formbricks.loadbalancer.server.port=3000

volumes:
  pg:
  redis:
```

4. Générez les secrets :
```bash
openssl rand -hex 32  # NEXTAUTH_SECRET
openssl rand -hex 32  # ENCRYPTION_KEY
openssl rand -hex 32  # CRON_SECRET
```

5. Déployez l'application

### 2️⃣ Configuration Frontend (Astro)

**Fichiers déjà modifiés :**
- ✅ `src/layouts/Layout.astro` - Script Formbricks intégré
- ✅ `src/components/Contact.astro` - Validation + trigger
- ✅ `.env.example` - Template des variables

**À faire :**

1. Connectez-vous à votre admin Formbricks : `https://admin.example.com`

2. Allez dans **Settings → Setup Checklist**

3. Copiez vos valeurs dans `.env` :
```env
PUBLIC_FORMBRICKS_APP_URL=https://admin.example.com
PUBLIC_FORMBRICKS_ENV_ID=env_abc123xyz
```

4. Redémarrez le serveur de dev :
```bash
pnpm dev
```

5. Testez avec `?formbricksDebug=true` :
```
http://localhost:4321/?formbricksDebug=true
```

### 3️⃣ Créer votre première enquête

1. Dans Formbricks admin : **Surveys → Create Survey**

2. Choisissez **Website Survey**

3. Configurez :
   - **Name:** "Satisfaction formulaire de contact"
   - **Trigger:** Event-based
   - **Event:** `contact_form_submitted`

4. Ajoutez vos questions :
   - "Comment trouvez-vous notre formulaire ?"
   - "Avez-vous réussi à trouver nos coordonnées ?"
   - "Recommanderiez-vous Oveco ?"

5. **Publish** l'enquête

6. Testez en soumettant le formulaire de contact

## 🧪 Tests

### Vérifier le chargement

```bash
# Dans la console navigateur
console.log(window.formbricks)
// Devrait afficher un objet avec { track, setup, ... }
```

### Déclencher manuellement un événement

```javascript
window.formbricks.track('contact_form_submitted', {
  name: 'Test',
  email: 'test@example.com',
  hasPhone: true,
  hasCompany: false,
  messageLength: 100
});
```

### Vérifier dans le réseau

Ouvrez DevTools → Network → filtrez par "formbricks"
- ✅ `/js/formbricks.umd.cjs` chargé
- ✅ Requêtes POST vers `/api/v1/client/...`

## 📊 Événements disponibles

### `contact_form_submitted`

**Quand :** Après soumission réussie du formulaire de contact

**Propriétés :**
```typescript
{
  name: string,           // Nom du contact
  email: string,          // Email
  hasPhone: boolean,      // A un téléphone ?
  hasCompany: boolean,    // A une entreprise ?
  messageLength: number   // Longueur du message
}
```

**Utilisation dans Formbricks :**
- Créer des segments (ex: `hasCompany === true`)
- Analyser les conversions
- Mesurer la satisfaction

## 🎯 Cas d'usage

### 1. Enquête de satisfaction post-contact

```
Trigger: contact_form_submitted
Question: "Sur 10, recommanderiez-vous Oveco ?"
Type: Rating (1-10)
```

### 2. Feedback sur le formulaire

```
Trigger: contact_form_submitted
Condition: messageLength > 200
Question: "Avez-vous trouvé notre formulaire facile à utiliser ?"
Type: Single Choice (Oui/Non/Peut mieux faire)
```

### 3. Segmentation clients

```
Trigger: contact_form_submitted
Condition: hasCompany === true
Question: "Quelle est la taille de votre entreprise ?"
Type: Single Choice (1-10 / 11-50 / 51-200 / 200+)
```

## 🐛 Dépannage

### Problème : Script ne charge pas

**Solution :**
1. Vérifiez `.env` : `PUBLIC_FORMBRICKS_APP_URL` correct ?
2. Testez l'URL : `curl https://surveys.example.com/js/formbricks.umd.cjs`
3. Vérifiez les CORS dans Formbricks

### Problème : Événement non tracké

**Solution :**
1. Mode debug : ajoutez `?formbricksDebug=true`
2. Console : `window.formbricks` existe ?
3. Vérifiez l'Environment ID

### Problème : Enquête n'apparaît pas

**Solution :**
1. L'enquête est **Active** (pas Draft) ?
2. Le trigger correspond : `contact_form_submitted` ?
3. Les conditions sont correctes ?
4. Testez en incognito (cookie de fermeture ?)

## 📚 Documentation complète

→ Voir `formbricks-integration.md` pour :
- Architecture détaillée
- Problèmes courants et solutions
- Exemples avancés
- Bonnes pratiques RGPD

## ✅ Checklist déploiement

Production :
- [ ] Certificats SSL installés
- [ ] Formbricks déployé sur Coolify
- [ ] Variables d'environnement configurées
- [ ] `.env` avec bonnes valeurs (APP_URL + ENV_ID)
- [ ] Test de chargement du script
- [ ] Test d'envoi du formulaire
- [ ] Test du trigger Formbricks
- [ ] Enquête publiée et active
- [ ] Test en production

---

**Besoin d'aide ?**
- 📖 [Documentation Formbricks](https://formbricks.com/docs)
- 🛠️ [Coolify Docs](https://coolify.io/docs)
- 💬 Contactez l'équipe Oveco
