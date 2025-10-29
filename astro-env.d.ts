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

// Declaration de type pour @unpic/astro
declare module "@unpic/astro" {
  import type { Component } from "astro/components";
  
  export interface ImageProps {
    src: string | any;
    alt: string;
    width?: number;
    height?: number;
    layout?: "constrained" | "fullWidth" | "fixed";
    breakpoints?: number[];
    sizes?: string;
    priority?: boolean;
    placeholder?: string;
    background?: string;
    operations?: any;
    class?: string;
    decoding?: "sync" | "async" | "auto";
    loading?: "lazy" | "eager";
    onload?: string;
    [key: string]: any;
  }
  
  export interface SourceProps {
    type: string;
    src: string | any;
    layout?: "constrained" | "fullWidth" | "fixed";
    width?: number;
    height?: number;
    breakpoints?: number[];
    sizes?: string;
    operations?: any;
  }
  
  export const Image: Component<ImageProps>;
  export const Source: Component<SourceProps>;
}

