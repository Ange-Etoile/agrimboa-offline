import { defineStore } from "pinia";
import { generateDiagnosis, saveDiagnosis } from "@/services/diagnosis-result.service";
import { useDiagnosisStore } from "@/stores/diagnosis.store";
import type { DiagnosisResult } from "@/features/diagnosis/types/diagnosis-result";

const KEY = "agrimboa.diagnosis.latest-result";
export const useDiagnosisResultStore = defineStore("diagnosis-result", {
  state: () => ({ result: null as DiagnosisResult | null, loading: false, error: null as string | null, saved: false }),
  actions: {
    hydrate() { if (this.result) return; const raw = localStorage.getItem(KEY); if (raw) try { this.result = JSON.parse(raw); } catch { localStorage.removeItem(KEY); } },
    async analyze(locale = "fr") {
      if (this.loading) return;
      const diagnosis = useDiagnosisStore(); diagnosis.hydrate();
      if (!diagnosis.answers.crop) { this.error = "Aucune culture sélectionnée."; return; }
      this.loading = true; this.error = null;
      try { this.result = await generateDiagnosis(diagnosis.answers, locale); localStorage.setItem(KEY, JSON.stringify(this.result)); }
      catch (e) { this.error = e instanceof Error ? e.message : "Analyse impossible."; }
      finally { this.loading = false; }
    },
    async save() { if (!this.result || this.saved) return; await saveDiagnosis(this.result, useDiagnosisStore().answers); this.saved = true; },
    clear() { this.result = null; this.error = null; this.saved = false; localStorage.removeItem(KEY); },
  },
});
