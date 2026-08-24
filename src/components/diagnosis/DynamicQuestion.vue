<script setup lang="ts">
import { computed } from "vue";
import { BrainCircuit, Check, Cloud, HardDrive, LoaderCircle, RotateCcw } from "lucide-vue-next";
import type { AiProvider, DiagnosisQuestion, DynamicAnswer, DynamicQuestionOrigin } from "@/features/diagnosis/types/diagnosis";

const props = defineProps<{
  question: DiagnosisQuestion | null;
  modelValue: DynamicAnswer;
  reason: string;
  loading: boolean;
  error: string | null;
  complete: boolean;
  provider: AiProvider | null;
  model: string;
  origin: DynamicQuestionOrigin | null;
}>();
const emit = defineEmits<{ "update:modelValue": [value: DynamicAnswer]; retry: [] }>();
const selectedValues = computed<string[]>(() => Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : []);

function choose(value: string): void {
  if (!props.question) return;
  if (props.question.answerType === "multiple_choice") {
    emit("update:modelValue", selectedValues.value.includes(value) ? selectedValues.value.filter((item) => item !== value) : [...selectedValues.value, value]);
  } else emit("update:modelValue", value);
}
function updateText(event: Event): void { emit("update:modelValue", (event.target as HTMLTextAreaElement).value); }
</script>

<template>
  <section class="mt-4 rounded-2xl border border-line bg-white/85 p-4 shadow-[0_8px_30px_rgb(24_55_36/4%)] sm:p-5">
    <div v-if="loading" class="grid min-h-[260px] place-items-center text-center">
      <div><LoaderCircle class="mx-auto size-9 animate-spin text-primary" /><p class="mt-4 text-[14px] font-bold text-heading">Analyse des observations</p><p class="mt-1 text-[11px] text-muted">Groq est essayé en priorité, puis le moteur local si nécessaire…</p></div>
    </div>
    <div v-else-if="error" class="grid min-h-[240px] place-items-center text-center">
      <div class="max-w-md"><p class="text-[14px] font-bold text-red-700">Les moteurs IA n’ont pas répondu</p><p class="mt-2 text-[11px] leading-5 text-muted">{{ error }}</p><button type="button" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[12px] font-bold text-white" @click="$emit('retry')"><RotateCcw class="size-4" />Réessayer</button></div>
    </div>
    <div v-else-if="complete" class="grid min-h-[240px] place-items-center text-center">
      <div class="max-w-md"><span class="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary"><Check class="size-6" /></span><h2 class="mt-4 text-[18px] font-extrabold text-heading">Les informations sont suffisantes</h2><p class="mt-2 text-[12px] leading-5 text-muted">{{ reason }}</p></div>
    </div>
    <div v-else-if="question">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold" :class="provider === 'groq' ? 'bg-sky-50 text-sky-700' : 'bg-primary-soft text-primary'">
          <Cloud v-if="provider === 'groq'" class="size-3.5" /><HardDrive v-else class="size-3.5" />
          {{ origin === "fallback" ? "Question de secours validée" : provider === "groq" ? "IA en ligne - Groq" : "IA locale hors ligne" }}
        </span>
        <span class="text-[9px] text-muted">{{ model }}</span>
      </div>
      <div class="mt-4 flex items-start gap-3"><span class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><BrainCircuit class="size-5" /></span><div><p class="text-[10px] font-bold uppercase tracking-wide text-primary">Question complémentaire intelligente</p><h2 class="mt-1 text-[18px] font-extrabold leading-snug text-heading">{{ question.titleKey }}</h2><p v-if="question.descriptionKey" class="mt-1 text-[11px] leading-5 text-muted">{{ question.descriptionKey }}</p></div></div>
      <p class="mt-4 rounded-xl border border-brand-100 bg-primary-subtle px-3 py-2.5 text-[10px] leading-4 text-primary"><strong>Pourquoi ?</strong> {{ reason }}</p>
      <textarea v-if="question.answerType === 'free_text'" :value="typeof modelValue === 'string' ? modelValue : ''" rows="4" class="mt-4 w-full rounded-xl border border-line p-3 text-[12px] outline-none focus:border-primary focus:ring-4 focus:ring-brand-100" @input="updateText" />
      <div v-else class="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <button v-for="option in question.options" :key="option.id" type="button" class="rounded-xl border px-3 py-3 text-left text-[12px] font-semibold transition" :class="selectedValues.includes(option.value ?? option.id) ? 'border-primary bg-primary-soft text-primary ring-2 ring-brand-100' : 'border-line bg-white text-body hover:border-primary'" @click="choose(option.value ?? option.id)">{{ option.labelKey }}</button>
      </div>
    </div>
  </section>
</template>
