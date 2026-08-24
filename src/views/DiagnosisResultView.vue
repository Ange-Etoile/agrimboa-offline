<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import AppLayout from "@/layouts/AppLayout.vue";
import ConsultationProgress from "@/components/diagnosis/ConsultationProgress.vue";
import DiagnosisActionPlan from "@/components/diagnosis/result/DiagnosisActionPlan.vue";
import DiagnosisExplanation from "@/components/diagnosis/result/DiagnosisExplanation.vue";
import DiagnosisFollowUp from "@/components/diagnosis/result/DiagnosisFollowUp.vue";
import DiagnosisOverview from "@/components/diagnosis/result/DiagnosisOverview.vue";
import DiagnosisResultFooter from "@/components/diagnosis/result/DiagnosisResultFooter.vue";
import DiagnosisResultHero from "@/components/diagnosis/result/DiagnosisResultHero.vue";
import DiagnosisResultTabs from "@/components/diagnosis/result/DiagnosisResultTabs.vue";
import { useDiagnosisResultStore } from "@/stores/diagnosis-result.store";

const route = useRoute();
const router = useRouter();
const store = useDiagnosisResultStore();
const section = computed(() => String(route.params.section || "overview"));
const result = computed(() => store.result);
const sessionId = computed(() =>
  typeof route.query.session === "string" ? route.query.session : "",
);
function open(value: string) {
  router.push({
    name: "diagnosis-result",
    params: { section: value },
    query: sessionId.value ? { session: sessionId.value } : undefined,
  });
}
function next() {
  open(
    section.value === "overview"
      ? "action"
      : section.value === "action"
        ? "why"
        : "followup",
  );
}
function speak() {
  if (!result.value || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(
    new SpeechSynthesisUtterance(
      `${result.value.title}. ${result.value.summary}`,
    ),
  );
}
function download() {
  if (!result.value) return;
  const blob = new Blob([JSON.stringify(result.value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "diagnostic-agrimboa.json";
  link.click();
  URL.revokeObjectURL(url);
}
onMounted(async () => {
  if (sessionId.value) await store.loadSaved(sessionId.value);
  else store.hydrate();
  if (!store.result) router.replace({ name: "diagnosis-analysis" });
});
</script>

<template>
  <AppLayout
    ><main
      v-if="result"
      class="diagnosis-result-page mx-auto w-full max-w-[1040px] px-3.5 py-4 sm:px-6"
    >
      <button
        class="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold text-primary"
        @click="
          sessionId
            ? router.push('/history')
            : router.push('/diagnosis/dynamic')
        "
      >
        <ArrowLeft class="size-4" />{{
          sessionId ? "Retour à l’historique" : "Retour au diagnostic"
        }}</button
      ><ConsultationProgress :phase="4" /><DiagnosisResultHero
        :result="result"
        :saved="store.saved"
        @speak="speak"
        @download="download"
        @save="store.save"
      /><DiagnosisResultTabs :active="section" @select="open" />
      <div class="mt-4">
        <DiagnosisOverview
          v-if="section === 'overview'"
          :result="result"
        /><DiagnosisActionPlan
          v-else-if="section === 'action'"
          :result="result"
        /><DiagnosisExplanation
          v-else-if="section === 'why'"
          :result="result"
        /><DiagnosisFollowUp v-else :result="result" :session-id="sessionId" />
      </div>
      <DiagnosisResultFooter
        :section="section"
        :saved="store.saved"
        @home="router.push('/home')"
        @next="next"
        @save="store.save"
      /></main
  ></AppLayout>
</template>

<style>
.diagnosis-result-page .result-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid #d9e4da;
  border-radius: 0.55rem;
  padding: 0.48rem 0.75rem;
  font-size: 10px;
  font-weight: 700;
  color: #31543d;
  background: #fff;
}
.diagnosis-result-page .tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 48px;
  border: 1px solid #dce6dd;
  border-radius: 11px;
  background: #fff;
  font-size: 10px;
  font-weight: 700;
  color: #64736a;
}
.diagnosis-result-page .tab.active {
  border-color: #4b8c5b;
  background: #edf6ef;
  color: #28623a;
}
.diagnosis-result-page .card,
.diagnosis-result-page .section-head {
  border: 1px solid #dfe8e0;
  border-radius: 16px;
  background: #fff;
  padding: 18px;
}
.diagnosis-result-page .section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.diagnosis-result-page .card h2,
.diagnosis-result-page .section-head h2 {
  font-size: 14px;
  font-weight: 800;
  color: #244b32;
}
.diagnosis-result-page .card p,
.diagnosis-result-page .section-head p,
.diagnosis-result-page .warning p,
.diagnosis-result-page .takeaway p {
  margin-top: 5px;
  font-size: 10px;
  line-height: 1.65;
  color: #68776e;
}
.diagnosis-result-page .eyebrow {
  font-size: 8px !important;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #568064 !important;
}
.diagnosis-result-page .match {
  border-radius: 999px;
  background: #e7f3e9;
  padding: 6px 9px;
  font-size: 12px;
  color: #2f7142;
}
.diagnosis-result-page .checklist {
  margin-top: 12px;
  display: grid;
  gap: 9px;
}
.diagnosis-result-page .checklist li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 10px;
  line-height: 1.5;
  color: #45564b;
}
.diagnosis-result-page .checklist svg {
  margin-top: 1px;
  width: 14px;
  height: 14px;
  flex: none;
  border-radius: 50%;
  background: #e4f1e6;
  padding: 2px;
  color: #347849;
}
.diagnosis-result-page .warning,
.diagnosis-result-page .takeaway {
  display: flex;
  gap: 10px;
  border: 1px solid #eedba9;
  border-radius: 14px;
  background: #fffaf0;
  padding: 15px;
  font-size: 10px;
  color: #755b19;
}
.diagnosis-result-page .warning ul,
.diagnosis-result-page .dot-list {
  margin-top: 6px;
  padding-left: 16px;
  list-style: disc;
  display: grid;
  gap: 4px;
}
.diagnosis-result-page .cause {
  margin-top: 12px;
  border-top: 1px solid #edf1ed;
  padding-top: 11px;
  font-size: 10px;
}
.diagnosis-result-page .cause:first-of-type {
  border-top: 0;
}
.diagnosis-result-page .chip,
.diagnosis-result-page .duration,
.diagnosis-result-page .source {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  background: #f2f6f2;
  padding: 7px 8px;
  font-size: 9px;
  color: #526359;
}
.diagnosis-result-page .timeline {
  display: grid;
  gap: 12px;
}
.diagnosis-result-page .step {
  position: absolute;
  right: 14px;
  top: 14px;
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 50%;
  background: #347849;
  color: white;
  font-size: 10px;
}
.diagnosis-result-page .bar {
  margin-top: 5px;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #e9efea;
}
.diagnosis-result-page .bar i {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: #4b8e5c;
}
.diagnosis-result-page .takeaway {
  border-color: #cfe3d3;
  background: #f2f8f3;
  color: #315c3d;
}
.diagnosis-result-page .state {
  border: 1px solid #dce5dd;
  border-radius: 9px;
  padding: 10px 4px;
  font-size: 9px;
  font-weight: 700;
  color: #6a776f;
}
.diagnosis-result-page .state.active {
  border-color: #4b8c5b;
  background: #edf6ef;
  color: #2d6c40;
}
.diagnosis-result-page .label {
  display: block;
  margin-top: 15px;
  font-size: 10px;
  font-weight: 700;
  color: #3e5445;
}
.diagnosis-result-page .label textarea {
  margin-top: 7px;
  width: 100%;
  resize: none;
  border: 1px solid #dce5dd;
  border-radius: 10px;
  padding: 10px;
  font-size: 10px;
  font-weight: 400;
  outline: none;
}
.diagnosis-result-page .primary-btn {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 9px;
  background: #347849;
  padding: 10px 15px;
  font-size: 10px;
  font-weight: 800;
  color: white;
}
@media (min-width: 768px) {
  .diagnosis-result-page .timeline {
    grid-template-columns: repeat(3, 1fr);
  }
  .diagnosis-result-page .card,
  .diagnosis-result-page .section-head {
    padding: 20px;
  }
}
</style>
