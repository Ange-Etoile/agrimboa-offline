import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { setI18nLocale } from "@/i18n";
import {
  loadPreferences,
  saveLanguage,
  savePreferences,
} from "@/services/preferences.service";
import {
  DEFAULT_PREFERENCES,
  type AppPreferences,
  type SupportedLocale,
} from "@/types/preferences";

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}

export const usePreferencesStore = defineStore(
  "preferences",
  () => {
    const preferences = ref<AppPreferences>({
      ...DEFAULT_PREFERENCES,
    });

    const initialized = ref(false);
    const saving = ref(false);
    const errorMessage = ref<string | null>(null);

    const language = computed(
      () => preferences.value.language,
    );

    const onboardingCompleted = computed(
      () => preferences.value.onboardingCompleted,
    );

    const preparationCompleted = computed(
      () => preferences.value.preparationCompleted,
    );

    async function initialize(): Promise<void> {
      if (initialized.value) {
        return;
      }

      errorMessage.value = null;

      try {
        const savedPreferences =
          await loadPreferences();

        preferences.value = savedPreferences;

        setI18nLocale(
          savedPreferences.language,
        );
      } catch (error) {
        console.error(
          "Impossible d’initialiser les préférences.",
          error,
        );

        preferences.value = {
          ...DEFAULT_PREFERENCES,
        };

        setI18nLocale(
          DEFAULT_PREFERENCES.language,
        );

        errorMessage.value =
          getErrorMessage(error);
      } finally {
        initialized.value = true;
      }
    }

    async function changeLanguage(
      locale: SupportedLocale,
    ): Promise<void> {
      const previousLanguage =
        preferences.value.language;

      saving.value = true;
      errorMessage.value = null;

      /*
       * Le changement est appliqué immédiatement
       * afin que l’interface réagisse sans attendre.
       */
      preferences.value = {
        ...preferences.value,
        language: locale,
      };

      setI18nLocale(locale);

      try {
        const updatedPreferences =
          await saveLanguage(locale);

        preferences.value =
          updatedPreferences;
      } catch (error) {
        console.error(
          "Impossible d’enregistrer la langue.",
          error,
        );

        preferences.value = {
          ...preferences.value,
          language: previousLanguage,
        };

        setI18nLocale(previousLanguage);

        errorMessage.value =
          getErrorMessage(error);

        throw error;
      } finally {
        saving.value = false;
      }
    }

    async function completeOnboarding(): Promise<void> {
      saving.value = true;
      errorMessage.value = null;

      const updatedPreferences: AppPreferences = {
        ...preferences.value,
        onboardingCompleted: true,
      };

      try {
        await savePreferences(
          updatedPreferences,
        );

        preferences.value =
          updatedPreferences;
      } catch (error) {
        console.error(
          "Impossible d’enregistrer la fin de l’onboarding.",
          error,
        );

        errorMessage.value =
          getErrorMessage(error);

        throw error;
      } finally {
        saving.value = false;
      }
    }

    async function completePreparation(): Promise<void> {
      saving.value = true;
      errorMessage.value = null;

      const updatedPreferences: AppPreferences = {
        ...preferences.value,
        preparationCompleted: true,
      };

      try {
        await savePreferences(
          updatedPreferences,
        );

        preferences.value =
          updatedPreferences;
      } catch (error) {
        console.error(
          "Impossible d’enregistrer la préparation.",
          error,
        );

        errorMessage.value =
          getErrorMessage(error);

        throw error;
      } finally {
        saving.value = false;
      }
    }

    function clearError(): void {
      errorMessage.value = null;
    }

    return {
      preferences,
      language,
      onboardingCompleted,
      preparationCompleted,
      initialized,
      saving,
      errorMessage,

      initialize,
      changeLanguage,
      completeOnboarding,
      completePreparation,
      clearError,
    };
  },
);