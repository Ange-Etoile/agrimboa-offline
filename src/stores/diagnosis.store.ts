import { defineStore } from "pinia";
import { getQuestionsForCrop, isTauriApplication } from "@/services/diagnosis.service";
import { generateNextDiagnosisQuestion, saveGeneratedQuestion } from "@/services/local-ai.service";
import type { AiProvider, CropId, DiagnosisAnswers, DiagnosisQuestion, DynamicAnswer, DynamicQuestionOrigin } from "@/features/diagnosis/types/diagnosis";

const STORAGE_KEY = "agrimboa.diagnosis.draft";
const MAX_DYNAMIC_QUESTIONS = 3;

function emptyAnswers(): DiagnosisAnswers {
  return { crop: null, parts: [], symptoms: [], yellowing: null, description: "", extent: null, voiceTranscript: "", followUpAnswers: {} };
}

interface DiagnosisState {
  answers: DiagnosisAnswers;
  questions: DiagnosisQuestion[];
  questionsLoading: boolean;
  questionsError: string | null;
  hydrated: boolean;
  currentDynamicQuestion: DiagnosisQuestion | null;
  currentDynamicAnswer: DynamicAnswer;
  dynamicReason: string;
  dynamicLoading: boolean;
  dynamicError: string | null;
  dynamicProvider: AiProvider | null;
  dynamicModel: string;
  dynamicOrigin: DynamicQuestionOrigin | null;
  askedQuestionCodes: string[];
  askedQuestionTitles: string[];
  sessionId: string;
  collectionComplete: boolean;
}

export const useDiagnosisStore = defineStore("diagnosis", {
  state: (): DiagnosisState => ({
    answers: emptyAnswers(), questions: [], questionsLoading: false, questionsError: null, hydrated: false,
    currentDynamicQuestion: null, currentDynamicAnswer: "", dynamicReason: "", dynamicLoading: false,
    dynamicError: null, dynamicProvider: null, dynamicModel: "", dynamicOrigin: null,
    askedQuestionCodes: [], askedQuestionTitles: [], sessionId: "", collectionComplete: false,
  }),
  getters: {
    cropNameKey(state): string { return state.answers.crop ? `diagnosis.crop.${state.answers.crop}` : "diagnosis.crop.maize"; },
    questionByCode(state) {
      return (code: string): DiagnosisQuestion | null => state.questions.find((question) => question.code === code || question.code.endsWith(`_${code}`)) ?? null;
    },
    followUpQuestions(state): DiagnosisQuestion[] { return state.questions.filter((question) => question.phase === "questions"); },
  },
  actions: {
    hydrate(): void {
      if (this.hydrated) return;
      const storedValue = localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        try {
          const parsed = JSON.parse(storedValue) as Partial<DiagnosisAnswers> & { askedQuestionCodes?: string[]; askedQuestionTitles?: string[]; sessionId?: string; collectionComplete?: boolean };
          this.answers = { ...emptyAnswers(), ...parsed, followUpAnswers: parsed.followUpAnswers ?? {} };
          this.askedQuestionCodes = parsed.askedQuestionCodes ?? Object.keys(this.answers.followUpAnswers);
          this.askedQuestionTitles = parsed.askedQuestionTitles ?? [];
          this.sessionId = parsed.sessionId ?? "";
          this.collectionComplete = parsed.collectionComplete ?? false;
        } catch { localStorage.removeItem(STORAGE_KEY); }
      }
      this.hydrated = true;
    },
    persist(): void {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...this.answers, askedQuestionCodes: this.askedQuestionCodes, askedQuestionTitles: this.askedQuestionTitles, sessionId: this.sessionId, collectionComplete: this.collectionComplete }));
    },
    async selectCrop(crop: CropId): Promise<void> {
      const changed = this.answers.crop !== crop;
      this.answers.crop = crop;
      if (changed) {
        this.answers = { ...emptyAnswers(), crop };
        this.questions = []; this.askedQuestionCodes = []; this.askedQuestionTitles = []; this.sessionId = ""; this.currentDynamicQuestion = null;
        this.dynamicProvider = null; this.dynamicModel = ""; this.dynamicOrigin = null; this.collectionComplete = false;
      }
      this.persist();
      await this.loadQuestions(crop);
    },
    async loadQuestions(cropId?: CropId): Promise<void> {
      const selectedCrop = cropId ?? this.answers.crop;
      if (!selectedCrop) { this.questions = []; return; }
      if (!isTauriApplication()) { this.questions = []; this.questionsError = null; return; }
      this.questionsLoading = true; this.questionsError = null;
      try { this.questions = await getQuestionsForCrop(selectedCrop); }
      catch (error: unknown) { this.questions = []; this.questionsError = error instanceof Error ? error.message : "Impossible de charger les questions."; }
      finally { this.questionsLoading = false; }
    },
    toggleMany(field: "parts" | "symptoms", value: string): void {
      const values = this.answers[field];
      this.answers[field] = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      this.persist();
    },
    clearMany(field: "parts" | "symptoms"): void { this.answers[field] = []; this.persist(); },
    setDescription(value: string): void { this.answers.description = value; this.persist(); },
    appendVoiceTranscript(value: string): void {
      const transcript = value.trim();
      if (!transcript) return;
      this.answers.voiceTranscript = transcript;
      this.answers.description = [this.answers.description.trim(), transcript].filter(Boolean).join(" ").slice(0, 600);
      this.persist();
    },
    setDynamicAnswer(value: DynamicAnswer): void { this.currentDynamicAnswer = value; },
    async prepareNextDynamicQuestion(): Promise<void> {
      if (this.dynamicLoading) return;
      if (this.askedQuestionCodes.length >= MAX_DYNAMIC_QUESTIONS) {
        this.currentDynamicQuestion = null; this.collectionComplete = true;
        this.dynamicReason = "Les précisions nécessaires ont été recueillies. L’analyse peut commencer."; this.persist(); return;
      }
      this.dynamicLoading = true; this.dynamicError = null; this.collectionComplete = false;
      try {
        const decision = await generateNextDiagnosisQuestion(this.answers, this.followUpQuestions, this.askedQuestionCodes, this.askedQuestionTitles);
        this.dynamicReason = decision.reason; this.dynamicProvider = decision.provider; this.dynamicModel = decision.model; this.dynamicOrigin = decision.origin;
        if (decision.complete || !decision.questionCode) {
          this.currentDynamicQuestion = null; this.collectionComplete = true; this.persist(); return;
        }
        const question = decision.question;
        if (!question) throw new Error("Le moteur n’a pas fourni de question exploitable.");
        if (!this.sessionId) this.sessionId = crypto.randomUUID();
        await saveGeneratedQuestion(this.sessionId, question, decision);
        this.currentDynamicQuestion = question;
        this.currentDynamicAnswer = question.answerType === "multiple_choice" ? [] : "";
      } catch (error: unknown) {
        this.currentDynamicQuestion = null;
        this.dynamicError = error instanceof Error ? error.message : "Impossible d’interroger les moteurs IA.";
      } finally { this.dynamicLoading = false; }
    },
    async submitDynamicAnswer(): Promise<void> {
      const question = this.currentDynamicQuestion;
      if (!question || this.dynamicLoading) return;
      this.answers.followUpAnswers[question.code] = this.currentDynamicAnswer;
      if (question.code === "extent" && typeof this.currentDynamicAnswer === "string") this.answers.extent = this.currentDynamicAnswer;
      if (!this.askedQuestionCodes.includes(question.code)) this.askedQuestionCodes.push(question.code);
      if (!this.askedQuestionTitles.includes(question.titleKey)) this.askedQuestionTitles.push(question.titleKey);
      this.currentDynamicQuestion = null; this.currentDynamicAnswer = ""; this.persist();
      await this.prepareNextDynamicQuestion();
    },
    reset(): void {
      this.answers = emptyAnswers(); this.questions = []; this.questionsError = null; this.currentDynamicQuestion = null;
      this.currentDynamicAnswer = ""; this.dynamicReason = ""; this.dynamicError = null; this.dynamicProvider = null;
      this.dynamicModel = ""; this.dynamicOrigin = null; this.askedQuestionCodes = []; this.askedQuestionTitles = []; this.sessionId = ""; this.collectionComplete = false;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});
