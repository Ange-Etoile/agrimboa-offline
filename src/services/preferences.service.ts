import { isTauri } from "@tauri-apps/api/core";

import {
  DEFAULT_PREFERENCES,
  isSupportedLocale,
  type AppPreferences,
  type SupportedLocale,
} from "@/types/preferences";

const STORE_FILE_NAME = "agrimboa-settings.json";
const STORE_KEY = "preferences";
const LOCAL_STORAGE_KEY = "agrimboa.preferences";

function normalizePreferences(value: unknown): AppPreferences {
  if (typeof value !== "object" || value === null) {
    return {
      ...DEFAULT_PREFERENCES,
    };
  }

  const candidate = value as Partial<AppPreferences>;

  return {
    language: isSupportedLocale(candidate.language)
      ? candidate.language
      : DEFAULT_PREFERENCES.language,

    onboardingCompleted:
      typeof candidate.onboardingCompleted === "boolean"
        ? candidate.onboardingCompleted
        : DEFAULT_PREFERENCES.onboardingCompleted,

    preparationCompleted:
      typeof candidate.preparationCompleted === "boolean"
        ? candidate.preparationCompleted
        : DEFAULT_PREFERENCES.preparationCompleted,
  };
}

function loadFromLocalStorage(): AppPreferences {
  try {
    const savedValue = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!savedValue) {
      return {
        ...DEFAULT_PREFERENCES,
      };
    }

    return normalizePreferences(JSON.parse(savedValue));
  } catch (error) {
    console.error("Impossible de lire les préférences locales.", error);

    return {
      ...DEFAULT_PREFERENCES,
    };
  }
}

function saveToLocalStorage(preferences: AppPreferences): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Impossible d’enregistrer les préférences locales.", error);
  }
}

async function loadFromTauriStore(): Promise<AppPreferences> {
  const { load } = await import("@tauri-apps/plugin-store");

  const store = await load(STORE_FILE_NAME, {
    autoSave: false,
  });

  const savedPreferences = await store.get<unknown>(STORE_KEY);

  return normalizePreferences(savedPreferences);
}

async function saveToTauriStore(preferences: AppPreferences): Promise<void> {
  const { load } = await import("@tauri-apps/plugin-store");

  const store = await load(STORE_FILE_NAME, {
    autoSave: false,
  });

  await store.set(STORE_KEY, preferences);
  await store.save();
}

export async function loadPreferences(): Promise<AppPreferences> {
  if (!isTauri()) {
    return loadFromLocalStorage();
  }

  try {
    return await loadFromTauriStore();
  } catch (error) {
    console.error(
      "Impossible de lire Tauri Store. Utilisation du stockage local.",
      error,
    );

    return loadFromLocalStorage();
  }
}

export async function savePreferences(
  preferences: AppPreferences,
): Promise<void> {
  const normalizedPreferences = normalizePreferences(preferences);

  /*
   * Une copie est également conservée dans localStorage.
   * Cela permet de tester l’application avec npm run dev.
   */
  saveToLocalStorage(normalizedPreferences);

  if (!isTauri()) {
    return;
  }

  try {
    await saveToTauriStore(normalizedPreferences);
  } catch (error) {
    console.error(
      "Impossible d’enregistrer les préférences dans Tauri Store.",
      error,
    );

    throw error;
  }
}

export async function saveLanguage(
  language: SupportedLocale,
): Promise<AppPreferences> {
  const currentPreferences = await loadPreferences();

  const updatedPreferences: AppPreferences = {
    ...currentPreferences,
    language,
  };

  await savePreferences(updatedPreferences);

  return updatedPreferences;
}
