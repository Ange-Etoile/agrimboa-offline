<script setup lang="ts">
import { Check } from "lucide-vue-next";
import { motion } from "motion-v";
import { useI18n } from "vue-i18n";

import type { DiagnosisChoice } from "@/features/diagnosis/types/diagnosis";
import SpriteIllustration from "./SpriteIllustration.vue";

withDefaults(
  defineProps<{
    choice: DiagnosisChoice;
    selected: boolean;
    index: number;
    radio?: boolean;
    variant?: "default" | "crop";
    featured?: boolean;
  }>(),
  {
    radio: false,
    variant: "default",
    featured: false,
  },
);

defineEmits<{
  select: [];
}>();

const { t } = useI18n();
</script>

<template>
  <motion.button
    type="button"
    class="group relative w-full min-w-0 overflow-hidden rounded-xl border bg-white text-left shadow-[0_3px_14px_rgb(24_55_36/3%)] transition-colors"
    :class="[
      selected
        ? 'border-primary bg-primary-subtle ring-1 ring-primary'
        : 'border-line hover:border-brand-300',

      variant === 'crop'
        ? 'min-h-[164px]'
        : 'min-h-[148px] sm:min-h-[156px]',

      variant === 'crop' && featured
        ? 'flex min-h-[142px] flex-row sm:min-h-[164px] sm:flex-col'
        : 'flex flex-col',
    ]"
    :aria-pressed="selected"
    :initial="{
      opacity: 0,
      y: 12,
    }"
    :animate="{
      opacity: 1,
      y: 0,
    }"
    :transition="{
      duration: 0.26,
      delay: index * 0.045,
      ease: 'easeOut',
    }"
    :while-hover="{
      y: -2,
    }"
    :while-tap="{
      scale: 0.985,
    }"
    @click="$emit('select')"
  >
    <!-- Sélection -->
    <span
      class="absolute right-2.5 top-2.5 z-20 grid size-6 place-items-center rounded-full border-2 bg-white transition-colors sm:size-7"
      :class="
        selected
          ? 'border-primary bg-primary text-white'
          : 'border-muted-soft/60 text-transparent'
      "
      aria-hidden="true"
    >
      <Check
        v-if="selected && !radio"
        class="size-4"
        :stroke-width="2.8"
      />

      <span
        v-else-if="selected"
        class="size-3 rounded-full bg-white"
      />
    </span>

    <!--
      Illustration de culture :
      - carte principale mobile : image à gauche ;
      - autres cartes : image en haut ;
      - desktop : images en haut.
    -->
    <div
      v-if="variant === 'crop'"
      class="flex shrink-0 items-center justify-center overflow-hidden bg-primary-subtle/30"
      :class="
        featured
          ? 'h-auto w-[57%] sm:h-[108px] sm:w-full'
          : 'h-[96px] w-full sm:h-[108px]'
      "
    >
      <img
      v-if="choice.image"
      :src="choice.image"
      :alt="t(choice.labelKey)"
      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
    />

    <SpriteIllustration
      v-else-if="choice.sprite"
      :src="choice.sprite.sheet"
      :column="choice.sprite.column"
      :row="choice.sprite.row"
      :alt="t(choice.labelKey)"
    />
    </div>

    <!-- Illustration des questions -->
    <div
      v-else
      class="flex h-[108px] w-full shrink-0 items-center justify-center overflow-hidden bg-gradient-to-b from-white to-primary-subtle/30 p-2 sm:h-[114px]"
    >
      <img
        v-if="choice.image"
        :src="choice.image"
        :alt="t(choice.labelKey)"
        class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.025]"
      />

      <SpriteIllustration
        v-else-if="choice.sprite"
        :src="choice.sprite.sheet"
        :column="choice.sprite.column"
        :row="choice.sprite.row"
        :alt="t(choice.labelKey)"
      />
    </div>

    <!-- Texte -->
    <div
      class="flex min-w-0 flex-1 flex-col justify-center border-line/70 px-3 py-2.5"
      :class="[
        variant === 'crop' && featured
          ? 'border-l sm:border-l-0 sm:border-t'
          : 'border-t',

        variant === 'crop'
          ? 'items-start'
          : 'items-center',
      ]"
    >
      <strong
        class="block w-full leading-tight text-heading"
        :class="
          variant === 'crop'
            ? 'text-left text-[14px] sm:text-[15px]'
            : 'text-center text-[12px] sm:text-[13px]'
        "
      >
        {{ t(choice.labelKey) }}
      </strong>

      <span
        v-if="choice.subtitleKey"
        class="mt-1 block w-full leading-tight text-muted"
        :class="
          variant === 'crop'
            ? 'text-left text-[11px] sm:text-[12px]'
            : 'text-center text-[10px] sm:text-[11px]'
        "
      >
        {{ t(choice.subtitleKey) }}
      </span>
    </div>
  </motion.button>
</template>