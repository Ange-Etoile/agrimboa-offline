<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
} from "vue";

import { useI18n } from "vue-i18n";

import {
  useRoute,
  useRouter,
} from "vue-router";

import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Headphones,
  Leaf,
  LoaderCircle,
  RefreshCw,
  ShieldAlert,
  Sprout,
  VolumeX,
} from "lucide-vue-next";

import AppLayout from "@/layouts/AppLayout.vue";

import { useAgriculturalLibraryStore } from "@/stores/agricultural-library.store";

import potassiumHero from "@/assets/images/library/potassium-hero.webp";
import potassiumStages from "@/assets/images/library/potassium-stages.webp";
import potassiumImportance from "@/assets/images/library/potassium-importance.webp";

type GuideTab =
  | "overview"
  | "symptoms"
  | "causes"
  | "actions"
  | "prevention";

const route = useRoute();
const router = useRouter();

const store =
  useAgriculturalLibraryStore();

const { t, locale } = useI18n();

const activeTab =
  ref<GuideTab>("overview");

const speaking = ref(false);

const tabs: GuideTab[] = [
  "overview",
  "symptoms",
  "causes",
  "actions",
  "prevention",
];

const guide = computed(() => {
  const slug = route.params.slug;

  if (typeof slug !== "string") {
    return null;
  }

  return (
    store.guides.find(
      (item) =>
        item.slug === slug,
    ) ?? null
  );
});

const symptoms = computed(() => {
  return (
    guide.value?.content
      .symptoms ?? []
  );
});

const confusions = computed(() => {
  return (
    guide.value?.content
      .confusions ?? []
  );
});

const actions = computed(() => {
  return (
    guide.value?.content.actions ??
    []
  );
});

const prevention = computed(() => {
  return (
    guide.value?.content
      .prevention ?? []
  );
});

const activeContent = computed(() => {
  switch (activeTab.value) {
    case "symptoms":
      return symptoms.value;

    case "causes":
      return confusions.value;

    case "actions":
      return actions.value;

    case "prevention":
      return prevention.value;

    default:
      return [];
  }
});

const confusionText = computed(() => {
  if (!confusions.value.length) {
    return t(
      "library.noConfusionInformation",
    );
  }

  return confusions.value.join(
    " · ",
  );
});

function goBack(): void {
  void router.push({
    name: "library",
  });
}

function startDiagnosis(): void {
  void router.push(
    "/diagnosis/crop",
  );
}

function stopSpeaking(): void {
  if (
    "speechSynthesis" in window
  ) {
    window.speechSynthesis.cancel();
  }

  speaking.value = false;
}

function toggleListening(): void {
  if (!guide.value) {
    return;
  }

  if (
    !(
      "speechSynthesis" in
      window
    )
  ) {
    return;
  }

  if (speaking.value) {
    stopSpeaking();

    return;
  }

  window.speechSynthesis.cancel();

  const text = [
    guide.value.title,
    guide.value.summary,
    ...symptoms.value,
    ...actions.value,
  ]
    .filter(Boolean)
    .join(". ");

  const utterance =
    new SpeechSynthesisUtterance(
      text,
    );

  utterance.lang =
    locale.value === "en"
      ? "en-US"
      : "fr-FR";

  utterance.rate = 0.95;
  utterance.pitch = 1;

  utterance.onend = () => {
    speaking.value = false;
  };

  utterance.onerror = () => {
    speaking.value = false;
  };

  speaking.value = true;

  window.speechSynthesis.speak(
    utterance,
  );
}

function printGuide(): void {
  window.print();
}

async function toggleBookmark(): Promise<void> {
  if (!guide.value) {
    return;
  }

  await store.toggle(guide.value);
}

async function loadGuide(): Promise<void> {
  if (!store.guides.length) {
    await store.load(
      locale.value,
    );
  }

  if (guide.value) {
    await store.progress(
      guide.value,
      Math.max(
        guide.value.progress,
        40,
      ),
    );
  }
}

watch(locale, async (value) => {
  stopSpeaking();

  await store.load(value);

  if (guide.value) {
    await store.progress(
      guide.value,
      Math.max(
        guide.value.progress,
        40,
      ),
    );
  }
});

watch(
  () => route.params.slug,
  async () => {
    activeTab.value = "overview";
    stopSpeaking();

    await loadGuide();
  },
);

onMounted(async () => {
  await loadGuide();
});
</script>

<template>
  <AppLayout>
    <!-- Chargement -->
    <main
      v-if="store.loading"
      class="grid min-h-[60vh] place-items-center bg-surface px-5 py-16"
    >
      <div
        class="flex flex-col items-center gap-3 text-center"
      >
        <LoaderCircle
          class="size-9 animate-spin text-primary"
          aria-hidden="true"
        />

        <p
          class="text-xs text-muted"
        >
          {{
            t("library.loading")
          }}
        </p>
      </div>
    </main>

    <!-- Fiche disponible -->
    <main
      v-else-if="guide"
      class="mx-auto w-full max-w-[1380px] bg-surface px-4 pt-5 pb-24 text-body sm:px-7 lg:px-11 lg:pt-6 lg:pb-20"
    >
      <!-- Fil d’Ariane -->
      <nav
        class="flex items-center gap-2 overflow-hidden text-[11px] text-muted print:hidden"
        aria-label="Fil d’Ariane"
      >
        <button
          type="button"
          class="flex shrink-0 items-center gap-1.5 font-semibold text-primary transition-colors hover:text-primary-hover"
          @click="goBack"
        >
          <ArrowLeft
            class="size-3.5"
            aria-hidden="true"
          />

          {{ t("library.title") }}
        </button>

        <ChevronRight
          class="hidden size-3.5 shrink-0 text-muted-soft sm:block"
          aria-hidden="true"
        />

        <span
          class="hidden shrink-0 sm:block"
        >
          {{
            t(
              `library.cropNames.${guide.crop}`,
            )
          }}
        </span>

        <ChevronRight
          class="hidden size-3.5 shrink-0 text-muted-soft sm:block"
          aria-hidden="true"
        />

        <strong
          class="hidden truncate text-body sm:block"
        >
          {{ guide.title }}
        </strong>
      </nav>

      <!-- En-tête -->
      <header
        class="mt-6 grid grid-cols-1 items-center gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:gap-9"
      >
        <div>
          <p
            class="text-[11px] font-extrabold tracking-[0.06em] text-primary uppercase"
          >
            {{
              t(
                `library.categories.${guide.category}`,
              )
            }}

            <span
              class="mx-1.5 text-muted-soft"
            >
              ·
            </span>

            {{
              t(
                `library.cropNames.${guide.crop}`,
              )
            }}
          </p>

          <h1
            class="mt-2.5 font-display text-[28px] leading-tight font-extrabold text-heading sm:text-[32px] lg:text-[34px]"
          >
            {{ guide.title }}
          </h1>

          <p
            class="mt-3 max-w-[680px] text-xs leading-relaxed text-muted sm:text-sm sm:leading-7"
          >
            {{ guide.summary }}
          </p>

          <!-- Métadonnées -->
          <div
            class="mt-5 flex flex-wrap gap-2.5"
          >
            <span
              class="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-2 text-[10px] font-semibold text-primary"
            >
              <Clock3
                class="size-3.5"
                aria-hidden="true"
              />

              {{
                guide.readingMinutes
              }}

              {{
                t(
                  "library.minutes",
                )
              }}
            </span>

            <span
              class="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-2 text-[10px] font-semibold text-primary"
            >
              <CheckCircle2
                class="size-3.5"
                aria-hidden="true"
              />

              {{
                t(
                  "library.verifiedContent",
                )
              }}
            </span>

            <span
              class="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-2 text-[10px] font-semibold text-primary"
            >
              <Download
                class="size-3.5"
                aria-hidden="true"
              />

              {{
                t(
                  "library.availableOffline",
                )
              }}
            </span>
          </div>
        </div>

        <img
          :src="potassiumHero"
          :alt="guide.title"
          class="order-first h-[220px] w-full rounded-card object-cover shadow-card lg:order-last lg:h-[260px]"
        />
      </header>

      <!-- Actions -->
      <div
        class="mt-6 grid grid-cols-2 gap-2.5 sm:flex print:hidden"
      >
        <button
          type="button"
          class="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-primary bg-surface px-4 py-3 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:col-span-1"
          @click="toggleListening"
        >
          <VolumeX
            v-if="speaking"
            class="size-[17px]"
            aria-hidden="true"
          />

          <Headphones
            v-else
            class="size-[17px]"
            aria-hidden="true"
          />

          {{
            speaking
              ? t(
                  "library.stopListening",
                )
              : t("library.listen")
          }}
        </button>

        <button
          type="button"
          :class="[
            'flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[11px] font-semibold transition-colors',
            guide.bookmarked
              ? 'border-primary bg-primary-soft text-primary'
              : 'border-line-strong bg-surface text-body hover:border-primary hover:text-primary',
          ]"
          @click="toggleBookmark"
        >
          <Bookmark
            class="size-[17px]"
            :class="{
              'fill-current':
                guide.bookmarked,
            }"
            aria-hidden="true"
          />

          {{
            guide.bookmarked
              ? t("library.saved")
              : t("library.save")
          }}
        </button>

        <button
          type="button"
          class="flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 py-3 text-[11px] font-semibold text-body transition-colors hover:border-primary hover:text-primary"
          @click="printGuide"
        >
          <Download
            class="size-[17px]"
            aria-hidden="true"
          />

          {{
            t(
              "library.downloadPdf",
            )
          }}
        </button>
      </div>

      <!-- Onglets -->
      <nav
        class="mt-7 flex gap-7 overflow-x-auto border-b border-line sm:gap-9 print:hidden"
        aria-label="Contenu de la fiche"
      >
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          :class="[
            'shrink-0 border-b-[3px] px-0.5 py-4 text-xs transition-colors',
            activeTab === tab
              ? 'border-primary font-extrabold text-primary'
              : 'border-transparent text-muted hover:text-primary',
          ]"
          @click="
            activeTab = tab
          "
        >
          {{
            t(
              `library.detailTabs.${tab}`,
            )
          }}
        </button>
      </nav>

      <!-- Article -->
      <div
        class="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_330px]"
      >
        <article
          class="grid min-w-0 content-start gap-6"
        >
          <!-- Vue d’ensemble -->
          <section
            v-if="
              activeTab ===
              'overview'
            "
          >
            <h2
              class="font-display text-lg font-extrabold text-heading sm:text-xl"
            >
              {{
                t(
                  "library.recognizeTitle",
                )
              }}
            </h2>

            <p
              class="mt-2.5 text-xs leading-7 text-muted sm:text-[13px]"
            >
              {{
                t(
                  "library.recognizeText",
                )
              }}
            </p>

            <img
              :src="potassiumStages"
              :alt="
                t(
                  'library.recognizeTitle',
                )
              "
              class="mt-5 h-[210px] w-full rounded-card object-cover shadow-card sm:h-[235px]"
            />

            <!-- Étapes -->
            <div
              class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <div
                class="flex gap-2.5 rounded-xl border border-line bg-surface p-3.5"
              >
                <strong
                  class="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-extrabold text-white"
                >
                  1
                </strong>

                <span
                  class="text-[10px] leading-relaxed text-muted"
                >
                  <strong
                    class="block text-[11px] text-heading"
                  >
                    {{
                      t(
                        "library.stageEarly",
                      )
                    }}
                  </strong>

                  {{
                    t(
                      "library.stageEarlyText",
                    )
                  }}
                </span>
              </div>

              <div
                class="flex gap-2.5 rounded-xl border border-line bg-surface p-3.5"
              >
                <strong
                  class="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-extrabold text-white"
                >
                  2
                </strong>

                <span
                  class="text-[10px] leading-relaxed text-muted"
                >
                  <strong
                    class="block text-[11px] text-heading"
                  >
                    {{
                      t(
                        "library.stageAdvanced",
                      )
                    }}
                  </strong>

                  {{
                    t(
                      "library.stageAdvancedText",
                    )
                  }}
                </span>
              </div>

              <div
                class="flex gap-2.5 rounded-xl border border-line bg-surface p-3.5"
              >
                <strong
                  class="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-extrabold text-white"
                >
                  3
                </strong>

                <span
                  class="text-[10px] leading-relaxed text-muted"
                >
                  <strong
                    class="block text-[11px] text-heading"
                  >
                    {{
                      t(
                        "library.stagePlant",
                      )
                    }}
                  </strong>

                  {{
                    t(
                      "library.stagePlantText",
                    )
                  }}
                </span>
              </div>
            </div>
          </section>

          <!-- Autres onglets -->
          <section
            v-else
            class="rounded-card border border-line bg-surface p-5 shadow-card"
          >
            <h2
              class="font-display text-lg font-extrabold text-heading"
            >
              {{
                t(
                  `library.detailTabs.${activeTab}`,
                )
              }}
            </h2>

            <ul
              v-if="
                activeContent.length
              "
              class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <li
                v-for="item in activeContent"
                :key="item"
                class="flex items-start gap-2.5 text-[11px] leading-relaxed text-body"
              >
                <CheckCircle2
                  class="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />

                {{ item }}
              </li>
            </ul>

            <p
              v-else
              class="mt-4 text-xs text-muted"
            >
              {{
                t(
                  "library.noSectionInformation",
                )
              }}
            </p>
          </section>

          <!-- Signes -->
          <section
            class="rounded-card border border-line bg-surface p-5 shadow-card"
          >
            <h2
              class="flex items-center gap-2.5 font-display text-lg font-extrabold text-heading"
            >
              <Leaf
                class="size-5 text-primary"
                aria-hidden="true"
              />

              {{
                t(
                  "library.frequentSigns",
                )
              }}
            </h2>

            <ul
              v-if="symptoms.length"
              class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <li
                v-for="item in symptoms"
                :key="item"
                class="flex items-start gap-2.5 text-[11px] leading-relaxed text-body"
              >
                <CheckCircle2
                  class="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />

                {{ item }}
              </li>
            </ul>

            <p
              v-else
              class="mt-4 text-xs text-muted"
            >
              {{
                t(
                  "library.noSectionInformation",
                )
              }}
            </p>
          </section>

          <!-- Avertissement -->
          <section
            class="flex items-start gap-3.5 rounded-card border border-sun-300 bg-sun-50 p-5"
          >
            <AlertTriangle
              class="size-6 shrink-0 text-sun-700"
              aria-hidden="true"
            />

            <div>
              <h2
                class="text-sm font-extrabold text-sun-900"
              >
                {{
                  t(
                    "library.doNotConfuse",
                  )
                }}
              </h2>

              <p
                class="mt-1.5 text-[11px] leading-relaxed text-sun-800"
              >
                {{ confusionText }}
              </p>
            </div>
          </section>

          <!-- Importance -->
          <section
            class="grid overflow-hidden rounded-card bg-surface-soft shadow-card sm:grid-cols-[220px_1fr]"
          >
            <img
              :src="
                potassiumImportance
              "
              alt=""
              class="h-[190px] w-full object-cover sm:h-full"
            />

            <div
              class="flex flex-col justify-center p-5 sm:p-6"
            >
              <p
                class="text-[10px] font-extrabold tracking-[0.06em] text-primary uppercase"
              >
                {{
                  t(
                    "library.whyImportant",
                  )
                }}
              </p>

              <h2
                class="mt-1.5 font-display text-lg font-extrabold text-heading"
              >
                {{
                  t(
                    "library.potassiumRole",
                  )
                }}
              </h2>

              <p
                class="mt-2 text-[11px] leading-relaxed text-muted"
              >
                {{
                  t(
                    "library.potassiumText",
                  )
                }}
              </p>
            </div>
          </section>
        </article>

        <!-- Colonne latérale -->
        <aside
          class="grid content-start gap-4"
        >
          <section
            class="rounded-card border border-line bg-surface p-5 shadow-card"
          >
            <h2
              class="flex items-center gap-2.5 text-sm font-extrabold text-heading"
            >
              <ShieldAlert
                class="size-5 text-primary"
                aria-hidden="true"
              />

              {{
                t(
                  "library.beforeActing",
                )
              }}
            </h2>

            <p
              class="mt-2.5 text-[11px] leading-relaxed text-muted"
            >
              {{
                t(
                  "library.beforeActingText",
                )
              }}
            </p>

            <ul
              v-if="actions.length"
              class="mt-4 grid gap-2.5"
            >
              <li
                v-for="item in actions"
                :key="item"
                class="flex items-start gap-2 text-[10px] leading-relaxed text-body"
              >
                <CheckCircle2
                  class="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />

                {{ item }}
              </li>
            </ul>
          </section>

          <section
            class="rounded-card border border-brand-200 bg-primary-subtle p-5 shadow-card"
          >
            <h2
              class="font-display text-sm font-extrabold text-heading"
            >
              {{
                t(
                  "library.inSummary",
                )
              }}
            </h2>

            <p
              class="mt-2.5 text-[11px] leading-relaxed text-muted"
            >
              {{ guide.summary }}
            </p>

            <p
              class="mt-3 text-[10px] font-semibold text-primary"
            >
              {{
                t(
                  "library.updatedLocally",
                )
              }}
            </p>
          </section>

          <button
            type="button"
            class="flex items-center gap-3 rounded-card bg-primary p-4 text-left text-white shadow-card transition-colors hover:bg-primary-hover print:hidden"
            @click="startDiagnosis"
          >
            <Sprout
              class="size-7 shrink-0"
              aria-hidden="true"
            />

            <span
              class="min-w-0 flex-1 text-[10px]"
            >
              <strong
                class="block text-xs font-extrabold"
              >
                {{
                  t(
                    "library.needPersonalized",
                  )
                }}
              </strong>

              {{
                t(
                  "library.startDiagnosis",
                )
              }}
            </span>

            <ChevronRight
              class="size-4 shrink-0"
              aria-hidden="true"
            />
          </button>
        </aside>
      </div>

      <!-- Retour -->
      <footer
        class="mt-8 border-t border-line pt-5 print:hidden"
      >
        <button
          type="button"
          class="flex items-center gap-2 text-[11px] font-bold text-primary transition-colors hover:text-primary-hover"
          @click="goBack"
        >
          <ArrowLeft
            class="size-4"
            aria-hidden="true"
          />

          {{
            t(
              "library.backToLibrary",
            )
          }}
        </button>
      </footer>
    </main>

    <!-- Fiche absente ou erreur -->
    <main
      v-else
      class="grid min-h-[60vh] place-items-center bg-surface px-5 py-16"
    >
      <section
        class="flex max-w-lg flex-col items-center gap-4 rounded-card border border-line bg-surface p-8 text-center shadow-card"
      >
        <BookOpen
          class="size-10 text-muted"
          aria-hidden="true"
        />

        <div>
          <h1
            class="font-display text-xl font-extrabold text-heading"
          >
            {{
              store.error
                ? t(
                    "library.loadingError",
                  )
                : t(
                    "library.guideNotFound",
                  )
            }}
          </h1>

          <p
            class="mt-2 text-xs leading-relaxed text-muted"
          >
            {{
              store.error ??
              t(
                "library.guideNotFoundText",
              )
            }}
          </p>
        </div>

        <div
          class="flex flex-wrap justify-center gap-2.5"
        >
          <button
            v-if="store.error"
            type="button"
            class="flex items-center gap-2 rounded-lg border border-primary bg-surface px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary-soft"
            @click="loadGuide"
          >
            <RefreshCw
              class="size-4"
              aria-hidden="true"
            />

            {{ t("library.retry") }}
          </button>

          <button
            type="button"
            class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover"
            @click="goBack"
          >
            <ArrowLeft
              class="size-4"
              aria-hidden="true"
            />

            {{
              t(
                "library.backToLibrary",
              )
            }}
          </button>
        </div>
      </section>
    </main>
  </AppLayout>
</template>