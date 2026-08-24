import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { CropId } from "@/features/diagnosis/types/diagnosis";
import type { DiagnosisHistoryItem, HistoryFilters, HistoryTab } from "@/features/history/types/history";
import { listDiagnosisHistory } from "@/services/diagnosis-history.service";

export const useDiagnosisHistoryStore = defineStore("diagnosis-history", () => {
  const items = ref<DiagnosisHistoryItem[]>([]); const loading = ref(false); const error = ref<string | null>(null); const page = ref(1); const pageSize = 3;
  const filters = ref<HistoryFilters>({ search: "", crop: "all", period: "all", sort: "recent", tab: "all" });
  const counts = computed(() => ({ all: items.value.length, follow_up: items.value.filter((x) => x.status === "follow_up" || x.status === "watch").length, completed: items.value.filter((x) => x.status === "completed").length, draft: items.value.filter((x) => x.status === "draft").length }));
  const filtered = computed(() => {
    const now = Date.now(); const query = filters.value.search.trim().toLowerCase();
    return items.value.filter((item) => {
      if (filters.value.tab === "follow_up" && !["follow_up", "watch"].includes(item.status)) return false;
      if (filters.value.tab !== "all" && filters.value.tab !== "follow_up" && item.status !== filters.value.tab) return false;
      if (filters.value.crop !== "all" && item.crop !== filters.value.crop) return false;
      if (query && !`${item.crop} ${item.title} ${item.summary}`.toLowerCase().includes(query)) return false;
      const age = now - new Date(item.createdAt).getTime();
      if (filters.value.period === "7d" && age > 7 * 86400000) return false;
      if (filters.value.period === "30d" && age > 30 * 86400000) return false;
      if (filters.value.period === "year" && age > 365 * 86400000) return false;
      return true;
    }).sort((a, b) => filters.value.sort === "confidence" ? b.confidence - a.confidence : filters.value.sort === "oldest" ? +new Date(a.createdAt) - +new Date(b.createdAt) : +new Date(b.createdAt) - +new Date(a.createdAt));
  });
  const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)));
  const paginated = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize));
  const upcoming = computed(() => items.value.filter((x) => x.nextFollowUpAt).sort((a, b) => +new Date(a.nextFollowUpAt!) - +new Date(b.nextFollowUpAt!)).slice(0, 3));
  async function load() { loading.value = true; error.value = null; try { items.value = await listDiagnosisHistory(); page.value = 1; } catch (e) { error.value = e instanceof Error ? e.message : "Impossible de charger l’historique."; } finally { loading.value = false; } }
  function setTab(tab: HistoryTab) { filters.value.tab = tab; page.value = 1; }
  function setCrop(crop: CropId | "all") { filters.value.crop = crop; page.value = 1; }
  return { items, loading, error, page, pageSize, filters, counts, filtered, paginated, pageCount, upcoming, load, setTab, setCrop };
});
