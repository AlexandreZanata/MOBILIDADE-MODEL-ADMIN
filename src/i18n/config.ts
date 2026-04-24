import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// en
import enCommon from "@/i18n/locales/en/common.json";
import enAuth from "@/i18n/locales/en/auth.json";
import enNav from "@/i18n/locales/en/nav.json";
import enRides from "@/i18n/locales/en/rides.json";
import enPassengers from "@/i18n/locales/en/passengers.json";
import enVehicles from "@/i18n/locales/en/vehicles.json";
import enServiceCategories from "@/i18n/locales/en/serviceCategories.json";

// pt-BR
import ptBRCommon from "@/i18n/locales/pt-BR/common.json";
import ptBRAuth from "@/i18n/locales/pt-BR/auth.json";
import ptBRNav from "@/i18n/locales/pt-BR/nav.json";
import ptBRRides from "@/i18n/locales/pt-BR/rides.json";
import ptBRPassengers from "@/i18n/locales/pt-BR/passengers.json";
import ptBRVehicles from "@/i18n/locales/pt-BR/vehicles.json";
import ptBRServiceCategories from "@/i18n/locales/pt-BR/serviceCategories.json";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        nav: enNav,
        rides: enRides,
        passengers: enPassengers,
        vehicles: enVehicles,
        serviceCategories: enServiceCategories,
      },
      "pt-BR": {
        common: ptBRCommon,
        auth: ptBRAuth,
        nav: ptBRNav,
        rides: ptBRRides,
        passengers: ptBRPassengers,
        vehicles: ptBRVehicles,
        serviceCategories: ptBRServiceCategories,
      },
    },
    lng: "pt-BR",
    fallbackLng: "pt-BR",
    defaultNS: "common",
    detection: {
      order: ["localStorage"],
      lookupLocalStorage: "mobiliade.language",
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
