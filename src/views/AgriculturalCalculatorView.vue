<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Copy,
  Download,
  Info,
  Pencil,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-vue-next";
import AppLayout from "@/layouts/AppLayout.vue";
import { useCalculatorStore } from "@/stores/calculator.store";
import type { CalculatorStep } from "@/features/calculators/types/calculator";
import surfaceDiagram from "@/assets/images/calculators/surface-diagram.webp";
import densityDiagram from "@/assets/images/calculators/density-diagram.webp";
import seedsDiagram from "@/assets/images/calculators/seeds-diagram.webp";
import inputsDiagram from "@/assets/images/calculators/inputs-diagram.webp";
const route = useRoute(),
  router = useRouter(),
  store = useCalculatorStore(),
  { t, locale } = useI18n();
const step = computed(() => route.params.step as CalculatorStep);
const diagram = computed(
  () =>
    ({
      surface: surfaceDiagram,
      density: densityDiagram,
      seeds: seedsDiagram,
      inputs: inputsDiagram,
    })[step.value as string],
);
const result = computed(() =>
  step.value === "surface"
    ? `${fmt(store.draft.surfaceM2)} m²`
    : step.value === "density"
      ? `${fmt(store.draft.plants)} plants`
      : step.value === "seeds"
        ? `${fmt(store.draft.seedUnits)} ${t("calculators.grains")}`
        : `${fmt(store.draft.inputKg)} kg`,
);
const next = computed(
  () =>
    (
      ({
        surface: "density",
        density: "seeds",
        seeds: "inputs",
        inputs: "summary",
      }) as Partial<Record<CalculatorStep, CalculatorStep>>
    )[step.value],
);
const titleKey = computed(() => `calculators.tool.${step.value}.title`);
function fmt(n: number) {
  return new Intl.NumberFormat(locale.value).format(n);
}
async function calculate() {
  if (step.value === "surface") store.surface();
  if (step.value === "density") store.density();
  if (step.value === "seeds") store.seeds();
  if (step.value === "inputs") store.inputs();
  await store.save(step.value, t(titleKey.value), result.value);
  void store.explain(step.value, locale.value);
}
function clear() {
  if (step.value === "surface") {
    store.draft.length = 0;
    store.draft.width = 0;
  }
  if (step.value === "density") {
    store.draft.rowSpacingCm = 0;
    store.draft.plantSpacingCm = 0;
  }
  store.persist();
}
function copy() {
  navigator.clipboard?.writeText(result.value);
}
function print() {
  window.print();
}
function goNext() {
  if (next.value) router.push(`/calculators/${next.value}`);
}
onMounted(() => store.load());
watch(step, () => (store.advice = null));
</script>
<template>
  <AppLayout
    ><main class="calculator-page">
      <nav class="crumb">
        <span>{{ t("calculators.title") }}</span
        ><b>/</b>{{ t(titleKey) }}
      </nav>
      <button class="back" @click="router.push('/calculators')">
        <ArrowLeft />{{ t("calculators.back") }}
      </button>
      <header>
        <p>
          {{
            step === "summary"
              ? t("calculators.completed")
              : t("calculators.offlineCalculator")
          }}
        </p>
        <h1>
          {{ step === "summary" ? t("calculators.summaryTitle") : t(titleKey) }}
        </h1>
        <span>{{ t(`calculators.pageDescriptions.${step}`) }}</span>
      </header>
      <template v-if="step === 'summary'"
        ><section class="done">
          <CheckCircle2 />
          <div>
            <h2>{{ t("calculators.savedDone") }}</h2>
            <p>{{ t("calculators.savedOffline") }}</p>
          </div>
          <b>{{ new Date(store.draft.updatedAt).toLocaleString() }}</b>
        </section>
        <section class="summary">
          <div class="summary-head">
            <div>
              <h2>{{ store.draft.name }}</h2>
              <p>
                {{ t(`calculators.crop.${store.draft.crop}`) }} ·
                {{ store.draft.length }} m × {{ store.draft.width }} m
              </p>
            </div>
            <button><Pencil />{{ t("calculators.rename") }}</button>
          </div>
          <div class="flow">
            <article>
              <i>1</i><span>{{ t("calculators.tool.surface.title") }}</span
              ><b>{{ fmt(store.draft.surfaceM2) }} m²</b
              ><small>{{ store.hectares.toFixed(2) }} ha</small
              ><button @click="router.push('/calculators/surface')">
                {{ t("calculators.viewCalculation") }}
              </button>
            </article>
            <ArrowRight />
            <article>
              <i>2</i><span>{{ t("calculators.tool.density.title") }}</span
              ><b>{{ fmt(store.draft.plants) }} plants</b
              ><small
                >{{
                  fmt(Math.round(store.draft.plants / store.hectares))
                }}
                plants/ha</small
              ><button @click="router.push('/calculators/density')">
                {{ t("calculators.viewCalculation") }}
              </button>
            </article>
            <ArrowRight />
            <article>
              <i>3</i><span>{{ t("calculators.tool.seeds.title") }}</span
              ><b
                >{{ fmt(store.draft.seedUnits) }}
                {{ t("calculators.grains") }}</b
              ><small>{{ store.draft.seedKg }} kg</small
              ><button @click="router.push('/calculators/seeds')">
                {{ t("calculators.viewCalculation") }}
              </button>
            </article>
            <ArrowRight />
            <article>
              <i>4</i><span>{{ t("calculators.tool.inputs.title") }}</span
              ><b>{{ fmt(store.draft.inputKg) }} kg</b
              ><small>{{ store.bags }} {{ t("calculators.bags") }}</small
              ><button @click="router.push('/calculators/inputs')">
                {{ t("calculators.viewCalculation") }}
              </button>
            </article>
          </div>
        </section>
        <div class="summary-grid">
          <section>
            <h2>{{ t("calculators.parcelNotes") }}</h2>
            <textarea
              v-model="store.draft.note"
              :placeholder="t('calculators.notePlaceholder')"
            ></textarea
            ><button class="primary" @click="store.persist">
              <Save />{{ t("calculators.saveNote") }}
            </button>
          </section>
          <section class="next-actions">
            <h2>{{ t("calculators.nextActions") }}</h2>
            <button @click="router.push('/library')">
              {{ t("calculators.viewCropGuide") }}<ArrowRight /></button
            ><button>{{ t("calculators.createReminder") }}<ArrowRight /></button
            ><button @click="router.push('/history')">
              {{ t("calculators.openHistory") }}<ArrowRight />
            </button>
          </section>
        </div>
        <section class="safety">
          <AlertTriangle />
          <div>
            <h2>{{ t("calculators.verifyEstimates") }}</h2>
            <p>{{ t("calculators.verifyEstimatesText") }}</p>
          </div>
          <button @click="router.push('/library')">
            <BookOpen />{{ t("calculators.safetyAdvice") }}
          </button>
        </section>
        <footer class="final-actions">
          <button @click="router.push('/calculators/surface')">
            <Pencil />{{ t("calculators.editCalculation") }}</button
          ><button
            @click="
              store.reset();
              router.push('/calculators/surface');
            "
          >
            <RefreshCw />{{ t("calculators.newJourney") }}</button
          ><button @click="print">
            <Download />{{ t("calculators.exportSummary") }}</button
          ><button class="primary" @click="router.push('/calculators')">
            {{ t("calculators.finish") }}<ArrowRight />
          </button></footer></template
      ><template
        v-else-if="['surface', 'density', 'seeds', 'inputs'].includes(step)"
        ><section v-if="step !== 'surface'" class="recovered">
          <h2>{{ t("calculators.recoveredData") }}</h2>
          <div>
            <b>{{ store.draft.name }}</b
            ><b>{{ fmt(store.draft.surfaceM2) }} m²</b
            ><b v-if="step === 'seeds'">{{ fmt(store.draft.plants) }} plants</b
            ><b v-else>{{ store.hectares.toFixed(2) }} ha</b
            ><span
              ><CheckCircle2 />{{ t("calculators.previousCalculation") }}</span
            >
          </div>
        </section>
        <section v-if="step === 'inputs'" class="verified-dose">
          <ShieldCheck />
          <div>
            <h2>{{ t("calculators.useVerifiedDose") }}</h2>
            <p>{{ t("calculators.useVerifiedDoseText") }}</p>
          </div>
          <span><Info />{{ t("calculators.noDoseChoice") }}</span>
        </section>
        <div class="work-grid">
          <section class="form-card">
            <h2>1. {{ t(`calculators.formTitles.${step}`) }}</h2>
            <template v-if="step === 'surface'"
              ><label
                >{{ t("calculators.parcelShape")
                }}<select v-model="store.draft.shape">
                  <option value="rectangle">
                    {{ t("calculators.rectangle") }}
                  </option>
                  <option value="triangle">
                    {{ t("calculators.triangle") }}
                  </option>
                  <option value="irregular">
                    {{ t("calculators.irregular") }}
                  </option>
                </select></label
              >
              <div class="two">
                <label
                  >{{ t("calculators.length")
                  }}<input
                    v-model.number="store.draft.length"
                    type="number"
                  /><i>m</i></label
                ><label
                  >{{ t("calculators.width")
                  }}<input v-model.number="store.draft.width" type="number" /><i
                    >m</i
                  ></label
                >
              </div>
              <label
                >{{ t("calculators.calculationName")
                }}<input v-model="store.draft.name" /></label></template
            ><template v-if="step === 'density'"
              ><label
                >{{ t("calculators.culture")
                }}<select v-model="store.draft.crop">
                  <option value="maize">
                    {{ t("calculators.crop.maize") }}
                  </option>
                  <option value="cassava">
                    {{ t("calculators.crop.cassava") }}
                  </option>
                  <option value="tomato">
                    {{ t("calculators.crop.tomato") }}
                  </option>
                  <option value="plantain">
                    {{ t("calculators.crop.plantain") }}
                  </option>
                </select></label
              ><label
                >{{ t("calculators.rowSpacing")
                }}<input
                  v-model.number="store.draft.rowSpacingCm"
                  type="number"
                /><i>cm</i></label
              ><label
                >{{ t("calculators.plantSpacing")
                }}<input
                  v-model.number="store.draft.plantSpacingCm"
                  type="number"
                /><i>cm</i></label
              ><label
                >{{ t("calculators.plantsPerHole")
                }}<input
                  v-model.number="store.draft.plantsPerHole"
                  type="number" /></label></template
            ><template v-if="step === 'seeds'"
              ><label
                >{{ t("calculators.culture")
                }}<select v-model="store.draft.crop">
                  <option value="maize">
                    {{ t("calculators.crop.maize") }}
                  </option>
                  <option value="cassava">
                    {{ t("calculators.crop.cassava") }}
                  </option>
                  <option value="tomato">
                    {{ t("calculators.crop.tomato") }}
                  </option>
                  <option value="plantain">
                    {{ t("calculators.crop.plantain") }}
                  </option>
                </select></label
              ><label
                >{{ t("calculators.requiredPlants")
                }}<input
                  v-model.number="store.draft.plants"
                  type="number" /></label
              ><label
                >{{ t("calculators.germination")
                }}<input
                  v-model.number="store.draft.germinationRate"
                  type="number"
                /><i>%</i></label
              ><label
                >{{ t("calculators.margin")
                }}<input
                  v-model.number="store.draft.safetyMargin"
                  type="number"
                /><i>%</i></label
              ><label
                >{{ t("calculators.thousandWeight")
                }}<input
                  v-model.number="store.draft.thousandSeedWeightG"
                  type="number"
                /><i>g</i></label
              ></template
            ><template v-if="step === 'inputs'"
              ><label
                >{{ t("calculators.inputType")
                }}<select v-model="store.draft.inputType">
                  <option value="fertilizer">
                    {{ t("calculators.fertilizer") }}
                  </option>
                  <option value="amendment">
                    {{ t("calculators.amendment") }}
                  </option>
                  <option value="treatment">
                    {{ t("calculators.treatment") }}
                  </option>
                </select></label
              ><label
                >{{ t("calculators.productName")
                }}<input v-model="store.draft.productName" /></label
              ><label
                >{{ t("calculators.referenceDose")
                }}<input
                  v-model.number="store.draft.dosePerHa"
                  type="number"
                /><i>kg/ha</i></label
              ><label
                >{{ t("calculators.packaging")
                }}<input
                  v-model.number="store.draft.packageKg"
                  type="number"
                /><i>kg</i></label
              ><label
                >{{ t("calculators.applications")
                }}<input
                  v-model.number="store.draft.applications"
                  type="number" /></label
            ></template>
            <p class="hint"><Info />{{ t(`calculators.hints.${step}`) }}</p>
            <div class="form-actions">
              <button class="primary" @click="calculate">
                <Calculator />{{ t(`calculators.calculate.${step}`) }}</button
              ><button @click="clear">
                <Trash2 />{{ t("calculators.clear") }}
              </button>
            </div>
          </section>
          <section class="diagram">
            <h2>2. {{ t(`calculators.diagramTitles.${step}`) }}</h2>
            <img :src="diagram" alt="" />
            <p><Info />{{ t(`calculators.diagramHints.${step}`) }}</p>
          </section>
        </div>
        <div class="result-grid">
          <section class="result">
            <p>{{ t("calculators.estimatedResult") }}</p>
            <h2>{{ result }}</h2>
            <div v-if="step === 'surface'" class="secondary">
              <b>{{ store.hectares.toFixed(2) }} hectare</b
              ><b>{{ fmt(store.ares) }} ares</b>
            </div>
            <div v-if="step === 'density'" class="secondary">
              <b
                >{{
                  fmt(Math.round(store.draft.plants / store.hectares))
                }}
                plants/hectare</b
              >
            </div>
            <div v-if="step === 'seeds'" class="secondary">
              <b>{{ store.draft.seedKg }} kg</b
              ><b>{{ Math.ceil(store.draft.seedKg / 5) }} sac(s) de 5 kg</b>
            </div>
            <div v-if="step === 'inputs'" class="secondary">
              <b>{{ store.draft.applications }} application(s)</b
              ><b>{{ store.bags }} sac(s) de {{ store.draft.packageKg }} kg</b>
            </div>
            <div class="formula">
              {{
                t(`calculators.formulas.${step}`, {
                  a: store.draft.length,
                  b: store.draft.width,
                  s: store.draft.surfaceM2,
                  r: store.draft.rowSpacingCm / 100,
                  p: store.draft.plantSpacingCm / 100,
                  n: store.draft.plants,
                  g: store.draft.germinationRate,
                  m: store.draft.safetyMargin,
                  d: store.draft.dosePerHa,
                  h: store.hectares.toFixed(2),
                  result,
                })
              }}<CheckCircle2 />{{ t("calculators.verified") }}
            </div>
            <div class="result-actions">
              <button @click="store.save(step, t(titleKey), result)">
                <Save />{{ t("calculators.saveCalculation") }}</button
              ><button @click="print"><Download />PDF</button
              ><button @click="copy">
                <Copy />{{ t("calculators.copy") }}
              </button>
            </div>
          </section>
          <section class="caution">
            <AlertTriangle />
            <div>
              <h2>{{ t(`calculators.cautionTitles.${step}`) }}</h2>
              <p>{{ t(`calculators.cautionTexts.${step}`) }}</p>
            </div>
          </section>
        </div>
        <section class="ai">
          <Sparkles />
          <div>
            <h2>{{ t("calculators.aiTitle") }}</h2>
            <p v-if="store.adviceLoading">{{ t("calculators.aiLoading") }}</p>
            <template v-else-if="store.advice"
              ><p>{{ store.advice.summary }}</p>
              <ul>
                <li v-for="item in store.advice.checks" :key="item">
                  {{ item }}
                </li>
              </ul>
              <small
                >{{ store.advice.provider }} · {{ store.advice.model }}</small
              ></template
            >
            <p v-else>{{ t("calculators.aiIntro") }}</p>
          </div>
          <button @click="store.explain(step, locale)">
            {{ t("calculators.askAi") }}
          </button>
        </section>
        <footer class="bottom-actions">
          <button @click="store.reset">
            <RefreshCw />{{ t("calculators.restart") }}</button
          ><button @click="router.push('/calculators')">
            {{ t("calculators.otherTool") }}</button
          ><button class="primary" @click="goNext">
            {{
              step === "inputs"
                ? t("calculators.finishSave")
                : t(`calculators.useFor.${next}`)
            }}<ArrowRight />
          </button></footer></template
      ><template v-else
        ><section class="utility">
          <Calculator />
          <h2>{{ t(titleKey) }}</h2>
          <p>{{ t(`calculators.pageDescriptions.${step}`) }}</p>
          <button class="primary" @click="router.push('/calculators/surface')">
            {{ t("calculators.startJourney") }}<ArrowRight />
          </button></section
      ></template></main
  ></AppLayout>
</template>
<style scoped>
.calculator-page {
  max-width: 1480px;
  margin: auto;
  padding: 22px 36px 80px;
  color: #132019;
}
.crumb {
  display: flex;
  gap: 9px;
  color: #607087;
  font-size: 11px;
}
.crumb span {
  color: #08752c;
}
.back {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  border: 1px solid #cfdad1;
  border-radius: 7px;
  padding: 10px 14px;
  color: #075f28;
  font-size: 11px;
}
.back svg {
  width: 15px;
}
.calculator-page > header {
  text-align: center;
  margin-top: -34px;
}
.calculator-page > header p {
  color: #08752c;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
}
.calculator-page > header h1 {
  margin-top: 6px;
  font: 800 31px var(--font-display);
}
.calculator-page > header span {
  display: block;
  margin-top: 5px;
  color: #52637a;
  font-size: 12px;
}
.recovered,
.done {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
  border: 1px solid #dce4de;
  border-radius: 12px;
  padding: 16px;
}
.recovered > h2 {
  font-size: 12px;
}
.recovered > div {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-around;
}
.recovered b,
.recovered span {
  font-size: 11px;
}
.recovered span {
  display: flex;
  gap: 6px;
  color: #08752c;
}
.recovered svg {
  width: 16px;
}
.verified-dose {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 12px;
  border: 1px solid #b9d4bf;
  border-radius: 12px;
  background: #f8fcf8;
  padding: 14px 18px;
}
.verified-dose > svg {
  width: 38px;
  color: #08752c;
}
.verified-dose h2 {
  font-size: 13px;
  font-weight: 800;
}
.verified-dose p {
  font-size: 10px;
  color: #52637a;
}
.verified-dose span {
  display: flex;
  gap: 6px;
  margin-left: auto;
  font-size: 10px;
}
.verified-dose span svg {
  width: 15px;
}
.work-grid {
  display: grid;
  grid-template-columns: 0.85fr 1.45fr;
  gap: 14px;
  margin-top: 14px;
}
.form-card,
.diagram,
.result,
.caution,
.ai,
.summary,
.summary-grid > section,
.safety,
.utility {
  border: 1px solid #dfe5e1;
  border-radius: 12px;
  background: #fff;
  padding: 18px;
}
.work-grid h2 {
  margin-bottom: 13px;
  color: #075f28;
  font-size: 15px;
  font-weight: 800;
}
.form-card label {
  position: relative;
  display: grid;
  grid-template-columns: 42% 58%;
  align-items: center;
  margin-top: 8px;
  font-size: 11px;
}
.form-card input,
.form-card select {
  height: 36px;
  border: 1px solid #d4ddd7;
  border-radius: 6px;
  padding: 0 11px;
  outline: 0;
}
.form-card label > i {
  position: absolute;
  right: 10px;
  font-size: 10px;
}
.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.two label {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
.two input {
  width: 100%;
  margin-top: 5px;
}
.hint {
  display: flex;
  gap: 7px;
  margin-top: 12px;
  color: #627188;
  font-size: 9px;
}
.hint svg {
  width: 14px;
}
.form-actions,
.result-actions,
.bottom-actions,
.final-actions {
  display: flex;
  gap: 10px;
  margin-top: 13px;
}
.form-actions button,
.result-actions button,
.bottom-actions button,
.final-actions button,
.primary {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #d6ded8;
  border-radius: 7px;
  padding: 10px;
  font-size: 10px;
}
.primary {
  border-color: #08752c !important;
  background: #08752c !important;
  color: white;
}
.form-actions svg,
.result-actions svg,
.bottom-actions svg,
.final-actions svg {
  width: 16px;
}
.diagram img {
  width: 100%;
  height: 210px;
  object-fit: contain;
}
.diagram p {
  display: flex;
  gap: 7px;
  color: #607188;
  font-size: 9px;
}
.diagram p svg {
  width: 14px;
}
.result-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 14px;
  margin-top: 14px;
}
.result {
  border-color: #5d9e70;
}
.result > p {
  color: #08752c;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}
.result > h2 {
  margin-top: 5px;
  color: #075f28;
  font-size: 37px;
  font-weight: 800;
}
.secondary {
  display: flex;
  gap: 14px;
  margin: 7px 0;
}
.secondary b {
  border-radius: 7px;
  background: #f1f7f0;
  padding: 7px 12px;
  color: #075f28;
  font-size: 11px;
}
.formula {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #dce4de;
  border-radius: 7px;
  padding: 8px 11px;
  font-family: monospace;
  font-size: 10px;
}
.formula svg {
  width: 15px;
  color: #08752c;
}
.caution {
  display: flex;
  gap: 13px;
  border-color: #f2bc56;
  background: #fffaf0;
}
.caution > svg {
  width: 30px;
  color: #d98900;
}
.caution h2 {
  font-size: 13px;
  font-weight: 800;
  color: #9b5100;
}
.caution p {
  margin-top: 6px;
  color: #6b5a45;
  font-size: 10px;
  line-height: 1.55;
}
.ai {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 14px;
  border-color: #b6d5bf;
  background: #f8fcf8;
}
.ai > svg {
  width: 32px;
  color: #08752c;
}
.ai > div {
  flex: 1;
}
.ai h2 {
  font-size: 13px;
  font-weight: 800;
}
.ai p,
.ai li {
  margin-top: 5px;
  color: #52637a;
  font-size: 10px;
}
.ai ul {
  padding-left: 14px;
  list-style: disc;
}
.ai small {
  display: block;
  margin-top: 8px;
  color: #7b887f;
  font-size: 8px;
}
.ai > button {
  border: 1px solid #08752c;
  border-radius: 7px;
  padding: 9px 13px;
  color: #08752c;
  font-size: 10px;
}
.bottom-actions,
.final-actions {
  border: 1px solid #dfe5e1;
  border-radius: 10px;
  padding: 12px;
}
.bottom-actions .primary,
.final-actions .primary {
  flex: 1.5;
}
.done {
  margin-top: 18px;
  border-color: #81b18e;
  background: #f8fcf8;
}
.done > svg {
  width: 48px;
  color: #08752c;
}
.done h2 {
  font-size: 13px;
  font-weight: 800;
  color: #075f28;
}
.done p {
  font-size: 10px;
  color: #52637a;
}
.done > b {
  margin-left: auto;
  font-size: 10px;
}
.summary {
  margin-top: 12px;
}
.summary-head {
  display: flex;
  justify-content: space-between;
}
.summary-head h2 {
  font-size: 18px;
  font-weight: 800;
}
.summary-head p {
  font-size: 10px;
  color: #52637a;
}
.summary-head button {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #d4ddd7;
  border-radius: 7px;
  padding: 9px 12px;
  font-size: 10px;
}
.summary-head svg {
  width: 15px;
}
.flow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 17px;
}
.flow > svg {
  width: 28px;
  color: #08752c;
}
.flow article {
  position: relative;
  display: flex;
  min-height: 150px;
  flex: 1;
  flex-direction: column;
  border: 1px solid #b9d2bf;
  border-radius: 10px;
  padding: 16px;
}
.flow i {
  position: absolute;
  top: 8px;
  left: 8px;
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 50%;
  background: #08752c;
  color: white;
  font-size: 10px;
}
.flow span {
  margin-left: 24px;
  font-size: 11px;
}
.flow b {
  margin-top: 20px;
  color: #08752c;
  font-size: 20px;
}
.flow small {
  margin-top: 5px;
}
.flow button {
  margin-top: auto;
  color: #08752c;
  font-size: 10px;
  text-decoration: underline;
}
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}
.summary-grid h2 {
  font-size: 13px;
  font-weight: 800;
}
.summary-grid textarea {
  width: 100%;
  height: 70px;
  margin-top: 10px;
  border: 1px solid #d7dfd9;
  border-radius: 7px;
  padding: 10px;
  font-size: 10px;
}
.summary-grid .primary {
  width: 180px;
  margin-top: 8px;
}
.next-actions {
  display: grid;
  gap: 0;
}
.next-actions button {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e2e7e3;
  padding: 9px;
  font-size: 10px;
}
.next-actions svg {
  width: 14px;
}
.safety {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 12px;
  border-color: #ed9c25;
  background: #fffaf3;
}
.safety > svg {
  width: 30px;
  color: #e08b00;
}
.safety h2 {
  font-size: 13px;
  color: #b84f00;
}
.safety p {
  font-size: 10px;
}
.safety button {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  border: 1px solid #ed9c25;
  border-radius: 7px;
  padding: 9px;
  color: #b85b00;
  font-size: 10px;
}
.safety button svg {
  width: 16px;
}
.utility {
  display: grid;
  max-width: 620px;
  min-height: 300px;
  place-items: center;
  margin: 35px auto;
  text-align: center;
}
.utility > svg {
  width: 55px;
  color: #08752c;
}
.utility h2 {
  font-size: 24px;
  font-weight: 800;
}
.utility p {
  color: #52637a;
  font-size: 12px;
}
.utility .primary {
  width: 250px;
}
.final-actions {
  margin-top: 12px;
}
@media (max-width: 800px) {
  .calculator-page {
    padding: 18px 16px 100px;
  }
  .calculator-page > header {
    margin-top: 26px;
  }
  .calculator-page > header h1 {
    font-size: 27px;
  }
  .recovered {
    display: block;
  }
  .recovered > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 12px;
  }
  .verified-dose {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .verified-dose span {
    width: 100%;
    margin: 0;
    border-top: 1px solid #cdded1;
    padding-top: 9px;
  }
  .work-grid,
  .result-grid,
  .summary-grid {
    grid-template-columns: 1fr;
  }
  .form-card label {
    grid-template-columns: 40% 60%;
  }
  .two {
    grid-template-columns: 1fr 1fr;
  }
  .diagram img {
    height: 220px;
  }
  .result > h2 {
    font-size: 34px;
  }
  .result-actions button {
    font-size: 0;
  }
  .result-actions button svg {
    width: 19px;
  }
  .ai {
    flex-wrap: wrap;
  }
  .ai > button {
    width: 100%;
  }
  .bottom-actions {
    flex-wrap: wrap;
  }
  .bottom-actions .primary {
    flex-basis: 100%;
    order: 3;
  }
  .flow {
    position: relative;
    display: grid;
    gap: 9px;
    padding-left: 45px;
  }
  .flow > svg {
    display: none;
  }
  .flow:before {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 25px;
    width: 2px;
    background: #08752c;
    content: "";
  }
  .flow article {
    min-height: 90px;
  }
  .flow i {
    left: -46px;
  }
  .flow span {
    margin: 0;
  }
  .flow b {
    margin-top: 8px;
  }
  .done > b {
    margin-left: auto;
    text-align: right;
  }
  .safety {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .safety button {
    width: 100%;
    justify-content: center;
    margin: 0;
  }
  .final-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .final-actions .primary {
    grid-column: 1/-1;
  }
  .summary-head {
    align-items: flex-start;
  }
  .summary-head button {
    font-size: 0;
  }
  .summary-head button svg {
    width: 18px;
  }
}
@media print {
  .back,
  .bottom-actions,
  .final-actions,
  .ai,
  .result-actions {
    display: none;
  }
}
</style>
