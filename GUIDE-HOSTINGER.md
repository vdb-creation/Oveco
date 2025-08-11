# 🌐 Guide de connexion à la base de données Hostinger

## 📋 Informations de connexion

**Serveur SSH Hostinger :**
- **Host :** 91.108.101.250
- **Port :** 65002
- **Utilisateur :** u749167356
- **Mot de passe :** xkUf&5nYafXEuK$EeB2E

**Base de données MySQL :**
- **Nom :** u749167356_aLLQB
- **Utilisateur :** u749167356_zTVGt
- **Mot de passe :** $CcDq4dFuk9ZSxDfY!g7
- **Host :** localhost (via tunnel SSH)
- **Port local :** 3307

ssh -L 3307:localhost:3306 -p 65002 u749167356@91.108.101.250 -N

## 🔧 Étapes de configuration

### 1. Démarrer le tunnel SSH

**Option A - Manuel (recommandé) :**
```bash
ssh -L 3307:localhost:3306 -p 65002 u749167356@91.108.101.250 -N
```

**Option B - Script PowerShell :**
```powershell
.\ssh-simple.ps1 start
```

### 2. Basculer vers la configuration Hostinger

1. Ouvrez : http://localhost/oveco/db-manager.php
2. Cliquez sur **"Activer Hostinger"**
3. Testez la connexion

### 3. Vérification

```powershell
.\ssh-simple.ps1 test
```

## 📁 Fichiers de configuration créés

- **wp-config-hostinger.php** : Configuration WordPress pour Hostinger
- **ssh-simple.ps1** : Script de gestion tunnel SSH
- **db-manager.php** : Interface de basculement entre configurations

## 🎯 Workflow complet

### Pour travailler avec Hostinger :

1. **Démarrer tunnel SSH :**
   ```bash
   ssh -L 3307:localhost:3306 -p 65002 u749167356@91.108.101.250 -N
   ```

2. **Basculer configuration :**
   - Visitez : http://localhost/oveco/db-manager.php
   - Cliquez "Activer Hostinger"

3. **Travailler normalement :**
   - Votre site WordPress utilise maintenant la DB Hostinger
   - Toutes les modifications sont sauvées sur Hostinger

4. **Arrêter (quand terminé) :**
   - Fermez le terminal SSH (Ctrl+C)
   - Optionnel : Rebasculez vers local via db-manager.php

### Pour revenir au local :

1. **Basculer configuration :**
   - Visitez : http://localhost/oveco/db-manager.php
   - Cliquez "Activer Local"

2. **Fermer tunnel SSH :**
   - Fermez le terminal SSH ou Ctrl+C

## ⚠️ Notes importantes

1. **Tunnel obligatoire :** Le tunnel SSH doit rester ouvert pendant tout le travail
2. **Port 3307 :** Utilisé localement pour éviter les conflits avec MySQL local (3306)
3. **Basculement :** Vous pouvez facilement basculer entre local et Hostinger
4. **Sécurité :** Tunnel SSH crypté pour sécuriser la connexion

## 🧪 Tests disponibles

- **Test tunnel :** `.\ssh-simple.ps1 test`
- **Test DB complet :** http://localhost/oveco/db-manager.php (bouton "Tester")
- **Site WordPress :** http://localhost/oveco/

## 🔍 Résolution des problèmes

**Si le tunnel ne fonctionne pas :**
1. Vérifiez que le port 3307 est libre
2. Confirmez les identifiants SSH
3. Redémarrez le tunnel

**Si WordPress ne se connecte pas :**
1. Vérifiez que le tunnel est actif (`ssh-simple.ps1 test`)
2. Confirmez la configuration active (db-manager.php)
3. Vérifiez les logs WordPress

---

✅ **Configuration terminée !** Vous pouvez maintenant travailler avec la base de données Hostinger via tunnel SSH sécurisé.
