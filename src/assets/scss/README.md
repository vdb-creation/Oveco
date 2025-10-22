# 🎨 Système SCSS Oveco

Ce dossier contient l'architecture SCSS complète du projet Oveco, optimisée pour Astro.

## 📁 Structure

```
src/assets/scss/
├── main.scss              # Point d'entrée principal (legacy)
├── astro.scss             # Configuration optimisée pour Astro
├── _astro-components.scss # Variables et mixins pour composants Astro
├── _theme.scss            # Variables CSS et styles globaux
├── _variables.scss        # Variables SCSS
├── _mixins.scss           # Mixins SCSS
├── _base.scss             # Styles de base
├── _layout.scss           # Styles de layout
├── _components.scss       # Import des composants
├── _utilities.scss        # Classes utilitaires
└── components/            # Styles des composants individuels
    ├── _navbar.scss
    ├── _hero.scss
    ├── _footer.scss
    └── ...
```

## 🚀 Utilisation

### Dans les composants Astro

Pour utiliser les variables et mixins SCSS dans un composant Astro :

```astro
---
// Votre logique Astro
---

<div class="my-component">
  <!-- Votre HTML -->
</div>

<style lang="scss">
  @use '../assets/scss/astro-components' as *;
  
  .my-component {
    background: $oveco-accent;
    padding: $oveco-space-4;
    border-radius: $oveco-radius;
    
    @include responsive(mobile) {
      padding: $oveco-space-2;
    }
  }
</style>
```

### Variables disponibles

#### Variables Oveco
- `$oveco-accent`: #048B9A
- `$oveco-secondary`: #334749
- `$oveco-white`: #FFFEF8
- `$oveco-text`: #5C6D6F
- `$oveco-colored-white`: #FFF9ED
- `$oveco-black`: #000000

#### Espacements
- `$oveco-space-1` à `$oveco-space-6`

#### Typographie
- `$oveco-font-family`: 'Nunito Sans Variable'
- `$oveco-font-h1` à `$oveco-font-p-small`
- `$oveco-weight-regular` à `$oveco-weight-extrabold`

### Mixins disponibles

#### Responsive
```scss
@include responsive(mobile) { /* styles mobile */ }
@include responsive(tablet) { /* styles tablette */ }
@include responsive(desktop) { /* styles desktop */ }
```

#### Animations
```scss
@include fade-in($duration: 0.3s);
@include slide-up($distance: 20px);
@include scale-hover($scale: 1.05);
```

## 🔧 Configuration Astro

Le système SCSS est configuré dans `astro.config.mjs` :

```javascript
vite: {
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@scss/variables" as *; @use "@scss/mixins" as *;`
      }
    }
  }
}
```

## 📝 Notes importantes

1. **Ordre d'import** : Les variables et mixins doivent être importés en premier
2. **Scoping** : Astro utilise `scopedStyleStrategy: 'where'` pour éviter les conflits CSS
3. **Performance** : Les styles sont compilés et optimisés automatiquement par Astro
4. **Variables CSS** : Les variables CSS personnalisées sont définies dans `_theme.scss`

## 🎯 Bonnes pratiques

- Utilisez les variables SCSS pour les valeurs réutilisables
- Préférez les mixins pour les patterns CSS complexes
- Gardez les styles spécifiques aux composants dans leurs fichiers respectifs
- Utilisez les variables CSS pour les valeurs qui peuvent changer dynamiquement
