export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAFeatures {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  hasPushSupport: boolean;
  hasBackgroundSync: boolean;
  hasServiceWorker: boolean;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class PWAManager {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isOnline = navigator.onLine;
  private features: PWAFeatures = {
    isInstalled: false,
    canInstall: false,
    isOnline: this.isOnline,
    hasPushSupport: 'serviceWorker' in navigator && 'PushManager' in window,
    hasBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    hasServiceWorker: 'serviceWorker' in navigator
  };

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.setupEventListeners();
    await this.registerServiceWorker();
    this.checkInstallationStatus();
    this.updateOnlineStatus();
  }

  private setupEventListeners() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as unknown as PWAInstallPrompt;
      this.features.canInstall = true;
      this.dispatchEvent('canInstallChanged');
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      this.features.isInstalled = true;
      this.features.canInstall = false;
      this.deferredPrompt = null;
      this.dispatchEvent('installed');
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.features.isOnline = true;
      this.dispatchEvent('online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.features.isOnline = false;
      this.dispatchEvent('offline');
    });

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.dispatchEvent('swUpdated');
      });
    }
  }

  private async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered:', this.swRegistration);

      // Check for updates
      this.swRegistration.addEventListener('updatefound', () => {
        const newWorker = this.swRegistration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.dispatchEvent('swUpdateAvailable');
            }
          });
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private checkInstallationStatus() {
    // Check if app is installed (display mode)
    if (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true) {
      this.features.isInstalled = true;
    }
  }

  private updateOnlineStatus() {
    this.features.isOnline = navigator.onLine;
  }

  // Public methods
  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('No install prompt available');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.features.canInstall = false;
        this.deferredPrompt = null;
        this.dispatchEvent('installPromptAccepted');
        return true;
      } else {
        this.dispatchEvent('installPromptDismissed');
        return false;
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!this.features.hasPushSupport) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return false;
    }
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.swRegistration || !this.features.hasPushSupport) {
      console.warn('Push notifications not available');
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '') as ArrayBufferView
      });

      console.log('Push subscription created:', subscription);
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  async unsubscribeFromPushNotifications(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Push subscription removed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  }

  async registerBackgroundSync(tag: string): Promise<boolean> {
    if (!this.swRegistration || !this.features.hasBackgroundSync) {
      console.warn('Background sync not supported');
      return false;
    }

    try {
      await this.swRegistration.sync.register(tag);
      console.log('Background sync registered:', tag);
      return true;
    } catch (error) {
      console.error('Background sync registration failed:', error);
      return false;
    }
  }

  async updateServiceWorker(): Promise<void> {
    if (this.swRegistration) {
      await this.swRegistration.update();
    }
  }

  getFeatures(): PWAFeatures {
    return { ...this.features };
  }

  isFeatureAvailable(feature: keyof PWAFeatures): boolean {
    return this.features[feature];
  }

  // Event handling
  private eventListeners: Map<string, Function[]> = new Map();

  addEventListener(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private dispatchEvent(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Cache management
  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    }
  }

  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

    let totalSize = 0;
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();
export default pwaManager;
