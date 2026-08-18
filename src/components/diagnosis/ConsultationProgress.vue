<script setup lang="ts">
import { Check } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

defineProps<{
  phase: number;
}>();

const { t } = useI18n();

const phases = [
  "crop",
  "observations",
  "questions",
  "result",
] as const;
</script>

<template>
  <nav
    class="w-full"
    :aria-label="
      t('diagnosis.common.questionProgress', {
        current: phase,
        total: 4,
      })
    "
  >
    <ol class="flex w-full items-center">
      <template
        v-for="(item, index) in phases"
        :key="item"
      >
        <li
          class="flex shrink-0 items-center gap-1.5 sm:gap-2"
          :class="{
            'text-primary': index + 1 <= phase,
            'text-muted': index + 1 > phase,
          }"
        >
          <!-- Cercle -->
          <span
            class="grid size-7 shrink-0 place-items-center rounded-full border text-[10px] font-semibold transition-colors sm:size-8 sm:text-[11px]"
            :class="
              index + 1 <= phase
                ? 'border-primary bg-primary text-white'
                : 'border-line-strong bg-white text-muted'
            "
          >
            <Check
              v-if="index + 1 < phase"
              class="size-4"
              :stroke-width="2.6"
              aria-hidden="true"
            />

            <span v-else>
              {{ index + 1 }}
            </span>
          </span>

          <!-- Libellé -->
          <span
            class="whitespace-nowrap text-[9px] leading-none min-[370px]:text-[10px] sm:text-[12px]"
            :class="
              index + 1 === phase
                ? 'font-bold text-primary'
                : 'font-medium'
            "
          >
            {{ t(`diagnosis.phases.${item}`) }}
          </span>
        </li>

        <!-- Ligne entre les phases -->
        <li
          v-if="index < phases.length - 1"
          aria-hidden="true"
          class="mx-1.5 h-px min-w-2 flex-1 transition-colors min-[370px]:mx-2 sm:mx-4 sm:min-w-8"
          :class="
            index + 1 < phase
              ? 'bg-primary'
              : 'bg-line-strong'
          "
        />
      </template>
    </ol>
  </nav>
</template>