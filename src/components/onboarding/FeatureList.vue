<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  items: Array<{
    label: string;
    icon: Component;
  }>;
}>();
</script>

<template>
  <ul class="space-y-5 sm:space-y-6">
    <li
      v-for="item in items"
      :key="item.label"
      class="flex items-center gap-5"
    >
      <span
        class="grid size-14 shrink-0 place-items-center rounded-full bg-[#f1f7e8] text-[#0b2818]"
      >
        <component
          :is="item.icon"
          :size="29"
          :stroke-width="1.8"
          aria-hidden="true"
        />
      </span>

      <span
        class="text-[16px] leading-snug text-[#122037] sm:text-[17px]"
      >
        {{ item.label }}
      </span>
    </li>
  </ul>
</template>