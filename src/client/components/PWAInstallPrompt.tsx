import React, { useState, useEffect } from 'react';
import './PWAInstallPrompt.css';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome from showing the default install prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    
    if (isAppInstalled) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    // Hide the prompt
    setShowPrompt(false);

    if (!deferredPrompt) {
      return;
    }

    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Reset the deferredPrompt variable
      setDeferredPrompt(null);
    });
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Save to localStorage to avoid showing the prompt again for some time
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };

  // Check if the prompt was recently dismissed
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwaPromptDismissed');
    if (dismissedTime) {
      const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const wasRecentlyDismissed = Date.now() - parseInt(dismissedTime) < ONE_DAY;
      if (wasRecentlyDismissed) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="pwa-prompt">
      <div className="pwa-prompt-content">
        <div className="pwa-prompt-icon">
          <img src="/icons/android-launchericon-192-192.png" alt="Wordle6 Icon" />
        </div>
        <div className="pwa-prompt-text">
          <h3>Install Wordle6</h3>
          <p>Install this app on your device for a better experience!</p>
        </div>
        <div className="pwa-prompt-buttons">
          <button className="pwa-prompt-install" onClick={handleInstallClick}>
            Install
          </button>
          <button className="pwa-prompt-dismiss" onClick={handleDismiss}>
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;