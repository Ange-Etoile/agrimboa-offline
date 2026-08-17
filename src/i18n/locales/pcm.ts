export default {
  common: {
    continue: "Continue",
    next: "Next",
    back: "Go back",
    skip: "Skip am",
    start: "Start",
    ready: "E ready",
    loading: "E dey load",
    showDetails: "Show details",
    accessHome: "Go for home",
    pending: "E dey wait",
    error: "Problem",
    retry: "Try again",
    hideDetails: "Hide details",
  },

  language: {
    title: "Choose your language",
    description:
      "Choose the language wey you want use.",
    legend: "Choose your language",
    imageAlt:
      "Cameroon woman farmer for maize and cassava farm",

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
      "You fit change the language after.",
  },

  offline: {
    worksOffline: "E dey work without Internet",
    dataStaysOnDevice:
      "Your information go remain for this device.",
    readyOffline: "E ready for work offline",
    noInternetRequired:
      "You no need Internet connection",
    preparedOnDevice:
      "Everything dey prepared for your device.",
  },

  onboarding: {
    eyebrow: "HOW E DEY WORK",
    imageAlt:
      "Cameroon woman farmer dey use AgriMboa for farm",

    step1: {
      title: "Find the problem easy",
      description:
        "Tell AgriMboa wetin you see for your crop. AgriMboa go ask you some simple questions so e fit understand the problem well.",

      features: {
        crop: "Choose the crop wey get problem",
        symptoms: "Tell us the signs wey you see",
        questions: "Answer some simple questions",
      },
    },

    step2: {
      title: "Get correct farming advice",
      description:
        "AgriMboa go search inside the farming guides wey dey for your device, then e go give you clear and careful advice.",

      features: {
        reliable:
          "Information from farming guides wey people trust",
        explanations:
          "Advice wey dem explain for simple way",
        sources:
          "You fit still check the sources wey dem use",
      },
    },

    step3: {
      title: "Use AgriMboa without Internet",
      description:
        "The artificial intelligence model and farming guides dey inside your device. So you fit use AgriMboa even when network no dey.",

      features: {
        noConnection:
          "You no need connection when you dey use am",
        consultations:
          "Your consultations go remain for this device",
        available:
          "AgriMboa dey available anywhere you dey",
      },
    },

    progress: "{current} of {total}",
  },

  preparation: {
    eyebrow: "WE DEY START",
    title: "We dey prepare AgriMboa",
    description:
      "We dey check all the things wey AgriMboa need for work without Internet. This one fit take small time.",
    imageAlt:
      "Woman farmer dey prepare AgriMboa for offline use",
    progressLabel: "Preparation dey go on",

    resources: {
      model: {
        title: "Artificial intelligence model",
        description: "Local engine dey load",
      },

      guides: {
        title: "Farming guides",
        description: "We dey check offline guides",
      },

      storage: {
        title: "Local storage",
        description:
          "We go save your consultations here",
      },
    },
  },
} as const;