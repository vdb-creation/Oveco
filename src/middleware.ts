/**
 * Middleware Astro - Security Headers
 * Ajoute les headers de sécurité pour atteindre 100/100 sur Lighthouse Bonnes Pratiques
 */
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // Headers de sécurité pour Lighthouse 100/100
  const headers = {
    // HSTS - Force HTTPS pour 2 ans
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    
    // X-Frame-Options - Prévient le clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Cross-Origin-Opener-Policy - Isolation du processus
    'Cross-Origin-Opener-Policy': 'same-origin',
    
    // X-Content-Type-Options - Prévient le MIME sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Referrer-Policy - Contrôle des informations de référence
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions-Policy - Désactive les fonctionnalités non nécessaires
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    
      // Content Security Policy - Politique de sécurité du contenu
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https:",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self' https://api.web3forms.com"
      ].join('; ')
  };

  // Appliquer tous les headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});
