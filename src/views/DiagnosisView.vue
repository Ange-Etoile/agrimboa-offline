<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Sprout } from "lucide-vue-next";
import AppLayout from "@/layouts/AppLayout.vue";
import ConsultationActions from "@/components/diagnosis/ConsultationActions.vue";
import ConsultationProgress from "@/components/diagnosis/ConsultationProgress.vue";
import DescriptionObservation from "@/components/diagnosis/DescriptionObservation.vue";
import DiagnosisChoiceCard from "@/components/diagnosis/DiagnosisChoiceCard.vue";
import DynamicQuestion from "@/components/diagnosis/DynamicQuestion.vue";
import {
  cropChoices,
  getFallbackParts,
  getFallbackSymptoms,
  yellowingChoices,
} from "@/features/diagnosis/data/diagnosisQuestions";
import type {
  CropId,
  DiagnosisChoice,
  DiagnosisQuestion,
  DiagnosisStep,
  DynamicAnswer,
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
  "dynamic",
];
const step = computed<DiagnosisStep>(() => {
  const routeStep = route.params.step as DiagnosisStep;
  return validSteps.includes(routeStep) ? routeStep : "crop";
});
const selectedCrop = computed<CropId | null>(() => store.answers.crop);

function findObservationQuestion(
  type: "plant_part" | "symptoms",
): DiagnosisQuestion | undefined {
  return store.questions.find(
    (question) => question.phase === "observations" && question.code === type,
  );
}

const databasePartQuestion = computed(() =>
  findObservationQuestion("plant_part"),
);
const databaseSymptomsQuestion = computed(() =>
  findObservationQuestion("symptoms"),
);
const partChoices = computed(() =>
  databasePartQuestion.value?.options.length
    ? databasePartQuestion.value.options
    : selectedCrop.value
      ? getFallbackParts(selectedCrop.value)
      : [],
);
const symptomChoices = computed(() =>
  databaseSymptomsQuestion.value?.options.length
    ? databaseSymptomsQuestion.value.options
    : selectedCrop.value
      ? getFallbackSymptoms(selectedCrop.value)
      : [],
);

const configurations = computed<Record<DiagnosisStep, StepConfiguration>>(
  () => ({
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
        `diagnosis.plantPart.${selectedCrop.value ?? "maize"}.title`,
      description:
        databasePartQuestion.value?.descriptionKey ??
        "diagnosis.plantPart.commonDescription",
      choices: partChoices.value,
      phase: 2,
      question: 1,
      progress: 20,
    },
    symptoms: {
      title:
        databaseSymptomsQuestion.value?.titleKey ??
        `diagnosis.symptoms.${selectedCrop.value ?? "maize"}.title`,
      description:
        databaseSymptomsQuestion.value?.descriptionKey ??
        "diagnosis.symptoms.commonDescription",
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
    dynamic: {
      title: "Précisons votre observation",
      description:
        "L’assistant choisit seulement une question utile parmi les questions agricoles validées.",
      choices: [],
      phase: 3,
      question: 5,
      progress: 90,
    },
  }),
);

const config = computed(() => configurations.value[step.value]);
const isMultipleChoice = computed(
  () => step.value === "part" || step.value === "symptoms",
);
const cropName = computed(() =>
  store.answers.crop ? t(store.cropNameKey) : "",
);
const hasYellowing = computed(() =>
  store.answers.symptoms.some((value) => /yellow|jaun/i.test(value)),
);
const shouldAskYellowing = computed(
  () => selectedCrop.value === "maize" && hasYellowing.value,
);
const eyebrow = computed(() =>
  step.value === "crop"
    ? t("diagnosis.common.newConsultation")
    : t("diagnosis.common.consultation", {
        crop: cropName.value.toUpperCase(),
      }),
);

const dynamicAnswerEmpty = computed(() => {
  const answer = store.currentDynamicAnswer;
  return Array.isArray(answer)
    ? answer.length === 0
    : answer.trim().length === 0;
});
const nextLabel = computed(() => {
  if (step.value !== "dynamic") return t("diagnosis.common.continue");
  if (store.collectionComplete) return "Analyser les observations";
  return "Valider cette réponse";
});
const nextDisabled = computed(() => {
  if (store.questionsLoading || store.dynamicLoading) return true;
  if (step.value === "crop") return !store.answers.crop;
  if (step.value === "part") return !store.answers.parts.length;
  if (step.value === "symptoms") return !store.answers.symptoms.length;
  if (step.value === "yellowing") return !store.answers.yellowing;
  if (step.value === "dynamic")
    return store.collectionComplete
      ? false
      : !store.currentDynamicQuestion || dynamicAnswerEmpty.value;
  return false;
});

const selectedItems = computed(() => {
  if (step.value === "part") return store.answers.parts;
  if (step.value === "symptoms") return store.answers.symptoms;
  if (step.value === "yellowing" && store.answers.yellowing)
    return [store.answers.yellowing];
  return [];
});
const selectedSummary = computed(() =>
  selectedItems.value
    .map((id) => {
      const choice = config.value.choices.find(
        (item) => item.id === id || item.value === id,
      );
      return choice ? t(choice.labelKey) : id;
    })
    .join(" · "),
);

function isSelected(id: string): boolean {
  if (step.value === "crop") return store.answers.crop === id;
  if (step.value === "part") return store.answers.parts.includes(id);
  if (step.value === "symptoms") return store.answers.symptoms.includes(id);
  return step.value === "yellowing" && store.answers.yellowing === id;
}
async function selectChoice(id: string): Promise<void> {
  if (step.value === "crop") {
    await store.selectCrop(id as CropId);
    return;
  }
  if (step.value === "part") store.toggleMany("parts", id);
  else if (step.value === "symptoms") {
    store.toggleMany("symptoms", id);
    if (!hasYellowing.value) store.answers.yellowing = null;
  } else if (step.value === "yellowing") store.answers.yellowing = id;
  store.persist();
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
async function navigate(target: DiagnosisStep): Promise<void> {
  await router.push({ name: "diagnosis", params: { step: target } });
}
async function openDynamicQuestion(): Promise<void> {
  await navigate("dynamic");
  await store.prepareNextDynamicQuestion();
}
async function goToPreviousStep(): Promise<void> {
  if (step.value === "crop") return void (await router.push("/home"));
  if (step.value === "part") return void (await navigate("crop"));
  if (step.value === "symptoms") return void (await navigate("part"));
  if (step.value === "yellowing") return void (await navigate("symptoms"));
  if (step.value === "description")
    return void (await navigate(
      shouldAskYellowing.value ? "yellowing" : "symptoms",
    ));
  await navigate("description");
}
async function goToNextStep(): Promise<void> {
  if (nextDisabled.value) return;
  store.persist();
  if (step.value === "crop") return void (await navigate("part"));
  if (step.value === "part") return void (await navigate("symptoms"));
  if (step.value === "symptoms")
    return void (await navigate(
      shouldAskYellowing.value ? "yellowing" : "description",
    ));
  if (step.value === "yellowing") return void (await navigate("description"));
  if (step.value === "description") return void (await openDynamicQuestion());
  if (store.collectionComplete) {
    await router.push({ name: "diagnosis-analysis" });
    return;
  }
  await store.submitDynamicAnswer();
}
function updateDynamicAnswer(value: DynamicAnswer): void {
  store.setDynamicAnswer(value);
}
function handleTranscript(text: string): void {
  store.appendVoiceTranscript(text);
}
function handleRecordedAudio(audio: Blob): void {
  console.info("Audio prêt pour la future sauvegarde SQLite", {
    size: audio.size,
    type: audio.type,
  });
}
async function skipDescription(): Promise<void> {
  store.setDescription("");
  await openDynamicQuestion();
}

onMounted(async () => {
  store.hydrate();
  if (store.answers.crop) await store.loadQuestions(store.answers.crop);
  if (
    step.value === "dynamic" &&
    !store.currentDynamicQuestion &&
    !store.collectionComplete
  ) {
    await store.prepareNextDynamicQuestion();
  }
});
</script>

<template>
  <AppLayout>
    <main class="mx-auto w-full max-w-[960px] px-3.5 py-4 sm:px-5 lg:px-6">
      <button
        type="button"
        class="mb-4 inline-flex items-center gap-2 rounded-lg px-1 py-2 text-[12px] font-semibold text-primary hover:bg-primary-soft"
        @click="goToPreviousStep"
      >
        <ArrowLeft class="size-4" />Retour
      </button>
      <header class="max-w-[820px]">
        <p
          class="inline-flex rounded bg-primary-soft px-2 py-1 text-[10px] font-bold tracking-wide text-primary"
        >
          {{ eyebrow }}
        </p>
        <h1
          class="mt-2.5 font-display text-[24px] font-extrabold leading-tight text-heading sm:text-[30px]"
        >
          {{ step === "dynamic" ? config.title : t(config.title) }}
        </h1>
        <p class="mt-2 text-[13px] leading-6 text-muted">
          {{ step === "dynamic" ? config.description : t(config.description) }}
        </p>
      </header>
      <ConsultationProgress :phase="config.phase" class="mt-6" />
      <div
        v-if="store.questionsLoading"
        class="mt-4 rounded-xl border border-brand-100 bg-primary-subtle px-4 py-3 text-[12px] text-primary"
      >
        Chargement des questions…
      </div>
      <div
        v-else-if="store.questionsError"
        class="mt-4 rounded-xl border border-earth-200 bg-earth-50 px-4 py-3 text-[11px] text-earth-700"
      >
        {{ store.questionsError }} Les questions locales sont utilisées.
      </div>

      <DescriptionObservation
        v-if="step === 'description'"
        v-model="store.answers.description"
        @save="store.persist"
        @previous-answers="navigate('part')"
        @skip="skipDescription"
        @audio-recorded="handleRecordedAudio"
        @transcribed="handleTranscript"
      />

      <DynamicQuestion
        v-else-if="step === 'dynamic'"
        :question="store.currentDynamicQuestion"
        :model-value="store.currentDynamicAnswer"
        :reason="store.dynamicReason"
        :loading="store.dynamicLoading"
        :error="store.dynamicError"
        :complete="store.collectionComplete"
        :provider="store.dynamicProvider"
        :model="store.dynamicModel"
        :origin="store.dynamicOrigin"
        @update:model-value="updateDynamicAnswer"
        @retry="store.prepareNextDynamicQuestion"
      />

      <section
        v-else
        class="mt-4 overflow-hidden rounded-2xl border border-line bg-white/80 p-3 shadow-[0_8px_30px_rgb(24_55_36/4%)] sm:p-4"
      >
        <div v-if="step !== 'crop'" class="mb-4 flex items-center gap-3">
          <span class="text-[11px] font-medium text-body"
            >Question {{ config.question }} / 5</span
          >
          <div class="h-2 flex-1 overflow-hidden rounded-full bg-primary-soft">
            <div
              class="h-full rounded-full bg-primary"
              :style="{ width: `${config.progress}%` }"
            />
          </div>
          <strong class="text-[11px] text-primary"
            >{{ config.progress }} %</strong
          >
        </div>
        <div
          class="mx-auto grid w-full max-w-[870px] grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3"
        >
          <DiagnosisChoiceCard
            v-for="(choice, index) in config.choices"
            :key="choice.id"
            :choice="choice"
            :index="index"
            :selected="isSelected(choice.value ?? choice.id)"
            :radio="!isMultipleChoice"
            :variant="step === 'crop' ? 'crop' : 'default'"
            :featured="step === 'crop' && index === 0"
            @select="selectChoice(choice.value ?? choice.id)"
          />
        </div>
        <div
          v-if="!store.questionsLoading && !config.choices.length"
          class="rounded-xl border border-dashed border-line-strong px-4 py-6 text-center text-[12px] text-muted"
        >
          Aucun choix disponible.
        </div>
        <div
          v-if="selectedItems.length"
          class="mx-auto mt-3 flex max-w-[870px] items-center gap-3 rounded-xl border border-brand-100 bg-primary-subtle px-3 py-2.5"
        >
          <Sprout class="size-5 text-primary" />
          <p
            class="min-w-0 flex-1 truncate text-[11px] font-semibold text-heading"
          >
            {{ selectedSummary }}
          </p>
          <button
            v-if="isMultipleChoice"
            type="button"
            class="text-[10px] font-semibold text-primary"
            @click="clearSelection"
          >
            Effacer
          </button>
        </div>
      </section>

      <ConsultationActions
        :next-label="nextLabel"
        :next-disabled="nextDisabled"
        @back="goToPreviousStep"
        @next="goToNextStep"
        @save="store.persist"
      />
    </main>
  </AppLayout>
</template>
