<script setup lang="ts">
import {
  Mic,
  PencilLine,
  Signpost,
  SkipForward,
  Trash2,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { motion } from "motion-v";

import VoiceRecorder from "./VoiceRecorder.vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  save: [];
  previousAnswers: [];
  skip: [];
  audioRecorded: [audio: Blob];
}>();

const { t } = useI18n();

const activeMode = ref<"write" | "speak">(
  "write",
);

const maximumCharacters = 600;

const characterCount = computed(() => {
  return props.modelValue.length;
});

function updateDescription(
  event: Event,
): void {
  const target =
    event.target as HTMLTextAreaElement;

  emit("update:modelValue", target.value);
}

function clearDescription(): void {
  emit("update:modelValue", "");
  emit("save");
}

function showVoiceMode(): void {
  activeMode.value = "speak";

  requestAnimationFrame(() => {
    document
      .getElementById(
        "diagnosis-voice-recorder",
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  });
}

function handleRecordedAudio(
  audio: Blob,
): void {
  emit("audioRecorded", audio);
}
</script>

<template>
  <div class="mt-4">
    <!-- Panneau principal -->
    <section
      class="rounded-2xl border border-line bg-white/75 p-3 shadow-[0_8px_30px_rgb(24_55_36/4%)] sm:p-4"
    >
      <!-- Progression de la question -->
      <div
        class="mb-4 grid grid-cols-[auto_minmax(80px,1fr)_auto] items-center gap-3"
      >
        <span
          class="whitespace-nowrap text-[11px] font-medium text-body sm:text-[12px]"
        >
          {{
            t(
              "diagnosis.common.questionProgress",
              {
                current: 4,
                total: 5,
              },
            )
          }}
        </span>

        <div
          class="h-2 overflow-hidden rounded-full bg-primary-soft sm:h-2.5"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="80"
        >
          <motion.div
            class="h-full rounded-full bg-primary"
            :initial="{
              width: 0,
            }"
            :animate="{
              width: '80%',
            }"
            :transition="{
              duration: 0.5,
              ease: 'easeOut',
            }"
          />
        </div>

        <strong
          class="whitespace-nowrap text-[11px] text-primary sm:text-[12px]"
        >
          80 %
        </strong>
      </div>

      <!--
        Desktop :
        éditeur à gauche, microphone à droite.

        Mobile :
        éditeur puis panneau vocal.
      -->
      <div
        class="grid items-stretch gap-3 lg:grid-cols-[minmax(0,2.2fr)_minmax(230px,0.95fr)]"
      >
        <!-- Éditeur -->
        <motion.div
          class="overflow-hidden rounded-xl border border-line bg-white"
          :initial="{
            opacity: 0,
            x: -10,
          }"
          :animate="{
            opacity: 1,
            x: 0,
          }"
          :transition="{
            duration: 0.3,
          }"
        >
          <!-- Onglets -->
          <div
            class="grid h-11 grid-cols-2 border-b border-line"
            role="tablist"
            :aria-label="
              t(
                'diagnosis.description.inputMode',
              )
            "
          >
            <button
              type="button"
              role="tab"
              class="relative flex min-w-0 items-center justify-center gap-2 px-3 text-[11px] font-semibold transition-colors sm:text-[12px]"
              :class="
                activeMode === 'write'
                  ? 'text-primary'
                  : 'text-muted hover:bg-primary-soft'
              "
              :aria-selected="
                activeMode === 'write'
              "
              @click="activeMode = 'write'"
            >
              <PencilLine
                class="size-4 shrink-0"
                aria-hidden="true"
              />

              <span>
                {{
                  t(
                    "diagnosis.description.write",
                  )
                }}
              </span>

              <span
                v-if="
                  activeMode === 'write'
                "
                class="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
              />
            </button>

            <button
              type="button"
              role="tab"
              class="relative flex min-w-0 items-center justify-center gap-2 border-l border-line px-3 text-[11px] font-semibold transition-colors sm:text-[12px]"
              :class="
                activeMode === 'speak'
                  ? 'text-primary'
                  : 'text-muted hover:bg-primary-soft'
              "
              :aria-selected="
                activeMode === 'speak'
              "
              @click="showVoiceMode"
            >
              <Mic
                class="size-4 shrink-0"
                aria-hidden="true"
              />

              <span>
                {{
                  t(
                    "diagnosis.description.speak",
                  )
                }}
              </span>

              <span
                v-if="
                  activeMode === 'speak'
                "
                class="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
              />
            </button>
          </div>

          <!-- Texte -->
          <div class="p-3 sm:p-4">
            <label
              for="diagnosis-description"
              class="text-[11px] font-semibold text-heading sm:text-[12px]"
            >
              {{
                t(
                  "diagnosis.description.observation",
                )
              }}
            </label>

            <textarea
              id="diagnosis-description"
              :value="modelValue"
              :maxlength="maximumCharacters"
              rows="6"
              class="mt-2 min-h-[142px] w-full resize-none rounded-xl border border-primary bg-white p-3 text-[12px] leading-5 text-body outline-none transition-shadow placeholder:text-muted-soft focus:ring-4 focus:ring-brand-100 sm:min-h-[154px] sm:text-[13px]"
              :placeholder="
                t(
                  'diagnosis.description.placeholder',
                )
              "
              @input="updateDescription"
              @blur="$emit('save')"
            />

            <!-- Actions de l’éditeur -->
            <div
              class="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2"
            >
              <p
                class="mr-auto text-[10px] text-muted sm:text-[11px]"
              >
                {{
                  t(
                    "diagnosis.description.characters",
                    {
                      current:
                        characterCount,
                      maximum:
                        maximumCharacters,
                    },
                  )
                }}
              </p>

              <button
                type="button"
                class="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-[10px] font-semibold text-primary transition-colors hover:bg-primary-soft sm:text-[11px]"
                @click="clearDescription"
              >
                <Trash2
                  class="size-3.5"
                  aria-hidden="true"
                />

                {{
                  t(
                    "diagnosis.common.clear",
                  )
                }}
              </button>

              <span
                class="hidden h-5 w-px bg-line sm:block"
                aria-hidden="true"
              />

              <button
                type="button"
                class="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-[10px] font-semibold text-primary transition-colors hover:bg-primary-soft sm:text-[11px]"
                @click="showVoiceMode"
              >
                <Mic
                  class="size-3.5"
                  aria-hidden="true"
                />

                {{
                  t(
                    "diagnosis.description.useVoice",
                  )
                }}
              </button>
            </div>
          </div>
        </motion.div>

        <!-- Voix -->
        <div id="diagnosis-voice-recorder">
          <VoiceRecorder
            class="h-full"
            @recorded="
              handleRecordedAudio
            "
          />
        </div>
      </div>
    </section>

    <!-- Diagnostic guidé -->
    <motion.button
      type="button"
      class="mt-3 flex w-full items-center gap-3 rounded-xl border border-dashed border-earth-300 bg-earth-50/45 px-3 py-3 text-left transition-colors hover:bg-earth-50 sm:px-4"
      :initial="{
        opacity: 0,
        y: 8,
      }"
      :animate="{
        opacity: 1,
        y: 0,
      }"
      :transition="{
        duration: 0.25,
        delay: 0.14,
      }"
      @click="$emit('previousAnswers')"
    >
      <Signpost
        class="size-6 shrink-0 text-sun-600"
        :stroke-width="1.8"
        aria-hidden="true"
      />

      <span class="min-w-0">
        <strong
          class="block text-[11px] font-semibold text-heading sm:text-[12px]"
        >
          {{
            t(
              "diagnosis.description.guidedDiagnosis",
            )
          }}
        </strong>

        <span
          class="mt-0.5 block text-[10px] text-primary sm:text-[11px]"
        >
          {{
            t(
              "diagnosis.description.previousAnswers",
            )
          }}
        </span>
      </span>
    </motion.button>

    <!-- Passer la question -->
    <motion.button
      type="button"
      class="mt-2 flex w-full items-center gap-3 rounded-xl border border-dashed border-line-strong bg-white px-3 py-3 text-left transition-colors hover:bg-primary-subtle sm:px-4"
      :initial="{
        opacity: 0,
        y: 8,
      }"
      :animate="{
        opacity: 1,
        y: 0,
      }"
      :transition="{
        duration: 0.25,
        delay: 0.2,
      }"
      @click="$emit('skip')"
    >
      <SkipForward
        class="size-6 shrink-0 text-primary"
        :stroke-width="1.8"
        aria-hidden="true"
      />

      <span class="min-w-0">
        <strong
          class="block text-[11px] font-semibold text-heading sm:text-[12px]"
        >
          {{
            t(
              "diagnosis.description.skip",
            )
          }}
        </strong>

        <span
          class="mt-0.5 block text-[10px] leading-4 text-muted sm:text-[11px]"
        >
          {{
            t(
              "diagnosis.description.skipDescription",
            )
          }}
        </span>
      </span>
    </motion.button>
  </div>
</template>