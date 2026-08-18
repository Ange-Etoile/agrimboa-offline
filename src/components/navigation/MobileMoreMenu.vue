<script setup lang="ts">
import {
  CircleHelp,
  Info,
  Languages,
  Settings,
  X,
} from "lucide-vue-next";
import {
  AnimatePresence,
  motion,
} from "motion-v";
import {
  onBeforeUnmount,
  onMounted,
} from "vue";
import { useI18n } from "vue-i18n";

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();

const menuItems = [
  {
    labelKey: "navigation.help",
    to: "/help",
    icon: CircleHelp,
  },
  {
    labelKey: "navigation.settings",
    to: "/settings",
    icon: Settings,
  },
  {
    labelKey: "navigation.language",
    to: "/language",
    icon: Languages,
  },
  {
    labelKey: "navigation.about",
    to: "/about",
    icon: Info,
  },
];

function handleEscape(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    emit("close");
  }
}

onMounted(() => {
  window.addEventListener(
    "keydown",
    handleEscape,
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    "keydown",
    handleEscape,
  );
});
</script>

<template>
  <Teleport to="body">
    <AnimatePresence>
      <div
        v-if="open"
        key="mobile-more-menu"
        class="fixed inset-0 z-[70] lg:hidden"
      >
        <!-- Fond sombre -->
        <motion.button
          type="button"
          class="absolute inset-0 size-full bg-black/35 backdrop-blur-[2px]"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.2 }"
          :aria-label="t('navigation.closeMenu')"
          @click="emit('close')"
        />

        <!-- Panneau -->
        <motion.section
          role="dialog"
          aria-modal="true"
          :aria-label="t('navigation.more')"
          class="absolute inset-x-0 bottom-0 rounded-t-[24px] bg-white px-5 pb-[max(22px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_50px_rgb(0_0_0/18%)]"
          :initial="{
            y: '100%',
            opacity: 0.7,
          }"
          :animate="{
            y: 0,
            opacity: 1,
          }"
          :exit="{
            y: '100%',
            opacity: 0.7,
          }"
          :transition="{
            type: 'spring',
            stiffness: 340,
            damping: 34,
          }"
        >
          <!-- Poignée -->
          <div
            class="mx-auto h-1.5 w-12 rounded-full bg-line-strong"
            aria-hidden="true"
          />

          <div
            class="mt-4 flex items-center justify-between"
          >
            <h2
              class="font-display text-[18px] font-extrabold text-heading"
            >
              {{ t("navigation.more") }}
            </h2>

            <button
              type="button"
              class="grid size-9 place-items-center rounded-full bg-surface-soft text-heading"
              :aria-label="t('navigation.closeMenu')"
              @click="emit('close')"
            >
              <X
                :size="20"
                aria-hidden="true"
              />
            </button>
          </div>

          <nav
            class="mt-4 grid grid-cols-2 gap-3"
            :aria-label="t('navigation.more')"
          >
            <RouterLink
              v-for="item in menuItems"
              :key="item.to"
              :to="item.to"
              class="flex min-h-[76px] items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-heading transition-colors hover:border-brand-300 hover:bg-primary-soft"
              @click="emit('close')"
            >
              <span
                class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"
              >
                <component
                  :is="item.icon"
                  :size="21"
                  :stroke-width="1.9"
                  aria-hidden="true"
                />
              </span>

              <span
                class="text-[13px] font-bold"
              >
                {{ t(item.labelKey) }}
              </span>
            </RouterLink>
          </nav>

          <div
            class="mt-5 flex items-center justify-center gap-2 rounded-xl bg-primary-soft px-4 py-3 text-[12px] font-semibold text-primary"
          >
            <span
              class="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-white"
            >
              ✓
            </span>

            {{ t("offline.worksOffline") }}
          </div>
        </motion.section>
      </div>
    </AnimatePresence>
  </Teleport>
</template>