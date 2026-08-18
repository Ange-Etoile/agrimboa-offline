<script setup lang="ts">
import {
  BookOpen,
  Calculator,
  Ellipsis,
  History,
  House,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import MobileMoreMenu from "@/components/navigation/MobileMoreMenu.vue";

const route = useRoute();
const { t } = useI18n();

const moreMenuOpen = ref(false);

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
    label: t("navigation.calculate"),
    to: "/calculators",
    icon: Calculator,
  },
  {
    label: t("navigation.history"),
    to: "/history",
    icon: History,
  },
]);

function isActive(path: string): boolean {
  if (path === "/home") {
    return route.path === "/home";
  }

  return route.path.startsWith(path);
}

function openMoreMenu(): void {
  moreMenuOpen.value = true;
}

function closeMoreMenu(): void {
  moreMenuOpen.value = false;
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-2 pb-[max(6px,env(safe-area-inset-bottom))] pt-1 backdrop-blur lg:hidden"
    :aria-label="t('navigation.main')"
  >
    <div
      class="mx-auto grid max-w-[680px] grid-cols-5"
    >
      <RouterLink
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        class="flex min-h-[58px] flex-col items-center justify-center gap-0.5 rounded-lg text-[9px] font-medium transition-colors sm:text-[10px]"
        :class="
          isActive(item.to)
            ? 'text-primary'
            : 'text-muted'
        "
      >
        <component
          :is="item.icon"
          :size="21"
          :stroke-width="
            isActive(item.to) ? 2.4 : 1.8
          "
          :fill="
            item.to === '/home' &&
            isActive(item.to)
              ? 'currentColor'
              : 'none'
          "
          aria-hidden="true"
        />

        <span>{{ item.label }}</span>
      </RouterLink>

      <button
        type="button"
        class="flex min-h-[58px] flex-col items-center justify-center gap-0.5 rounded-lg text-[9px] font-medium transition-colors sm:text-[10px]"
        :class="
          moreMenuOpen
            ? 'text-primary'
            : 'text-muted'
        "
        :aria-expanded="moreMenuOpen"
        @click="openMoreMenu"
      >
        <Ellipsis
          :size="22"
          :stroke-width="
            moreMenuOpen ? 2.4 : 1.8
          "
          aria-hidden="true"
        />

        <span>{{ t("navigation.more") }}</span>
      </button>
    </div>
  </nav>

  <MobileMoreMenu
    :open="moreMenuOpen"
    @close="closeMoreMenu"
  />
</template>