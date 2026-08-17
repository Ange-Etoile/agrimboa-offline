<script setup lang="ts">
import AppLogo from "@/components/brand/AppLogo.vue";

withDefaults(
  defineProps<{
    image: string;
    imageAlt: string;
    imagePosition?: string;
  }>(),
  {
    imagePosition: "center center",
  },
);
</script>

<template>
  <main
    class="w-full overflow-x-hidden bg-surface text-heading lg:grid lg:h-dvh lg:grid-cols-[52.7%_47.3%] lg:overflow-hidden"
  >
    <!-- Panneau gauche : desktop uniquement -->
    <section
      class="relative hidden h-dvh overflow-hidden bg-[#f3f7df] lg:block"
    >
      <!-- Illustration -->
      <img
        :src="image"
        :alt="imageAlt"
        class="absolute inset-0 size-full object-cover"
        :style="{
          objectPosition: imagePosition,
        }"
      />

      <!-- Voile clair en haut pour préserver le logo -->
      <div
        class="pointer-events-none absolute inset-x-0 top-0 z-10 h-[190px] bg-gradient-to-b from-[#f5f8e7] via-[#f5f8e7]/85 to-transparent"
        aria-hidden="true"
      />

      <!-- Logo desktop -->
      <div
        class="absolute left-[7.4%] top-[6.8%] z-20"
      >
        <AppLogo />
      </div>

      <!-- Badges propres à certaines illustrations -->
      <div class="absolute inset-0 z-10">
        <slot name="desktop-visual" />
      </div>
    </section>

    <!-- Panneau de contenu -->
    <section
      class="min-h-dvh w-full overflow-x-hidden bg-surface lg:h-dvh lg:min-h-0 lg:overflow-hidden"
    >
      <!-- Version mobile -->
      <div class="lg:hidden">
        <header
          class="flex h-[116px] items-center justify-center bg-surface px-6 pt-3"
        >
          <AppLogo mobile />
        </header>

        <div class="px-4 sm:px-7">
          <div
            class="relative overflow-hidden rounded-[32px] bg-surface-illustration"
          >
            <img
              :src="image"
              :alt="imageAlt"
              class="aspect-[1.55/1] w-full object-cover"
              :style="{
                objectPosition: imagePosition,
              }"
            />

            <div class="absolute inset-0">
              <slot name="mobile-visual" />
            </div>
          </div>
        </div>

        <div class="px-7 pb-9 pt-10 sm:px-10">
          <slot />
        </div>
      </div>

      <!-- Version desktop -->
      <div
        class="hidden h-full w-full items-center justify-center px-[7.5%] py-6 lg:flex xl:px-[8.2%]"
      >
        <div
          class="w-full max-w-[610px] origin-center"
        >
          <slot />
        </div>
      </div>
    </section>
  </main>
</template>