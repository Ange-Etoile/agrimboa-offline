<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import languageFarmer from "@/assets/images/onboarding/language-farmer.png";
import OfflineStatus from "@/components/onboarding/OfflineStatus.vue";
import OnboardingShell from "@/components/onboarding/OnboardingShell.vue";
import { usePreferencesStore } from "@/stores/preferences.store";
import type { SupportedLocale } from "@/types/preferences";

const router = useRouter();
const preferencesStore = usePreferencesStore();
const { t } = useI18n();

const {
  language: savedLanguage,
  saving,
  errorMessage,
} = storeToRefs(preferencesStore);

const selectedLanguage = ref<SupportedLocale>(savedLanguage.value);

const languages = computed(() => [
  {
    value: "fr" as const,
    name: t("language.french.name"),
    subtitle: t("language.french.description"),
  },
  {
    value: "en" as const,
    name: t("language.english.name"),
    subtitle: t("language.english.description"),
  },
  {
    value: "pcm" as const,
    name: t("language.pidgin.name"),
    subtitle: t("language.pidgin.description"),
  },
]);

watch(savedLanguage, (newLanguage) => {
  selectedLanguage.value = newLanguage;
});

async function continueToOnboarding(): Promise<void> {
  if (saving.value) {
    return;
  }

  preferencesStore.clearError();

  await preferencesStore.changeLanguage(selectedLanguage.value);

if (errorMessage.value) {
  return;
}

await router.push("/onboarding/1");
}
</script>

<template>
  <OnboardingShell
    :image="languageFarmer"
    :image-alt="t('language.imageAlt')"
    image-position="42% center"
  >
    <div
      class="-mx-3 w-auto sm:-mx-2 lg:mx-auto lg:max-h-[calc(100dvh-40px)] lg:w-full lg:max-w-[610px] lg:overflow-y-auto lg:py-2"
    >
      <!-- En-tête -->
      <header>
        <h1
          class="font-display text-[40px] font-extrabold leading-[1.08] tracking-[-0.035em] text-heading sm:text-[44px] lg:text-[34px] xl:text-[40px]"
        >
          {{ t("language.title") }}
        </h1>

        <p
          class="mt-4 text-[19px] leading-[1.55] text-muted sm:text-[20px] lg:mt-2.5 lg:text-[16px] lg:leading-relaxed xl:mt-3 xl:text-[17px]"
        >
          {{ t("language.description") }}
        </p>
      </header>

      <!-- Choix de langue -->
      <fieldset
        class="mt-7 space-y-4 sm:mt-8 lg:mt-5 lg:space-y-2.5 xl:mt-6 xl:space-y-3"
        :disabled="saving"
      >
        <legend class="sr-only">
          {{ t("language.legend") }}
        </legend>

        <label
          v-for="languageOption in languages"
          :key="languageOption.value"
          class="flex min-h-[108px] cursor-pointer items-center gap-5 rounded-2xl border bg-white px-5 py-4 transition-colors sm:min-h-[112px] sm:px-6 lg:min-h-[70px] lg:gap-4 lg:rounded-xl lg:px-4 lg:py-2.5 xl:min-h-[78px] xl:px-5 xl:py-3"
          :class="[
            selectedLanguage === languageOption.value
              ? 'border-primary bg-primary-subtle'
              : 'border-line-strong hover:border-brand-300',
            saving ? 'cursor-wait opacity-70' : '',
          ]"
        >
          <input
            v-model="selectedLanguage"
            class="sr-only"
            type="radio"
            name="language"
            :value="languageOption.value"
          />

          <!-- Cercle radio -->
          <span
            class="grid size-11 shrink-0 place-items-center rounded-full border-[2.5px] transition-colors sm:size-12 lg:size-8 lg:border-2"
            :class="
              selectedLanguage === languageOption.value
                ? 'border-primary'
                : 'border-muted/50'
            "
            aria-hidden="true"
          >
            <span
              v-if="selectedLanguage === languageOption.value"
              class="size-6 rounded-full bg-primary sm:size-7 lg:size-[18px]"
            />
          </span>

          <!-- Libellé -->
          <span class="min-w-0 flex-1">
            <strong
              class="block text-[21px] font-bold leading-tight text-heading sm:text-[22px] lg:text-[16px] xl:text-[17px]"
            >
              {{ languageOption.name }}
            </strong>

            <span
              class="mt-1.5 block text-[18px] leading-snug text-muted sm:text-[19px] lg:mt-0.5 lg:text-[14px] lg:leading-tight xl:text-[15px]"
            >
              {{ languageOption.subtitle }}
            </span>
          </span>
        </label>
      </fieldset>

      <!-- Erreur d’enregistrement -->
      <p
        v-if="errorMessage"
        role="alert"
        class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[16px] leading-snug text-red-700 lg:mt-3 lg:text-[13px]"
      >
        {{ errorMessage }}
      </p>

      <!-- Bouton principal -->
      <button
        type="button"
        class="mt-7 h-[68px] w-full rounded-xl bg-primary text-[22px] font-bold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:cursor-wait disabled:opacity-70 sm:h-[72px] sm:text-[23px] lg:mt-4 lg:h-[52px] lg:text-[17px] xl:mt-5 xl:h-[58px] xl:text-lg"
        :disabled="saving"
        :aria-busy="saving"
        @click="continueToOnboarding"
      >
        {{
          saving
            ? t("common.loading")
            : t("common.continue")
        }}
      </button>

      <!-- Note -->
      <p
        class="mt-4 text-center text-[17px] leading-relaxed text-muted sm:text-[18px] lg:mt-2.5 lg:text-[13px] lg:leading-normal xl:mt-3 xl:text-[14px]"
      >
        {{ t("language.changeLater") }}
      </p>

      <!-- Information hors connexion -->
      <OfflineStatus
        card
        class="mt-7 justify-start sm:mt-8 lg:mt-4 xl:mt-5"
        :label="t('offline.worksOffline')"
      >
        <p
          class="mt-1 text-[16px] leading-snug text-muted sm:text-[17px] lg:mt-0.5 lg:text-[12px] xl:text-[13px]"
        >
          {{ t("offline.dataStaysOnDevice") }}
        </p>
      </OfflineStatus>
    </div>
  </OnboardingShell>
</template>