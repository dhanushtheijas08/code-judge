import type { SupportedLanguageSchema } from "@code-judge/shared/problemsSchema";

export const LANGUAGE_LABELS: Record<SupportedLanguageSchema, string> = {
  js: "JavaScript",
  ts: "TypeScript",
  py: "Python",
  cpp: "C++",
  c: "C",
};
const PREFERRED_LANGUAGE_KEY = "code-judge:preferred-language";
const DEFAULT_LANGUAGE: SupportedLanguageSchema = "c";

export const getPreferredLanguage = (): SupportedLanguageSchema => {
  const stored = localStorage.getItem(PREFERRED_LANGUAGE_KEY);
  if (stored && Object.keys(LANGUAGE_LABELS).includes(stored)) {
    return stored as SupportedLanguageSchema;
  }
  return DEFAULT_LANGUAGE;
};

export const setPreferredLanguage = (
  lang: SupportedLanguageSchema,
): SupportedLanguageSchema => {
  localStorage.setItem(PREFERRED_LANGUAGE_KEY, lang);
  return lang;
};
