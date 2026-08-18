<script setup lang="ts">
import {
  BookOpen,
  Calculator,
  ChevronDown,
  CircleHelp,
  History,
  House,
  Settings,
} from "lucide-vue-next";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import AppLogo from "@/components/brand/AppLogo.vue";
import { usePreferencesStore } from "@/stores/preferences.store";

const route = useRoute();
const preferencesStore = usePreferencesStore();
const { t } = useI18n();

const navigationItems = computed(() => [
  {
    label: t("navigation.home"),
    to: "/home",
    icon: House,
  },
  {
    label: t("navigation.library"),
    to: "/guides",
    icon: BookOpen,
  },
  {
    label: t("navigation.calculators"),
    to: "/calculators",
    icon: Calculator,
  },
  {
    label: t("navigation.history"),
    to: "/history",
    icon: History,
  },
  {
    label: t("navigation.help"),
    to: "/help",
    icon: CircleHelp,
  },
]);

const languageLabel = computed(() => {
  return preferencesStore.language === "pcm"
    ? "PCM"
    : preferencesStore.language.toUpperCase();
});

function isActive(path: string): boolean {
  if (path === "/home") {
    return route.path === "/home";
  }

  return route.path.startsWith(path);
}
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur"
  >
    <div
      class="mx-auto flex h-[74px] w-full max-w-[1540px] items-center justify-between px-4 sm:px-6 lg:h-[78px] lg:px-10"
    >
      <!-- Logo réduit -->
      <RouterLink
        to="/home"
        :aria-label="t('navigation.home')"
        class="flex h-[48px] w-[148px] shrink-0 items-center overflow-hidden sm:w-[165px] lg:h-[52px] lg:w-[180px]"
      >
        <AppLogo
          class="!h-full !max-h-full !w-auto !max-w-full"
        />
      </RouterLink>

      <!-- Navigation desktop -->
      <nav
        class="hidden h-full items-stretch lg:flex"
        :aria-label="t('navigation.main')"
      >
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="relative flex items-center justify-center gap-1.5 px-4 text-[14px] font-semibold transition-colors xl:px-5 xl:text-[15px]"
          :class="
            isActive(item.to)
              ? 'text-primary'
              : 'text-muted hover:text-primary'
          "
        >
          <component
            :is="item.icon"
            :size="17"
            :stroke-width="
              isActive(item.to) ? 2.3 : 1.8
            "
            aria-hidden="true"
          />

          <span>{{ item.label }}</span>

          <span
            v-if="isActive(item.to)"
            class="absolute inset-x-4 bottom-0 h-[3px] rounded-t-full bg-primary"
            aria-hidden="true"
          />
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="flex shrink-0 items-center gap-2 lg:gap-3">
        <div
          class="hidden h-10 items-center gap-2 rounded-xl border border-brand-200 bg-primary-soft px-3 text-[12px] font-semibold text-primary xl:flex"
        >
          <span
            class="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-white"
          >
            ✓
          </span>

          <span>{{ t("offline.worksOffline") }}</span>
        </div>

        <button
          type="button"
          class="flex h-10 items-center gap-2 rounded-xl border border-line-strong bg-white px-3 text-[14px] font-semibold text-heading transition-colors hover:border-primary lg:h-11"
          :aria-label="t('navigation.changeLanguage')"
        >
          <span>{{ languageLabel }}</span>

          <ChevronDown
            :size="17"
            aria-hidden="true"
          />
        </button>

        <RouterLink
          to="/settings"
          class="grid size-10 place-items-center rounded-full border border-line-strong text-heading transition-colors hover:border-primary hover:text-primary lg:size-11"
          :aria-label="t('navigation.settings')"
        >
          <Settings
            :size="20"
            :stroke-width="2"
            aria-hidden="true"
          />
        </RouterLink>
      </div>
    </div>

    <!-- Statut mobile -->
    <div
      class="flex justify-end px-4 pb-3 sm:px-6 md:hidden"
    >
      <div
        class="flex h-9 items-center gap-2 rounded-xl border border-brand-200 bg-primary-soft px-3 text-[12px] font-semibold text-primary"
      >
        <span
          class="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-white"
        >
          ✓
        </span>

        <span>{{ t("offline.worksOffline") }}</span>
      </div>
    </div>
  </header>
</template>