<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  PlusCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-vue-next";
import AppLayout from "@/layouts/AppLayout.vue";
import CropHistoryImage from "@/components/history/CropHistoryImage.vue";
import HistoryDiagnosisCard from "@/components/history/HistoryDiagnosisCard.vue";
import type {
  DiagnosisHistoryItem,
  HistoryTab,
} from "@/features/history/types/history";
import { useDiagnosisHistoryStore } from "@/stores/diagnosis-history.store";

const router = useRouter();
const { t } = useI18n();
const store = useDiagnosisHistoryStore();
const showFilters = ref(false);
const tabs: Array<{ id: HistoryTab; key: string }> = [
  { id: "all", key: "all" },
  { id: "follow_up", key: "ongoing" },
  { id: "completed", key: "completed" },
  { id: "draft", key: "drafts" },
];
const visibleStart = computed(() =>
  store.filtered.length ? (store.page - 1) * store.pageSize + 1 : 0,
);
const visibleEnd = computed(() =>
  Math.min(store.page * store.pageSize, store.filtered.length),
);
function open(item: DiagnosisHistoryItem, section = "overview") {
  router.push({
    name: "diagnosis-result",
    params: { section },
    query: { session: item.sessionId },
  });
}
function exportItems(items = store.filtered) {
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `agrimboa-historique-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
function followDate(item: DiagnosisHistoryItem) {
  if (!item.nextFollowUpAt) return "";
  const days = Math.max(
    0,
    Math.ceil((+new Date(item.nextFollowUpAt) - Date.now()) / 86400000),
  );
  return days === 0
    ? t("history.todayDue")
    : days === 1
      ? t("history.tomorrow")
      : t("history.inDays", { days });
}
onMounted(() => store.load());
</script>

<template>
  <AppLayout
    ><main
      class="history-page mx-auto w-full max-w-[1488px] px-4 py-7 sm:px-8 lg:px-12"
    >
      <header class="history-heading">
        <div>
          <p>{{ t("history.eyebrow") }}</p>
          <h1>{{ t("history.title") }}</h1>
          <span>{{ t("history.subtitle") }}</span>
        </div>
        <div class="heading-actions">
          <button class="new" @click="router.push('/diagnosis/crop')">
            <PlusCircle />{{ t("history.newDiagnosis") }}</button
          ><button @click="exportItems()">
            <Download />{{ t("history.exportHistory") }}
          </button>
        </div>
      </header>
      <section class="history-shell">
        <div class="filters-top">
          <label class="search"
            ><Search /><input
              v-model="store.filters.search"
              :placeholder="t('history.search')" /></label
          ><button class="mobile-filter" @click="showFilters = !showFilters">
            <Filter />{{ t("history.filters") }}
          </button>
          <div class="filter-selects" :class="{ open: showFilters }">
            <select v-model="store.filters.crop">
              <option value="all">{{ t("history.allCrops") }}</option>
              <option value="maize">{{ t("history.maize") }}</option>
              <option value="cassava">{{ t("history.cassava") }}</option>
              <option value="tomato">{{ t("history.tomato") }}</option>
              <option value="plantain">
                {{ t("history.plantain") }}
              </option></select
            ><select v-model="store.filters.period">
              <option value="all">{{ t("history.allPeriods") }}</option>
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
              <option value="year">1 an</option></select
            ><select v-model="store.filters.sort">
              <option value="recent">{{ t("history.recent") }}</option>
              <option value="oldest">{{ t("history.oldest") }}</option>
              <option value="confidence">
                {{ t("history.confidence") }}
              </option></select
            ><span class="local-filter"
              ><CheckCircle2 />{{ t("history.local") }}</span
            >
          </div>
        </div>
        <nav class="history-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="{ active: store.filters.tab === tab.id }"
            @click="store.setTab(tab.id)"
          >
            {{ t(`history.${tab.key}`) }}<b>{{ store.counts[tab.id] }}</b>
          </button>
        </nav>
        <div v-if="store.loading" class="empty-state">
          {{ t("history.loading") }}
        </div>
        <div v-else-if="store.error" class="empty-state error">
          {{ store.error }}
        </div>
        <div v-else class="history-layout">
          <section class="history-list">
            <h2>{{ t("history.today") }}</h2>
            <div v-if="!store.paginated.length" class="empty-state">
              <SlidersHorizontal />{{ t("history.noResult") }}
            </div>
            <HistoryDiagnosisCard
              v-for="item in store.paginated"
              :key="item.sessionId"
              :item="item"
              @open="open(item)"
              @follow="open(item, 'followup')"
              @export="exportItems([item])"
            />
          </section>
          <aside>
            <section class="side-card">
              <h2><CalendarDays />{{ t("history.upcoming") }}</h2>
              <button
                v-for="item in store.upcoming"
                :key="item.sessionId"
                class="upcoming"
                @click="open(item, 'followup')"
              >
                <span><CropHistoryImage :crop="item.crop" /></span>
                <div>
                  <b>{{ t(`history.${item.crop}`) }}</b
                  ><strong>{{ followDate(item) }}</strong>
                </div></button
              ><button class="all-follow" @click="store.setTab('follow_up')">
                <CalendarDays />{{ t("history.viewAll") }}
              </button>
            </section>
            <section class="side-card privacy">
              <ShieldCheck />
              <div>
                <h2>{{ t("history.localTitle") }}</h2>
                <p>
                  {{ store.items.length }} {{ t("history.diagnosticsStored") }}
                </p>
                <button>{{ t("history.manage") }}<ChevronRight /></button>
              </div>
            </section>
          </aside>
        </div>
        <footer class="history-pagination">
          <span
            >{{ visibleStart }}–{{ visibleEnd }} {{ t("history.of") }}
            {{ store.filtered.length }} {{ t("history.diagnostics") }}</span
          >
          <div>
            <button :disabled="store.page <= 1" @click="store.page--">
              <ChevronLeft />{{ t("history.previous") }}</button
            ><button
              v-for="page in store.pageCount"
              :key="page"
              :class="{ active: store.page === page }"
              @click="store.page = page"
            >
              {{ page }}</button
            ><button
              :disabled="store.page >= store.pageCount"
              @click="store.page++"
            >
              {{ t("history.next") }}<ChevronRight />
            </button>
          </div>
        </footer>
      </section></main
  ></AppLayout>
</template>

<style scoped>
.history-page {
  color: #17231c;
}
.history-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}
.history-heading > div:first-child > p {
  font-size: 12px;
  font-weight: 800;
  color: #08752c;
  letter-spacing: 0.03em;
}
.history-heading h1 {
  margin-top: 9px;
  font-family: var(--font-display);
  font-size: 31px;
  font-weight: 800;
  line-height: 1.15;
}
.history-heading span {
  display: block;
  margin-top: 10px;
  font-size: 13px;
  color: #52637a;
}
.heading-actions {
  display: flex;
  gap: 14px;
}
.heading-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 53px;
  border: 1px solid #d7dde2;
  border-radius: 8px;
  padding: 0 24px;
  font-size: 13px;
  font-weight: 650;
}
.heading-actions svg {
  width: 18px;
}
.heading-actions .new {
  border-color: #08752c;
  background: #08752c;
  color: white;
}
.history-shell {
  overflow: hidden;
  border: 1px solid #dfe4e1;
  border-radius: 13px;
  background: white;
}
.filters-top {
  display: grid;
  grid-template-columns: minmax(280px, 1.2fr) minmax(560px, 2.8fr);
  gap: 14px;
  padding: 18px;
}
.search {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 53px;
  border: 1px solid #dbe1e5;
  border-radius: 8px;
  padding: 0 14px;
}
.search svg {
  width: 20px;
}
.search input {
  width: 100%;
  font-size: 12px;
  outline: none;
}
.filter-selects {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 14px;
}
.filter-selects select,
.local-filter {
  height: 53px;
  border: 1px solid #dbe1e5;
  border-radius: 8px;
  background: white;
  padding: 0 14px;
  font-size: 12px;
}
.local-filter {
  display: flex;
  align-items: center;
  gap: 9px;
  border-color: #55a26c;
  color: #08752c;
  white-space: nowrap;
}
.local-filter svg {
  width: 18px;
}
.mobile-filter {
  display: none;
}
.history-tabs {
  display: flex;
  gap: 20px;
  border-top: 1px solid #edf0ee;
  border-bottom: 1px solid #e4e8e5;
  padding: 0 20px;
}
.history-tabs button {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 3px solid transparent;
  padding: 18px 28px 15px;
  font-size: 13px;
  color: #273852;
}
.history-tabs button.active {
  border-color: #08752c;
  color: #08752c;
}
.history-tabs b {
  display: grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 50%;
  background: #e4e7e9;
  font-size: 10px;
}
.history-tabs .active b {
  background: #08752c;
  color: white;
}
.history-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
}
.history-list {
  display: grid;
  gap: 12px;
  padding: 18px;
  border-right: 1px solid #edf0ee;
}
.history-list > h2 {
  font-size: 15px;
  font-weight: 800;
}
.history-layout aside {
  display: grid;
  align-content: start;
  gap: 16px;
  padding: 18px;
}
.side-card {
  border: 1px solid #dfe5e1;
  border-radius: 12px;
  padding: 18px;
}
.side-card > h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 800;
}
.side-card > h2 svg {
  width: 18px;
  color: #08752c;
}
.upcoming {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  border: 1px solid #e2e7e3;
  border-radius: 9px;
  padding: 8px;
  text-align: left;
}
.upcoming > span {
  width: 62px;
  height: 58px;
}
.upcoming b,
.upcoming strong {
  display: block;
  font-size: 12px;
}
.upcoming strong {
  margin-top: 4px;
  color: #08752c;
}
.all-follow {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
  border: 1px solid #16813b;
  border-radius: 8px;
  padding: 13px;
  color: #08752c;
  font-size: 12px;
  font-weight: 700;
}
.all-follow svg {
  width: 18px;
}
.privacy {
  display: flex;
  gap: 14px;
}
.privacy > svg {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #eff8ef;
  padding: 9px;
  color: #08752c;
}
.privacy h2 {
  font-size: 12px;
}
.privacy p {
  margin-top: 5px;
  font-size: 11px;
  color: #607089;
}
.privacy button {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: #08752c;
  font-size: 11px;
}
.privacy button svg {
  width: 15px;
}
.history-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e6eae7;
  padding: 17px 20px;
  font-size: 11px;
  color: #52637a;
}
.history-pagination > div {
  display: flex;
  gap: 8px;
}
.history-pagination button {
  display: flex;
  min-width: 38px;
  height: 40px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid #dde3df;
  border-radius: 7px;
  padding: 0 12px;
}
.history-pagination button.active {
  background: #08752c;
  color: white;
}
.history-pagination button:disabled {
  opacity: 0.4;
}
.history-pagination svg {
  width: 15px;
}
.empty-state {
  display: grid;
  min-height: 180px;
  place-items: center;
  gap: 10px;
  padding: 30px;
  text-align: center;
  color: #64736a;
}
.empty-state svg {
  width: 30px;
}
.empty-state.error {
  color: #b42318;
}
@media (max-width: 900px) {
  .history-page {
    padding: 22px 18px 110px;
  }
  .history-heading {
    display: block;
  }
  .history-heading h1 {
    font-size: 27px;
  }
  .history-heading span {
    font-size: 12px;
    line-height: 1.6;
  }
  .heading-actions {
    margin-top: 24px;
  }
  .heading-actions button {
    height: 58px;
    flex: 1;
    padding: 0 12px;
  }
  .filters-top {
    grid-template-columns: 1fr auto;
    padding: 16px;
  }
  .mobile-filter {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #dbe1e5;
    border-radius: 8px;
    padding: 0 18px;
  }
  .mobile-filter svg {
    width: 18px;
  }
  .filter-selects {
    display: none;
    grid-column: 1/-1;
    grid-template-columns: 1fr 1fr;
  }
  .filter-selects.open {
    display: grid;
  }
  .filter-selects select:nth-child(2) {
    display: none;
  }
  .local-filter {
    justify-content: center;
  }
  .history-tabs {
    overflow-x: auto;
    gap: 0;
    padding: 0;
  }
  .history-tabs button {
    flex: none;
    padding: 17px 22px 14px;
  }
  .history-layout {
    display: flex;
    flex-direction: column;
  }
  .history-list {
    border-right: 0;
    padding: 16px;
  }
  .history-layout aside {
    padding: 0 16px 18px;
  }
  .history-pagination {
    padding: 16px;
  }
  .history-pagination button {
    font-size: 0;
    padding: 0 10px;
  }
  .history-pagination button.active {
    font-size: 11px;
  }
  .history-pagination button svg {
    display: block;
  }
  .history-pagination
    > div
    button:not(.active):not(:first-child):not(:last-child) {
    font-size: 11px;
  }
}
</style>
