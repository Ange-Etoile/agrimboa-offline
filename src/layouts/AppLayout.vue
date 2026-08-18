<script setup lang="ts">
import AppHeader from "@/components/navigation/AppHeader.vue";
import MobileBottomNavigation from "@/components/navigation/MobileBottomNavigation.vue";
</script>

<template>
  <div
    class="h-dvh overflow-y-auto bg-surface-soft text-body [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <AppHeader />

    <main class="pb-24 lg:pb-6">
      <slot />
    </main>

    <MobileBottomNavigation />
  </div>
</template>