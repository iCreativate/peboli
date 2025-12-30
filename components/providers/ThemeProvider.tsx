'use client';

import { useEffect } from 'react';
import { useAdminStore } from '@/lib/stores/admin';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAdminStore((s) => s.theme);

  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

    // Primary Colors
    root.style.setProperty('--splash-blue', theme.primaryColor);
    root.style.setProperty('--premium-navy', theme.primaryColor);
    root.style.setProperty('--primary', theme.primaryColor);
    
    // We can try to derive a darker version for premium-navy-dark, 
    // or just use the primary color for now to keep it consistent.
    // For a real production app, we might use a color manipulation lib.
    root.style.setProperty('--premium-navy-dark', theme.primaryColor); 

    // Accent Colors
    root.style.setProperty('--coral-accent', theme.accentColor);
    root.style.setProperty('--accent', theme.accentColor);

    // Success Color
    root.style.setProperty('--success-green', theme.successColor);

  }, [theme]);

  return <>{children}</>;
}
