<script setup lang="ts">
import { ChevronRight, Home, Save } from "lucide-vue-next";
defineProps<{ section: string; saved: boolean }>();
const emit = defineEmits<{ home: []; next: []; save: [] }>();
</script>
<template><footer class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dde7de] bg-white p-3"><button class="result-action" @click="emit('home')"><Home class="size-4" />Accueil</button><div class="flex gap-2"><button v-if="section !== 'followup'" class="result-action" @click="emit('next')">Continuer<ChevronRight class="size-4" /></button><button class="primary-btn !mt-0" @click="emit('save')"><Save class="size-4" />{{ saved ? 'Enregistré' : 'Enregistrer' }}</button></div></footer></template>
