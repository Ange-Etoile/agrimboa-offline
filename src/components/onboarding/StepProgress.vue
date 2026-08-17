<script setup lang="ts">
withDefaults(
  defineProps<{
    current: number;
    total?: number;
  }>(),
  {
    total: 3,
  },
);
</script>

<template>
  <div
    class="flex flex-col items-center gap-2"
    aria-label="Progression de l’onboarding"
  >
    <div class="flex gap-5">
      <span
        v-for="step in total"
        :key="step"
        class="size-3.5 rounded-full"
        :class="
          step === current
            ? 'bg-[#087833]'
            : 'bg-[#d7d8d6]'
        "
      />
    </div>

    <p class="text-base text-[#526078]">
      {{ current }} sur {{ total }}
    </p>
  </div>
</template>