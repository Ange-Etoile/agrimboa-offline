<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  ArrowRight,
  CheckCircle2,
  History,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-vue-next";
import AppLayout from "@/layouts/AppLayout.vue";
import { useCalculatorStore } from "@/stores/calculator.store";
import hero from "@/assets/images/calculators/calculator-hero.webp";
import surface from "@/assets/images/calculators/surface-card.webp";
import density from "@/assets/images/calculators/density-card.webp";
import seeds from "@/assets/images/calculators/seeds-card.webp";
import harvest from "@/assets/images/calculators/harvest-card.webp";
import budget from "@/assets/images/calculators/budget-card.webp";
import converter from "@/assets/images/calculators/converter-card.webp";
const { t, locale } = useI18n(),
  router = useRouter(),
  store = useCalculatorStore(),
  search = ref("");
const tools = [
  { id: "surface", image: surface },
  { id: "density", image: density },
  { id: "seeds", image: seeds },
  { id: "harvest", image: harvest },
  { id: "budget", image: budget },
  { id: "converter", image: converter },
];
function open(id: string) {
  router.push(`/calculators/${id}`);
}
function voice() {
  const C =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  if (!C) return;
  const r = new C();
  r.lang = locale.value === "en" ? "en-US" : "fr-FR";
  r.onresult = (e: any) => (search.value = e.results[0][0].transcript);
  r.start();
}
onMounted(() => store.load());
</script>
<template>
  <AppLayout
    ><main class="calc-list">
      <section class="hero">
        <div>
          <p>{{ t("calculators.eyebrow") }}</p>
          <h1>{{ t("calculators.title") }}</h1>
          <span>{{ t("calculators.subtitle") }}</span
          ><label
            ><Search /><input
              v-model="search"
              :placeholder="t('calculators.search')" /><button @click="voice">
              <Mic /></button></label
          ><b><CheckCircle2 />6 {{ t("calculators.offlineTools") }}</b>
        </div>
        <img :src="hero" alt="" />
      </section>
      <section class="page">
        <article class="featured">
          <div class="feature-image">
            <span><Sparkles />{{ t("calculators.recommended") }}</span
            ><img :src="surface" alt="" />
          </div>
          <div>
            <h2>{{ t("calculators.tool.surface.title") }}</h2>
            <p>{{ t("calculators.tool.surface.description") }}</p>
            <div class="badges">
              <span>{{ t("calculators.simple") }}</span
              ><span>{{ t("calculators.noConnection") }}</span
              ><span>{{ t("calculators.localUnits") }}</span>
            </div>
          </div>
          <aside>
            <button @click="open('surface')">
              {{ t("calculators.calculateSurface") }}<ArrowRight /></button
            ><button @click="open('surface')">
              {{ t("calculators.viewExample") }}<ArrowRight />
            </button>
          </aside>
        </article>
        <h2 class="all-title">{{ t("calculators.allTools") }}</h2>
        <div class="tools">
          <article
            v-for="(tool, index) in tools.filter(
              (x) =>
                !search ||
                t(`calculators.tool.${x.id}.title`)
                  .toLowerCase()
                  .includes(search.toLowerCase()),
            )"
            :key="tool.id"
          >
            <img :src="tool.image" alt="" />
            <div>
              <h3>
                {{ index + 1 }}. {{ t(`calculators.tool.${tool.id}.title`) }}
              </h3>
              <p>{{ t(`calculators.tool.${tool.id}.description`) }}</p>
              <button @click="open(tool.id)">
                {{ t("calculators.open") }}<ArrowRight />
              </button>
            </div>
          </article>
        </div>
        <div class="info-grid">
          <section class="recent">
            <History />
            <div>
              <h2>{{ t("calculators.recent") }}</h2>
              <p>
                {{ store.history[0]?.label || store.draft.name }} ·
                {{
                  store.history[0]?.result ||
                  `${store.draft.surfaceM2.toLocaleString()} m²`
                }}
              </p>
            </div>
            <button @click="open(store.history[0]?.step || 'surface')">
              {{ t("calculators.resume") }}<ArrowRight />
            </button>
          </section>
          <section class="warning">
            <ShieldCheck />
            <div>
              <h2>{{ t("calculators.estimatesTitle") }}</h2>
              <p>{{ t("calculators.estimatesText") }}</p>
            </div>
          </section>
        </div>
        <section class="ask">
          <span><Mic /></span>
          <div>
            <h2>{{ t("calculators.needHelp") }}</h2>
            <p>{{ t("calculators.needHelpText") }}</p>
          </div>
          <button @click="open('surface')">
            {{ t("calculators.askAgrimboa") }}<ArrowRight />
          </button>
        </section>
      </section></main
  ></AppLayout>
</template>
<style scoped>
.calc-list {
  color: #152119;
}
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 240px;
  background: #fbfaf4;
}
.hero > div {
  padding: 34px 4vw;
}
.hero p {
  color: #08752c;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}
.hero h1 {
  margin-top: 7px;
  font: 800 34px var(--font-display);
}
.hero > div > span {
  display: block;
  max-width: 600px;
  margin-top: 8px;
  color: #475a73;
  font-size: 13px;
  line-height: 1.5;
}
.hero label {
  display: flex;
  max-width: 480px;
  height: 52px;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  border: 1px solid #dce3de;
  border-radius: 8px;
  background: #fff;
  padding: 0 10px 0 15px;
}
.hero label > svg {
  width: 20px;
}
.hero input {
  flex: 1;
  outline: 0;
  font-size: 12px;
}
.hero label button {
  color: #08752c;
}
.hero > div > b {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  color: #08752c;
  font-size: 11px;
}
.hero > div > b svg {
  width: 16px;
}
.hero > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.page {
  max-width: 1480px;
  margin: auto;
  padding: 18px 52px 70px;
}
.featured {
  display: grid;
  grid-template-columns: 420px 1fr 330px;
  align-items: center;
  overflow: hidden;
  border: 1px solid #cdddcf;
  border-radius: 13px;
  background: #fcfefb;
}
.feature-image {
  position: relative;
  height: 140px;
}
.feature-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.feature-image span {
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
  border-radius: 6px;
  background: #08752c;
  padding: 7px 10px;
  color: white;
  font-size: 10px;
}
.feature-image svg {
  width: 13px;
}
.featured > div:nth-child(2) {
  padding: 18px;
}
.featured h2 {
  font-size: 18px;
  font-weight: 800;
}
.featured p {
  margin-top: 7px;
  color: #50617a;
  font-size: 12px;
}
.badges {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.badges span {
  border: 1px solid #dfe7df;
  border-radius: 6px;
  background: #f6faf6;
  padding: 5px 9px;
  font-size: 9px;
}
.featured aside {
  display: grid;
  gap: 8px;
  border-left: 1px solid #dfe6df;
  padding: 20px;
}
.featured aside button,
.tools button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid #d7e0d9;
  border-radius: 7px;
  padding: 11px;
  font-size: 11px;
}
.featured aside button:first-child,
.tools button {
  background: #08752c;
  color: #fff;
}
.featured svg,
.tools svg {
  width: 15px;
}
.all-title {
  margin: 18px 0 10px;
  font-size: 15px;
  font-weight: 800;
}
.tools {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.tools article {
  display: grid;
  grid-template-columns: 42% 58%;
  overflow: hidden;
  border: 1px solid #dfe5e1;
  border-radius: 11px;
}
.tools img {
  width: 100%;
  height: 126px;
  object-fit: cover;
}
.tools article > div {
  padding: 12px;
}
.tools h3 {
  font-size: 12px;
  font-weight: 800;
}
.tools p {
  height: 35px;
  margin-top: 5px;
  color: #52637a;
  font-size: 10px;
  line-height: 1.4;
}
.tools button {
  width: 120px;
  margin-top: 8px;
  padding: 7px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 15px;
}
.recent,
.warning,
.ask {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #dce5dd;
  border-radius: 12px;
  padding: 16px;
}
.recent > svg,
.warning > svg,
.ask > span {
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: 50%;
  background: #eaf5e9;
  padding: 10px;
  color: #08752c;
}
.recent h2,
.warning h2,
.ask h2 {
  font-size: 13px;
  font-weight: 800;
}
.recent p,
.warning p,
.ask p {
  margin-top: 4px;
  color: #52637a;
  font-size: 10px;
}
.recent button,
.ask button {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  border-radius: 7px;
  background: #08752c;
  padding: 10px 14px;
  color: white;
  font-size: 10px;
}
.recent button svg,
.ask button svg {
  width: 14px;
}
.warning {
  border-color: #f2d99d;
  background: #fffaf0;
}
.ask {
  margin-top: 15px;
}
.ask > span {
  display: grid;
  place-items: center;
  border: 2px solid #08752c;
  background: white;
  padding: 8px;
}
.ask > span svg {
  width: 22px;
}
@media (max-width: 800px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: 420px;
  }
  .hero > div {
    z-index: 1;
    padding: 32px 20px 0;
  }
  .hero h1 {
    font-size: 28px;
  }
  .hero > img {
    height: 220px;
    margin-top: -30px;
  }
  .page {
    padding: 18px 16px 100px;
  }
  .featured {
    grid-template-columns: 1fr;
  }
  .feature-image {
    height: 190px;
    grid-row: 2;
  }
  .featured > div:nth-child(2) {
    grid-row: 1;
  }
  .featured aside {
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid #dfe6df;
    border-left: 0;
  }
  .tools {
    grid-template-columns: 1fr 1fr;
  }
  .tools article {
    grid-template-columns: 45% 55%;
  }
  .tools img {
    height: 150px;
  }
  .tools p {
    height: 58px;
  }
  .tools button {
    width: 100%;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .ask {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .ask button {
    width: 100%;
    justify-content: center;
  }
  .recent {
    flex-wrap: wrap;
  }
  .recent button {
    width: 100%;
    justify-content: center;
    margin: 0;
  }
}
@media (max-width: 440px) {
  .tools {
    grid-template-columns: 1fr 1fr;
  }
  .tools article {
    display: block;
  }
  .tools img {
    height: 115px;
  }
  .tools h3 {
    font-size: 11px;
  }
  .tools p {
    height: 52px;
  }
}
</style>
