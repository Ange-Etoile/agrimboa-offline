import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "@/App.vue";
import i18n from "@/i18n";
import router from "@/router";
import { usePreferencesStore } from "@/stores/preferences.store";
import "@/styles.css";

async function bootstrap(): Promise<void> {
  const app = createApp(App);
  const pinia = createPinia();

  /*
   * Pinia doit être installé avant de pouvoir
   * initialiser le store des préférences.
   */
  app.use(pinia);
  app.use(i18n);

  const preferencesStore =
    usePreferencesStore(pinia);

  /*
   * Chargement de la langue et des préférences
   * avant l’affichage de l’application.
   */
  await preferencesStore.initialize();

  /*
   * Le routeur est installé après le chargement
   * des préférences afin que les futures protections
   * de routes puissent utiliser leurs valeurs.
   */
  app.use(router);

  await router.isReady();

  app.mount("#app");
}

bootstrap().catch((error: unknown) => {
  console.error(
    "Impossible de démarrer AgriMboa.",
    error,
  );
});