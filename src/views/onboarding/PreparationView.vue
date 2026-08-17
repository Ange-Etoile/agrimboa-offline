<script setup lang="ts">
import {
  BookOpenCheck,
  Check,
  Cpu,
  Database,
  LoaderCircle,
} from "lucide-vue-next";

import guidesFarmer from "@/assets/images/onboarding/offline-guides-farmer.png";
import OfflineStatus from "@/components/onboarding/OfflineStatus.vue";
import OnboardingShell from "@/components/onboarding/OnboardingShell.vue";

const progress = 72;

const resources = [
  {
    title: "Modèle d’intelligence artificielle",
    subtitle: "Chargement du moteur local",
    icon: Cpu,
    ready: false,
  },
  {
    title: "Guides agricoles",
    subtitle: "128 documents disponibles",
    icon: BookOpenCheck,
    ready: true,
  },
  {
    title: "Stockage local",
    subtitle: "Vos consultations seront enregistrées ici",
    icon: Database,
    ready: true,
  },
];
</script>

<template>
  <OnboardingShell
    :image="guidesFarmer"
    image-alt="Agricultrice préparant AgriMboa hors ligne"
    image-position="42% center"
  >
    <div
      class="-mx-3 w-auto sm:-mx-2 lg:mx-auto lg:max-h-[calc(100dvh-40px)] lg:w-full lg:max-w-[620px] lg:overflow-y-auto lg:py-2"
    >
      <!-- En-tête -->
      <header>
        <p
          class="text-[18px] font-semibold tracking-wide text-primary sm:text-[19px] lg:text-[13px] xl:text-[14px]"
        >
          DÉMARRAGE
        </p>

        <h1
          class="mt-4 font-display text-[40px] font-extrabold leading-[1.08] tracking-[-0.035em] text-heading sm:text-[44px] lg:mt-2 lg:text-[32px] xl:text-[38px]"
        >
          Préparation d’AgriMboa
        </h1>

        <p
          class="mt-4 text-[19px] leading-[1.55] text-muted sm:text-[20px] lg:mt-2.5 lg:text-[15px] lg:leading-6 xl:mt-3 xl:text-[16px]"
        >
          Nous vérifions les ressources nécessaires au fonctionnement
          hors ligne. Cette opération peut prendre quelques instants.
        </p>
      </header>

      <!-- Progression -->
      <section
        class="mt-7 sm:mt-8 lg:mt-4 xl:mt-5"
        aria-labelledby="preparation-progress"
      >
        <div
          id="preparation-progress"
          class="flex items-center justify-between text-[18px] font-medium text-body sm:text-[19px] lg:text-[13px] lg:font-normal xl:text-[14px]"
        >
          <span>Préparation en cours</span>

          <span class="font-semibold text-primary lg:font-medium">
            {{ progress }} %
          </span>
        </div>

        <div
          class="mt-3.5 h-3.5 overflow-hidden rounded-full bg-primary-soft sm:h-4 lg:mt-2 lg:h-2.5"
          role="progressbar"
          aria-label="Préparation d’AgriMboa"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="progress"
        >
          <div
            class="h-full rounded-full bg-primary transition-[width] duration-500"
            :style="{
              width: `${progress}%`,
            }"
          />
        </div>
      </section>

      <!-- Ressources -->
      <section
        class="mt-7 space-y-4 sm:mt-8 sm:space-y-5 lg:mt-5 lg:space-y-2 xl:mt-6 xl:space-y-2.5"
        aria-label="Ressources hors connexion"
      >
        <article
          v-for="resource in resources"
          :key="resource.title"
          class="flex min-h-[112px] items-center gap-4 rounded-2xl border border-line bg-white px-4 py-4 sm:min-h-[120px] sm:gap-5 sm:px-5 lg:min-h-[68px] lg:gap-3 lg:rounded-xl lg:px-3 lg:py-2.5 xl:min-h-[76px] xl:px-4 xl:py-3"
        >
          <!-- Icône -->
          <span
            class="grid size-[60px] shrink-0 place-items-center rounded-xl bg-primary-soft text-primary sm:size-16 lg:size-11 lg:rounded-lg xl:size-12"
          >
            <component
              :is="resource.icon"
              :size="32"
              :stroke-width="1.8"
              aria-hidden="true"
              class="sm:size-9 lg:size-6 xl:size-7"
            />
          </span>

          <!-- Informations -->
          <div class="min-w-0 flex-1">
            <p
              class="text-[18px] font-semibold leading-[1.25] text-body sm:text-[20px] lg:text-[14px] lg:leading-tight xl:text-[15px]"
            >
              {{ resource.title }}
            </p>

            <p
              class="mt-1.5 text-[16px] leading-[1.35] text-muted-soft sm:text-[18px] lg:mt-0.5 lg:text-[12px] lg:leading-tight xl:text-[13px]"
            >
              {{ resource.subtitle }}
            </p>
          </div>

          <!-- État -->
          <div
            class="flex shrink-0 flex-col items-center gap-1.5 text-[15px] font-medium text-primary sm:text-[16px] lg:flex-row lg:gap-1.5 lg:text-[12px] xl:text-[13px]"
          >
            <span
              v-if="resource.ready"
              class="grid size-10 place-items-center rounded-full bg-primary text-white sm:size-11 lg:size-7"
            >
              <Check
                :size="24"
                :stroke-width="2.2"
                aria-hidden="true"
                class="sm:size-7 lg:size-[17px]"
              />
            </span>

            <LoaderCircle
              v-else
              class="size-10 animate-spin sm:size-11 lg:size-6"
              :stroke-width="2"
              aria-hidden="true"
            />

            <span>
              {{ resource.ready ? "Prêt" : "En cours" }}
            </span>
          </div>
        </article>
      </section>

      <!-- Information hors connexion -->
      <OfflineStatus
        card
        class="mt-6 justify-start sm:mt-7 lg:mt-3.5 xl:mt-4"
        label="Aucune connexion Internet nécessaire"
      >
        <p
          class="mt-1.5 text-[16px] leading-snug text-muted sm:text-[18px] lg:mt-0.5 lg:text-[12px] xl:text-[13px]"
        >
          Tout est préparé directement sur votre appareil.
        </p>
      </OfflineStatus>

      <!-- Actions -->
      <div class="mt-7 sm:mt-8 lg:mt-4 xl:mt-5">
        <button
          disabled
          type="button"
          class="mx-auto block h-16 w-[88%] rounded-xl bg-disabled text-[19px] text-disabled-text sm:h-[68px] sm:text-[21px] lg:h-[48px] lg:w-[78%] lg:text-[15px] xl:h-[54px] xl:text-[17px]"
        >
          Accéder à l’accueil
        </button>

        <button
          type="button"
          class="mx-auto mt-4 block min-h-12 rounded-lg px-5 py-2 text-[18px] font-medium text-body transition-colors hover:bg-primary-soft sm:text-[19px] lg:mt-1.5 lg:min-h-0 lg:py-1.5 lg:text-[13px] lg:font-normal xl:mt-2 xl:text-[14px]"
        >
          Afficher les détails
        </button>
      </div>
    </div>
  </OnboardingShell>
</template>