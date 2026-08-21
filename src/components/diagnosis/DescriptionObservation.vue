<script setup lang="ts">
import { computed, ref } from "vue";
import { Mic, PencilLine, Signpost, SkipForward, Trash2 } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import VoiceRecorder from "./VoiceRecorder.vue";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ "update:modelValue": [value: string]; save: []; previousAnswers: []; skip: []; audioRecorded: [audio: Blob]; transcribed: [text: string] }>();
const { t } = useI18n();
const activeMode = ref<"write" | "speak">("write");
const maximumCharacters = 600;
const characterCount = computed(() => props.modelValue.length);

function updateDescription(event: Event): void {
  emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
}
function clearDescription(): void { emit("update:modelValue", ""); emit("save"); }
function showVoiceMode(): void {
  activeMode.value = "speak";
  requestAnimationFrame(() => document.getElementById("diagnosis-voice-recorder")?.scrollIntoView({ behavior: "smooth", block: "center" }));
}
</script>

<template>
  <div class="mt-4">
    <section class="rounded-2xl border border-line bg-white/75 p-3 shadow-[0_8px_30px_rgb(24_55_36/4%)] sm:p-4">
      <div class="mb-4 flex items-center gap-3"><span class="text-[11px] font-medium text-body">Description</span><div class="h-2 flex-1 overflow-hidden rounded-full bg-primary-soft"><div class="h-full w-4/5 rounded-full bg-primary" /></div><strong class="text-[11px] text-primary">80 %</strong></div>
      <div class="grid items-stretch gap-3 lg:grid-cols-[minmax(0,2.2fr)_minmax(230px,0.95fr)]">
        <div class="overflow-hidden rounded-xl border border-line bg-white">
          <div class="grid h-11 grid-cols-2 border-b border-line" role="tablist">
            <button type="button" class="flex items-center justify-center gap-2 text-[11px] font-semibold" :class="activeMode === 'write' ? 'text-primary' : 'text-muted'" @click="activeMode = 'write'"><PencilLine class="size-4" />{{ t("diagnosis.description.write") }}</button>
            <button type="button" class="flex items-center justify-center gap-2 border-l border-line text-[11px] font-semibold" :class="activeMode === 'speak' ? 'text-primary' : 'text-muted'" @click="showVoiceMode"><Mic class="size-4" />{{ t("diagnosis.description.speak") }}</button>
          </div>
          <div class="p-3 sm:p-4">
            <label for="diagnosis-description" class="text-[11px] font-semibold text-heading">{{ t("diagnosis.description.observation") }}</label>
            <textarea id="diagnosis-description" :value="modelValue" :maxlength="maximumCharacters" rows="6" class="mt-2 min-h-[154px] w-full resize-none rounded-xl border border-primary bg-white p-3 text-[13px] leading-5 text-body outline-none focus:ring-4 focus:ring-brand-100" :placeholder="t('diagnosis.description.placeholder')" @input="updateDescription" @blur="$emit('save')" />
            <div class="mt-2.5 flex flex-wrap items-center gap-2"><p class="mr-auto text-[10px] text-muted">{{ characterCount }} / {{ maximumCharacters }}</p><button type="button" class="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold text-primary hover:bg-primary-soft" @click="clearDescription"><Trash2 class="size-3.5" />{{ t("diagnosis.common.clear") }}</button><button type="button" class="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-semibold text-primary hover:bg-primary-soft" @click="showVoiceMode"><Mic class="size-3.5" />{{ t("diagnosis.description.useVoice") }}</button></div>
          </div>
        </div>
        <div id="diagnosis-voice-recorder"><VoiceRecorder class="h-full" @recorded="$emit('audioRecorded', $event)" @transcribed="$emit('transcribed', $event)" /></div>
      </div>
    </section>
    <button type="button" class="mt-3 flex w-full items-center gap-3 rounded-xl border border-dashed border-earth-300 bg-earth-50/45 px-4 py-3 text-left" @click="$emit('previousAnswers')"><Signpost class="size-6 text-sun-600" /><span><strong class="block text-[12px] text-heading">{{ t("diagnosis.description.guidedDiagnosis") }}</strong><span class="text-[11px] text-primary">{{ t("diagnosis.description.previousAnswers") }}</span></span></button>
    <button type="button" class="mt-2 flex w-full items-center gap-3 rounded-xl border border-dashed border-line-strong bg-white px-4 py-3 text-left" @click="$emit('skip')"><SkipForward class="size-6 text-primary" /><span><strong class="block text-[12px] text-heading">{{ t("diagnosis.description.skip") }}</strong><span class="text-[11px] text-muted">{{ t("diagnosis.description.skipDescription") }}</span></span></button>
  </div>
</template>
