import { defineStore } from "pinia";
import { generateDiagnosis, saveDiagnosis } from "@/services/diagnosis-result.service";
import { useDiagnosisStore } from "@/stores/diagnosis.store";
import type { DiagnosisResult } from "@/features/diagnosis/types/diagnosis-result";
import { getDiagnosisHistoryResult } from "@/services/diagnosis-history.service";

const KEY = "agrimboa.diagnosis.latest-result";
export const useDiagnosisResultStore = defineStore("diagnosis-result", {
  state: () => ({ result: null as DiagnosisResult | null, loading: false, error: null as string | null, saved: false }),
  actions: {
    hydrate() { if (this.result) return; const raw = localStorage.getItem(KEY); if (raw) try { this.result = JSON.parse(raw); } catch { localStorage.removeItem(KEY); } },
    async loadSaved(sessionId: string) { this.loading = true; this.error = null; try { this.result = await getDiagnosisHistoryResult(sessionId); this.saved = true; if (!this.result) this.error = "Résultat enregistré introuvable."; } catch (e) { this.error = e instanceof Error ? e.message : "Impossible de charger ce résultat."; } finally { this.loading = false; } },
    async analyze(locale = "fr") {
      if (this.loading) return;
      const diagnosis = useDiagnosisStore(); diagnosis.hydrate();
      if (!diagnosis.answers.crop) { this.error = "Aucune culture sélectionnée."; return; }
      this.loading = true; this.error = null;
      try {
        this.result = await generateDiagnosis(diagnosis.answers, locale);
        localStorage.setItem(KEY, JSON.stringify(this.result));
        try { await saveDiagnosis(this.result, diagnosis.answers, diagnosis.sessionId); this.saved = true; }
        catch (saveError) { console.warn("Le résultat reste disponible localement mais sa sauvegarde SQLite a échoué.", saveError); }
      }
      catch (e) { this.error = e instanceof Error ? e.message : "Analyse impossible."; }
      finally { this.loading = false; }
    },
    async save() { if (!this.result || this.saved) return; const diagnosis = useDiagnosisStore(); await saveDiagnosis(this.result, diagnosis.answers, diagnosis.sessionId); this.saved = true; },
    clear() { this.result = null; this.error = null; this.saved = false; localStorage.removeItem(KEY); },
  },
});
