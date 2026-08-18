<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <AnimatePresence mode="wait">
      <motion.div
        :key="route.fullPath"
        class="min-h-dvh"
        :initial="{
          opacity: 0,
          y: 10,
        }"
        :animate="{
          opacity: 1,
          y: 0,
        }"
        :exit="{
          opacity: 0,
          y: -6,
        }"
        :transition="{
          duration: 0.22,
          ease: 'easeOut',
        }"
      >
        <component :is="Component" />
      </motion.div>
    </AnimatePresence>
  </RouterView>
</template>