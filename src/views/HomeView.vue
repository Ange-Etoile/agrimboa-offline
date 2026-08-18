<script setup lang="ts">
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ChevronRight,
  ScanSearch,
  ShieldCheck,
} from "lucide-vue-next";
import { motion } from "motion-v";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import cropCassava from "@/assets/images/home/crop-cassava.png";
import cropMaize from "@/assets/images/home/crop-maize.png";
import cropTomato from "@/assets/images/home/crop-tomato.png";
import homeFarmer from "@/assets/images/home/home-farmer.png";
import AppLayout from "@/layouts/AppLayout.vue";

const { t } = useI18n();

const quickActions = computed(() => [
  {
    title: t("home.actions.diagnosis.title"),
    subtitle: t(
      "home.actions.diagnosis.description",
    ),
    icon: ScanSearch,
    to: "/diagnosis",
  },
  {
    title: t("home.actions.guides.title"),
    subtitle: t(
      "home.actions.guides.description",
    ),
    icon: BookOpen,
    to: "/guides",
  },
  {
    title: t(
      "home.actions.calculator.title",
    ),
    subtitle: t(
      "home.actions.calculator.description",
    ),
    icon: Calculator,
    to: "/calculators",
  },
]);

const crops = computed(() => [
  {
    id: "maize",
    name: t("home.crops.maize"),
    image: cropMaize,
    to: "/diagnosis?crop=maize",
  },
  {
    id: "cassava",
    name: t("home.crops.cassava"),
    image: cropCassava,
    to: "/diagnosis?crop=cassava",
  },
  {
    id: "tomato",
    name: t("home.crops.tomato"),
    image: cropTomato,
    to: "/diagnosis?crop=tomato",
  },
]);

const enterTransition = {
  duration: 0.35,
  ease: "easeOut" as const,
};
</script>

<template>
  <AppLayout>
    <div
      class="mx-auto w-full max-w-[1540px] px-3.5 py-3 sm:px-5 lg:px-8 lg:py-4"
    >
      <!-- Hero -->
      <motion.section
        class="relative min-h-[330px] overflow-hidden rounded-xl border border-brand-200 bg-[#f3f8e9] sm:min-h-[350px] lg:min-h-[285px]"
        :initial="{
          opacity: 0,
          y: 14,
        }"
        :animate="{
          opacity: 1,
          y: 0,
        }"
        :transition="enterTransition"
      >
        <img
          :src="homeFarmer"
          :alt="t('home.hero.imageAlt')"
          class="absolute inset-0 size-full object-cover object-[69%_center] lg:object-center"
        />

        <!-- Dégradé -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-[#f6faec] from-[0%] via-[#f6faec]/95 via-[43%] to-transparent to-[79%] lg:via-[46%] lg:to-[72%]"
          aria-hidden="true"
        />

        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f6faec]/80 lg:hidden"
          aria-hidden="true"
        />

        <!-- Contenu -->
        <div
          class="relative z-10 flex min-h-[330px] flex-col px-4 py-4 sm:min-h-[350px] sm:px-5 sm:py-5 lg:min-h-[285px] lg:w-[59%] lg:justify-center lg:px-9 lg:py-5"
        >
          <motion.p
            class="text-[15px] font-semibold text-primary sm:text-[16px] lg:text-[15px]"
            :initial="{
              opacity: 0,
              x: -12,
            }"
            :animate="{
              opacity: 1,
              x: 0,
            }"
            :transition="{
              ...enterTransition,
              delay: 0.08,
            }"
          >
            {{ t("home.hero.greeting") }} 
          </motion.p>

          <motion.h1
            class="mt-2.5 max-w-[280px] font-display text-[23px] font-extrabold leading-[1.17] tracking-[-0.03em] text-heading sm:max-w-[325px] sm:text-[26px] lg:mt-2 lg:max-w-[580px] lg:text-[31px]"
            :initial="{
              opacity: 0,
              x: -14,
            }"
            :animate="{
              opacity: 1,
              x: 0,
            }"
            :transition="{
              ...enterTransition,
              delay: 0.13,
            }"
          >
            {{ t("home.hero.title") }}
          </motion.h1>

          <motion.p
            class="mt-2.5 max-w-[265px] text-[12px] leading-[1.55] text-muted sm:max-w-[310px] sm:text-[13px] lg:mt-2 lg:max-w-[570px] lg:text-[13px]"
            :initial="{
              opacity: 0,
              x: -14,
            }"
            :animate="{
              opacity: 1,
              x: 0,
            }"
            :transition="{
              ...enterTransition,
              delay: 0.18,
            }"
          >
            {{ t("home.hero.description") }}
          </motion.p>

          <!-- Actions -->
            <motion.div
            class="mt-auto grid min-w-0 gap-2 pt-4 sm:max-w-[500px] lg:mt-4 lg:grid-cols-[245px_195px] lg:pt-0"
            :initial="{
                opacity: 0,
                y: 12,
            }"
            :animate="{
                opacity: 1,
                y: 0,
            }"
            :transition="{
                ...enterTransition,
                delay: 0.23,
            }"
            >
            <!-- Commencer une consultation -->
            <RouterLink
                :to="{
                name: 'diagnosis',
                params: {
                    step: 'crop',
                },
                }"
                class="flex h-11 min-w-0 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 sm:text-[12px] lg:h-[46px] lg:text-[13px]"
            >
                <span class="whitespace-nowrap">
                {{ t("home.hero.start") }}
                </span>

                <ArrowRight
                class="size-4 shrink-0"
                aria-hidden="true"
                />
            </RouterLink>

            <!-- Revoir le fonctionnement de l’application -->
            <RouterLink
                to="/onboarding/1"
                class="hidden h-[46px] items-center justify-center rounded-lg border border-primary bg-white/65 px-3 text-[12px] font-semibold text-primary transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 lg:flex"
            >
                {{ t("home.hero.howItWorks") }}
            </RouterLink>
            </motion.div>
        </div>
      </motion.section>

      <!-- Accès rapides -->
      <motion.section
        class="mt-4"
        :initial="{
          opacity: 0,
          y: 14,
        }"
        :while-in-view="{
          opacity: 1,
          y: 0,
        }"
        :viewport="{
          once: true,
          amount: 0.15,
        }"
        :transition="{
          ...enterTransition,
          delay: 0.05,
        }"
      >
        <h2
          class="font-display text-[18px] font-extrabold tracking-[-0.02em] text-heading lg:text-[20px]"
        >
          {{ t("home.quickAccess") }}
        </h2>

        <div
          class="mt-2.5 grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4"
        >
          <RouterLink
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="group relative flex min-h-[98px] flex-col rounded-xl border border-line bg-white p-2.5 transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card sm:min-h-[105px] lg:min-h-[70px] lg:flex-row lg:items-center lg:gap-3 lg:px-4 lg:py-2.5"
          >
            <span
              class="grid size-9 shrink-0 place-items-center rounded-lg border border-brand-200 bg-primary-soft text-primary sm:size-10 lg:size-10"
            >
              <component
                :is="action.icon"
                :size="21"
                :stroke-width="1.8"
                aria-hidden="true"
              />
            </span>

            <span
              class="mt-2 min-w-0 pr-2 lg:mt-0 lg:flex-1 lg:pr-0"
            >
              <strong
                class="block text-[10px] font-bold leading-[1.25] text-heading sm:text-[11px] lg:text-[13px]"
              >
                {{ action.title }}
              </strong>

              <span
                class="mt-0.5 hidden text-[10px] leading-tight text-muted lg:block"
              >
                {{ action.subtitle }}
              </span>
            </span>

            <ChevronRight
              class="absolute bottom-2 right-1.5 size-4 text-primary transition-transform group-hover:translate-x-0.5 lg:static lg:size-[18px]"
              aria-hidden="true"
            />
          </RouterLink>
        </div>
      </motion.section>

      <!-- Cultures et consultation -->
      <motion.div
        class="mt-5 grid gap-5 lg:mt-4 lg:grid-cols-[1.08fr_0.92fr] lg:gap-4"
        :initial="{
          opacity: 0,
          y: 16,
        }"
        :while-in-view="{
          opacity: 1,
          y: 0,
        }"
        :viewport="{
          once: true,
          amount: 0.1,
        }"
        :transition="{
          ...enterTransition,
          delay: 0.08,
        }"
      >
        <!-- Cultures -->
        <section
          class="lg:rounded-xl lg:border lg:border-line lg:bg-white lg:p-3"
        >
          <h2
            class="font-display text-[18px] font-extrabold tracking-[-0.02em] text-heading lg:text-[19px]"
          >
            {{ t("home.crops.title") }}
          </h2>

          <div
            class="mt-2.5 grid grid-cols-3 gap-2 sm:gap-3"
          >
            <RouterLink
              v-for="crop in crops"
              :key="crop.id"
              :to="crop.to"
              class="group overflow-hidden rounded-lg border border-line bg-white transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
            >
              <img
                :src="crop.image"
                :alt="crop.name"
                class="h-[66px] w-full object-cover sm:h-[78px] lg:h-[70px]"
              />

              <div
                class="flex min-h-[38px] items-center justify-between gap-1 px-2"
              >
                <span
                  class="truncate text-[11px] font-bold text-heading sm:text-[12px] lg:text-[12px]"
                >
                  {{ crop.name }}
                </span>

                <ChevronRight
                  class="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </RouterLink>
          </div>
        </section>

        <!-- Dernière consultation -->
        <section
          class="lg:rounded-xl lg:border lg:border-line lg:bg-white lg:p-3"
        >
          <h2
            class="font-display text-[18px] font-extrabold tracking-[-0.02em] text-heading lg:text-[19px]"
          >
            {{ t("home.lastConsultation.title") }}
          </h2>

          <article
            class="mt-2.5 flex min-h-[104px] items-center gap-2.5 rounded-xl border border-line bg-white p-2.5 lg:min-h-[100px]"
          >
            <img
              :src="cropMaize"
              :alt="t('home.crops.maize')"
              class="size-[68px] shrink-0 rounded-lg object-cover sm:size-[74px] lg:size-[72px]"
            />

            <div class="min-w-0 flex-1">
              <div
                class="flex flex-wrap items-center justify-between gap-1.5"
              >
                <h3
                  class="text-[14px] font-extrabold text-heading"
                >
                  {{ t("home.crops.maize") }}
                </h3>

                <span
                  class="rounded-md border border-sun-200 bg-sun-50 px-1.5 py-0.5 text-[8px] font-medium text-sun-700 sm:text-[9px]"
                >
                  {{
                    t(
                      "home.lastConsultation.confidence",
                    )
                  }}
                </span>
              </div>

              <p
                class="mt-1 truncate text-[10px] text-muted sm:text-[11px]"
              >
                {{
                  t(
                    "home.lastConsultation.symptoms",
                  )
                }}
              </p>

              <div
                class="mt-1.5 flex items-center justify-between gap-1"
              >
                <span
                  class="truncate text-[9px] text-muted-soft"
                >
                  {{
                    t(
                      "home.lastConsultation.time",
                    )
                  }}
                </span>

                <RouterLink
                  to="/diagnosis/current"
                  class="flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-primary sm:text-[11px]"
                >
                  {{
                    t(
                      "home.lastConsultation.resume",
                    )
                  }}

                  <ChevronRight
                    class="size-4"
                    aria-hidden="true"
                  />
                </RouterLink>
              </div>
            </div>
          </article>
        </section>
      </motion.div>

      <!-- État hors ligne -->
      <motion.section
        class="mt-4 flex min-h-[50px] items-center gap-3 rounded-xl border border-brand-200 bg-primary-soft px-4 py-2.5"
        :initial="{
          opacity: 0,
          y: 12,
        }"
        :while-in-view="{
          opacity: 1,
          y: 0,
        }"
        :viewport="{
          once: true,
          amount: 0.4,
        }"
        :transition="enterTransition"
      >
        <ShieldCheck
          class="size-6 shrink-0 text-primary lg:size-7"
          :stroke-width="1.8"
          aria-hidden="true"
        />

        <div>
          <p
            class="hidden text-[11px] font-bold text-primary lg:block"
          >
            {{ t("offline.worksOffline") }}
          </p>

          <p
            class="text-[11px] text-muted lg:mt-0.5"
          >
            {{ t("offline.dataStaysOnDevice") }}
          </p>
        </div>
      </motion.section>
    </div>
  </AppLayout>
</template>