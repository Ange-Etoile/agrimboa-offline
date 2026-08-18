<script setup lang="ts">
import {
  CloudOff,
  Mic,
  Square,
} from "lucide-vue-next";
import { computed, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { motion } from "motion-v";

type RecorderStatus =
  | "ready"
  | "requesting"
  | "recording"
  | "processing"
  | "completed"
  | "error";

const emit = defineEmits<{
  recorded: [audio: Blob];
  error: [message: string];
}>();

const { t } = useI18n();

const status = ref<RecorderStatus>("ready");
const elapsedSeconds = ref(0);
const errorMessage = ref("");

let mediaRecorder: MediaRecorder | null = null;
let mediaStream: MediaStream | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let audioChunks: Blob[] = [];

const maximumDuration = 60;

const formattedDuration = computed(() => {
  const minutes = Math.floor(
    elapsedSeconds.value / 60,
  );

  const seconds = elapsedSeconds.value % 60;

  return [
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
});

const statusLabel = computed(() => {
  if (status.value === "requesting") {
    return t("diagnosis.description.requestingMicrophone");
  }

  if (status.value === "recording") {
    return t("diagnosis.description.recording");
  }

  if (status.value === "processing") {
    return t("diagnosis.description.processingVoice");
  }

  if (status.value === "completed") {
    return t("diagnosis.description.recordingCompleted");
  }

  if (status.value === "error") {
    return t("diagnosis.description.microphoneError");
  }

  return t("diagnosis.description.microphoneReady");
});

const recorderTitle = computed(() => {
  if (status.value === "recording") {
    return t("diagnosis.description.stopRecording");
  }

  return t("diagnosis.description.dictate");
});

const recorderSubtitle = computed(() => {
  if (status.value === "recording") {
    return formattedDuration.value;
  }

  if (status.value === "processing") {
    return t("diagnosis.description.processingVoice");
  }

  if (status.value === "completed") {
    return t("diagnosis.description.recordingCompleted");
  }

  return t("diagnosis.description.pressToStart");
});

async function toggleRecording(): Promise<void> {
  if (status.value === "recording") {
    stopRecording();
    return;
  }

  await startRecording();
}

async function startRecording(): Promise<void> {
  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {
    setError(
      t("diagnosis.description.microphoneUnavailable"),
    );

    return;
  }

  try {
    status.value = "requesting";
    errorMessage.value = "";

    mediaStream =
      await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

    audioChunks = [];
    elapsedSeconds.value = 0;

    mediaRecorder = new MediaRecorder(
      mediaStream,
    );

    mediaRecorder.addEventListener(
      "dataavailable",
      handleAudioData,
    );

    mediaRecorder.addEventListener(
      "stop",
      handleRecordingStopped,
    );

    mediaRecorder.start(250);

    status.value = "recording";

    timer = setInterval(() => {
      elapsedSeconds.value += 1;

      if (
        elapsedSeconds.value >= maximumDuration
      ) {
        stopRecording();
      }
    }, 1000);
  } catch (error: unknown) {
    setError(getErrorMessage(error));
  }
}

function stopRecording(): void {
  stopTimer();

  if (
    mediaRecorder &&
    mediaRecorder.state !== "inactive"
  ) {
    status.value = "processing";
    mediaRecorder.stop();
    return;
  }

  stopStream();
}

function handleAudioData(
  event: BlobEvent,
): void {
  if (event.data.size > 0) {
    audioChunks.push(event.data);
  }
}

function handleRecordingStopped(): void {
  const mimeType =
    mediaRecorder?.mimeType || "audio/webm";

  const audioBlob = new Blob(audioChunks, {
    type: mimeType,
  });

  stopStream();

  if (audioBlob.size === 0) {
    setError(
      t("diagnosis.description.emptyRecording"),
    );

    return;
  }

  status.value = "completed";
  emit("recorded", audioBlob);
}

function setError(message: string): void {
  status.value = "error";
  errorMessage.value = message;

  stopTimer();
  stopStream();

  emit("error", message);
}

function getErrorMessage(
  error: unknown,
): string {
  if (
    error instanceof DOMException &&
    error.name === "NotAllowedError"
  ) {
    return t(
      "diagnosis.description.microphonePermissionDenied",
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return t(
    "diagnosis.description.microphoneUnavailable",
  );
}

function stopTimer(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function stopStream(): void {
  mediaStream
    ?.getTracks()
    .forEach((track) => track.stop());

  mediaStream = null;
  mediaRecorder = null;
}

onBeforeUnmount(() => {
  stopTimer();
  stopStream();
});
</script>

<template>
  <motion.aside
    class="flex min-h-[274px] flex-col rounded-xl border border-brand-100 bg-gradient-to-b from-primary-subtle/55 to-white p-4 sm:min-h-[286px]"
    :initial="{
      opacity: 0,
      x: 10,
    }"
    :animate="{
      opacity: 1,
      x: 0,
    }"
    :transition="{
      duration: 0.3,
      delay: 0.12,
    }"
  >
    <!-- Partie centrale -->
    <div
      class="flex flex-1 flex-col items-center justify-center text-center"
    >
      <!-- Microphone animé -->
      <div class="relative grid size-[92px] place-items-center">
        <motion.span
          class="absolute inset-0 rounded-full border border-brand-200 bg-white/50"
          :animate="
            status === 'recording'
              ? {
                  scale: [1, 1.14, 1],
                  opacity: [0.7, 0.2, 0.7],
                }
              : {
                  scale: 1,
                  opacity: 0.7,
                }
          "
          :transition="
            status === 'recording'
              ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : {
                  duration: 0.2,
                }
          "
        />

        <span
          class="absolute inset-[9px] rounded-full border border-brand-200 bg-primary-subtle/70"
        />

        <motion.button
          type="button"
          class="relative z-10 grid size-[58px] place-items-center rounded-full bg-primary text-white shadow-[0_7px_20px_rgb(8_122_50/26%)] transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:cursor-wait disabled:opacity-70"
          :disabled="
            status === 'requesting' ||
            status === 'processing'
          "
          :aria-label="recorderTitle"
          :while-hover="{
            scale: 1.04,
          }"
          :while-tap="{
            scale: 0.96,
          }"
          @click="toggleRecording"
        >
          <Square
            v-if="status === 'recording'"
            class="size-5 fill-current"
            aria-hidden="true"
          />

          <Mic
            v-else
            class="size-6"
            :stroke-width="2"
            aria-hidden="true"
          />
        </motion.button>
      </div>

      <h2
        class="mt-2 text-[14px] font-bold text-heading sm:text-[15px]"
      >
        {{ recorderTitle }}
      </h2>

      <p
        class="mt-1 min-h-5 text-[11px] text-muted sm:text-[12px]"
      >
        {{ recorderSubtitle }}
      </p>

      <!-- État -->
      <div
        class="mt-2 flex min-h-7 w-full max-w-[205px] items-center justify-center rounded-full border px-3 text-[10px] font-medium sm:text-[11px]"
        :class="{
          'border-brand-100 bg-primary-subtle text-primary':
            status === 'ready' ||
            status === 'completed',

          'border-sun-200 bg-sun-50 text-sun-800':
            status === 'requesting' ||
            status === 'processing',

          'border-primary bg-primary text-white':
            status === 'recording',

          'border-red-200 bg-red-50 text-red-700':
            status === 'error',
        }"
      >
        {{ statusLabel }}
      </div>

      <p
        v-if="errorMessage"
        class="mt-2 max-w-[240px] text-[10px] leading-4 text-red-700"
      >
        {{ errorMessage }}
      </p>

      <p
        class="mt-2 text-[10px] text-muted sm:text-[11px]"
      >
        {{
          t(
            "diagnosis.description.maximumDuration",
          )
        }}
      </p>
    </div>

    <!-- Information hors connexion -->
    <div
      class="mt-3 flex items-start gap-2.5 border-t border-brand-100 pt-3 text-left"
    >
      <CloudOff
        class="mt-0.5 size-4 shrink-0 text-primary"
        :stroke-width="1.9"
        aria-hidden="true"
      />

      <p
        class="text-[10px] font-medium leading-4 text-primary sm:text-[11px]"
      >
        {{
          t(
            "diagnosis.description.offlineVoice",
          )
        }}
      </p>
    </div>
  </motion.aside>
</template>