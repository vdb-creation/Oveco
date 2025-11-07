# 🎨 Astro Template - Wireframe Components

Un template Astro moderne avec une collection complète de composants wireframe prêts à l'emploi.

## ✨ Fonctionnalités

- 🎯 **10 composants wireframe** prêts à l'emploi
- 📱 **100% Responsive** - Mobile, tablette, desktop
- 🎨 **Design minimaliste** - Style wireframe épuré
- ⚡ **Performance optimale** - Astro SSG
- 🔧 **Facile à personnaliser** - Props et styles modulaires
- 📝 **TinaCMS intégré** - CMS headless (optionnel)
- 🚀 **GitHub Actions** - Déploiement automatique
- � **Formbricks** - Feedback utilisateur et analytics

## 📦 Composants inclus

1. **WFNavbar** - Navigation responsive avec menu mobile
2. **WFHero** - Section héro avec CTA
3. **WFServices** - Grille de services
4. **WFProjectShowcase** - Carrousel de projets interactif
5. **WFTestimonials** - Témoignages clients
6. **WFStats** - Statistiques/chiffres clés
7. **WFFAQ** - Questions fréquentes (accordéon)
8. **WFCTA** - Appel à l'action
9. **WFContact** - Formulaire de contact (avec Formbricks)
10. **WFFooter** - Pied de page complet

## 📚 Documentation

### Formbricks (Feedback & Analytics)
- 📖 [Guide de démarrage rapide](docs-GPT/formbricks-quick-start.md) - Configuration backend + frontend
- 🔧 [Documentation technique complète](docs-GPT/formbricks-integration.md) - Architecture, debug, bonnes pratiques
- 📊 [Exemples d'enquêtes](docs-GPT/formbricks-survey-examples.md) - 6 templates prêts à l'emploi

### Images & Optimisations
- 🖼️ [Smart Image Component](docs-GPT/smart-image.md) - Component d'images optimisé
- ⚡ [Optimisations avancées](docs-GPT/image-optimizations-advanced.md)
- 📝 [Scripts d'optimisation](SCRIPTS-OPTIMISATION-IMAGES.md)

### CMS & Contenu
- 🎨 [TinaCMS Guide](docs-GPT/tinacms.md)
- 📋 [Template Guide](docs-GPT/template-guide.md)
- ✨ [Animations Astro](docs-GPT/anim-astro.md)

10. **WFFooter** - Pied de page complet10. **WFFooter** - Pied de page complet



## 🚀 Démarrage rapide## 🚀 Démarrage rapide



### Installation### Installation



```sh```sh

# Cloner le repo# Cloner le repo

git clone https://github.com/vdb-creation/Template-Astro.gitgit clone https://github.com/vdb-creation/Template-Astro.git

cd Template-Astrocd Template-Astro



# Installer les dépendances# Installer les dépendances

pnpm installpnpm install



# Lancer le serveur de dev# Lancer le serveur de dev

pnpm devpnpm dev

``````



### Accès### Accès



- **Site** : http://localhost:4321/- **Site** : http://localhost:4321/

- **Démo complète** : http://localhost:4321/demo- **Démo complète** : http://localhost:4321/demo

- **TinaCMS Admin** : http://localhost:4321/admin/index.html- **TinaCMS Admin** : http://localhost:4321/admin/index.html



## 📂 Structure du projet## 📂 Structure du projet



```text```text

//

├── public/             # Assets statiques├── public/             # Assets statiques

├── scripts/├── scripts/

│   └── create-content.sh  # Script de création de contenu│   └── create-content.sh  # Script de création de contenu

├── src/├── src/

│   ├── components/│   ├── components/

│   │   └── wireframe/     # 🎨 Composants wireframe│   │   └── wireframe/     # 🎨 Composants wireframe

│   ├── layouts/│   ├── layouts/

│   │   └── Layout.astro   # Layout principal│   │   └── Layout.astro   # Layout principal

│   └── pages/│   └── pages/

│       ├── index.astro    # Page d'accueil│       ├── index.astro    # Page d'accueil

│       └── demo.astro     # Démo complète│       └── demo.astro     # Démo complète

├── tina/               # Configuration TinaCMS├── tina/               # Configuration TinaCMS

└── content/            # Contenu markdown└── content/            # Contenu markdown

``````



## 🧞 Commandes## 🧞 Commandes



| Commande | Action || Commande | Action |

| :--- | :--- || :--- | :--- |

| `pnpm install` | Installer les dépendances || `pnpm install` | Installer les dépendances |

| `pnpm dev` | Serveur de dev sur `localhost:4321` || `pnpm dev` | Serveur de dev sur `localhost:4321` |

| `pnpm build` | Build production dans `./dist/` || `pnpm build` | Build production dans `./dist/` |

| `pnpm preview` | Prévisualiser le build || `pnpm preview` | Prévisualiser le build |

| `pnpm content:create` | Créer des sections de contenu || `pnpm content:create` | Créer des sections de contenu |



### Script de création de contenu### Script de création de contenu



```sh```sh

# Créer des sections# Créer des sections

pnpm content:create -- contact about servicespnpm content:create -- contact about services



# Avec options avancées# Avec options avancées

bash scripts/create-content.sh --dry-run -l "menu,galerie,equipe"bash scripts/create-content.sh --dry-run -l "menu,galerie,equipe"

bash scripts/create-content.sh -f ./sections.txt --forcebash scripts/create-content.sh -f ./sections.txt --force

``````



## 🎨 Utilisation des composants## 🎨 Utilisation des composants



### Import## 🚀 Project Structure



```astroInside of your Astro project, you'll see the following folders and files:

---

import {```text

  WFNavbar,/

  WFHero,├── public/

  WFServices,│   └── favicon.svg

  WFProjectShowcase,├── src

  // ... autres composants│   ├── assets

} from '../components/wireframe';│   │   └── astro.svg

---│   ├── components

```│   │   └── Welcome.astro

│   ├── layouts

### Exemple│   │   └── Layout.astro

│   └── pages

```astro│       └── index.astro

<WFNavbar brandName="Mon Site" />└── package.json

```

<WFHero

  title="Bienvenue"To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

  description="Votre description ici"

  ctaLabel="Découvrir"## 🧞 Commands

  ctaHref="#services"

/>All commands are run from the root of the project, from a terminal:



<WFServices| Command                   | Action                                           |

  services={[| :------------------------ | :----------------------------------------------- |

    {| `pnpm install`             | Installs dependencies                            |

      icon: "🎨",| `pnpm dev`             | Starts local dev server at `localhost:4321`      |

      title: "Design",| `pnpm build`           | Build your production site to `./dist/` (Astro only) |

      description: "Services de design"| `pnpm build:admin`     | Build TinaCMS admin (requires Tina Cloud env)     |

    }| `pnpm preview`         | Preview your build locally, before deploying     |

  ]}| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |

/>| `pnpm astro -- --help` | Get help using the Astro CLI                     |

```

## 👀 Want to learn more?

## 📚 Documentation

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

- **[WIREFRAME_GUIDE.md](./WIREFRAME_GUIDE.md)** - Guide complet d'utilisation

- **[COMPONENTS_REFERENCE.md](./COMPONENTS_REFERENCE.md)** - Référence des props## TinaCMS

- **[src/components/wireframe/README.md](./src/components/wireframe/README.md)** - Doc des composants

- Dev local (recommandé):

## 🎯 Pages disponibles  - `pnpm dev` démarre Tina Dev + Astro. L’admin est servie sur `/admin/`.

- Build de l’admin (optionnel, nécessite Tina Cloud):

- `/` - Page d'accueil (avec TinaCMS)  - Exportez `NEXT_PUBLIC_TINA_CLIENT_ID` et `TINA_TOKEN`, puis `pnpm build:admin`.

- `/demo` - Démo complète de tous les composants- Déploiement Astro:

  - `pnpm build` n’exécute pas `tinacms build` pour éviter l’échec CI si les variables ne sont pas définies. Si vous avez besoin de l’admin statique, lancez `pnpm build:admin` avant le déploiement.

## 🔧 Personnalisation



### Modifier les stylesURL pour live editing

http://localhost:4321/admin/index.html#/~
Chaque composant a son propre style scopé. Pour personnaliser :

1. **Directement** : Éditer les fichiers dans `src/components/wireframe/`
2. **Override CSS** : Créer un fichier dans `src/styles/`
3. **Via props** : Passer des données personnalisées

### Exemple de personnalisation

```astro
<WFHero
  title="Mon titre personnalisé"
  subtitle="Mon sous-titre"
  ctaLabel="Mon bouton"
/>
```

## 🚀 Déploiement

### GitHub Pages (inclus)

Le workflow GitHub Actions est configuré pour déployer automatiquement :

1. Push sur `main`
2. Build automatique
3. Déploiement sur GitHub Pages

### Autres plateformes

- **Vercel** : `vercel deploy`
- **Netlify** : `netlify deploy`
- **Cloudflare Pages** : Connecter le repo

## 📝 TinaCMS (optionnel)

Pour utiliser TinaCMS :

1. Créer un compte sur [Tina Cloud](https://app.tina.io)
2. Configurer les variables d'environnement
3. Décommenter les imports Tina dans `index.astro`

## 🐛 Troubleshooting

### Erreurs TypeScript

Si vous voyez des erreurs Tina, c'est normal si vous n'avez pas configuré le schéma. Utilisez `/demo` qui fonctionne sans Tina.

### Problèmes de build

```sh
# Nettoyer et rebuilder
rm -rf node_modules .astro dist
pnpm install
pnpm build
```

## 📖 Ressources

- [Astro Documentation](https://docs.astro.build)
- [TinaCMS Documentation](https://tina.io/docs)
- [GitHub Repository](https://github.com/vdb-creation/Template-Astro)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT

---

**Template créé avec ❤️ et Astro** | [Demo](http://localhost:4321/demo) | [Documentation](./WIREFRAME_GUIDE.md)
