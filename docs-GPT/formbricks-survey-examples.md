# Exemples d'Enquêtes Formbricks pour Oveco

Ce document propose des enquêtes pré-configurées adaptées au contexte d'Oveco (auto-construction, rénovation écologique).

## 📋 Enquête 1 : Satisfaction Post-Contact

**Objectif :** Mesurer la satisfaction des visiteurs après avoir soumis le formulaire de contact.

### Configuration

- **Nom :** Satisfaction Formulaire Contact
- **Type :** Website Survey
- **Trigger :** Event-based
- **Event :** `contact_form_submitted`
- **Délai d'affichage :** 2 secondes après soumission
- **Réponses max :** 1 par utilisateur

### Questions

#### Question 1 : NPS
```
Type: Rating (0-10)
Question: "Sur une échelle de 0 à 10, recommanderiez-vous Oveco à un ami pour un projet de construction écologique ?"
Required: Oui
Logic: Si ≥9 → Question 3 | Si 7-8 → Question 2 | Si ≤6 → Question 4
```

#### Question 2 : Raison score moyen
```
Type: Open Text
Question: "Merci pour votre retour ! Que pourrions-nous améliorer pour mieux vous servir ?"
Required: Non
Max characters: 500
```

#### Question 3 : Félicitations promoteurs
```
Type: Single Choice
Question: "Génial ! Quel aspect d'Oveco vous plaît le plus ?"
Choices:
  - L'approche écologique
  - L'expertise technique
  - La transparence des prix
  - L'accompagnement personnalisé
  - Autre
Required: Non
```

#### Question 4 : Feedback détracteurs
```
Type: Open Text
Question: "Nous sommes désolés que votre expérience n'ait pas été optimale. Pouvez-vous nous dire ce qui vous a déçu ?"
Required: Non
Max characters: 500
```

---

## 🎯 Enquête 2 : Qualification du Besoin

**Objectif :** Mieux comprendre le type de projet du visiteur pour personnaliser le suivi.

### Configuration

- **Nom :** Qualification Projet
- **Type :** Website Survey
- **Trigger :** Event-based
- **Event :** `contact_form_submitted`
- **Condition :** `hasCompany === true` (seulement pros/entreprises)
- **Délai :** 1 seconde

### Questions

#### Question 1 : Type de projet
```
Type: Multiple Choice
Question: "Quel type de projet envisagez-vous avec Oveco ?"
Choices:
  - Nouvelle construction (maison passive)
  - Rénovation énergétique complète
  - Isolation thermique
  - Installation énergies renouvelables
  - Autoconstruction accompagnée
  - Conseil / Audit énergétique
  - Autre
Required: Oui
```

#### Question 2 : Échéance
```
Type: Single Choice
Question: "À quel horizon prévoyez-vous de démarrer votre projet ?"
Choices:
  - Moins de 3 mois
  - 3 à 6 mois
  - 6 à 12 mois
  - Plus d'un an
  - Pas encore défini
Required: Oui
Logic: Si "Moins de 3 mois" → Question 3
```

#### Question 3 : Budget indicatif
```
Type: Single Choice
Question: "Avez-vous une idée de votre budget pour ce projet ?"
Choices:
  - Moins de 50 000 €
  - 50 000 € - 100 000 €
  - 100 000 € - 200 000 €
  - Plus de 200 000 €
  - Budget non défini
Required: Non
```

---

## 💬 Enquête 3 : Expérience Utilisateur du Site

**Objectif :** Améliorer l'ergonomie et le contenu du site web.

### Configuration

- **Nom :** Feedback Site Web
- **Type :** Website Survey
- **Trigger :** Time-based
- **Délai :** Après 2 minutes sur le site
- **Fréquence :** Max 1 fois tous les 30 jours par utilisateur
- **Pages cibles :** Toutes sauf `/admin`

### Questions

#### Question 1 : Facilité d'utilisation
```
Type: Rating (1-5 étoiles)
Question: "Comment évaluez-vous la facilité d'utilisation de notre site ?"
Required: Oui
```

#### Question 2 : Informations trouvées
```
Type: Single Choice
Question: "Avez-vous trouvé les informations que vous cherchiez ?"
Choices:
  - Oui, facilement
  - Oui, mais après quelques recherches
  - Non, mais j'ai contacté Oveco
  - Non, je n'ai pas trouvé
Required: Oui
Logic: Si "Non" → Question 3
```

#### Question 3 : Informations manquantes
```
Type: Open Text
Question: "Quelles informations n'avez-vous pas réussi à trouver ?"
Required: Non
Max characters: 300
```

#### Question 4 : Section préférée
```
Type: Multiple Choice
Question: "Quelle(s) section(s) du site avez-vous trouvée(s) la/les plus utile(s) ?"
Choices:
  - Nos projets / Réalisations
  - Nos compétences
  - À propos / Notre équipe
  - Formulaire de contact
  - Page d'accueil
  - Autre
Required: Non
```

---

## 🏗️ Enquête 4 : Source de Découverte

**Objectif :** Comprendre comment les visiteurs découvrent Oveco.

### Configuration

- **Nom :** Source de Trafic
- **Type :** Website Survey
- **Trigger :** Page view
- **Page :** Homepage (`/` ou `/fr`)
- **Délai :** 30 secondes après arrivée
- **Fréquence :** 1 fois par utilisateur (permanent cookie)

### Questions

#### Question 1 : Canal de découverte
```
Type: Single Choice
Question: "Comment avez-vous découvert Oveco ?"
Choices:
  - Recherche Google
  - Réseaux sociaux (Facebook, LinkedIn, etc.)
  - Recommandation d'un ami ou collègue
  - Article de blog / Presse
  - Événement / Salon
  - Déjà client
  - Autre
Required: Oui
Logic: Si "Réseaux sociaux" → Question 2
```

#### Question 2 : Quel réseau social
```
Type: Single Choice
Question: "Sur quel réseau social nous avez-vous trouvé ?"
Choices:
  - Facebook
  - LinkedIn
  - Instagram
  - YouTube
  - Autre
Required: Non
```

#### Question 3 : Mots-clés recherche
```
Type: Open Text
Question: "Si vous nous avez trouvé via Google, quels mots-clés avez-vous utilisés ?"
Placeholder: "Ex: maison passive belgique, autoconstruction, rénovation écologique..."
Required: Non
Max characters: 200
```

---

## 🌱 Enquête 5 : Intérêt Écologie

**Objectif :** Mesurer la sensibilité écologique et adapter la communication.

### Configuration

- **Nom :** Sensibilité Écologique
- **Type :** Website Survey
- **Trigger :** Event-based
- **Event :** `contact_form_submitted`
- **Délai :** 5 secondes
- **Condition :** `messageLength > 100` (messages détaillés)

### Questions

#### Question 1 : Motivation écologique
```
Type: Rating (1-10)
Question: "À quel point l'aspect écologique est-il important dans votre projet ?"
Label gauche: "Pas prioritaire"
Label droite: "Primordial"
Required: Oui
Logic: Si ≥7 → Question 2
```

#### Question 2 : Critères écologiques
```
Type: Multiple Choice (Max 3 choix)
Question: "Quels aspects écologiques vous intéressent le plus ?"
Choices:
  - Performance énergétique (isolation, étanchéité)
  - Énergies renouvelables (solaire, géothermie)
  - Matériaux biosourcés et locaux
  - Gestion de l'eau et récupération
  - Empreinte carbone minimale
  - Biodiversité et végétalisation
  - Économie circulaire / Réemploi
Required: Non
```

#### Question 3 : Certifications
```
Type: Single Choice
Question: "Une certification (Passivhaus, BREEAM, etc.) est-elle importante pour vous ?"
Choices:
  - Oui, indispensable
  - Oui, un plus
  - Non, mais intéressé par les performances
  - Non, pas prioritaire
Required: No
```

---

## 📊 Enquête 6 : Retour Post-Projet (Clients)

**Objectif :** Feedback des clients ayant terminé un projet avec Oveco.

### Configuration

- **Nom :** Satisfaction Client Post-Projet
- **Type :** Link Survey (envoyé par email)
- **Audience :** Clients ayant terminé un projet
- **Timing :** 1 mois après fin de projet

### Questions

#### Question 1 : Satisfaction globale
```
Type: Smiley (5 niveaux)
Question: "Comment évaluez-vous votre expérience globale avec Oveco ?"
Smileys: 😞 😕 😐 🙂 😃
Required: Oui
```

#### Question 2 : Respect des délais
```
Type: Rating (1-5)
Question: "Le projet a-t-il été livré dans les délais annoncés ?"
Label gauche: "Non, retards importants"
Label droite: "Oui, parfaitement"
Required: Oui
```

#### Question 3 : Respect du budget
```
Type: Rating (1-5)
Question: "Le budget final était-il conforme au devis initial ?"
Label gauche: "Non, dépassements"
Label droite: "Oui, conforme"
Required: Oui
```

#### Question 4 : Qualité des travaux
```
Type: Rating (1-5)
Question: "Comment jugez-vous la qualité des travaux réalisés ?"
Label gauche: "Insatisfaisant"
Label droite: "Excellent"
Required: Oui
```

#### Question 5 : Communication
```
Type: Rating (1-5)
Question: "Comment évaluez-vous la communication et la réactivité de l'équipe ?"
Label gauche: "Insuffisante"
Label droite: "Parfaite"
Required: Oui
```

#### Question 6 : Recommandation
```
Type: Single Choice
Question: "Recommanderiez-vous Oveco à votre entourage ?"
Choices:
  - Oui, sans hésitation
  - Oui, probablement
  - Peut-être
  - Non, probablement pas
  - Non, certainement pas
Required: Oui
```

#### Question 7 : Témoignage
```
Type: Open Text
Question: "Souhaitez-vous partager un témoignage que nous pourrions publier (avec votre accord) ?"
Placeholder: "Votre retour d'expérience..."
Required: Non
Max characters: 1000
```

#### Question 8 : Améliorations
```
Type: Open Text
Question: "Que pourrions-nous améliorer pour les futurs projets ?"
Required: Non
Max characters: 500
```

---

## 🎓 Bonnes Pratiques d'Utilisation

### Timing
- ⏱️ Enquêtes courtes : **2-3 questions max**
- ⏱️ Enquêtes longues : **6-8 questions max** (segmentées avec logique)
- ⏱️ Délai avant affichage : **1-3 secondes** (éviter l'intrusion)

### Fréquence
- 🔁 Visiteur occasionnel : **1 enquête / 30 jours**
- 🔁 Utilisateur régulier : **1 enquête / 60 jours**
- 🔁 Client : **1 enquête post-projet** + **1 suivi annuel**

### Personnalisation
- 🎯 Utiliser les conditions : `hasCompany`, `messageLength`, etc.
- 🎯 Adapter selon la page : homepage ≠ page projet
- 🎯 Segmenter : nouveaux visiteurs ≠ clients existants

### Analyse
- 📈 Suivre le taux de réponse par enquête
- 📈 Identifier les abandons (quelle question ?)
- 📈 Croiser avec les données de conversion
- 📈 Agir sur les feedbacks négatifs rapidement

---

## 🚀 Déploiement Progressif

### Phase 1 - Semaine 1
- Enquête 1 : Satisfaction Post-Contact (petite charge)

### Phase 2 - Semaine 2-3
- Enquête 2 : Qualification du Besoin
- Analyser les premiers résultats

### Phase 3 - Mois 2
- Enquête 3 : Expérience Site Web
- Enquête 4 : Source de Découverte

### Phase 4 - Mois 3+
- Enquête 5 : Intérêt Écologie
- Enquête 6 : Post-Projet (clients uniquement)

### Optimisation Continue
- Ajuster les questions selon les retours
- A/B tester différentes formulations
- Désactiver les enquêtes peu performantes

---

**Dernière mise à jour :** 6 novembre 2025
**Nombre d'enquêtes :** 6 templates prêts à l'emploi
**Temps de setup :** ~30 minutes par enquête
