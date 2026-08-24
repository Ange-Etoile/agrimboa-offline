<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
} from "vue";

import type { Component } from "vue";

import { useI18n } from "vue-i18n";

import { useRouter } from "vue-router";

import {
  Bookmark,
  BookOpen,
  Bug,
  ChevronRight,
  CloudOff,
  GraduationCap,
  Leaf,
  LoaderCircle,
  Mic,
  RefreshCw,
  Search,
  ShieldCheck,
  Sprout,
  Stethoscope,
} from "lucide-vue-next";

import AppLayout from "@/layouts/AppLayout.vue";

import LibraryGuideCard from "@/components/library/LibraryGuideCard.vue";
import LibraryGuideImage from "@/components/library/LibraryGuideImage.vue";

import { useAgriculturalLibraryStore } from "@/stores/agricultural-library.store";

import type {
  LibraryCategory,
  LibraryCrop,
} from "@/features/library/types/library";

interface SpeechRecognitionResultEvent {
  results: ArrayLike<
    ArrayLike<{
      transcript: string;
    }>
  >;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult:
    | ((
        event: SpeechRecognitionResultEvent,
      ) => void)
    | null;
  onerror: (() => void) | null;
  start: () => void;
}

type SpeechRecognitionConstructor =
  new () => SpeechRecognitionInstance;

const router = useRouter();

const store =
  useAgriculturalLibraryStore();

const { t, locale } = useI18n();

const page = ref(1);
const pageSize = 8;

const showResults = computed(() => {
  return (
    store.search.trim().length > 0 ||
    store.crop !== "all" ||
    store.category !== "all" ||
    store.bookmarksOnly
  );
});

const pageCount = computed(() => {
  return Math.max(
    1,
    Math.ceil(
      store.filtered.length /
        pageSize,
    ),
  );
});

const visibleGuides = computed(() => {
  const start =
    (page.value - 1) * pageSize;

  const end =
    page.value * pageSize;

  return store.filtered.slice(
    start,
    end,
  );
});

const crops: Array<{
  id: Exclude<
    LibraryCrop,
    "general"
  >;
  imageKey: string;
}> = [
  {
    id: "maize",
    imageKey: "crop-maize",
  },
  {
    id: "cassava",
    imageKey: "crop-cassava",
  },
  {
    id: "tomato",
    imageKey: "crop-tomato",
  },
  {
    id: "plantain",
    imageKey: "crop-plantain",
  },
];

const categories: Array<{
  id: LibraryCategory;
  icon: Component;
}> = [
  {
    id: "crop",
    icon: Sprout,
  },
  {
    id: "disease",
    icon: Stethoscope,
  },
  {
    id: "deficiency",
    icon: Leaf,
  },
  {
    id: "pest",
    icon: Bug,
  },
  {
    id: "practice",
    icon: GraduationCap,
  },
];

function guideCount(
  crop: LibraryCrop,
): number {
  return store.guides.filter(
    (guide) =>
      guide.crop === crop,
  ).length;
}

function selectCrop(
  crop: LibraryCrop,
): void {
  store.search = "";
  store.crop = crop;
  store.category = "all";
  store.bookmarksOnly = false;
  page.value = 1;
}

function selectCategory(
  category: LibraryCategory,
): void {
  store.search = "";
  store.category = category;
  store.crop = "all";
  store.bookmarksOnly = false;
  page.value = 1;
}

function clearFilters(): void {
  store.search = "";
  store.crop = "all";
  store.category = "all";
  store.bookmarksOnly = false;
  page.value = 1;
}

function showPracticalGuides(): void {
  store.search = "";
  store.crop = "all";
  store.category = "guide";
  store.bookmarksOnly = false;
  page.value = 1;
}

function toggleSavedGuides(): void {
  store.search = "";
  store.crop = "all";
  store.category = "all";
  store.bookmarksOnly =
    !store.bookmarksOnly;

  page.value = 1;
}

function openGuide(
  slug: string,
): void {
  void router.push({
    name: "library-guide",
    params: {
      slug,
    },
  });
}

function startDiagnosis(): void {
  void router.push(
    "/diagnosis/crop",
  );
}

function startVoiceSearch(): void {
  const speechWindow =
    window as typeof window & {
      SpeechRecognition?:
        SpeechRecognitionConstructor;
      webkitSpeechRecognition?:
        SpeechRecognitionConstructor;
    };

  const Recognition =
    speechWindow.SpeechRecognition ??
    speechWindow.webkitSpeechRecognition;

  if (!Recognition) {
    return;
  }

  const recognition =
    new Recognition();

  recognition.lang =
    locale.value === "en"
      ? "en-US"
      : "fr-FR";

  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (
    event,
  ) => {
    const transcript =
      event.results[0]?.[0]
        ?.transcript ?? "";

    store.search =
      transcript.trim();
  };

  recognition.onerror = () => {
    /*
     * La recherche textuelle reste
     * disponible si la reconnaissance
     * vocale échoue.
     */
  };

  recognition.start();
}

async function reloadLibrary(): Promise<void> {
  await store.load(locale.value);
}

watch(
  [
    () => store.search,
    () => store.crop,
    () => store.category,
    () => store.bookmarksOnly,
  ],
  () => {
    page.value = 1;
  },
);

watch(locale, async (value) => {
  await store.load(value);
});

onMounted(async () => {
  await store.load(locale.value);
});
</script>

<template>
  <AppLayout>
    <main
      class="min-h-full bg-surface text-body"
    >
      <!-- Héro -->
      <section
        class="relative h-[355px] overflow-hidden bg-primary lg:h-[355px]"
      >
        <LibraryGuideImage
          image-key="library-hero"
          :alt="
            t('library.heroAlt')
          "
          class="h-full w-full object-cover"
        />

        <div
          class="absolute inset-0 bg-linear-to-r from-brand-950/95 via-brand-900/65 to-transparent"
        ></div>

        <div
          class="absolute inset-0 mx-auto flex w-full max-w-[1480px] flex-col justify-center px-5 py-7 text-white sm:px-8 lg:px-[54px]"
        >
          <p
            class="text-[11px] font-extrabold tracking-[0.08em] uppercase"
          >
            {{
              t(
                "library.eyebrow",
              )
            }}
          </p>

          <h1
            class="mt-2.5 font-display text-[29px] leading-tight font-extrabold sm:text-[34px] lg:text-4xl"
          >
            {{ t("library.title") }}
          </h1>

          <p
            class="mt-3 max-w-[620px] text-xs leading-relaxed text-brand-50 sm:text-sm"
          >
            {{
              t(
                "library.subtitle",
              )
            }}
          </p>

          <!-- Recherche -->
          <div
            class="mt-6 flex h-[54px] w-full max-w-[660px] items-center gap-3 rounded-lg border border-line bg-surface px-2 pl-4 text-body shadow-card"
          >
            <Search
              class="size-5 shrink-0 text-muted"
              aria-hidden="true"
            />

            <input
              v-model="store.search"
              type="search"
              class="min-w-0 flex-1 border-none bg-transparent text-[13px] text-body outline-none placeholder:text-muted"
              :placeholder="
                t(
                  'library.search',
                )
              "
            />

            <button
              type="button"
              class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              :aria-label="
                t(
                  'library.voiceSearch',
                )
              "
              @click="
                startVoiceSearch
              "
            >
              <Mic
                class="size-5"
                aria-hidden="true"
              />
            </button>
          </div>

          <p
            class="mt-3.5 flex items-center gap-2 text-[11px] font-semibold text-brand-50"
          >
            <CloudOff
              class="size-4"
              aria-hidden="true"
            />

            {{
              store.guides.length ||
              48
            }}

            {{
              t(
                "library.offlineSheets",
              )
            }}
          </p>
        </div>
      </section>

      <!-- Contenu -->
      <div
        class="mx-auto w-full max-w-[1480px] px-4 pb-28 sm:px-7 lg:px-[52px] lg:pb-[70px]"
      >
        <!-- Navigation -->
        <nav
          class="flex gap-7 overflow-x-auto border-b border-line sm:gap-10"
          aria-label="Navigation de la bibliothèque"
        >
          <button
            type="button"
            :class="[
              'flex shrink-0 items-center gap-2 border-b-[3px] px-0.5 py-4 text-xs transition-colors',
              !showResults
                ? 'border-primary font-bold text-primary'
                : 'border-transparent text-muted hover:text-primary',
            ]"
            @click="clearFilters"
          >
            {{
              t("library.explore")
            }}
          </button>

          <button
            type="button"
            :class="[
              'flex shrink-0 items-center gap-2 border-b-[3px] px-0.5 py-4 text-xs transition-colors',
              store.category ===
              'crop'
                ? 'border-primary font-bold text-primary'
                : 'border-transparent text-muted hover:text-primary',
            ]"
            @click="
              selectCategory('crop')
            "
          >
            {{ t("library.crops") }}
          </button>

          <button
            type="button"
            :class="[
              'flex shrink-0 items-center gap-2 border-b-[3px] px-0.5 py-4 text-xs transition-colors',
              store.category ===
              'disease'
                ? 'border-primary font-bold text-primary'
                : 'border-transparent text-muted hover:text-primary',
            ]"
            @click="
              selectCategory(
                'disease',
              )
            "
          >
            {{
              t(
                "library.problems",
              )
            }}
          </button>

          <button
            type="button"
            :class="[
              'flex shrink-0 items-center gap-2 border-b-[3px] px-0.5 py-4 text-xs transition-colors',
              store.category ===
              'guide'
                ? 'border-primary font-bold text-primary'
                : 'border-transparent text-muted hover:text-primary',
            ]"
            @click="
              showPracticalGuides
            "
          >
            {{ t("library.guides") }}
          </button>

          <button
            type="button"
            :class="[
              'flex shrink-0 items-center gap-2 border-b-[3px] px-0.5 py-4 text-xs transition-colors',
              store.bookmarksOnly
                ? 'border-primary font-bold text-primary'
                : 'border-transparent text-muted hover:text-primary',
            ]"
            @click="
              toggleSavedGuides
            "
          >
            <Bookmark
              class="size-4"
              aria-hidden="true"
            />

            {{ t("library.saved") }}
          </button>
        </nav>

        <!-- Chargement -->
        <section
          v-if="store.loading"
          class="grid min-h-[280px] place-items-center py-12"
        >
          <div
            class="flex flex-col items-center gap-3 text-center text-muted"
          >
            <LoaderCircle
              class="size-8 animate-spin text-primary"
              aria-hidden="true"
            />

            <p class="text-xs">
              {{
                t(
                  "library.loading",
                )
              }}
            </p>
          </div>
        </section>

        <!-- Erreur -->
        <section
          v-else-if="store.error"
          class="my-7 flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-card border border-sun-200 bg-sun-50 p-8 text-center shadow-card"
        >
          <BookOpen
            class="size-9 text-sun-700"
            aria-hidden="true"
          />

          <div>
            <h2
              class="font-display text-lg font-extrabold text-heading"
            >
              {{
                t(
                  "library.loadingError",
                )
              }}
            </h2>

            <p
              class="mt-2 max-w-lg text-xs leading-relaxed text-sun-800"
            >
              {{ store.error }}
            </p>
          </div>

          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-sun-600 bg-surface px-4 py-2.5 text-xs font-bold text-sun-700 transition-colors hover:bg-sun-100"
            @click="reloadLibrary"
          >
            <RefreshCw
              class="size-4"
              aria-hidden="true"
            />

            {{ t("library.retry") }}
          </button>
        </section>

        <!-- Accueil de la bibliothèque -->
        <template
          v-else-if="!showResults"
        >
          <!-- Catégories -->
          <section>
            <header
              class="my-8 flex items-end justify-between"
            >
              <div>
                <p
                  class="text-[11px] font-extrabold tracking-[0.08em] text-primary uppercase"
                >
                  {{
                    t(
                      "library.findQuickly",
                    )
                  }}
                </p>

                <h2
                  class="mt-1.5 font-display text-xl font-extrabold text-heading sm:text-2xl"
                >
                  {{
                    t(
                      "library.whatLooking",
                    )
                  }}
                </h2>
              </div>

              <p
                class="hidden text-[11px] text-muted sm:block"
              >
                {{
                  t(
                    "library.availableOffline",
                  )
                }}
              </p>
            </header>

            <div
              class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
            >
              <button
                v-for="category in categories"
                :key="category.id"
                type="button"
                class="group flex min-h-28 items-center gap-3 rounded-xl border border-line bg-surface p-4 text-left transition hover:-translate-y-0.5 hover:border-primary hover:shadow-card"
                @click="
                  selectCategory(
                    category.id,
                  )
                "
              >
                <span
                  class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white"
                >
                  <component
                    :is="
                      category.icon
                    "
                    class="size-5"
                  />
                </span>

                <span
                  class="min-w-0 flex-1"
                >
                  <strong
                    class="block text-[13px] font-extrabold text-heading"
                  >
                    {{
                      t(
                        `library.categories.${category.id}`,
                      )
                    }}
                  </strong>

                  <span
                    class="mt-1 block text-[10px] leading-snug text-muted"
                  >
                    {{
                      t(
                        `library.categoryDescriptions.${category.id}`,
                      )
                    }}
                  </span>
                </span>

                <ChevronRight
                  class="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary"
                  aria-hidden="true"
                />
              </button>
            </div>
          </section>

          <!-- Cultures -->
          <section class="mt-10">
            <header>
              <p
                class="text-[11px] font-extrabold tracking-[0.08em] text-primary uppercase"
              >
                {{ t("library.byCrop") }}
              </p>

              <h2
                class="mt-1.5 font-display text-xl font-extrabold text-heading sm:text-2xl"
              >
                {{
                  t(
                    "library.popularCrops",
                  )
                }}
              </h2>
            </header>

            <div
              class="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
            >
              <button
                v-for="crop in crops"
                :key="crop.id"
                type="button"
                class="group overflow-hidden rounded-xl border border-line bg-surface text-left transition hover:-translate-y-0.5 hover:border-primary hover:shadow-card"
                @click="
                  selectCrop(crop.id)
                "
              >
                <LibraryGuideImage
                  :image-key="
                    crop.imageKey
                  "
                  :alt="
                    t(
                      `library.cropNames.${crop.id}`,
                    )
                  "
                  class="h-28 w-full object-cover sm:h-36"
                />

                <span
                  class="block p-3.5"
                >
                  <strong
                    class="block font-display text-sm font-extrabold text-heading sm:text-base"
                  >
                    {{
                      t(
                        `library.cropNames.${crop.id}`,
                      )
                    }}
                  </strong>

                  <span
                    class="mt-1 block min-h-10 text-[10px] leading-relaxed text-muted"
                  >
                    {{
                      t(
                        `library.cropDescriptions.${crop.id}`,
                      )
                    }}
                  </span>

                  <span
                    class="mt-2.5 flex items-center justify-between text-[11px] font-bold text-primary"
                  >
                    <span>
                      {{
                        guideCount(
                          crop.id,
                        )
                      }}

                      {{
                        t(
                          "library.sheets",
                        )
                      }}
                    </span>

                    <ChevronRight
                      class="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </button>
            </div>
          </section>

          <!-- Recommandations -->
          <section class="mt-10">
            <header
              class="flex items-end justify-between"
            >
              <div>
                <p
                  class="text-[11px] font-extrabold tracking-[0.08em] text-primary uppercase"
                >
                  {{
                    t(
                      "library.recommended",
                    )
                  }}
                </p>

                <h2
                  class="mt-1.5 font-display text-xl font-extrabold text-heading sm:text-2xl"
                >
                  {{
                    t(
                      "library.usefulNow",
                    )
                  }}
                </h2>
              </div>

              <button
                type="button"
                class="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
                @click="
                  showPracticalGuides
                "
              >
                {{ t("library.seeAll") }}

                <ChevronRight
                  class="size-4"
                  aria-hidden="true"
                />
              </button>
            </header>

            <div
              v-if="
                store.recommended.length
              "
              class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              <LibraryGuideCard
                v-for="guide in store.recommended"
                :key="guide.id"
                :guide="guide"
                @open="
                  openGuide(
                    guide.slug,
                  )
                "
                @bookmark="
                  store.toggle(guide)
                "
              />
            </div>

            <div
              v-else
              class="mt-5 rounded-card border border-line bg-surface-soft p-8 text-center text-xs text-muted"
            >
              {{
                t(
                  "library.noRecommendations",
                )
              }}
            </div>
          </section>

          <!-- Hors ligne et reprise -->
          <div
            class="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.25fr]"
          >
            <section
              class="flex items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-card"
            >
              <span
                class="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"
              >
                <ShieldCheck
                  class="size-6"
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2
                  class="text-sm font-extrabold text-heading"
                >
                  {{
                    t(
                      "library.offlineTitle",
                    )
                  }}
                </h2>

                <p
                  class="mt-1 text-[11px] leading-relaxed text-muted"
                >
                  {{
                    t(
                      "library.offlineText",
                      {
                        count:
                          store.guides
                            .length ||
                          48,
                      },
                    )
                  }}
                </p>

                <button
                  type="button"
                  class="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
                >
                  {{
                    t(
                      "library.manageContent",
                    )
                  }}

                  <ChevronRight
                    class="size-4"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </section>

            <section
              v-if="store.resume"
              class="flex items-center gap-4 rounded-card border border-line bg-surface p-5 shadow-card"
            >
              <LibraryGuideImage
                :image-key="
                  store.resume.imageKey
                "
                :alt="
                  store.resume.title
                "
                class="size-24 shrink-0 rounded-xl object-cover"
              />

              <div
                class="min-w-0 flex-1"
              >
                <p
                  class="text-[10px] font-extrabold text-primary uppercase"
                >
                  {{
                    t(
                      "library.continueReading",
                    )
                  }}
                </p>

                <h3
                  class="mt-1 truncate text-sm font-extrabold text-heading"
                >
                  {{ store.resume.title }}
                </h3>

                <div
                  class="mt-2.5 h-1.5 overflow-hidden rounded-full bg-disabled"
                >
                  <div
                    class="h-full rounded-full bg-primary"
                    :style="{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          store.resume
                            .progress,
                        ),
                      )}%`,
                    }"
                  ></div>
                </div>

                <button
                  type="button"
                  class="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
                  @click="
                    openGuide(
                      store.resume
                        .slug,
                    )
                  "
                >
                  {{ t("library.resume") }}

                  <ChevronRight
                    class="size-4"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </section>
          </div>

          <!-- Diagnostic -->
          <section
            class="mt-6 flex flex-col items-start justify-between gap-5 rounded-card bg-brand-950 p-6 text-white shadow-card sm:flex-row sm:items-center"
          >
            <div
              class="flex items-center gap-4"
            >
              <span
                class="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-800"
              >
                <Stethoscope
                  class="size-6"
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2
                  class="font-display text-base font-extrabold"
                >
                  {{
                    t(
                      "library.needHelp",
                    )
                  }}
                </h2>

                <p
                  class="mt-1 text-[11px] leading-relaxed text-brand-100"
                >
                  {{
                    t(
                      "library.diagnosisText",
                    )
                  }}
                </p>
              </div>
            </div>

            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-surface px-5 py-3 text-[11px] font-extrabold text-primary transition-colors hover:bg-primary-soft sm:w-auto"
              @click="startDiagnosis"
            >
              {{
                t(
                  "library.startDiagnosis",
                )
              }}

              <ChevronRight
                class="size-4"
                aria-hidden="true"
              />
            </button>
          </section>
        </template>

        <!-- Résultats filtrés -->
        <section
          v-else
          class="pt-6"
        >
          <header
            class="flex items-start justify-between gap-5"
          >
            <div>
              <p
                class="text-[11px] font-extrabold tracking-[0.08em] text-primary uppercase"
              >
                {{ t("library.results") }}
              </p>

              <h2
                class="mt-1 font-display text-xl font-extrabold text-heading sm:text-2xl"
              >
                {{ store.filtered.length }}

                {{
                  t(
                    "library.sheetsFound",
                  )
                }}
              </h2>
            </div>

            <button
              type="button"
              class="text-xs font-bold text-primary hover:underline"
              @click="clearFilters"
            >
              {{
                t(
                  "library.clearFilters",
                )
              }}
            </button>
          </header>

          <div
            v-if="
              !visibleGuides.length
            "
            class="mt-6 flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-card border border-line bg-surface-soft p-8 text-center"
          >
            <BookOpen
              class="size-8 text-muted"
              aria-hidden="true"
            />

            <p
              class="text-xs text-muted"
            >
              {{
                t(
                  "library.noResults",
                )
              }}
            </p>
          </div>

          <div
            v-else
            class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <LibraryGuideCard
              v-for="guide in visibleGuides"
              :key="guide.id"
              :guide="guide"
              @open="
                openGuide(guide.slug)
              "
              @bookmark="
                store.toggle(guide)
              "
            />
          </div>

          <!-- Pagination -->
          <footer
            v-if="pageCount > 1"
            class="mt-6 flex justify-center gap-2"
          >
            <button
              v-for="pageNumber in pageCount"
              :key="pageNumber"
              type="button"
              :class="[
                'grid size-10 place-items-center rounded-lg border text-xs font-bold transition-colors',
                page === pageNumber
                  ? 'border-primary bg-primary text-white'
                  : 'border-line bg-surface text-body hover:border-primary hover:text-primary',
              ]"
              @click="
                page = pageNumber
              "
            >
              {{ pageNumber }}
            </button>
          </footer>
        </section>
      </div>
    </main>
  </AppLayout>
</template>