const registerServiceWorker = async () => {
    try {
      if (
        'serviceWorker' in navigator &&
        import.meta.env.PROD &&
        !window.location.hostname.includes('stackblitz')
      ) {
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.info('ServiceWorker registered successfully:', registration.scope);
        return registration;
      }
    } catch {
      console.info('ServiceWorker registration skipped');
    }
  };

  export { registerServiceWorker };