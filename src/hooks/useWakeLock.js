import { useState, useEffect } from 'react';

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [wakeLock, setWakeLock] = useState(null);

  useEffect(() => {
    // Check if Wake Lock API is supported
    if ('wakeLock' in navigator) {
      setIsSupported(true);
    }
  }, []);

  const requestWakeLock = async () => {
    if (!isSupported) return;

    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
      setIsActive(true);
      setError(null);

      // Listen for release event
      lock.addEventListener('release', () => {
        setIsActive(false);
        // Auto re-request wake lock
        setTimeout(() => requestWakeLock(), 1000);
      });
    } catch (err) {
      setError(err.message);
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (isSupported) {
      requestWakeLock();
    }

    // Cleanup on unmount
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [isSupported]);

  return { isSupported, isActive, error };
}
