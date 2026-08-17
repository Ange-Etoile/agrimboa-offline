export const SUPPORTED_LOCALES = [
  "fr",
  "en",
  "pcm",
] as const;

export type SupportedLocale =
  (typeof SUPPORTED_LOCALES)[number];

export interface AppPreferences {
  language: SupportedLocale;
  onboardingCompleted: boolean;
  preparationCompleted: boolean;
}

export const DEFAULT_PREFERENCES: AppPreferences = {
  language: "fr",
  onboardingCompleted: false,
  preparationCompleted: false,
};

export function isSupportedLocale(
  value: unknown,
): value is SupportedLocale {
  return (
    typeof value === "string" &&
    SUPPORTED_LOCALES.includes(
      value as SupportedLocale,
    )
  );
}