<script setup lang="ts">
import logoUrl from "@/assets/images/brand/agrimboa-logo.png";

withDefaults(
  defineProps<{
    mobile?: boolean;
  }>(),
  {
    mobile: false,
  },
);
</script>

<template>
  <img
    :src="logoUrl"
    alt="AgriMboa Offline"
    class="block h-auto object-contain"
    :class="
      mobile
        ? 'w-[174px] sm:w-[190px]'
        : 'w-[238px] xl:w-[260px]'
    "
  />
</template>