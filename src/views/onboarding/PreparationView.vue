<script setup lang="ts">
import {
  BookOpenCheck,
  Check,
  CircleAlert,
  Clock3,
  Cpu,
  Database,
  LoaderCircle,
  RotateCcw,
} from "lucide-vue-next";
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import guidesFarmer from "@/assets/images/onboarding/offline-guides-farmer.png";
import OfflineStatus from "@/components/onboarding/OfflineStatus.vue";
import OnboardingShell from "@/components/onboarding/OnboardingShell.vue";
import {
  prepareApplication,
  type PreparationResourceId,
  type PreparationResourceState,
} from "@/services/preparation.service";
import { usePreferencesStore } from "@/stores/preferences.store";
import type { ResourceStatus } from "@/services/database.service";

const { t } = useI18n();
const router = useRouter();
const preferencesStore = usePreferencesStore();

const progress = ref(0);
const isPreparing = ref(false);
const preparationCompleted = ref(false);
const showDetails = ref(false);
const generalError = ref<string | null>(null);

const resourceStates = reactive<
  Record<PreparationResourceId, PreparationResourceState>
>({
  "local-ai-model": {
    id: "local-ai-model",
    status: "pending",
    message: null,
  },
  "agricultural-guides": {
    id: "agricultural-guides",
    status: "pending",
    message: null,
  },
  "local-storage": {
    id: "local-storage",
    status: "pending",
    message: null,
  },
});

const resources = computed(() => [
  {
    title: t("preparation.resources.model.title"),
    subtitle: t(
      "preparation.resources.model.description",
    ),
    icon: Cpu,
    ...resourceStates["local-ai-model"],
  },
  {
    title: t("preparation.resources.guides.title"),
    subtitle: t(
      "preparation.resources.guides.description",
    ),
    icon: BookOpenCheck,
    ...resourceStates["agricultural-guides"],
  },
  {
    title: t("preparation.resources.storage.title"),
    subtitle: t(
      "preparation.resources.storage.description",
    ),
    icon: Database,
    ...resourceStates["local-storage"],
  },
]);

const hasErrors = computed(() => {
  return resources.value.some(
    (resource) => resource.status === "error",
  );
});

function updatePreparationState(
  result: {
    progress: number;
    completed: boolean;
    resources: PreparationResourceState[];
  },
): void {
  progress.value = result.progress;
  preparationCompleted.value = result.completed;

  for (const resource of result.resources) {
    resourceStates[resource.id] = {
      ...resource,
    };
  }
}

async function startPreparation(): Promise<void> {
  if (isPreparing.value) {
    return;
  }

  isPreparing.value = true;
  preparationCompleted.value = false;
  generalError.value = null;
  showDetails.value = false;

  try {
    const result = await prepareApplication(
      updatePreparationState,
    );

    updatePreparationState(result);
  } catch (error: unknown) {
    generalError.value =
      error instanceof Error
        ? error.message
        : "La préparation d’AgriMboa a échoué.";
  } finally {
    isPreparing.value = false;
  }
}

async function accessHome(): Promise<void> {
  if (!preparationCompleted.value) {
    return;
  }

  preferencesStore.clearError();

  await preferencesStore.completePreparation();

  if (preferencesStore.errorMessage) {
    generalError.value =
      preferencesStore.errorMessage;

    return;
  }

  await router.replace("/home");
}

function toggleDetails(): void {
  showDetails.value = !showDetails.value;
}

function getStatusLabel(
  status: ResourceStatus,
): string {
  switch (status) {
    case "ready":
      return t("common.ready");

    case "loading":
      return t("common.loading");

    case "error":
      return t("common.error");

    default:
      return t("common.pending");
  }
}

onMounted(() => {
  void startPreparation();
});
</script>

<template>
  <OnboardingShell
    :image="guidesFarmer"
    :image-alt="t('preparation.imageAlt')"
    image-position="42% center"
  >
    <div
      class="-mx-3 w-auto sm:-mx-2 lg:mx-auto lg:max-h-[calc(100dvh-40px)] lg:w-full lg:max-w-[620px] lg:overflow-y-auto lg:py-2"
    >
      <!-- En-tête -->
      <header>
        <p
          class="text-[18px] font-semibold tracking-wide text-primary sm:text-[19px] lg:text-[13px] xl:text-[14px]"
        >
          {{ t("preparation.eyebrow") }}
        </p>

        <h1
          class="mt-4 font-display text-[40px] font-extrabold leading-[1.08] tracking-[-0.035em] text-heading sm:text-[44px] lg:mt-2 lg:text-[32px] xl:text-[38px]"
        >
          {{ t("preparation.title") }}
        </h1>

        <p
          class="mt-4 text-[19px] leading-[1.55] text-muted sm:text-[20px] lg:mt-2.5 lg:text-[15px] lg:leading-6 xl:mt-3 xl:text-[16px]"
        >
          {{ t("preparation.description") }}
        </p>
      </header>

      <!-- Progression -->
      <section
        class="mt-7 sm:mt-8 lg:mt-4 xl:mt-5"
        aria-labelledby="preparation-progress"
        aria-live="polite"
      >
        <div
          id="preparation-progress"
          class="flex items-center justify-between text-[18px] font-medium text-body sm:text-[19px] lg:text-[13px] lg:font-normal xl:text-[14px]"
        >
          <span>
            {{ t("preparation.progressLabel") }}
          </span>

          <span
            class="font-semibold text-primary lg:font-medium"
          >
            {{ progress }} %
          </span>
        </div>

        <div
          class="mt-3.5 h-3.5 overflow-hidden rounded-full bg-primary-soft sm:h-4 lg:mt-2 lg:h-2.5"
          role="progressbar"
          :aria-label="t('preparation.progressLabel')"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="progress"
        >
          <div
            class="h-full rounded-full bg-primary transition-[width] duration-500"
            :style="{
              width: `${progress}%`,
            }"
          />
        </div>
      </section>

      <!-- Erreur générale -->
      <div
        v-if="generalError"
        role="alert"
        class="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
      >
        <CircleAlert
          class="mt-0.5 size-5 shrink-0"
          aria-hidden="true"
        />

        <p class="text-sm leading-relaxed">
          {{ generalError }}
        </p>
      </div>

      <!-- Ressources -->
      <section
        class="mt-7 space-y-4 sm:mt-8 sm:space-y-5 lg:mt-5 lg:space-y-2 xl:mt-6 xl:space-y-2.5"
        :aria-label="t('preparation.title')"
      >
        <article
          v-for="resource in resources"
          :key="resource.id"
          class="flex min-h-[112px] items-center gap-4 rounded-2xl border bg-white px-4 py-4 transition-colors sm:min-h-[120px] sm:gap-5 sm:px-5 lg:min-h-[68px] lg:gap-3 lg:rounded-xl lg:px-3 lg:py-2.5 xl:min-h-[76px] xl:px-4 xl:py-3"
          :class="
            resource.status === 'error'
              ? 'border-red-200'
              : 'border-line'
          "
        >
          <!-- Icône de la ressource -->
          <span
            class="grid size-[60px] shrink-0 place-items-center rounded-xl sm:size-16 lg:size-11 lg:rounded-lg xl:size-12"
            :class="
              resource.status === 'error'
                ? 'bg-red-50 text-red-600'
                : 'bg-primary-soft text-primary'
            "
          >
            <component
              :is="resource.icon"
              :size="32"
              :stroke-width="1.8"
              aria-hidden="true"
              class="sm:size-9 lg:size-6 xl:size-7"
            />
          </span>

          <!-- Informations -->
          <div class="min-w-0 flex-1">
            <p
              class="text-[18px] font-semibold leading-[1.25] text-body sm:text-[20px] lg:text-[14px] lg:leading-tight xl:text-[15px]"
            >
              {{ resource.title }}
            </p>

            <p
              class="mt-1.5 text-[16px] leading-[1.35] text-muted-soft sm:text-[18px] lg:mt-0.5 lg:text-[12px] lg:leading-tight xl:text-[13px]"
            >
              {{ resource.subtitle }}
            </p>

            <p
              v-if="
                showDetails &&
                resource.status === 'error' &&
                resource.message
              "
              class="mt-2 text-sm leading-snug text-red-600 lg:text-[11px]"
            >
              {{ resource.message }}
            </p>
          </div>

          <!-- État -->
          <div
            class="flex shrink-0 flex-col items-center gap-1.5 text-[15px] font-medium sm:text-[16px] lg:flex-row lg:gap-1.5 lg:text-[12px] xl:text-[13px]"
            :class="
              resource.status === 'error'
                ? 'text-red-600'
                : 'text-primary'
            "
          >
            <span
              v-if="resource.status === 'ready'"
              class="grid size-10 place-items-center rounded-full bg-primary text-white sm:size-11 lg:size-7"
            >
              <Check
                :size="24"
                :stroke-width="2.2"
                aria-hidden="true"
                class="sm:size-7 lg:size-[17px]"
              />
            </span>

            <LoaderCircle
              v-else-if="resource.status === 'loading'"
              class="size-10 animate-spin sm:size-11 lg:size-6"
              :stroke-width="2"
              aria-hidden="true"
            />

            <CircleAlert
              v-else-if="resource.status === 'error'"
              class="size-10 sm:size-11 lg:size-6"
              :stroke-width="2"
              aria-hidden="true"
            />

            <Clock3
              v-else
              class="size-10 sm:size-11 lg:size-6"
              :stroke-width="1.8"
              aria-hidden="true"
            />

            <span>
              {{ getStatusLabel(resource.status) }}
            </span>
          </div>
        </article>
      </section>

      <!-- Information hors connexion -->
      <OfflineStatus
        card
        class="mt-6 justify-start sm:mt-7 lg:mt-3.5 xl:mt-4"
        :label="t('offline.noInternetRequired')"
      >
        <p
          class="mt-1.5 text-[16px] leading-snug text-muted sm:text-[18px] lg:mt-0.5 lg:text-[12px] xl:text-[13px]"
        >
          {{ t("offline.preparedOnDevice") }}
        </p>
      </OfflineStatus>

      <!-- Actions -->
      <div class="mt-7 sm:mt-8 lg:mt-4 xl:mt-5">
        <button
          type="button"
          class="mx-auto block h-16 w-[88%] rounded-xl text-[19px] font-semibold transition-colors sm:h-[68px] sm:text-[21px] lg:h-[48px] lg:w-[78%] lg:text-[15px] xl:h-[54px] xl:text-[17px]"
          :class="
            preparationCompleted
              ? 'bg-primary text-white hover:bg-primary-hover'
              : 'bg-disabled text-disabled-text'
          "
          :disabled="!preparationCompleted"
          @click="accessHome"
        >
          {{ t("common.accessHome") }}
        </button>

        <button
          v-if="hasErrors"
          type="button"
          class="mx-auto mt-4 block min-h-12 rounded-lg px-5 py-2 text-[18px] font-medium text-body transition-colors hover:bg-primary-soft sm:text-[19px] lg:mt-1.5 lg:min-h-0 lg:py-1.5 lg:text-[13px] lg:font-normal xl:mt-2 xl:text-[14px]"
          @click="toggleDetails"
        >
          {{
            showDetails
              ? t("common.hideDetails")
              : t("common.showDetails")
          }}
        </button>

        <button
          v-if="hasErrors && !isPreparing"
          type="button"
          class="mx-auto mt-2 flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-2 text-[17px] font-semibold text-primary transition-colors hover:bg-primary-soft lg:min-h-0 lg:text-[13px]"
          @click="startPreparation"
        >
          <RotateCcw
            class="size-5 lg:size-4"
            aria-hidden="true"
          />

          {{ t("common.retry") }}
        </button>
      </div>
    </div>
  </OnboardingShell>
</template>