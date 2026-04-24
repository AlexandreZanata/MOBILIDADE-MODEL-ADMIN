"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage, SUPPORTED_LOCALES, type SupportedLocale } from "@/hooks/useLanguage";

/** Flag emoji map — no external dependency needed. */
const FLAG: Record<SupportedLocale, string> = {
  "pt-BR": "🇧🇷",
  en: "🇺🇸",
};

/**
 * Language switcher dropdown for the admin topbar.
 *
 * Displays the current locale flag + code and opens a dropdown with all
 * supported languages. Closes on outside click or Escape key.
 * Selection is persisted to localStorage via useLanguage.
 */
export function LanguageSwitcher() {
  const { t } = useTranslation("nav");
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function handleSelect(locale: SupportedLocale) {
    changeLanguage(locale);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language.label")}
        className={[
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium",
          "text-neutral-600 transition-colors",
          "hover:bg-neutral-100 hover:text-neutral-900",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
          open ? "bg-neutral-100 text-neutral-900" : "",
        ].join(" ")}
      >
        <Globe className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
        <span aria-hidden="true">{FLAG[language]}</span>
        <span className="hidden sm:inline">{language === "pt-BR" ? "PT" : "EN"}</span>
        <ChevronDown
          className={[
            "h-3.5 w-3.5 text-neutral-400 transition-transform duration-150",
            open ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label={t("language.label")}
          className={[
            "absolute right-0 top-full z-50 mt-1.5",
            "min-w-[10rem] rounded-xl border border-neutral-200 bg-white py-1 shadow-lg",
          ].join(" ")}
        >
          {SUPPORTED_LOCALES.map((locale) => {
            const isActive = locale === language;
            return (
              <button
                key={locale}
                role="option"
                aria-selected={isActive}
                type="button"
                onClick={() => handleSelect(locale)}
                className={[
                  "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary",
                  isActive
                    ? "bg-brand-primary/5 font-medium text-brand-primary"
                    : "text-neutral-700 hover:bg-neutral-50",
                ].join(" ")}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {FLAG[locale]}
                </span>
                <span className="flex-1 text-left">
                  {t(`language.${locale}` as `language.${"en" | "pt-BR"}`)}
                </span>
                {isActive && (
                  <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
