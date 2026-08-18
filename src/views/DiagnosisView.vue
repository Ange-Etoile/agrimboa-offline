<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  CircleHelp,
  Sprout,
} from "lucide-vue-next";
import { motion } from "motion-v";

import AppLayout from "@/layouts/AppLayout.vue";
import ConsultationActions from "@/components/diagnosis/ConsultationActions.vue";
import ConsultationProgress from "@/components/diagnosis/ConsultationProgress.vue";
import DescriptionObservation from "@/components/diagnosis/DescriptionObservation.vue";
import DiagnosisChoiceCard from "@/components/diagnosis/DiagnosisChoiceCard.vue";

import {
  cropChoices,
  extentChoices,
  getFallbackParts,
  getFallbackSymptoms,
  yellowingChoices,
} from "@/features/diagnosis/data/diagnosisQuestions";

import type {
  CropId,
  DiagnosisChoice,
  DiagnosisQuestion,
  DiagnosisStep,
} from "@/features/diagnosis/types/diagnosis";

import { useDiagnosisStore } from "@/stores/diagnosis.store";

interface StepConfiguration {
  title: string;
  description: string;
  choices: DiagnosisChoice[];
  phase: number;
  question: number;
  progress: number;
}

const route = useRoute();
const router = useRouter();
const store = useDiagnosisStore();
const { t } = useI18n();

const validSteps: DiagnosisStep[] = [
  "crop",
  "part",
  "symptoms",
  "yellowing",
  "description",
  "extent",
];

const step = computed<DiagnosisStep>(() => {
  const routeStep = route.params.step as DiagnosisStep;

  if (validSteps.includes(routeStep)) {
    return routeStep;
  }

  return "crop";
});

const selectedCrop = computed<CropId | null>(() => {
  return store.answers.crop;
});

/*
 * Recherche une question SQLite grâce à son code.
 * Les codes attendus peuvent par exemple être :
 *
 * maize_plant_part
 * maize_symptoms
 * cassava_plant_part
 * cassava_symptoms
 */
function findDatabaseQuestion(
  type: "plant_part" | "symptoms",
): DiagnosisQuestion | undefined {
  if (!selectedCrop.value) {
    return undefined;
  }

  const cropId = selectedCrop.value;

  return store.questions.find((question) => {
    const code = question.code.toLowerCase();

    return (
      code.includes(cropId) &&
      code.includes(type)
    );
  });
}

const databasePartQuestion = computed(() => {
  return findDatabaseQuestion("plant_part");
});

const databaseSymptomsQuestion = computed(() => {
  return findDatabaseQuestion("symptoms");
});

const partChoices = computed<DiagnosisChoice[]>(() => {
  if (
    databasePartQuestion.value &&
    databasePartQuestion.value.options.length > 0
  ) {
    return databasePartQuestion.value.options;
  }

  if (!selectedCrop.value) {
    return [];
  }

  return getFallbackParts(selectedCrop.value);
});

const symptomChoices = computed<DiagnosisChoice[]>(() => {
  if (
    databaseSymptomsQuestion.value &&
    databaseSymptomsQuestion.value.options.length > 0
  ) {
    return databaseSymptomsQuestion.value.options;
  }

  if (!selectedCrop.value) {
    return [];
  }

  return getFallbackSymptoms(selectedCrop.value);
});

const configurations = computed<
  Record<DiagnosisStep, StepConfiguration>
>(() => ({
  crop: {
    title: "diagnosis.crop.title",
    description: "diagnosis.crop.description",
    choices: cropChoices,
    phase: 1,
    question: 0,
    progress: 0,
  },

  part: {
    title:
      databasePartQuestion.value?.titleKey ??
      "diagnosis.plantPart.title",

    description:
      databasePartQuestion.value?.descriptionKey ??
      "diagnosis.plantPart.shortDescription",

    choices: partChoices.value,
    phase: 2,
    question: 1,
    progress: 20,
  },

  symptoms: {
    title:
      databaseSymptomsQuestion.value?.titleKey ??
      "diagnosis.symptoms.title",

    description:
      databaseSymptomsQuestion.value?.descriptionKey ??
      "diagnosis.symptoms.description",

    choices: symptomChoices.value,
    phase: 2,
    question: 2,
    progress: 40,
  },

  yellowing: {
    title: "diagnosis.yellowing.title",
    description: "diagnosis.yellowing.description",
    choices: yellowingChoices,
    phase: 2,
    question: 3,
    progress: 60,
  },

  description: {
    title: "diagnosis.description.title",
    description: "diagnosis.description.subtitle",
    choices: [],
    phase: 2,
    question: 4,
    progress: 80,
  },

  extent: {
    title: "diagnosis.extent.title",
    description: "diagnosis.extent.description",
    choices: extentChoices,
    phase: 3,
    question: 5,
    progress: 100,
  },
}));

const config = computed<StepConfiguration>(() => {
  return configurations.value[step.value];
});

const isMultipleChoice = computed(() => {
  return (
    step.value === "part" ||
    step.value === "symptoms"
  );
});

const cropName = computed(() => {
  if (!store.answers.crop) {
    return "";
  }

  return t(store.cropNameKey);
});

const hasYellowingSymptom = computed(() => {
  return store.answers.symptoms.some((symptom) => {
    const normalized = symptom.toLowerCase();

    return (
      normalized === "yellowing" ||
      normalized.includes("yellow") ||
      normalized.includes("jaun")
    );
  });
});

const shouldAskYellowingQuestion = computed(() => {
  return (
    selectedCrop.value === "maize" &&
    hasYellowingSymptom.value
  );
});

const eyebrow = computed(() => {
  if (step.value === "crop") {
    return t(
      "diagnosis.common.newConsultation",
    );
  }

  if (step.value === "description") {
    return t(
      "diagnosis.description.eyebrow",
      {
        crop: cropName.value.toUpperCase(),
      },
    );
  }

  if (step.value === "extent") {
    return t(
      "diagnosis.common.additionalQuestion",
      {
        crop: cropName.value.toUpperCase(),
      },
    );
  }

  return t(
    "diagnosis.common.consultation",
    {
      crop: cropName.value.toUpperCase(),
    },
  );
});

const backLabel = computed(() => {
  if (step.value === "crop") {
    return t(
      "diagnosis.common.backHome",
    );
  }

  if (step.value === "part") {
    return t(
      "diagnosis.common.backCrop",
    );
  }

  if (step.value === "extent") {
    return t(
      "diagnosis.common.backDescription",
    );
  }

  return t(
    "diagnosis.common.backQuestion",
  );
});

const nextLabel = computed(() => {
  if (step.value === "extent") {
    return t(
      "diagnosis.common.showResult",
    );
  }

  if (step.value === "crop") {
    if (!cropName.value) {
      return t(
        "diagnosis.common.continue",
      );
    }

    return t(
      "diagnosis.crop.continueWith",
      {
        crop: cropName.value.toLowerCase(),
      },
    );
  }

  return t(
    "diagnosis.common.continue",
  );
});

const nextDisabled = computed(() => {
  if (store.questionsLoading) {
    return true;
  }

  if (step.value === "crop") {
    return !store.answers.crop;
  }

  if (step.value === "part") {
    return (
      store.answers.parts.length === 0
    );
  }

  if (step.value === "symptoms") {
    return (
      store.answers.symptoms.length === 0
    );
  }

  if (step.value === "yellowing") {
    return !store.answers.yellowing;
  }

  if (step.value === "extent") {
    return !store.answers.extent;
  }

  return false;
});

const selectedItems = computed<string[]>(() => {
  if (step.value === "part") {
    return store.answers.parts;
  }

  if (step.value === "symptoms") {
    return store.answers.symptoms;
  }

  if (
    step.value === "yellowing" &&
    store.answers.yellowing
  ) {
    return [
      store.answers.yellowing,
    ];
  }

  if (
    step.value === "extent" &&
    store.answers.extent
  ) {
    return [
      store.answers.extent,
    ];
  }

  return [];
});

const selectedSummary = computed(() => {
  return selectedItems.value
    .map((selectedId) => {
      const choice = config.value.choices.find(
        (item) => item.id === selectedId,
      );

      if (!choice) {
        return selectedId;
      }

      return t(choice.labelKey);
    })
    .join(" · ");
});

const contextualHint = computed(() => {
  if (step.value === "part") {
    return {
      title: t(
        "diagnosis.plantPart.unsure",
      ),
      description: t(
        "diagnosis.plantPart.unsureDescription",
      ),
    };
  }

  if (step.value === "symptoms") {
    return {
      title: t(
        "diagnosis.symptoms.absent",
      ),
      description: t(
        "diagnosis.symptoms.absentDescription",
      ),
    };
  }

  if (step.value === "yellowing") {
    return {
      title: t(
        "diagnosis.yellowing.unsure",
      ),
      description: t(
        "diagnosis.yellowing.unsureDescription",
      ),
    };
  }

  if (step.value === "extent") {
    return {
      title: t(
        "diagnosis.extent.why",
      ),
      description: t(
        "diagnosis.extent.whyDescription",
      ),
    };
  }

  return null;
});

function isSelected(id: string): boolean {
  if (step.value === "crop") {
    return store.answers.crop === id;
  }

  if (step.value === "part") {
    return store.answers.parts.includes(id);
  }

  if (step.value === "symptoms") {
    return store.answers.symptoms.includes(id);
  }

  if (step.value === "yellowing") {
    return store.answers.yellowing === id;
  }

  if (step.value === "extent") {
    return store.answers.extent === id;
  }

  return false;
}

async function selectChoice(
  id: string,
): Promise<void> {
  if (step.value === "crop") {
    await store.selectCrop(id as CropId);
    return;
  }

  if (step.value === "part") {
    store.toggleMany(
      "parts",
      id,
    );
    return;
  }

  if (step.value === "symptoms") {
    store.toggleMany(
      "symptoms",
      id,
    );

    /*
     * Si le jaunissement est retiré,
     * l’ancienne réponse liée au jaunissement
     * ne doit pas rester dans la consultation.
     */
    if (!hasYellowingSymptom.value) {
      store.answers.yellowing = null;
      store.persist();
    }

    return;
  }

  if (step.value === "yellowing") {
    store.answers.yellowing = id;
    store.persist();
    return;
  }

  if (step.value === "extent") {
    store.answers.extent = id;
    store.persist();
  }
}

function clearSelection(): void {
  if (step.value === "part") {
    store.clearMany("parts");
    return;
  }

  if (step.value === "symptoms") {
    store.clearMany("symptoms");
    store.answers.yellowing = null;
    store.persist();
  }
}

async function navigateToStep(
  target: DiagnosisStep,
): Promise<void> {
  await router.push({
    name: "diagnosis",
    params: {
      step: target,
    },
  });
}

async function goToPreviousStep(): Promise<void> {
  if (step.value === "crop") {
    await router.push("/");
    return;
  }

  if (step.value === "part") {
    await navigateToStep("crop");
    return;
  }

  if (step.value === "symptoms") {
    await navigateToStep("part");
    return;
  }

  if (step.value === "yellowing") {
    await navigateToStep("symptoms");
    return;
  }

  if (step.value === "description") {
    await navigateToStep(
      shouldAskYellowingQuestion.value
        ? "yellowing"
        : "symptoms",
    );

    return;
  }

  await navigateToStep("description");
}

async function goToNextStep(): Promise<void> {
  if (nextDisabled.value) {
    return;
  }

  store.persist();

  if (step.value === "crop") {
    await navigateToStep("part");
    return;
  }

  if (step.value === "part") {
    await navigateToStep("symptoms");
    return;
  }

  if (step.value === "symptoms") {
    await navigateToStep(
      shouldAskYellowingQuestion.value
        ? "yellowing"
        : "description",
    );

    return;
  }

  if (step.value === "yellowing") {
    await navigateToStep("description");
    return;
  }

  if (step.value === "description") {
    await navigateToStep("extent");
    return;
  }

  await router.push({
    name: "diagnosis-result",
  });
}

async function saveAndQuit(): Promise<void> {
  store.persist();
  await router.push("/");
}

async function returnToPreviousAnswers(): Promise<void> {
  store.persist();
  await navigateToStep("part");
}

async function skipDescription(): Promise<void> {
  store.answers.description = "";
  store.persist();

  await navigateToStep("extent");
}

function handleRecordedAudio(
  audio: Blob,
): void {
  /*
   * Le Blob sera ensuite enregistré dans
   * diagnosis_voice_notes puis transmis
   * au moteur local Whisper.
   */
  console.info(
    "Enregistrement vocal prêt",
    {
      size: audio.size,
      type: audio.type,
    },
  );
}

onMounted(async () => {
  store.hydrate();

  if (store.answers.crop) {
    await store.loadQuestions(
      store.answers.crop,
    );
  }
});
</script>

<template>
  <AppLayout>
    <motion.main
      :key="step"
      class="mx-auto w-full max-w-[960px] px-3.5 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6"
      :initial="{
        opacity: 0,
        x: 14,
      }"
      :animate="{
        opacity: 1,
        x: 0,
      }"
      :exit="{
        opacity: 0,
        x: -8,
      }"
      :transition="{
        duration: 0.25,
        ease: 'easeOut',
      }"
    >
      <!-- Retour supérieur -->
      <motion.button
        type="button"
        class="mb-3 inline-flex min-h-9 items-center gap-2 rounded-lg px-1 text-[12px] font-semibold text-primary transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 sm:mb-4 sm:text-[13px]"
        :initial="{
          opacity: 0,
          x: -8,
        }"
        :animate="{
          opacity: 1,
          x: 0,
        }"
        :transition="{
          duration: 0.22,
        }"
        @click="goToPreviousStep"
      >
        <ArrowLeft
          class="size-4 shrink-0"
          aria-hidden="true"
        />

        <span>
          {{ backLabel }}
        </span>
      </motion.button>

      <!-- En-tête -->
      <header class="max-w-[820px]">
        <p
          class="inline-flex rounded bg-primary-soft px-2 py-1 text-[10px] font-bold tracking-wide text-primary sm:text-[11px]"
        >
          {{ eyebrow }}
        </p>

        <h1
          class="mt-2.5 max-w-[800px] font-display text-[24px] font-extrabold leading-[1.13] tracking-[-0.03em] text-heading sm:text-[28px] lg:text-[30px]"
        >
          {{ t(config.title) }}
        </h1>

        <p
          class="mt-2 max-w-[760px] text-[13px] leading-[1.55] text-muted sm:text-[14px]"
        >
          {{ t(config.description) }}
        </p>
      </header>

      <!-- Progression générale -->
      <ConsultationProgress
        :phase="config.phase"
        class="mt-5 sm:mt-6"
      />

      <!-- État du chargement SQLite -->
      <motion.div
        v-if="store.questionsLoading"
        class="mt-4 rounded-xl border border-brand-100 bg-primary-subtle px-4 py-3 text-[12px] text-primary"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
      >
        {{ t("common.loading") }}
      </motion.div>

      <!-- Erreur non bloquante -->
      <motion.div
        v-else-if="store.questionsError"
        class="mt-4 rounded-xl border border-earth-200 bg-earth-50 px-4 py-3 text-[11px] text-earth-700"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
      >
        Les questions enregistrées n’ont pas pu être chargées.
        Les questions locales intégrées sont utilisées.
      </motion.div>

      <!-- Description libre et voix -->
      <DescriptionObservation
        v-if="step === 'description'"
        v-model="store.answers.description"
        @save="store.persist"
        @previous-answers="returnToPreviousAnswers"
        @skip="skipDescription"
        @audio-recorded="handleRecordedAudio"
      />

      <!-- Questions et choix -->
      <template v-else>
        <section
          class="mt-4 overflow-hidden rounded-2xl border border-line bg-white/80 p-3 shadow-[0_8px_30px_rgb(24_55_36/4%)] sm:p-4"
        >
          <!-- Progression des questions -->
          <div
            v-if="step !== 'crop'"
            class="mb-4 grid grid-cols-[auto_minmax(80px,1fr)_auto] items-center gap-3"
          >
            <span
              class="whitespace-nowrap text-[11px] font-medium text-body sm:text-[12px]"
            >
              {{
                t(
                  "diagnosis.common.questionProgress",
                  {
                    current:
                      config.question,
                    total: 5,
                  },
                )
              }}
            </span>

            <div
              class="h-2 overflow-hidden rounded-full bg-primary-soft sm:h-2.5"
              role="progressbar"
              :aria-valuenow="config.progress"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <motion.div
                class="h-full rounded-full bg-primary"
                :initial="{ width: 0 }"
                :animate="{
                  width: `${config.progress}%`,
                }"
                :transition="{
                  duration: 0.45,
                  ease: 'easeOut',
                }"
              />
            </div>

            <strong
              class="whitespace-nowrap text-[11px] text-primary sm:text-[12px]"
            >
              {{ config.progress }} %
            </strong>
          </div>

          <!-- Grille de choix -->
          <div
            class="mx-auto grid w-full max-w-[870px] grid-cols-2 items-stretch gap-2.5 sm:gap-3 lg:grid-cols-3"
          >
            <DiagnosisChoiceCard
              v-for="(
                choice,
                index
              ) in config.choices"
              :key="choice.id"
              :choice="choice"
              :index="index"
              :selected="
                isSelected(choice.id)
              "
              :radio="
                !isMultipleChoice
              "
              :variant="
                step === 'crop'
                  ? 'crop'
                  : 'default'
              "
              :featured="
                step === 'crop' &&
                index === 0
              "
              :class="{
                'col-span-2 sm:col-span-1':
                  step === 'crop' &&
                  index === 0,
              }"
              @select="
                selectChoice(choice.id)
              "
            />
          </div>

          <!-- Aucun choix -->
          <div
            v-if="
              !store.questionsLoading &&
              config.choices.length === 0
            "
            class="mx-auto max-w-[870px] rounded-xl border border-dashed border-line-strong px-4 py-6 text-center text-[12px] text-muted"
          >
            Aucune question n’est disponible pour cette culture.
          </div>

          <!-- Résumé de sélection -->
          <motion.div
            v-if="
              step !== 'crop' &&
              selectedItems.length > 0
            "
            class="mx-auto mt-3 flex max-w-[870px] items-center gap-3 rounded-xl border border-brand-100 bg-primary-subtle px-3 py-2.5"
            :initial="{
              opacity: 0,
              y: 6,
            }"
            :animate="{
              opacity: 1,
              y: 0,
            }"
          >
            <span
              class="grid size-8 shrink-0 place-items-center rounded-full border border-primary text-primary"
            >
              <Sprout
                class="size-4"
                aria-hidden="true"
              />
            </span>

            <div class="min-w-0 flex-1">
              <p
                class="text-[10px] text-primary sm:text-[11px]"
              >
                {{
                  selectedItems.length === 1
                    ? t(
                        "diagnosis.common.selectedOne",
                      )
                    : t(
                        "diagnosis.common.selectedMany",
                        {
                          count:
                            selectedItems.length,
                        },
                      )
                }}
              </p>

              <p
                class="mt-0.5 truncate text-[11px] font-semibold text-heading sm:text-[12px]"
              >
                {{ selectedSummary }}
              </p>
            </div>

            <button
              v-if="isMultipleChoice"
              type="button"
              class="shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-[10px] font-semibold text-primary transition-colors hover:bg-white sm:text-[11px]"
              @click="clearSelection"
            >
              {{
                t(
                  "diagnosis.common.clear",
                )
              }}
            </button>

            <span
              v-else
              class="shrink-0 whitespace-nowrap px-2 text-[10px] font-semibold text-primary sm:text-[11px]"
            >
              {{
                t(
                  "diagnosis.common.edit",
                )
              }}
            </span>
          </motion.div>
        </section>

        <!-- Aide contextuelle -->
        <motion.div
          v-if="contextualHint"
          class="mt-3 flex items-start gap-3 rounded-xl border border-dashed border-earth-300 bg-earth-50/50 px-3 py-3 sm:px-4"
          :initial="{
            opacity: 0,
            y: 7,
          }"
          :animate="{
            opacity: 1,
            y: 0,
          }"
          :transition="{
            duration: 0.24,
            delay: 0.12,
          }"
        >
          <CircleHelp
            class="mt-0.5 size-5 shrink-0 text-earth-500"
            aria-hidden="true"
          />

          <div class="min-w-0">
            <p
              class="text-[11px] font-semibold text-heading sm:text-[12px]"
            >
              {{ contextualHint.title }}
            </p>

            <p
              class="mt-0.5 text-[10px] leading-4 text-muted sm:text-[11px]"
            >
              {{ contextualHint.description }}
            </p>
          </div>
        </motion.div>
      </template>

      <!-- Navigation -->
      <ConsultationActions
        :next-label="nextLabel"
        :next-disabled="nextDisabled"
        @back="goToPreviousStep"
        @next="goToNextStep"
        @save="saveAndQuit"
      />
    </motion.main>
  </AppLayout>
</template>