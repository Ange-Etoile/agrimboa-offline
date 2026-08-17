import { createI18n } from "vue-i18n";

import englishMessages from "@/i18n/locales/en";
import frenchMessages from "@/i18n/locales/fr";
import pidginMessages from "@/i18n/locales/pcm";
import type { SupportedLocale } from "@/types/preferences";

const messages = {
  fr: frenchMessages,
  en: englishMessages,
  pcm: pidginMessages,
};

export const i18n = createI18n({
  legacy: false,
  locale: "fr",
  fallbackLocale: "fr",
  messages,
});

export function setI18nLocale(
  locale: SupportedLocale,
) {
  i18n.global.locale.value = locale;

  document.documentElement.lang =
    locale === "pcm"
      ? "en-CM"
      : locale;
}

export default i18n;