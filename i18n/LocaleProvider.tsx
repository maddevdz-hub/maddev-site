'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from './config';

type LocaleContextValue = {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Rend la langue active disponible aux composants client (animations,
 * décalages RTL, formulaires) sans passer la prop à chaque niveau.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const isRtl = locale === 'ar';
  return (
    <LocaleContext.Provider value={{ locale, dir: isRtl ? 'rtl' : 'ltr', isRtl }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale doit être utilisé à l’intérieur de <LocaleProvider>');
  }
  return ctx;
}
