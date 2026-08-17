export default {
  common: {
    continue: "Continue",
    next: "Next",
    back: "Back",
    skip: "Skip",
    start: "Get started",
    ready: "Ready",
    loading: "In progress",
    showDetails: "Show details",
    accessHome: "Go to home",
    pending: "Pending",
    error: "Error",
    retry: "Try again",
    hideDetails: "Hide details",
  },

  language: {
    title: "Choose your language",
    description:
      "Select the language you would like to use.",
    legend: "Select your language",
    imageAlt:
      "Cameroonian farmer in a maize and cassava field",

    french: {
      name: "Français",
      description: "Continuer en français",
    },

    english: {
      name: "English",
      description: "Continue in English",
    },

    pidgin: {
      name: "Cameroon Pidgin",
      description: "Continue for Cameroon Pidgin",
    },

    changeLater:
      "You can change the language later.",
  },

  offline: {
    worksOffline: "Works without Internet",
    dataStaysOnDevice:
      "Your data stays on this device.",
    readyOffline: "Ready to work offline",
    noInternetRequired:
      "No Internet connection required",
    preparedOnDevice:
      "Everything is prepared directly on your device.",
  },

  onboarding: {
    eyebrow: "HOW IT WORKS",
    imageAlt:
      "Cameroonian farmer using AgriMboa in her field",

    step1: {
      title: "Identify a problem easily",
      description:
        "Simply describe what you observe on your crop. AgriMboa asks you a few questions to better understand the situation.",

      features: {
        crop: "Choose the affected crop",
        symptoms: "Describe the symptoms you observed",
        questions: "Answer a few simple questions",
      },
    },

    step2: {
      title: "Receive reliable farming advice",
      description:
        "AgriMboa searches the agricultural guides stored on your device to provide clear and careful recommendations.",

      features: {
        reliable:
          "Information from reliable agricultural guides",
        explanations:
          "Recommendations explained in simple terms",
        sources:
          "The sources used remain available for consultation",
      },
    },

    step3: {
      title: "Use AgriMboa without Internet",
      description:
        "The artificial intelligence model and agricultural guides are stored on your device. You can therefore use AgriMboa even when the network is unavailable.",

      features: {
        noConnection:
          "No connection required while using the application",
        consultations:
          "Your consultations stay on this device",
        available:
          "AgriMboa remains available wherever you are",
      },
    },

    progress: "{current} of {total}",
  },

  preparation: {
    eyebrow: "GETTING STARTED",
    title: "Preparing AgriMboa",
    description:
      "We are checking the resources required for offline use. This operation may take a few moments.",
    imageAlt:
      "Farmer preparing AgriMboa for offline use",
    progressLabel: "Preparation in progress",

    resources: {
      model: {
        title: "Artificial intelligence model",
        description: "Loading the local engine",
      },

      guides: {
        title: "Agricultural guides",
        description: "Checking offline guides",
      },

      storage: {
        title: "Local storage",
        description:
          "Your consultations will be saved here",
      },
    },
  },
} as const;