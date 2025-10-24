// src/lib/performance.ts
// Système de monitoring des performances pour Astro 2025

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  loadTime: number; // Page Load Time
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    // Observer pour les métriques de peinture
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);

      // Observer pour LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // Observer pour CLS
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  // Mesurer le temps de chargement d'une ressource
  measureResourceLoad(url: string): Promise<number> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      const img = new Image();
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        resolve(loadTime);
      };
      img.onerror = () => {
        const loadTime = performance.now() - startTime;
        resolve(loadTime);
      };
      img.src = url;
    });
  }

  // Mesurer le temps d'exécution d'une fonction
  measureFunction<T>(fn: () => T, name: string): T {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    
    console.log(`${name} took ${endTime - startTime} milliseconds`);
    return result;
  }

  // Mesurer le temps d'exécution d'une fonction asynchrone
  async measureAsyncFunction<T>(fn: () => Promise<T>, name: string): Promise<T> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    
    console.log(`${name} took ${endTime - startTime} milliseconds`);
    return result;
  }

  // Obtenir les métriques actuelles
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Obtenir le score de performance global
  getPerformanceScore(): number {
    const { fcp, lcp, fid, cls } = this.metrics;
    let score = 100;

    // Pénalités basées sur les Core Web Vitals
    if (fcp && fcp > 1800) score -= 20; // FCP > 1.8s
    if (lcp && lcp > 2500) score -= 30; // LCP > 2.5s
    if (fid && fid > 100) score -= 20; // FID > 100ms
    if (cls && cls > 0.1) score -= 30; // CLS > 0.1

    return Math.max(0, score);
  }

  // Envoyer les métriques à un service d'analytics
  sendMetrics(analyticsEndpoint?: string): void {
    const metrics = this.getMetrics();
    const score = this.getPerformanceScore();

    if (analyticsEndpoint) {
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          score,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      }).catch(error => {
        console.warn('Erreur lors de l\'envoi des métriques:', error);
      });
    }

    // Log local pour le développement
    console.log('Performance Metrics:', {
      ...metrics,
      score,
      timestamp: new Date().toISOString()
    });
  }

  // Nettoyer les observers
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Instance globale du moniteur de performance
export const performanceMonitor = new PerformanceMonitor();

// Hook pour mesurer les performances d'un composant
export function usePerformanceMeasurement(componentName: string) {
  return {
    measureRender: <T>(fn: () => T): T => 
      performanceMonitor.measureFunction(fn, `${componentName} render`),
    measureAsyncRender: <T>(fn: () => Promise<T>): Promise<T> => 
      performanceMonitor.measureAsyncFunction(fn, `${componentName} async render`)
  };
}

// Fonction utilitaire pour mesurer le temps de chargement des images
export async function measureImageLoadTimes(images: string[]): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  
  const promises = images.map(async (src) => {
    const loadTime = await performanceMonitor.measureResourceLoad(src);
    results[src] = loadTime;
  });

  await Promise.all(promises);
  return results;
}

// Fonction pour optimiser les performances en développement
export function optimizeForDevelopment(): void {
  if (import.meta.env.DEV) {
    // Activer les logs de performance détaillés
    console.log('🚀 Mode développement - Monitoring des performances activé');
    
    // Mesurer le temps de chargement initial
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor.sendMetrics();
      }, 1000);
    });
  }
}
