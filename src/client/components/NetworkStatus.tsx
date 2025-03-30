import React, { useState, useEffect } from 'react';
import './NetworkStatus.css';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  useEffect(() => {
    // Function to handle online status changes
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
      
      if (!navigator.onLine) {
        // Show message immediately when going offline
        setShowMessage(true);
      } else {
        // Show the online message
        setShowMessage(true);
        // Hide after 3 seconds
        const timer = setTimeout(() => {
          setShowMessage(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Don't show anything if we're online and the message is hidden
  if (isOnline && !showMessage) {
    return null;
  }

  return (
    <div className={`network-status ${isOnline ? 'online' : 'offline'}`}>
      <div className="network-status-icon">
        {isOnline ? (
          // Online icon (checkmark)
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        ) : (
          // Offline icon (wifi off)
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
        )}
      </div>
      <div className="network-status-text">
        {isOnline ? 'You\'re back online!' : 'You\'re offline. Some features may be limited.'}
      </div>
    </div>
  );
};

export default NetworkStatus;