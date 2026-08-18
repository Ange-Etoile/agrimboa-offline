<script setup lang="ts">
import {
  ArrowRight,
  ShieldCheck,
} from "lucide-vue-next";
import { motion } from "motion-v";
import { useI18n } from "vue-i18n";

defineProps<{
  nextLabel: string;
  nextDisabled?: boolean;
}>();

defineEmits<{
  back: [];
  next: [];
  save: [];
}>();

const { t } = useI18n();
</script>

<template>
  <footer class="mt-4 sm:mt-5">
    <!--
      Mobile : trois actions sur une ligne.
      Desktop : actions alignées à droite comme la maquette.
    -->
    <div
      class="grid w-full grid-cols-[minmax(78px,0.82fr)_minmax(126px,1.12fr)_minmax(104px,1fr)] items-center gap-1.5 sm:ml-auto sm:max-w-[590px] sm:grid-cols-[145px_190px_220px] sm:gap-3"
    >
      <!-- Retour -->
      <motion.button
        type="button"
        class="flex h-11 min-w-0 items-center justify-center whitespace-nowrap rounded-lg border border-primary bg-white px-2 text-[10px] font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 sm:px-3 sm:text-[12px]"
        :while-hover="{
          y: -1,
        }"
        :while-tap="{
          scale: 0.98,
        }"
        @click="$emit('back')"
      >
        {{ t("diagnosis.common.back") }}
      </motion.button>

      <!-- Enregistrer et quitter -->
      <button
        type="button"
        class="flex h-11 min-w-0 items-center justify-center whitespace-nowrap rounded-lg px-1 text-[9px] font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 min-[370px]:text-[10px] sm:px-3 sm:text-[12px]"
        @click="$emit('save')"
      >
        {{ t("diagnosis.common.saveQuit") }}
      </button>

      <!-- Continuer -->
      <motion.button
        type="button"
        class="flex h-11 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-2 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-text sm:gap-2 sm:px-3 sm:text-[12px]"
        :disabled="nextDisabled"
        :while-hover="
          nextDisabled
            ? {}
            : {
                y: -1,
              }
        "
        :while-tap="
          nextDisabled
            ? {}
            : {
                scale: 0.98,
              }
        "
        @click="$emit('next')"
      >
        <span class="min-w-0 truncate">
          {{ nextLabel }}
        </span>

        <ArrowRight
          class="size-3.5 shrink-0 sm:size-4"
          :stroke-width="2.2"
          aria-hidden="true"
        />
      </motion.button>
    </div>

    <!-- Sauvegarde locale -->
    <p
      class="mt-3 flex items-center justify-center gap-2 text-center text-[10px] leading-4 text-muted sm:text-[11px]"
    >
      <ShieldCheck
        class="size-4 shrink-0 text-primary"
        :stroke-width="2"
        aria-hidden="true"
      />

      <span>
        {{ t("diagnosis.common.savedLocally") }}
      </span>
    </p>
  </footer>
</template>