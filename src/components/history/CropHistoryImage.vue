<script setup lang="ts">
import { computed } from "vue"; import { Leaf } from "lucide-vue-next";
import maize from "@/assets/images/history/maize.webp"; import tomato from "@/assets/images/history/tomato.webp"; import cassava from "@/assets/images/history/cassava.webp";
import type { CropId } from "@/features/diagnosis/types/diagnosis";
const props = defineProps<{ crop: CropId }>();
const source = computed(() => props.crop === "maize" ? maize : props.crop === "tomato" ? tomato : props.crop === "cassava" ? cassava : null);
</script>
<template><div class="grid h-full min-h-[92px] w-full place-items-center overflow-hidden rounded-xl bg-[#fbfcf8]"><img v-if="source" :src="source" :alt="crop" class="max-h-full max-w-full object-contain" /><Leaf v-else class="size-14 text-primary" /></div></template>
