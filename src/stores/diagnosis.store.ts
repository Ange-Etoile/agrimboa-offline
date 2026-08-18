import { defineStore } from "pinia";

import {
  getQuestionsForCrop,
  isTauriApplication,
} from "@/services/diagnosis.service";

import type {
  CropId,
  DiagnosisAnswers,
  DiagnosisQuestion,
} from "@/features/diagnosis/types/diagnosis";

const STORAGE_KEY =
  "agrimboa.diagnosis.draft";

function emptyAnswers(): DiagnosisAnswers {
  return {
    crop: null,
    parts: [],
    symptoms: [],
    yellowing: null,
    description: "",
    extent: null,
  };
}

interface DiagnosisState {
  answers: DiagnosisAnswers;
  questions: DiagnosisQuestion[];
  questionsLoading: boolean;
  questionsError: string | null;
  hydrated: boolean;
}

export const useDiagnosisStore =
  defineStore("diagnosis", {
    state: (): DiagnosisState => ({
      answers: emptyAnswers(),
      questions: [],
      questionsLoading: false,
      questionsError: null,
      hydrated: false,
    }),

    getters: {
      cropNameKey(state): string {
        if (!state.answers.crop) {
          return "diagnosis.crop.maize";
        }

        return `diagnosis.crop.${state.answers.crop}`;
      },

      questionByCode(state) {
        return (
          code: string,
        ): DiagnosisQuestion | null => {
          return (
            state.questions.find(
              (question) =>
                question.code === code,
            ) ?? null
          );
        };
      },
    },

    actions: {
      hydrate(): void {
        if (this.hydrated) {
          return;
        }

        const storedValue =
          localStorage.getItem(STORAGE_KEY);

        if (storedValue) {
          try {
            const parsed =
              JSON.parse(storedValue) as Partial<DiagnosisAnswers>;

            this.answers = {
              ...emptyAnswers(),
              ...parsed,
            };
          } catch {
            localStorage.removeItem(
              STORAGE_KEY,
            );
          }
        }

        this.hydrated = true;
      },

      persist(): void {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(this.answers),
        );
      },

      async selectCrop(
        crop: CropId,
      ): Promise<void> {
        const cropChanged =
          this.answers.crop !== crop;

        this.answers.crop = crop;

        if (cropChanged) {
          this.answers.parts = [];
          this.answers.symptoms = [];
          this.answers.yellowing = null;
          this.answers.description = "";
          this.answers.extent = null;
          this.questions = [];
        }

        this.persist();

        await this.loadQuestions(crop);
      },

      async loadQuestions(
        cropId?: CropId,
      ): Promise<void> {
        const selectedCrop =
          cropId ?? this.answers.crop;

        if (!selectedCrop) {
          this.questions = [];
          return;
        }

        /*
         * Dans npm run dev, les questions
         * de secours restent dans le frontend.
         * Dans Tauri, SQLite devient la source.
         */
        if (!isTauriApplication()) {
          this.questions = [];
          this.questionsError = null;
          return;
        }

        this.questionsLoading = true;
        this.questionsError = null;

        try {
          this.questions =
            await getQuestionsForCrop(
              selectedCrop,
            );
        } catch (error: unknown) {
          this.questions = [];

          this.questionsError =
            error instanceof Error
              ? error.message
              : "Impossible de charger les questions.";
        } finally {
          this.questionsLoading = false;
        }
      },

      toggleMany(
        field: "parts" | "symptoms",
        value: string,
      ): void {
        const values =
          this.answers[field];

        this.answers[field] =
          values.includes(value)
            ? values.filter(
                (item) =>
                  item !== value,
              )
            : [...values, value];

        this.persist();
      },

      clearMany(
        field: "parts" | "symptoms",
      ): void {
        this.answers[field] = [];
        this.persist();
      },

      reset(): void {
        this.answers = emptyAnswers();
        this.questions = [];
        this.questionsError = null;

        localStorage.removeItem(
          STORAGE_KEY,
        );
      },
    },
  });