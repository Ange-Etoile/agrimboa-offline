<script setup lang="ts">
import { CalendarDays, Check, ClipboardCheck, ShieldCheck } from "lucide-vue-next";
import type { DiagnosisResult } from "@/features/diagnosis/types/diagnosis-result";
defineProps<{ result: DiagnosisResult }>();
</script>
<template><section class="space-y-4"><header class="section-head"><div><p class="eyebrow">PLAN PERSONNALISÉ</p><h2>Votre plan d’action</h2><p>Des étapes simples, dans l’ordre, pour agir avec prudence.</p></div><ClipboardCheck class="size-8 text-primary" /></header><div class="timeline"><article v-for="(period,index) in result.plan" :key="period.period" class="card relative"><span class="step">{{ index + 1 }}</span><p class="eyebrow">{{ period.period }}</p><h2>{{ period.title }}</h2><span class="duration"><CalendarDays class="size-3" />{{ period.duration }}</span><ul class="checklist"><li v-for="item in period.items" :key="item"><Check />{{ item }}</li></ul></article></div><article class="warning"><ShieldCheck class="size-5 shrink-0" /><div><b>Agissez progressivement</b><p>N’appliquez pas plusieurs traitements à la fois : vous pourrez ainsi comprendre ce qui améliore réellement la situation.</p></div></article></section></template>
