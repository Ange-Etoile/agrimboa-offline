<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Check, Cloud, HardDrive, LoaderCircle, Mic, RotateCcw, Square, Trash2, WandSparkles } from "lucide-vue-next";
import { transcribeVoice, type TranscriptionProvider } from "@/services/voice-transcription.service";

const emit = defineEmits<{ recorded: [audio: Blob]; transcribed: [text: string] }>();
const { t, locale } = useI18n();

const isRecording = ref(false);
const isTranscribing = ref(false);
const elapsedSeconds = ref(0);
const audioBlob = ref<Blob | null>(null);
const audioUrl = ref("");
const transcript = ref("");
const provider = ref<TranscriptionProvider | null>(null);
const modelName = ref("");
const errorMessage = ref("");
const transcriptApplied = ref(false);

let mediaStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;
let processorNode: ScriptProcessorNode | null = null;
let inputSampleRate = 48_000;
let pcmChunks: Float32Array[] = [];
let timer: number | null = null;

const duration = computed(() => `${String(Math.floor(elapsedSeconds.value / 60)).padStart(2, "0")}:${String(elapsedSeconds.value % 60).padStart(2, "0")}`);

async function startRecording(): Promise<void> {
  clearRecording();
  errorMessage.value = "";
  transcriptApplied.value = false;

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
    audioContext = new AudioContext();
    await audioContext.resume();
    inputSampleRate = audioContext.sampleRate;
    sourceNode = audioContext.createMediaStreamSource(mediaStream);
    processorNode = audioContext.createScriptProcessor(4096, 1, 1);
    pcmChunks = [];

    processorNode.onaudioprocess = (event: AudioProcessingEvent) => {
      pcmChunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
      event.outputBuffer.getChannelData(0).fill(0);
    };

    sourceNode.connect(processorNode);
    processorNode.connect(audioContext.destination);
    isRecording.value = true;
    timer = window.setInterval(() => {
      elapsedSeconds.value += 1;
      if (elapsedSeconds.value >= 120) stopRecording();
    }, 1000);
  } catch {
    errorMessage.value = t("diagnosis.voice.microphoneError");
    await releaseAudioResources();
  }
}

async function stopRecording(): Promise<void> {
  if (!isRecording.value) return;
  isRecording.value = false;
  if (timer !== null) window.clearInterval(timer);
  timer = null;

  const merged = mergeChunks(pcmChunks);
  const resampled = resampleTo16Khz(merged, inputSampleRate);
  const wav = encodeWav(resampled, 16_000);
  audioBlob.value = new Blob([wav], { type: "audio/wav" });
  audioUrl.value = URL.createObjectURL(audioBlob.value);
  emit("recorded", audioBlob.value);
  await releaseAudioResources();
}

async function requestTranscription(): Promise<void> {
  if (!audioBlob.value || isTranscribing.value) return;
  isTranscribing.value = true;
  errorMessage.value = "";

  try {
    const language = locale.value === "en" ? "en" : locale.value === "pcm" ? "auto" : "fr";
    const result = await transcribeVoice(audioBlob.value, language);
    transcript.value = result.text.trim();
    provider.value = result.provider;
    modelName.value = result.model;
    if (!transcript.value) throw new Error(t("diagnosis.voice.emptyTranscription"));
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : String(error);
  } finally {
    isTranscribing.value = false;
  }
}

function applyTranscript(): void {
  if (!transcript.value.trim()) return;
  emit("transcribed", transcript.value.trim());
  transcriptApplied.value = true;
}

function clearRecording(): void {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
  audioBlob.value = null;
  audioUrl.value = "";
  transcript.value = "";
  provider.value = null;
  modelName.value = "";
  errorMessage.value = "";
  transcriptApplied.value = false;
  elapsedSeconds.value = 0;
  pcmChunks = [];
}

async function releaseAudioResources(): Promise<void> {
  processorNode?.disconnect();
  sourceNode?.disconnect();
  processorNode = null;
  sourceNode = null;
  mediaStream?.getTracks().forEach((track) => track.stop());
  mediaStream = null;
  if (audioContext && audioContext.state !== "closed") await audioContext.close();
  audioContext = null;
}

function mergeChunks(chunks: Float32Array[]): Float32Array {
  const result = new Float32Array(chunks.reduce((total, chunk) => total + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  return result;
}

function resampleTo16Khz(input: Float32Array, sourceRate: number): Float32Array {
  if (sourceRate === 16_000) return input;
  const ratio = sourceRate / 16_000;
  const output = new Float32Array(Math.round(input.length / ratio));
  for (let index = 0; index < output.length; index += 1) {
    const position = index * ratio;
    const left = Math.floor(position);
    const right = Math.min(left + 1, input.length - 1);
    const fraction = position - left;
    output[index] = input[left] * (1 - fraction) + input[right] * fraction;
  }
  return output;
}

function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(44 + index * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return buffer;
}

function writeAscii(view: DataView, offset: number, value: string): void {
  for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index));
}

onBeforeUnmount(async () => {
  if (timer !== null) window.clearInterval(timer);
  await releaseAudioResources();
  clearRecording();
});
</script>

<template>
  <section class="flex h-full min-h-[260px] flex-col rounded-xl border border-line bg-primary-subtle p-4">
    <div class="flex items-start justify-between gap-3">
      <div><p class="text-[12px] font-bold text-heading">{{ t("diagnosis.voice.title") }}</p><p class="mt-1 text-[10px] leading-4 text-muted">{{ t("diagnosis.voice.description") }}</p></div>
      <span class="rounded-full bg-white px-2 py-1 text-[11px] font-bold text-primary">{{ duration }}</span>
    </div>

    <div v-if="!audioUrl" class="grid flex-1 place-items-center py-5">
      <button v-if="!isRecording" type="button" class="grid size-16 place-items-center rounded-full bg-primary text-white shadow-lg" @click="startRecording"><Mic class="size-7" /><span class="sr-only">{{ t("diagnosis.voice.start") }}</span></button>
      <button v-else type="button" class="grid size-16 animate-pulse place-items-center rounded-full bg-red-600 text-white shadow-lg" @click="stopRecording"><Square class="size-6 fill-current" /><span class="sr-only">{{ t("diagnosis.voice.stop") }}</span></button>
      <p class="mt-3 text-[10px] font-semibold" :class="isRecording ? 'text-red-700' : 'text-muted'">{{ isRecording ? t("diagnosis.voice.recording") : t("diagnosis.voice.ready") }}</p>
    </div>

    <div v-else class="mt-4 space-y-3">
      <audio :src="audioUrl" controls class="w-full" />
      <div class="flex flex-wrap gap-2">
        <button type="button" class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-primary" @click="startRecording"><RotateCcw class="size-4" />{{ t("diagnosis.voice.retry") }}</button>
        <button type="button" class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-red-700" @click="clearRecording"><Trash2 class="size-4" />{{ t("diagnosis.voice.delete") }}</button>
        <button type="button" class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60" :disabled="isTranscribing" @click="requestTranscription">
          <LoaderCircle v-if="isTranscribing" class="size-4 animate-spin" /><WandSparkles v-else class="size-4" />
          {{ isTranscribing ? t("diagnosis.voice.transcribing") : t("diagnosis.voice.transcribe") }}
        </button>
      </div>
    </div>

    <div v-if="transcript" class="mt-3 rounded-lg border border-brand-100 bg-white p-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-[10px] font-bold uppercase tracking-wide text-primary">{{ t("diagnosis.voice.detectedText") }}</p>
        <span class="inline-flex items-center gap-1 text-[9px] text-muted"><Cloud v-if="provider === 'groq'" class="size-3" /><HardDrive v-else class="size-3" />{{ provider === "groq" ? t("diagnosis.voice.online") : t("diagnosis.voice.offline") }} · {{ modelName }}</span>
      </div>
      <textarea v-model="transcript" rows="3" class="mt-2 w-full resize-none rounded-lg border border-line p-2 text-[11px] leading-5 text-body outline-none focus:border-primary" />
      <button type="button" class="mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold text-white" :class="transcriptApplied ? 'bg-green-700' : 'bg-primary'" @click="applyTranscript">
        <Check v-if="transcriptApplied" class="size-4" /><WandSparkles v-else class="size-4" />
        {{ transcriptApplied ? t("diagnosis.voice.added") : t("diagnosis.voice.addToDescription") }}
      </button>
    </div>

    <p v-if="errorMessage" class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[10px] leading-4 text-red-700">{{ errorMessage }}</p>
  </section>
</template>
