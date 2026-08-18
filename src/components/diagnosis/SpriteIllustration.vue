<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  src: string;
  column: number;
  row: number;
  alt: string;
}>();

const safeColumn = computed(() => {
  return Math.min(
    Math.max(props.column, 0),
    2,
  );
});

const safeRow = computed(() => {
  return Math.min(
    Math.max(props.row, 0),
    1,
  );
});

const backgroundPosition = computed(() => {
  const xPositions = [
    "0%",
    "50%",
    "100%",
  ];

  const yPositions = [
    "0%",
    "100%",
  ];

  return [
    xPositions[safeColumn.value],
    yPositions[safeRow.value],
  ].join(" ");
});
</script>

<template>
  <div
    class="aspect-square h-full max-h-full max-w-full overflow-hidden"
    role="img"
    :aria-label="alt"
  >
    <div
      class="h-full w-full bg-no-repeat"
      :style="{
        backgroundImage: `url(${src})`,
        backgroundPosition,
        backgroundSize: '300% 200%',
      }"
    />
  </div>
</template>