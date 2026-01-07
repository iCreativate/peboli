'use client';

import { useEffect } from 'react';

/**
 * Suppresses harmless browser extension errors that don't affect the app
 */
export function ErrorHandler() {
  useEffect(() => {
    // Suppress the common Chrome extension error
    const originalError = window.console.error;
    window.console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      
      // Filter out the harmless extension error
      if (
        message.includes('A listener indicated an asynchronous response') ||
        message.includes('message channel closed') ||
        message.includes('Extension context invalidated')
      ) {
        // Silently ignore - this is a browser extension issue, not our app
        return;
      }
      
      // Log all other errors normally
      originalError.apply(console, args);
    };

    // Also handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason?.message || event.reason?.toString() || '';
      
      if (
        message.includes('A listener indicated an asynchronous response') ||
        message.includes('message channel closed') ||
        message.includes('Extension context invalidated')
      ) {
        // Prevent the error from showing in console
        event.preventDefault();
        return;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.console.error = originalError;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}

