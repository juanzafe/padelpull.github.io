import { createContext } from "react";
import { translations, Language } from "./translations";

type LanguageContextType = {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.es) => string;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);