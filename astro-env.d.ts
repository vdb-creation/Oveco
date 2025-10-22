/// <reference types="astro/client" />

// Extension des types Astro pour supporter les attributs HTML standards
declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    class?: string;
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

