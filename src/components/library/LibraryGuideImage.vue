<script setup lang="ts">
import hero from "@/assets/images/library/library-hero.webp";
import maize from "@/assets/images/library/crop-maize.webp";
import cassava from "@/assets/images/library/crop-cassava.webp";
import tomato from "@/assets/images/library/crop-tomato.webp";
import plantain from "@/assets/images/library/crop-plantain.webp";
const props=defineProps<{imageKey?:string|null;alt?:string}>();
const images:Record<string,string>={"library-hero":hero,"crop-maize":maize,"crop-cassava":cassava,"crop-tomato":tomato,"crop-plantain":plantain};
</script>
<template><img :src="images[props.imageKey||'']||hero" :alt="alt||''" loading="lazy" /></template>
