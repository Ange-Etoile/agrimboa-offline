<script setup lang="ts">
import { ShieldCheck } from "lucide-vue-next";

withDefaults(
  defineProps<{
    label?: string;
    card?: boolean;
  }>(),
  {
    label: "Fonctionne sans Internet",
    card: false,
  },
);
</script>

<template>
  <div
    class="flex items-center justify-center gap-4"
    :class="card ? 'rounded-2xl bg-[#f2f7e9] px-5 py-4' : ''"
  >
    <span
      class="grid size-14 shrink-0 place-items-center rounded-full bg-[#eef5df] text-[#08702e]"
    >
      <ShieldCheck
        :size="29"
        :stroke-width="1.8"
        aria-hidden="true"
      />
    </span>

    <div>
      <p class="text-[15px] font-semibold text-[#101a15] sm:text-base">
        {{ label }}
      </p>

      <slot />
    </div>
  </div>
</template>