<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import diagnosisFarmer from "@/assets/images/onboarding/diagnosis-farmer.png";
import guidesFarmer from "@/assets/images/onboarding/offline-guides-farmer.png";
import FeatureList from "@/components/onboarding/FeatureList.vue";
import OfflineStatus from "@/components/onboarding/OfflineStatus.vue";
import OnboardingShell from "@/components/onboarding/OnboardingShell.vue";
import StepProgress from "@/components/onboarding/StepProgress.vue";
import { onboardingSteps } from "@/features/onboarding/data/onboardingSteps";

const route = useRoute();
const router = useRouter();

const currentStep = computed(() => {
  const value = Number(route.params.step);

  if (Number.isNaN(value) || value < 1 || value > 3) {
    return 1;
  }

  return value;
});

const step = computed(() => {
  return onboardingSteps[currentStep.value - 1];
});

const currentImage = computed(() => {
  return step.value.image === "diagnosis"
    ? diagnosisFarmer
    : guidesFarmer;
});

const imagePosition = computed(() => {
  if (currentStep.value === 1) {
    return "45% center";
  }

  return "42% center";
});

const primaryButtonLabel = computed(() => {
  return currentStep.value === 3
    ? "Commencer"
    : "Suivant";
});

const secondaryButtonLabel = computed(() => {
  return currentStep.value === 1
    ? "Passer"
    : "Retour";
});

const offlineLabel = computed(() => {
  return currentStep.value === 3
    ? "Prêt à fonctionner hors ligne"
    : "Fonctionne sans Internet";
});

function nextStep() {
  if (currentStep.value < 3) {
    router.push(`/onboarding/${currentStep.value + 1}`);
    return;
  }

  router.push("/preparation");
}

function previousStep() {
  if (currentStep.value > 1) {
    router.push(`/onboarding/${currentStep.value - 1}`);
    return;
  }

  router.push("/language");
}
</script>

<template>
  <OnboardingShell
    :image="currentImage"
    :image-position="imagePosition"
    image-alt="Agricultrice camerounaise utilisant AgriMboa dans son champ"
  >
    <div
      class="-mx-3 w-auto sm:-mx-2 lg:mx-auto lg:max-h-[calc(100dvh-40px)] lg:w-full lg:max-w-[610px] lg:overflow-y-auto lg:py-2"
    >
      <!-- En-tête -->
      <header>
        <p
          class="text-[18px] font-semibold tracking-wide text-primary sm:text-[19px] lg:text-[13px] xl:text-[14px]"
        >
          {{ step.eyebrow }}
        </p>

        <h1
          class="mt-4 font-display text-[40px] font-extrabold leading-[1.1] tracking-[-0.035em] text-heading sm:text-[44px] lg:mt-2 lg:text-[32px] xl:mt-3 xl:text-[38px]"
        >
          {{ step.title }}
        </h1>

        <p
          class="mt-4 text-[19px] leading-[1.55] text-muted sm:text-[20px] lg:mt-2.5 lg:text-[15px] lg:leading-6 xl:mt-3 xl:text-[16px]"
        >
          {{ step.description }}
        </p>
      </header>

      <!-- Liste des avantages -->
      <FeatureList
        :items="[...step.items]"
        class="mt-7 sm:mt-8 lg:mt-5 xl:mt-6"
      />

      <!-- Progression -->
      <StepProgress
        :current="currentStep"
        class="mt-7 sm:mt-8 lg:mt-4 xl:mt-5"
      />

      <!-- Navigation -->
      <div
        class="mt-6 grid grid-cols-[0.9fr_1.6fr] items-center gap-4 sm:gap-5 lg:mt-4 lg:grid-cols-[1fr_1.55fr] lg:gap-4 xl:mt-5"
      >
        <button
          type="button"
          class="h-16 rounded-xl text-[19px] font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 sm:h-[68px] sm:text-[20px] lg:h-[48px] lg:text-[14px] xl:h-[52px] xl:text-[15px]"
          @click="previousStep"
        >
          {{ secondaryButtonLabel }}
        </button>

        <button
          type="button"
          class="h-16 rounded-xl bg-primary text-[20px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 sm:h-[68px] sm:text-[21px] lg:h-[48px] lg:text-[16px] xl:h-[52px] xl:text-[17px]"
          @click="nextStep"
        >
          {{ primaryButtonLabel }}
        </button>
      </div>

      <!-- État hors connexion -->
      <OfflineStatus
        class="mt-5 sm:mt-6 lg:mt-3 xl:mt-4"
        :label="offlineLabel"
      />
    </div>
  </OnboardingShell>
</template>