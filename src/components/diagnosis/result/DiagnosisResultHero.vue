<script setup lang="ts">
import { Download, Save, Volume2 } from "lucide-vue-next";
import maizeImage from "@/assets/images/diagnosis/maize-result.png";
import type { DiagnosisResult } from "@/features/diagnosis/types/diagnosis-result";

const props = defineProps<{ result: DiagnosisResult; saved: boolean }>();
const emit = defineEmits<{ speak: []; download: []; save: [] }>();
const priority = props.result.priority === "high" ? "Priorité élevée" : props.result.priority === "low" ? "Priorité faible" : "Priorité modérée";
const sourceLabel = props.result.provider === "groq"
  ? "Analyse IA connectée"
  : props.result.provider === "local"
    ? "Analyse IA locale"
    : "Conseil local de secours";
</script>

<template>
  <section class="mt-5 overflow-hidden rounded-[20px] border border-[#dce8dd] bg-white shadow-[0_8px_30px_rgba(31,67,40,.06)]">
    <div class="grid min-h-[210px] md:grid-cols-[1fr_270px]">
      <div class="p-5 sm:p-7">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-[#e6f2e8] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-primary">Résultat du diagnostic</span>
          <span class="rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-700">{{ priority }}</span>
          <span class="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] text-slate-600">{{ sourceLabel }}</span>
        </div>
        <h1 class="mt-3 max-w-[650px] font-display text-[23px] font-extrabold leading-tight text-[#173d29] sm:text-[29px]">{{ result.title }}</h1>
        <p class="mt-2 max-w-[650px] text-[11px] leading-5 text-[#607066]">{{ result.summary }}</p>
        <div class="mt-5 flex flex-wrap items-center gap-4">
          <div class="grid size-[72px] place-items-center rounded-full" :style="{ background: `conic-gradient(#3e8a53 ${result.confidence * 3.6}deg,#e3ece4 0)` }"><div class="grid size-[58px] place-items-center rounded-full bg-white"><strong class="text-[17px] text-[#28593a]">{{ result.confidence }}%</strong></div></div>
          <div><b class="text-[11px] text-heading">Niveau de confiance</b><p class="mt-1 text-[9px] text-muted">Hypothèse à confirmer par l’observation</p></div>
        </div>
      </div>
      <div class="relative min-h-[180px] overflow-hidden bg-[#eaf2e7]"><img :src="maizeImage" alt="Plant observé" class="absolute inset-0 h-full w-full object-cover" /></div>
    </div>
    <div class="flex flex-wrap gap-2 border-t border-[#e5ece5] px-5 py-3">
      <button class="result-action" @click="emit('speak')"><Volume2 class="size-3.5" />Écouter</button>
      <button class="result-action" @click="emit('download')"><Download class="size-3.5" />Télécharger</button>
      <button class="result-action" @click="emit('save')"><Save class="size-3.5" />{{ saved ? 'Enregistré' : 'Enregistrer' }}</button>
    </div>
  </section>
</template>
