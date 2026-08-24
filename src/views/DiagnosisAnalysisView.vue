<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  ArrowLeft,
  Check,
  Cpu,
  Leaf,
  LoaderCircle,
  Search,
} from "lucide-vue-next";
import AppLayout from "@/layouts/AppLayout.vue";
import ConsultationProgress from "@/components/diagnosis/ConsultationProgress.vue";
import { useDiagnosisStore } from "@/stores/diagnosis.store";
import { useDiagnosisResultStore } from "@/stores/diagnosis-result.store";

const router = useRouter();
const { locale, t } = useI18n();
const diagnosis = useDiagnosisStore();
const results = useDiagnosisResultStore();
const elapsed = ref(0);
const timer = ref<number>();
const progress = computed(() =>
  results.result ? 100 : Math.min(91, 16 + elapsed.value * 7),
);
const parts = computed(
  () =>
    diagnosis.answers.parts.join(", ") ||
    t("diagnosisResult.analysis.notSpecified"),
);
const symptoms = computed(
  () =>
    diagnosis.answers.symptoms.join(", ") ||
    diagnosis.answers.description ||
    t("diagnosisResult.analysis.notSpecified"),
);

function finishSoon() {
  window.clearInterval(timer.value);
  window.setTimeout(
    () =>
      router.replace({
        name: "diagnosis-result",
        params: { section: "overview" },
      }),
    650,
  );
}
watch(
  () => results.result,
  (value) => {
    if (value) finishSoon();
  },
);
onMounted(async () => {
  diagnosis.hydrate();
  results.clear();
  timer.value = window.setInterval(() => (elapsed.value += 1), 800);
  await results.analyze(locale.value);
  if (results.result) finishSoon();
});
</script>

<template>
  <AppLayout>
    <main class="mx-auto w-full max-w-[970px] px-4 py-5 sm:px-6">
      <button
        class="mb-4 inline-flex items-center gap-2 text-[12px] font-semibold text-primary"
        @click="router.push('/diagnosis/dynamic')"
      >
        <ArrowLeft class="size-4" />{{ t("diagnosisResult.common.back") }}
      </button>
      <ConsultationProgress :phase="4" />
      <section
        class="mx-auto mt-7 max-w-[880px] overflow-hidden rounded-[22px] border border-[#dfe9df] bg-white shadow-[0_12px_40px_rgba(32,70,43,.07)]"
      >
        <div class="grid gap-0 lg:grid-cols-[1.25fr_.75fr]">
          <div class="px-5 py-8 text-center sm:px-10 sm:py-10">
            <p class="text-[10px] font-extrabold tracking-[.18em] text-primary">
              {{ t("diagnosisResult.analysis.eyebrow") }}
            </p>
            <h1
              class="mt-3 font-display text-[23px] font-extrabold text-[#173d29] sm:text-[28px]"
            >
              {{ t("diagnosisResult.analysis.title") }}
            </h1>
            <p
              class="mx-auto mt-2 max-w-[520px] text-[12px] leading-5 text-[#66766c]"
            >
              {{ t("diagnosisResult.analysis.subtitle") }}
            </p>
            <div
              class="relative mx-auto mt-7 grid size-[132px] place-items-center rounded-full"
              :style="{
                background: `conic-gradient(#3d8751 ${progress * 3.6}deg,#e8f0e9 0)`,
              }"
            >
              <div
                class="grid size-[110px] place-items-center rounded-full bg-white"
              >
                <div>
                  <strong class="text-[25px] text-[#234d32]"
                    >{{ progress }}%</strong
                  >
                  <p class="text-[9px] uppercase tracking-wider text-[#7b887f]">
                    {{ t("diagnosisResult.analysis.progress") }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mx-auto mt-7 max-w-[500px] space-y-2 text-left">
              <div
                class="flex items-center gap-3 rounded-xl bg-[#f4f8f4] px-3 py-2.5"
              >
                <span
                  class="grid size-7 place-items-center rounded-full bg-primary text-white"
                  ><Check class="size-4"
                /></span>
                <div>
                  <b class="block text-[11px] text-[#244b32]">{{
                    t("diagnosisResult.analysis.stage1")
                  }}</b
                  ><span class="text-[10px] text-muted">{{
                    t("diagnosisResult.analysis.stage1Detail")
                  }}</span>
                </div>
              </div>
              <div
                class="flex items-center gap-3 rounded-xl border border-[#cfe2d3] bg-white px-3 py-2.5"
              >
                <span
                  class="grid size-7 place-items-center rounded-full bg-[#e3f0e6] text-primary"
                  ><LoaderCircle class="size-4 animate-spin"
                /></span>
                <div>
                  <b class="block text-[11px] text-[#244b32]">{{
                    t("diagnosisResult.analysis.stage2")
                  }}</b
                  ><span class="text-[10px] text-muted">{{
                    t("diagnosisResult.analysis.stage2Detail")
                  }}</span>
                </div>
              </div>
              <div class="flex items-center gap-3 px-3 py-2.5 opacity-55">
                <span
                  class="grid size-7 place-items-center rounded-full bg-[#edf2ed]"
                  ><Search class="size-4" /></span
                ><b class="text-[11px]">{{
                  t("diagnosisResult.analysis.stage3")
                }}</b>
              </div>
            </div>
          </div>
          <aside
            class="border-t border-[#e4ece5] bg-[#f8faf7] p-5 lg:border-l lg:border-t-0 lg:p-7"
          >
            <h2
              class="flex items-center gap-2 text-[12px] font-bold text-[#244b32]"
            >
              <Leaf class="size-4 text-primary" />{{
                t("diagnosisResult.analysis.summary")
              }}
            </h2>
            <dl class="mt-4 space-y-4 text-[10px]">
              <div>
                <dt class="uppercase tracking-wider text-muted">
                  {{ t("diagnosisResult.analysis.crop") }}
                </dt>
                <dd class="mt-1 font-bold capitalize text-heading">
                  {{ diagnosis.answers.crop }}
                </dd>
              </div>
              <div>
                <dt class="uppercase tracking-wider text-muted">
                  {{ t("diagnosisResult.analysis.parts") }}
                </dt>
                <dd class="mt-1 text-body">{{ parts }}</dd>
              </div>
              <div>
                <dt class="uppercase tracking-wider text-muted">
                  {{ t("diagnosisResult.analysis.symptoms") }}
                </dt>
                <dd class="mt-1 text-body">{{ symptoms }}</dd>
              </div>
            </dl>
            <div class="mt-6 rounded-xl border border-[#d7e6d9] bg-white p-3">
              <Cpu class="size-5 text-primary" /><b
                class="mt-2 block text-[10px] text-heading"
                >{{ t("diagnosisResult.analysis.local") }}</b
              >
              <p class="mt-1 text-[9px] leading-4 text-muted">
                {{ t("diagnosisResult.analysis.localDetail") }}
              </p>
            </div>
          </aside>
        </div>
        <div
          v-if="results.error"
          class="border-t border-red-100 bg-red-50 px-5 py-3 text-center text-[11px] text-red-700"
        >
          {{ results.error }}
        </div>
        <div class="border-t border-[#e5ece5] px-5 py-4 text-center">
          <button
            class="rounded-lg border border-[#d9e3da] px-5 py-2 text-[11px] font-semibold text-muted"
            @click="router.push('/diagnosis/dynamic')"
          >
            {{ t("diagnosisResult.analysis.cancel") }}
          </button>
        </div>
      </section>
    </main>
  </AppLayout>
</template>
