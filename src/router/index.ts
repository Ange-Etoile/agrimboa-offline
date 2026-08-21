import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/language" },
    { path: "/language", name: "language", component: () => import("@/views/onboarding/LanguageSelectionView.vue") },
    { path: "/onboarding/:step(1|2|3)", name: "onboarding-step", component: () => import("@/views/onboarding/OnboardingStepView.vue") },
    { path: "/preparation", name: "preparation", component: () => import("@/views/onboarding/PreparationView.vue") },
    { path: "/home", name: "home", component: HomeView },
    { path: "/diagnosis/analyzing", name: "diagnosis-analysis", component: () => import("@/views/DiagnosisAnalysisView.vue") },
    { path: "/diagnosis/result/:section(overview|action|why|followup)?", name: "diagnosis-result", component: () => import("@/views/DiagnosisResultView.vue") },
    { path: "/diagnosis/:step?", name: "diagnosis", component: () => import("@/views/DiagnosisView.vue") },
  ],
  scrollBehavior() { return { top: 0 }; },
});
export default router;
