"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

/** Supported UI languages. */
export type SupportedLocale = "pt-BR" | "en";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["pt-BR", "en"];

const STORAGE_KEY = "mobiliade.language";

/**
 * Hook for reading and changing the active UI language.
 *
 * - `language` — the currently active locale code
 * - `changeLanguage(locale)` — switches i18next + persists to localStorage
 *
 * The initial language is resolved by i18next-browser-languagedetector in
 * this order: localStorage → navigator (browser preference) → fallback pt-BR.
 */
export function useLanguage() {
  const { i18n } = useTranslation();

  const language = (
    SUPPORTED_LOCALES.includes(i18n.language as SupportedLocale)
      ? i18n.language
      : "pt-BR"
  ) as SupportedLocale;

  const changeLanguage = useCallback(
    (locale: SupportedLocale) => {
      void i18n.changeLanguage(locale);
      localStorage.setItem(STORAGE_KEY, locale);
    },
    [i18n]
  );

  return { language, changeLanguage };
}
