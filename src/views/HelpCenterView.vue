<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  BookOpen,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  CloudDownload,
  LockKeyhole,
  Mail,
  MessageSquareText,
  Mic,
  Minus,
  Plus,
  Search,
  TriangleAlert,
} from "lucide-vue-next";

import AppLayout from "@/layouts/AppLayout.vue";
import helpHero from "@/assets/images/help/help-center-hero.webp";

interface HelpTopic {
  id: "discover" | "diagnosis" | "calculators" | "offline";
  icon: typeof BookOpen;
  route: string;
}

interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

interface QuickGuide {
  id: string;
  titleKey: string;
  duration: number;
  route: string;
}

const { t, locale } = useI18n();
const router = useRouter();

const search = ref("");
const activeFaq = ref("offline");
const listening = ref(false);
const lastCheck = ref(new Date());
let recognition: { start: () => void; stop: () => void } | null = null;

const topics: HelpTopic[] = [
  { id: "discover", icon: BookOpen, route: "/home" },
  { id: "diagnosis", icon: ClipboardCheck, route: "/diagnosis/crop" },
  { id: "calculators", icon: Calculator, route: "/calculators" },
  { id: "offline", icon: CloudDownload, route: "/preparation" },
];

const faqs: FaqItem[] = [
  {
    id: "offline",
    questionKey: "help.faq.offline.question",
    answerKey: "help.faq.offline.answer",
  },
  {
    id: "voice",
    questionKey: "help.faq.voice.question",
    answerKey: "help.faq.voice.answer",
  },
  {
    id: "skip",
    questionKey: "help.faq.skip.question",
    answerKey: "help.faq.skip.answer",
  },
  {
    id: "crop",
    questionKey: "help.faq.crop.question",
    answerKey: "help.faq.crop.answer",
  },
  {
    id: "history",
    questionKey: "help.faq.history.question",
    answerKey: "help.faq.history.answer",
  },
  {
    id: "export",
    questionKey: "help.faq.export.question",
    answerKey: "help.faq.export.answer",
  },
];

const guides: QuickGuide[] = [
  { id: "start", titleKey: "help.guides.start", duration: 3, route: "/home" },
  {
    id: "diagnosis",
    titleKey: "help.guides.diagnosis",
    duration: 5,
    route: "/diagnosis/crop",
  },
  {
    id: "offline",
    titleKey: "help.guides.offline",
    duration: 2,
    route: "/library",
  },
  {
    id: "results",
    titleKey: "help.guides.results",
    duration: 4,
    route: "/history",
  },
];

const normalizedSearch = computed(() => search.value.trim().toLocaleLowerCase());

const visibleFaqs = computed(() => {
  if (!normalizedSearch.value) return faqs;

  return faqs.filter((faq) =>
    `${t(faq.questionKey)} ${t(faq.answerKey)}`
      .toLocaleLowerCase()
      .includes(normalizedSearch.value),
  );
});

const visibleGuides = computed(() => {
  if (!normalizedSearch.value) return guides;

  return guides.filter((guide) =>
    t(guide.titleKey).toLocaleLowerCase().includes(normalizedSearch.value),
  );
});

const formattedCheckTime = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(lastCheck.value),
);

function toggleFaq(id: string): void {
  activeFaq.value = activeFaq.value === id ? "" : id;
}

function startVoiceSearch(): void {
  const SpeechRecognition = (
    window as typeof window & {
      SpeechRecognition?: new () => {
        lang: string;
        continuous: boolean;
        interimResults: boolean;
        onresult: (event: {
          results: ArrayLike<{ 0: { transcript: string } }>;
        }) => void;
        onend: () => void;
        onerror: () => void;
        start: () => void;
        stop: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        continuous: boolean;
        interimResults: boolean;
        onresult: (event: {
          results: ArrayLike<{ 0: { transcript: string } }>;
        }) => void;
        onend: () => void;
        onerror: () => void;
        start: () => void;
        stop: () => void;
      };
    }
  ).SpeechRecognition ??
    (
      window as typeof window & {
        webkitSpeechRecognition?: new () => {
          lang: string;
          continuous: boolean;
          interimResults: boolean;
          onresult: (event: {
            results: ArrayLike<{ 0: { transcript: string } }>;
          }) => void;
          onend: () => void;
          onerror: () => void;
          start: () => void;
          stop: () => void;
        };
      }
    ).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    search.value = t("help.voiceUnavailable");
    return;
  }

  const instance = new SpeechRecognition();
  instance.lang = locale.value === "en" ? "en-US" : "fr-FR";
  instance.continuous = false;
  instance.interimResults = false;
  instance.onresult = (event) => {
    search.value = event.results[0]?.[0]?.transcript ?? "";
  };
  instance.onend = () => {
    listening.value = false;
  };
  instance.onerror = () => {
    listening.value = false;
  };

  recognition = instance;
  listening.value = true;
  instance.start();
}

function verifyStorage(): void {
  localStorage.setItem("agrimboa.storage.last-check", new Date().toISOString());
  lastCheck.value = new Date();
}

function contact(subject: string): void {
  window.location.href = `mailto:support@agrimboa.cm?subject=${encodeURIComponent(subject)}`;
}

onBeforeUnmount(() => recognition?.stop());
</script>

<template>
  <AppLayout>
    <main class="bg-surface text-body lg:h-full lg:overflow-y-auto">
      <section class="relative overflow-hidden bg-earth-50">
        <img
          :src="helpHero"
          :alt="t('help.heroAlt')"
          class="absolute right-0 top-0 h-full w-[52%] object-cover object-center max-lg:h-[250px] max-lg:w-[58%] max-lg:object-[56%_center]"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-earth-50 via-earth-50/95 to-earth-50/5 max-lg:bg-gradient-to-b max-lg:from-earth-50/20 max-lg:via-earth-50/40 max-lg:to-earth-50"
        />

        <div class="relative mx-auto max-w-[1480px] px-12 py-6 max-lg:px-5 max-lg:pb-5 max-lg:pt-[62px]">
          <p class="text-xs font-extrabold uppercase tracking-[0.09em] text-primary">
            {{ t("help.eyebrow") }}
          </p>
          <h1 class="mt-2 max-w-[760px] font-display text-[38px] font-extrabold leading-tight text-heading max-lg:mt-3 max-lg:max-w-[390px] max-lg:text-[30px]">
            {{ t("help.title") }}
          </h1>
          <p class="mt-2 max-w-[700px] text-sm leading-relaxed text-muted max-lg:max-w-[360px] max-lg:text-[13px]">
            {{ t("help.subtitle") }}
          </p>

          <div class="mt-5 flex max-w-[840px] gap-3 max-lg:mt-5 max-lg:max-w-none max-lg:flex-col">
            <label class="flex h-16 flex-1 items-center gap-4 rounded-lg border border-line bg-white px-5 shadow-sm max-lg:h-14">
              <Search class="size-6 shrink-0 text-heading" />
              <input
                v-model="search"
                type="search"
                :placeholder="t('help.searchPlaceholder')"
                class="min-w-0 flex-1 bg-transparent text-sm text-body outline-none placeholder:text-muted-soft"
              />
            </label>
            <button
              type="button"
              class="flex h-16 min-w-[220px] items-center justify-center gap-3 rounded-lg border border-line bg-white px-6 text-sm font-bold text-primary shadow-sm transition hover:border-brand-300 hover:bg-primary-subtle max-lg:h-14"
              :aria-pressed="listening"
              @click="startVoiceSearch"
            >
              <Mic class="size-5" :class="{ 'animate-pulse': listening }" />
              {{ listening ? t("help.listening") : t("help.voiceRequest") }}
            </button>
          </div>
        </div>
      </section>

      <div class="mx-auto max-w-[1480px] px-12 pb-5 pt-3 max-lg:px-5 max-lg:pb-28 max-lg:pt-0">
        <section class="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-sm:gap-2">
          <button
            v-for="topic in topics"
            :key="topic.id"
            type="button"
            class="group flex min-h-[108px] items-center gap-4 rounded-xl border border-line bg-white px-5 text-left transition hover:border-brand-300 hover:shadow-card max-sm:min-h-[115px] max-sm:px-4"
            @click="router.push(topic.route)"
          >
            <span class="grid size-14 shrink-0 place-items-center rounded-full border border-brand-100 bg-primary-soft text-primary max-sm:size-12">
              <component :is="topic.icon" class="size-7 max-sm:size-6" />
            </span>
            <span class="min-w-0 flex-1">
              <strong class="block text-sm font-extrabold text-heading max-sm:text-[13px]">
                {{ t(`help.topics.${topic.id}.title`) }}
              </strong>
              <span class="mt-1 block text-xs leading-relaxed text-muted max-sm:text-[11px]">
                {{ t(`help.topics.${topic.id}.description`) }}
              </span>
            </span>
            <ChevronRight class="size-5 shrink-0 text-heading transition group-hover:translate-x-1" />
          </button>
        </section>

        <div class="mt-3 grid grid-cols-[1.22fr_1fr] gap-4 max-lg:grid-cols-1">
          <section class="rounded-xl border border-line bg-white p-4 max-lg:p-4">
            <h2 class="font-display text-base font-extrabold text-heading">
              {{ t("help.faqTitle") }}
            </h2>

            <div class="mt-2">
              <article
                v-for="faq in visibleFaqs"
                :key="faq.id"
                class="border-b border-line last:border-b-0"
              >
                <button
                  type="button"
                  class="flex w-full items-center gap-4 py-2.5 text-left"
                  :aria-expanded="activeFaq === faq.id"
                  @click="toggleFaq(faq.id)"
                >
                  <span
                    class="grid size-5 shrink-0 place-items-center rounded-full border border-primary text-primary"
                    :class="{ 'bg-primary text-white': activeFaq === faq.id }"
                  >
                    <Minus v-if="activeFaq === faq.id" class="size-3" />
                    <Plus v-else class="size-3" />
                  </span>
                  <span class="flex-1 text-[13px] font-bold text-heading max-sm:text-xs">
                    {{ t(faq.questionKey) }}
                  </span>
                  <ChevronDown
                    class="size-4 shrink-0 transition"
                    :class="{ 'rotate-180 text-primary': activeFaq === faq.id }"
                  />
                </button>
                <p
                  v-if="activeFaq === faq.id"
                  class="pb-3 pl-9 pr-8 text-xs leading-relaxed text-muted"
                >
                  {{ t(faq.answerKey) }}
                </p>
              </article>

              <p v-if="visibleFaqs.length === 0" class="py-8 text-center text-sm text-muted">
                {{ t("help.noResult") }}
              </p>
            </div>

            <button
              type="button"
              class="mx-auto mt-2 flex items-center gap-3 text-xs font-extrabold text-primary"
              @click="search = ''"
            >
              {{ t("help.allQuestions") }}
              <ChevronRight class="size-4" />
            </button>
          </section>

          <div class="grid gap-3">
            <section class="rounded-xl border border-line bg-white p-4">
              <h2 class="font-display text-base font-extrabold text-heading">
                {{ t("help.quickGuides") }}
              </h2>
              <div class="mt-2">
                <button
                  v-for="guide in visibleGuides"
                  :key="guide.id"
                  type="button"
                  class="group flex w-full items-center gap-4 border-b border-line py-2 text-left last:border-b-0"
                  @click="router.push(guide.route)"
                >
                  <BookOpen class="size-5 shrink-0 text-primary" />
                  <span class="flex-1 text-xs font-bold text-heading">
                    {{ t(guide.titleKey) }}
                  </span>
                  <span class="text-[11px] text-muted">
                    {{ guide.duration }} {{ t("help.minutes") }}
                  </span>
                  <ChevronRight class="size-4 transition group-hover:translate-x-1" />
                </button>
              </div>
              <button
                type="button"
                class="mt-2 w-full rounded-md border border-line-strong py-2 text-xs font-extrabold text-primary hover:bg-primary-subtle"
                @click="router.push('/library')"
              >
                {{ t("help.allGuides") }}
              </button>
            </section>

            <section class="rounded-xl border border-line bg-white p-4">
              <h2 class="font-display text-base font-extrabold text-heading">
                {{ t("help.appStatus") }}
              </h2>
              <div class="mt-2 flex items-start gap-3">
                <span class="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <Check class="size-3" stroke-width="3" />
                </span>
                <div>
                  <strong class="block text-xs text-primary">
                    {{ t("help.appWorking") }}
                  </strong>
                  <p class="mt-1 text-[11px] leading-relaxed text-muted">
                    {{ t("help.offlineFiles", { count: 48 }) }}<br />
                    {{ t("help.lastCheck", { time: formattedCheckTime }) }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="mt-3 w-full rounded-md border border-primary/50 py-2 text-xs font-extrabold text-primary hover:bg-primary-subtle"
                @click="verifyStorage"
              >
                {{ t("help.checkStorage") }}
              </button>
            </section>
          </div>
        </div>

        <section class="mt-4 rounded-xl border border-earth-200 bg-earth-50 px-7 py-4 max-lg:px-5">
          <div class="flex items-center gap-5 max-lg:items-start max-sm:flex-col">
            <span class="grid size-14 shrink-0 place-items-center rounded-full border-2 border-primary text-primary">
              <MessageSquareText class="size-7" />
            </span>
            <div class="flex-1">
              <h2 class="font-display text-sm font-extrabold text-heading">
                {{ t("help.notFoundTitle") }}
              </h2>
              <p class="mt-1 max-w-[660px] text-xs leading-relaxed text-muted">
                {{ t("help.notFoundText") }}
              </p>
            </div>
            <div class="flex min-w-[520px] gap-5 max-lg:min-w-0 max-lg:flex-1 max-sm:w-full">
              <button
                type="button"
                class="flex flex-1 items-center justify-center gap-3 rounded-md border border-primary/70 px-5 py-3 text-xs font-extrabold text-primary hover:bg-primary-subtle"
                @click="contact(t('help.reportSubject'))"
              >
                <TriangleAlert class="size-5" />
                {{ t("help.reportProblem") }}
              </button>
              <button
                type="button"
                class="flex flex-1 items-center justify-center gap-3 rounded-md bg-primary px-5 py-3 text-xs font-extrabold text-white hover:bg-primary-hover"
                @click="contact(t('help.contactSubject'))"
              >
                <Mail class="size-5" />
                {{ t("help.contactUs") }}
              </button>
            </div>
          </div>
          <p class="mt-2 flex items-center justify-center gap-2 text-[10px] text-muted">
            <LockKeyhole class="size-3 text-primary" />
            {{ t("help.privacy") }}
          </p>
        </section>
      </div>
    </main>
  </AppLayout>
</template>
