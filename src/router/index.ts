import {
  createRouter,
  createWebHistory,
} from "vue-router";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      redirect: "/language",
    },
    {
      path: "/language",
      name: "language",
      component: () =>
        import(
          "@/views/onboarding/LanguageSelectionView.vue"
        ),
    },
    {
      path: "/onboarding/:step(1|2|3)",
      name: "onboarding-step",
      component: () =>
        import(
          "@/views/onboarding/OnboardingStepView.vue"
        ),
    },
    {
      path: "/preparation",
      name: "preparation",
      component: () =>
        import(
          "@/views/onboarding/PreparationView.vue"
        ),
    },
  ],

  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

export default router;