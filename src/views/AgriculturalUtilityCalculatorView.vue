<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from "vue";

import { useI18n } from "vue-i18n";

import {
  useRoute,
  useRouter,
} from "vue-router";

import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Copy,
  Download,
  Info,
  Save,
  Sparkles,
} from "lucide-vue-next";

import AppLayout from "@/layouts/AppLayout.vue";

import { useCalculatorStore } from "@/stores/calculator.store";

import type { CalculatorStep } from "@/features/calculators/types/calculator";

type UtilityCalculatorStep =
  | "harvest"
  | "budget"
  | "converter";

const route = useRoute();
const router = useRouter();

const store = useCalculatorStore();

const { t, locale } = useI18n();

const firstValue = ref(1);
const secondValue = ref(1);

const step =
  computed<UtilityCalculatorStep>(
    () => {
      const routeStep =
        route.params.step;

      if (
        routeStep === "harvest" ||
        routeStep === "budget" ||
        routeStep === "converter"
      ) {
        return routeStep;
      }

      return "converter";
    },
  );

const result = computed(() => {
  if (step.value === "harvest") {
    return (
      firstValue.value *
      secondValue.value
    );
  }

  if (step.value === "budget") {
    return (
      secondValue.value -
      firstValue.value
    );
  }

  return firstValue.value * 10_000;
});

const unit = computed(() => {
  if (step.value === "harvest") {
    return "t";
  }

  if (step.value === "budget") {
    return "FCFA";
  }

  return "m²";
});

const formattedFirstValue =
  computed(() => {
    return new Intl.NumberFormat(
      locale.value,
      {
        maximumFractionDigits: 2,
      },
    ).format(firstValue.value);
  });

const formattedSecondValue =
  computed(() => {
    return new Intl.NumberFormat(
      locale.value,
      {
        maximumFractionDigits: 2,
      },
    ).format(secondValue.value);
  });

const formattedResult = computed(() => {
  const value =
    new Intl.NumberFormat(
      locale.value,
      {
        maximumFractionDigits: 2,
      },
    ).format(result.value);

  return `${value} ${unit.value}`;
});

const calculationOperator =
  computed(() => {
    return step.value === "budget"
      ? "−"
      : "×";
  });

const firstValueUnit = computed(() => {
  if (step.value === "budget") {
    return "FCFA";
  }

  return "ha";
});

const secondValueUnit =
  computed(() => {
    if (step.value === "harvest") {
      return "t/ha";
    }

    if (step.value === "budget") {
      return "FCFA";
    }

    return "";
  });

const isNegativeBudget =
  computed(() => {
    return (
      step.value === "budget" &&
      result.value < 0
    );
  });

async function calculate(): Promise<void> {
  await store.save(
    step.value as CalculatorStep,
    t(
      `calculators.tool.${step.value}.title`,
    ),
    formattedResult.value,
  );

  void store.explain(
    step.value as CalculatorStep,
    locale.value,
  );
}

async function copyResult(): Promise<void> {
  if (!navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(
    formattedResult.value,
  );
}

function printResult(): void {
  window.print();
}

function goBack(): void {
  void router.push({
    name: "calculators",
  });
}

onMounted(async () => {
  await store.load();
});
</script>

<template>
  <AppLayout>
    <main
      class="mx-auto w-full max-w-[1240px] px-4 pt-5 pb-24 text-body sm:px-6 lg:px-[38px] lg:pt-6"
    >
      <!-- Fil d’Ariane -->
      <nav
        class="flex items-center gap-2 text-[11px] text-muted"
        aria-label="Fil d’Ariane"
      >
        <button
          type="button"
          class="transition-colors hover:text-primary"
          @click="goBack"
        >
          {{ t("calculators.title") }}
        </button>

        <span class="text-muted-soft">
          /
        </span>

        <span>
          {{
            t(
              `calculators.tool.${step}.title`,
            )
          }}
        </span>
      </nav>

      <!-- Retour -->
      <button
        type="button"
        class="mt-4 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5 text-[11px] font-semibold text-primary transition-colors hover:border-primary hover:bg-primary-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary print:hidden"
        @click="goBack"
      >
        <ArrowLeft
          class="size-4"
          aria-hidden="true"
        />

        {{ t("calculators.back") }}
      </button>

      <!-- En-tête -->
      <header
        class="mt-7 text-center lg:-mt-8"
      >
        <p
          class="text-[10px] font-extrabold tracking-[0.08em] text-primary uppercase"
        >
          {{
            t(
              "calculators.offlineCalculator",
            )
          }}
        </p>

        <h1
          class="mt-1.5 font-display text-[27px] leading-tight font-extrabold text-heading lg:text-[31px]"
        >
          {{
            t(
              `calculators.tool.${step}.title`,
            )
          }}
        </h1>

        <p
          class="mx-auto mt-1.5 max-w-2xl text-xs leading-relaxed text-muted"
        >
          {{
            t(
              `calculators.pageDescriptions.${step}`,
            )
          }}
        </p>
      </header>

      <!-- Formulaire et explication -->
      <div
        class="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.3fr]"
      >
        <!-- Formulaire -->
        <section
          class="rounded-card border border-line bg-surface p-5 shadow-card"
        >
          <h2
            class="text-[15px] font-extrabold text-primary"
          >
            1.
            {{
              t(
                "calculators.enterValues",
              )
            }}
          </h2>

          <!-- Estimation de récolte -->
          <template
            v-if="step === 'harvest'"
          >
            <label
              class="relative mt-4 grid grid-cols-[44%_56%] items-center gap-2 text-[11px] text-body sm:grid-cols-[46%_54%]"
            >
              <span>
                {{
                  t(
                    "calculators.areaHectares",
                  )
                }}
              </span>

              <input
                v-model.number="
                  firstValue
                "
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                class="h-10 w-full rounded-lg border border-line-strong bg-surface pr-12 pl-3 text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <span
                class="pointer-events-none absolute right-3 text-[10px] text-muted"
              >
                ha
              </span>
            </label>

            <label
              class="relative mt-3 grid grid-cols-[44%_56%] items-center gap-2 text-[11px] text-body sm:grid-cols-[46%_54%]"
            >
              <span>
                {{
                  t(
                    "calculators.expectedYield",
                  )
                }}
              </span>

              <input
                v-model.number="
                  secondValue
                "
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                class="h-10 w-full rounded-lg border border-line-strong bg-surface pr-14 pl-3 text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <span
                class="pointer-events-none absolute right-3 text-[10px] text-muted"
              >
                t/ha
              </span>
            </label>
          </template>

          <!-- Budget de culture -->
          <template
            v-else-if="
              step === 'budget'
            "
          >
            <label
              class="relative mt-4 grid grid-cols-[44%_56%] items-center gap-2 text-[11px] text-body sm:grid-cols-[46%_54%]"
            >
              <span>
                {{
                  t(
                    "calculators.totalCosts",
                  )
                }}
              </span>

              <input
                v-model.number="
                  firstValue
                "
                type="number"
                min="0"
                step="100"
                inputmode="numeric"
                class="h-10 w-full rounded-lg border border-line-strong bg-surface pr-16 pl-3 text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <span
                class="pointer-events-none absolute right-3 text-[10px] text-muted"
              >
                FCFA
              </span>
            </label>

            <label
              class="relative mt-3 grid grid-cols-[44%_56%] items-center gap-2 text-[11px] text-body sm:grid-cols-[46%_54%]"
            >
              <span>
                {{
                  t(
                    "calculators.expectedRevenue",
                  )
                }}
              </span>

              <input
                v-model.number="
                  secondValue
                "
                type="number"
                min="0"
                step="100"
                inputmode="numeric"
                class="h-10 w-full rounded-lg border border-line-strong bg-surface pr-16 pl-3 text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <span
                class="pointer-events-none absolute right-3 text-[10px] text-muted"
              >
                FCFA
              </span>
            </label>
          </template>

          <!-- Convertisseur d’unités -->
          <template v-else>
            <label
              class="relative mt-4 grid grid-cols-[44%_56%] items-center gap-2 text-[11px] text-body sm:grid-cols-[46%_54%]"
            >
              <span>
                {{
                  t(
                    "calculators.hectaresToConvert",
                  )
                }}
              </span>

              <input
                v-model.number="
                  firstValue
                "
                type="number"
                min="0"
                step="0.01"
                inputmode="decimal"
                class="h-10 w-full rounded-lg border border-line-strong bg-surface pr-12 pl-3 text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <span
                class="pointer-events-none absolute right-3 text-[10px] text-muted"
              >
                ha
              </span>
            </label>

            <div
              class="mt-4 rounded-xl bg-primary-soft p-[18px] text-center text-sm font-extrabold text-primary"
            >
              1 ha = 10 000 m²
            </div>
          </template>

          <!-- Conseil -->
          <p
            class="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-muted"
          >
            <Info
              class="mt-0.5 size-[15px] shrink-0"
              aria-hidden="true"
            />

            <span>
              {{
                t(
                  `calculators.utilityHints.${step}`,
                )
              }}
            </span>
          </p>

          <!-- Bouton de calcul -->
          <button
            type="button"
            class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-[11px] font-bold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-text"
            @click="calculate"
          >
            <Calculator
              class="size-[17px]"
              aria-hidden="true"
            />

            {{
              t(
                "calculators.calculateNow",
              )
            }}
          </button>
        </section>

        <!-- Comprendre le calcul -->
        <section
          class="rounded-card border border-line bg-surface p-5 shadow-card"
        >
          <h2
            class="text-[15px] font-extrabold text-primary"
          >
            2.
            {{
              t(
                "calculators.understandCalculation",
              )
            }}
          </h2>

          <div
            class="mt-[18px] flex min-h-[150px] flex-wrap items-center justify-center gap-2 rounded-xl bg-surface-soft px-3 py-5 sm:gap-5"
          >
            <!-- Première valeur -->
            <div
              class="rounded-xl border border-brand-200 bg-surface px-3 py-3 text-center text-lg font-extrabold text-primary sm:px-[18px] sm:py-[18px] sm:text-[23px]"
            >
              <strong>
                {{ formattedFirstValue }}
              </strong>

              <small
                class="mt-1 block text-[9px] font-medium text-muted"
              >
                {{ firstValueUnit }}
              </small>
            </div>

            <span
              class="text-xl font-bold text-heading"
            >
              {{ calculationOperator }}
            </span>

            <!-- Deuxième valeur -->
            <div
              v-if="
                step !== 'converter'
              "
              class="rounded-xl border border-brand-200 bg-surface px-3 py-3 text-center text-lg font-extrabold text-primary sm:px-[18px] sm:py-[18px] sm:text-[23px]"
            >
              <strong>
                {{ formattedSecondValue }}
              </strong>

              <small
                class="mt-1 block text-[9px] font-medium text-muted"
              >
                {{ secondValueUnit }}
              </small>
            </div>

            <!-- Facteur de conversion -->
            <div
              v-else
              class="rounded-xl border border-brand-200 bg-surface px-3 py-3 text-center text-lg font-extrabold text-primary sm:px-[18px] sm:py-[18px] sm:text-[23px]"
            >
              <strong>10 000</strong>

              <small
                class="mt-1 block text-[9px] font-medium text-muted"
              >
                m²/ha
              </small>
            </div>

            <span
              class="text-xl font-bold text-heading"
            >
              =
            </span>

            <strong
              class="text-center text-[21px] font-extrabold text-primary sm:text-[27px]"
            >
              {{ formattedResult }}
            </strong>
          </div>

          <p
            class="mt-4 text-[10px] leading-relaxed text-muted"
          >
            {{
              t(
                `calculators.utilityExplanations.${step}`,
              )
            }}
          </p>
        </section>
      </div>

      <!-- Résultat -->
      <section
        class="mt-4 rounded-card border border-brand-600 bg-surface p-5 shadow-card"
        aria-live="polite"
      >
        <p
          class="text-[10px] font-extrabold tracking-[0.04em] text-primary uppercase"
        >
          {{
            t(
              "calculators.estimatedResult",
            )
          }}
        </p>

        <h2
          :class="[
            'mt-1.5 text-[34px] leading-tight font-extrabold sm:text-[39px]',
            isNegativeBudget
              ? 'text-sun-700'
              : 'text-primary',
          ]"
        >
          {{ formattedResult }}
        </h2>

        <div
          class="mt-1 flex items-center gap-2 text-[10px] text-primary"
        >
          <CheckCircle2
            class="size-[15px]"
            aria-hidden="true"
          />

          {{
            t(
              "calculators.verified",
            )
          }}
        </div>

        <footer
          class="mt-4 grid grid-cols-3 gap-2.5 print:hidden"
        >
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-2 py-2.5 text-[10px] text-body transition-colors hover:border-primary hover:bg-primary-subtle"
            @click="calculate"
          >
            <Save
              class="size-4 text-primary"
              aria-hidden="true"
            />

            <span
              class="hidden sm:inline"
            >
              {{
                t(
                  "calculators.saveCalculation",
                )
              }}
            </span>
          </button>

          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-2 py-2.5 text-[10px] text-body transition-colors hover:border-primary hover:bg-primary-subtle"
            @click="printResult"
          >
            <Download
              class="size-4 text-primary"
              aria-hidden="true"
            />

            <span
              class="hidden sm:inline"
            >
              PDF
            </span>
          </button>

          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-2 py-2.5 text-[10px] text-body transition-colors hover:border-primary hover:bg-primary-subtle"
            @click="copyResult"
          >
            <Copy
              class="size-4 text-primary"
              aria-hidden="true"
            />

            <span
              class="hidden sm:inline"
            >
              {{
                t(
                  "calculators.copy",
                )
              }}
            </span>
          </button>
        </footer>
      </section>

      <!-- Accompagnement IA -->
      <section
        class="mt-4 flex flex-wrap items-start gap-[13px] rounded-card border border-brand-200 bg-primary-subtle p-5 shadow-card print:hidden"
      >
        <div
          class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"
        >
          <Sparkles
            class="size-5"
            aria-hidden="true"
          />
        </div>

        <div class="min-w-0 flex-1">
          <h2
            class="text-[13px] font-extrabold text-heading"
          >
            {{
              t(
                "calculators.aiTitle",
              )
            }}
          </h2>

          <p
            v-if="
              store.adviceLoading
            "
            class="mt-1.5 text-[10px] leading-relaxed text-muted"
          >
            {{
              t(
                "calculators.aiLoading",
              )
            }}
          </p>

          <template
            v-else-if="
              store.advice
            "
          >
            <p
              class="mt-1.5 text-[10px] leading-relaxed text-muted"
            >
              {{ store.advice.summary }}
            </p>

            <ul
              v-if="
                store.advice.checks
                  .length
              "
              class="mt-2 grid gap-1 pl-4 text-[10px] text-muted"
            >
              <li
                v-for="check in store.advice.checks"
                :key="check"
                class="list-disc"
              >
                {{ check }}
              </li>
            </ul>

            <p
              v-if="
                store.advice.warning
              "
              class="mt-2 rounded-lg border border-sun-200 bg-sun-50 px-3 py-2 text-[10px] text-sun-800"
            >
              {{ store.advice.warning }}
            </p>

            <small
              class="mt-2 block text-[9px] text-muted-soft"
            >
              {{ store.advice.provider }}
              ·
              {{ store.advice.model }}
            </small>
          </template>

          <p
            v-else
            class="mt-1.5 text-[10px] leading-relaxed text-muted"
          >
            {{
              t(
                "calculators.aiIntro",
              )
            }}
          </p>
        </div>

        <button
          type="button"
          class="w-full rounded-lg border border-primary bg-surface px-[13px] py-[9px] text-[10px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-text sm:w-auto"
          :disabled="
            store.adviceLoading
          "
          @click="
            store.explain(
              step,
              locale,
            )
          "
        >
          {{
            t(
              "calculators.askAi",
            )
          }}
        </button>
      </section>
    </main>
  </AppLayout>
</template>