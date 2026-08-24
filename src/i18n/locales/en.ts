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
    description: "Select the language you would like to use.",
    legend: "Select your language",
    imageAlt: "Cameroonian farmer in a maize and cassava field",

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

    changeLater: "You can change the language later.",
  },
  navigation: {
    main: "Main navigation",
    home: "Home",
    library: "Library",
    calculators: "Calculators",
    calculate: "Calculate",
    history: "History",
    help: "Help",
    more: "More",
    settings: "Settings",
    language: "Language",
    changeLanguage: "Change language",
    about: "About AgriMboa",
    closeMenu: "Close menu",
  },

  home: {
    hero: {
      greeting: "Hello",
      title: "How can we help your crops today?",
      description:
        "Describe a problem, consult a guide or perform an agricultural calculation.",
      start: "Start a consultation",
      howItWorks: "See how it works",
      imageAlt: "Cameroonian farmer using AgriMboa in her field",
    },

    quickAccess: "Quick access",

    actions: {
      diagnosis: {
        title: "Identify a problem",
        description: "Describe the symptoms observed",
      },
      guides: {
        title: "Consult the guides",
        description: "Access saved agricultural advice",
      },
      calculator: {
        title: "Make a calculation",
        description: "Seeds, surface area and spacing",
      },
    },

    crops: {
      title: "Available crops",
      maize: "Maize",
      cassava: "Cassava",
      tomato: "Tomato",
    },

    lastConsultation: {
      title: "Last consultation",
      confidence: "Medium confidence",
      symptoms: "Yellow leaves and dry edges",
      time: "Today, 10:24",
      resume: "Resume",
    },
  },
  diagnosis: {
    common: {
      newConsultation: "NEW CONSULTATION",
      consultation: "CONSULTATION — {crop}",
      additionalQuestion: "ADDITIONAL QUESTION — {crop}",
      backHome: "Back to home",
      backCrop: "Back to crop selection",
      backQuestion: "Back to previous question",
      backDescription: "Back to description",
      back: "Back",
      continue: "Continue",
      cancel: "Cancel",
      saveQuit: "Save and quit",
      showResult: "View result",
      clear: "Clear",
      edit: "Edit",
      selectedOne: "1 item selected",
      selectedMany: "{count} items selected",
      answerSelected: "1 answer selected",
      savedLocally: "Your progress is saved locally.",
      savedDevice: "Saved only on this device.",
      questionProgress: "Question {current} of {total}",
    },

    phases: {
      crop: "Crop",
      observations: "Observations",
      questions: "Questions",
      result: "Result",
    },
    parts: {
      leaves: "Leaves",
      stem: "Stem",
      stems: "Stems",
      roots: "Roots",
      tuberousRoots: "Tuberous roots",
      collar: "Root collar",
      ears: "Ears or grains",
      flowers: "Flowers",
      fruits: "Fruits",
      pseudostem: "Pseudostem",
      corm: "Corm and roots",
      inflorescence: "Plantain flower",
      fruitBunch: "Plantain bunch",
      wholePlant: "Whole plant",
      unknown: "I don't know",
    },

    observations: {
      yellowing: "Yellowing",
      spots: "Spots",
      brownSpots: "Brown spots",
      blackSpots: "Black streaks or spots",
      holes: "Holes",
      dryEdges: "Dry edges",
      deformation: "Deformation",
      wilting: "Wilting",
      mosaic: "Yellow and green mosaic",
      rootRot: "Root rot",
      whiteflies: "Presence of whiteflies",
      leafCurling: "Curled leaves",
      blossomEndRot: "Rot at the bottom of the fruit",
      insects: "Presence of insects",
      pseudostemRot: "Pseudostem rot",
      fruitDamage: "Damage to the fruit bunch",
    },

    crop: {
      title: "Which crop would you like to examine?",
      description: "Select the crop affected by the problem you are observing.",
      maize: "Maize",
      maizeCategory: "Cereals",
      cassava: "Cassava",
      cassavaCategory: "Roots and tubers",
      tomato: "Tomato",
      tomatoCategory: "Vegetables",
      other: "Another crop?",
      otherDescription: "More crops will be added soon.",
      soon: "Coming soon",
      why: "Why select the crop?",
      whyDescription:
        "Questions and recommendations will be adapted to your selection.",
      continueWith: "Continue with {crop}",
      plantain: "Plantain",
      plantainCategory: "Bananas and plantains",
    },

    plantPart: {
      title: "Which part of the plant is affected?",
      description:
        "Select where you observe the problem. You may select several answers.",
      shortDescription: "Select one or more answers.",
      leaves: "Leaves",
      stem: "Stem",
      roots: "Roots",
      ears: "Ears or grains",
      wholePlant: "Whole plant",
      unknown: "I don't know",
      unsure: "Not sure?",
      unsureDescription:
        "Select “I don't know”. AgriMboa will ask other questions.",
      commonDescription:
        "Select where you observe the problem. You may select several answers.",

      maize: {
        title: "Which part of the maize plant is affected?",
      },

      cassava: {
        title: "Which part of the cassava plant is affected?",
      },

      tomato: {
        title: "Which part of the tomato plant is affected?",
      },

      plantain: {
        title: "Which part of the plantain is affected?",
      },
    },

    symptoms: {
      title: "What do you see on the leaves?",
      description: "Select all the symptoms you observe.",
      yellowing: "Yellowing",
      spots: "Spots",
      holes: "Holes",
      dryEdges: "Dry edges",
      deformation: "Deformation",
      insects: "Presence of insects",
      absent: "Observation not listed?",
      absentDescription:
        "You can describe it in your own words in the next step.",
      commonDescription: "Select all the symptoms you observe.",

      maize: {
        title: "What do you see on the maize plant?",
      },

      cassava: {
        title: "What do you see on the cassava plant?",
      },

      tomato: {
        title: "What do you see on the tomato plant?",
      },

      plantain: {
        title: "What do you see on the plantain?",
      },
    },

    yellowing: {
      title: "Where did the yellowing begin?",
      description: "Select where the yellowing appeared first.",
      lowerLeaves: "Lower leaves",
      newLeaves: "New leaves",
      leafTips: "Leaf tips",
      leafEdges: "Leaf edges",
      wholePlant: "Whole plant",
      unknown: "I don't know",
      unsure: "Not certain?",
      unsureDescription: "Select “I don't know”.",
    },

    description: {
      eyebrow: "CONSULTATION — {crop} · FREE DESCRIPTION",
      title: "Describe what you observe",
      subtitle:
        "Write your observation or use your voice. You can correct the text before continuing.",
      observation: "Your observation",
      placeholder:
        "Describe the symptoms, their location and when they started…",
      write: "Write",
      speak: "Speak",
      useVoice: "Use my voice",
      dictate: "Dictate my observation",
      pressToStart: "Press to start",
      microphoneReady: "Microphone ready",
      maximumDuration: "Maximum duration: 1 minute",
      offlineVoice: "Transcription and analysis remain available offline.",
      characters: "{current} / {maximum} characters",
      guidedDiagnosis: "You selected guided diagnosis",
      previousAnswers: "Return to previous answers",
      skip: "Skip this question",
      skipDescription: "You can add more details later.",
    },

    extent: {
      title: "How many plants are affected?",
      description:
        "This information helps us estimate the extent of the problem in your field.",
      adapted: "Question adapted to your observations",
      onePlant: "One plant",
      fewPlants: "A few plants",
      smallArea: "A small area",
      severalAreas: "Several areas",
      almostField: "Almost the whole field",
      unknown: "I don't know",
      why: "Why this question?",
      whyDescription:
        "You have already provided several observations. We only need the remaining information.",
      skip: "Skip this question",
      skipDescription:
        "The result will be calculated using the information already provided.",
    },
  },
  offline: {
    worksOffline: "Works without Internet",
    dataStaysOnDevice: "Your data stays on this device.",
    readyOffline: "Ready to work offline",
    noInternetRequired: "No Internet connection required",
    preparedOnDevice: "Everything is prepared directly on your device.",
  },

  onboarding: {
    eyebrow: "HOW IT WORKS",
    imageAlt: "Cameroonian farmer using AgriMboa in her field",

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
        reliable: "Information from reliable agricultural guides",
        explanations: "Recommendations explained in simple terms",
        sources: "The sources used remain available for consultation",
      },
    },

    step3: {
      title: "Use AgriMboa without Internet",
      description:
        "The artificial intelligence model and agricultural guides are stored on your device. You can therefore use AgriMboa even when the network is unavailable.",

      features: {
        noConnection: "No connection required while using the application",
        consultations: "Your consultations stay on this device",
        available: "AgriMboa remains available wherever you are",
      },
    },

    progress: "{current} of {total}",
  },

  preparation: {
    eyebrow: "GETTING STARTED",
    title: "Preparing AgriMboa",
    description:
      "We are checking the resources required for offline use. This operation may take a few moments.",
    imageAlt: "Farmer preparing AgriMboa for offline use",
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
        description: "Your consultations will be saved here",
      },
    },
  },
  diagnosisResult: {
    common: {
      back: "Back",
    },

    analysis: {
      eyebrow: "LOCAL ANALYSIS IN PROGRESS",
      title: "We are analysing your observations",
      subtitle:
        "The assistant compares your answers with the agricultural knowledge available on your device.",
      progress: "Analysis",
      stage1: "Observations saved",
      stage1Detail: "Your answers have been prepared for analysis.",
      stage2: "Searching for probable causes",
      stage2Detail: "Comparison with known agricultural symptoms.",
      stage3: "Preparing recommendations",
      summary: "Observation summary",
      crop: "Crop",
      parts: "Affected parts",
      symptoms: "Symptoms",
      notSpecified: "Not specified",
      local: "Local and private analysis",
      localDetail: "Your observations remain stored on your device.",
      cancel: "Cancel analysis",
    },
  },
  history: {
    eyebrow: "YOUR ACTIVITIES",
    title: "Diagnosis history",
    subtitle:
      "Find your diagnoses, continue follow-ups and review recommendations saved on this device.",

    newDiagnosis: "New diagnosis",
    exportHistory: "Export history",
    export: "Export",

    search: "Search for a crop or result…",
    filters: "Filters",
    allCrops: "All crops",
    allPeriods: "All periods",
    recent: "Most recent",
    oldest: "Oldest",
    confidence: "Confidence",
    local: "Stored locally",

    all: "All",
    ongoing: "Ongoing follow-ups",
    completed: "Completed",
    drafts: "Drafts",

    today: "Today",
    loading: "Loading history…",
    noResult: "No diagnosis matches your filters.",

    open: "Open",
    consult: "View",
    addFollowUp: "Add follow-up",
    nextObservation: "Next observation",
    actionsCompleted: "actions completed",
    created: "Created",

    watch: "Watch",
    followUp: "Follow-up ongoing",
    done: "Completed",
    draft: "Draft",
    recommended: "A new observation is recommended",

    upcoming: "Upcoming follow-ups",
    viewAll: "View all follow-ups",

    localTitle: "Your data stays on this device",
    manage: "Manage my data",
    diagnosticsStored: "diagnoses stored locally",

    previous: "Previous",
    next: "Next",
    of: "of",
    diagnostics: "diagnoses",

    tomorrow: "Tomorrow",
    inDays: "In {days} days",
    todayDue: "Today",

    maize: "Maize",
    cassava: "Cassava",
    tomato: "Tomato",
    plantain: "Plantain",

    priority: "Priority",
    low: "Low",
    moderate: "Moderate",
    high: "High",
  },
  library: {
    eyebrow: "Offline agricultural advice",
    title: "Agricultural library",
    subtitle:
      "Find practical guides to identify problems, protect your crops and improve your farming practices.",
    search: "Search for a crop, symptom or problem…",
    offlineSheets: "guides available offline",
    explore: "Explore",
    crops: "Crops",
    problems: "Problems",
    guides: "Practical guides",
    saved: "Saved",
    save: "Save",
    findQuickly: "Find quickly",
    whatLooking: "What are you looking for?",
    availableOffline: "Available offline",
    byCrop: "By crop",
    popularCrops: "Popular crops",
    sheets: "guides",
    recommended: "Recommended",
    usefulNow: "Useful advice right now",
    seeAll: "View all guides",
    offlineTitle: "Your library remains available offline",
    offlineText: "{count} guides are stored directly on this device.",
    manageContent: "Manage offline content",
    continueReading: "Continue reading",
    resume: "Resume",
    needHelp: "Cannot find your problem?",
    diagnosisText: "Start a guided diagnosis based on your observations.",
    startDiagnosis: "Start diagnosis",
    results: "Search results",
    sheetsFound: "guides found",
    clearFilters: "Clear filters",
    loading: "Loading the library…",
    noResults: "No guide matches your search.",
    minutes: "min read",
    verifiedContent: "Verified agricultural content",
    listen: "Listen to guide",
    stopListening: "Stop listening",
    downloadPdf: "Download PDF",
    recognizeTitle: "How can you recognize this problem?",
    recognizeText:
      "Observe several plants and compare young and old leaves. The position and progression of signs help prevent misdiagnosis.",
    stageEarly: "Early stage",
    stageEarlyText: "The first signs generally appear on the oldest leaves.",
    stageAdvanced: "Advanced stage",
    stageAdvancedText: "Yellow areas may gradually turn brown and dry.",
    stagePlant: "Affected plant",
    stagePlantText: "Growth slows when the problem becomes severe.",
    frequentSigns: "Frequently observed signs",
    doNotConfuse: "Do not confuse with",
    whyImportant: "Why it matters",
    potassiumRole: "The role of potassium in the plant",
    potassiumText:
      "Potassium supports water management, plant strength and grain filling. Any correction should consider the soil and the crop's actual needs.",
    beforeActing: "Before taking action",
    beforeActingText:
      "Confirm your observations on several plants before applying a treatment or fertilizer.",
    inSummary: "In summary",
    updatedLocally: "This guide is stored on your device.",
    needPersonalized: "Need personalized advice?",
    backToLibrary: "Back to library",

    categories: {
      crop: "Crops",
      disease: "Diseases",
      deficiency: "Deficiencies",
      pest: "Pests",
      practice: "Good practices",
      guide: "Practical guide",
    },

    categoryDescriptions: {
      crop: "Advice organized by crop",
      disease: "Identify crop diseases",
      deficiency: "Identify nutrient deficiencies",
      pest: "Recognize crop pests",
      practice: "Improve farming practices",
    },

    cropNames: {
      maize: "Maize",
      cassava: "Cassava",
      tomato: "Tomato",
      plantain: "Plantain",
      general: "All crops",
    },

    cropDescriptions: {
      maize: "Nutrition, diseases, pests and harvesting",
      cassava: "Leaves, roots, cuttings and storage",
      tomato: "Nursery, diseases, watering and fruits",
      plantain: "Leaves, corm, pseudostem and bunches",
    },

    detailTabs: {
      overview: "Overview",
      symptoms: "Symptoms",
      causes: "Possible causes",
      actions: "Actions",
      prevention: "Prevention",
    },
  },
  calculators: {
    eyebrow: "Practical tools",
    title: "Agricultural calculators",
    subtitle:
      "Prepare your work and estimate your needs with simple offline tools.",
    search: "Search for a calculator…",
    offlineTools: "tools available offline",
    recommended: "Recommended calculator",
    simple: "Simple",
    noConnection: "No connection required",
    localUnits: "Local units",
    calculateSurface: "Calculate an area",
    viewExample: "View an example",
    allTools: "All calculators",
    open: "Open",
    recent: "Recent calculation",
    resume: "Resume",
    estimatesTitle: "Estimates, not prescriptions",
    estimatesText:
      "Use these results to prepare decisions. Compare them with field conditions and local advice.",
    needHelp: "Need help choosing a tool?",
    needHelpText: "Describe what you want to calculate.",
    askAgrimboa: "Ask AgriMboa",

    back: "Back to calculators",
    offlineCalculator: "OFFLINE CALCULATOR",
    completed: "JOURNEY COMPLETED",
    summaryTitle: "Your field summary",

    pageDescriptions: {
      surface:
        "Enter your field dimensions to obtain its area in several units.",
      density:
        "Estimate the number of plants using the area and planting distances.",
      seeds:
        "Estimate the quantity of planting material required for your field.",
      inputs: "Convert a known rate using the actual area of your field.",
      summary: "Find all the results of your journey in one summary.",
      harvest:
        "Estimate an indicative harvest from the area and expected yield.",
      budget: "Compare planned expenses with expected income.",
      converter: "Quickly convert hectares to square metres.",
    },

    tool: {
      surface: {
        title: "Field area",
        description:
          "Calculate the area of a rectangular, triangular or irregular field.",
      },
      density: {
        title: "Density and spacing",
        description:
          "Estimate the number of plants using the selected distances.",
      },
      seeds: {
        title: "Seed quantity",
        description: "Estimate planting material using the area and density.",
      },
      inputs: {
        title: "Input quantity",
        description: "Convert a verified rate using the actual field area.",
      },
      harvest: {
        title: "Harvest estimate",
        description: "Estimate an indicative quantity from an expected yield.",
      },
      budget: {
        title: "Crop budget",
        description: "Add planned expenses and compare them with income.",
      },
      converter: {
        title: "Unit converter",
        description: "Convert hectares, square metres, kilograms and bags.",
      },
      summary: {
        title: "Field summary",
        description: "View the linked results of your journey.",
      },
    },

    crop: {
      maize: "Maize",
      cassava: "Cassava",
      tomato: "Tomato",
      plantain: "Plantain",
    },

    recoveredData: "Recovered data",
    previousCalculation: "From the previous calculation",
    useVerifiedDose: "Use a verified rate",
    useVerifiedDoseText:
      "Enter the rate shown on the product label or recommended by an agricultural technician.",
    noDoseChoice: "The application does not choose the rate for you.",

    formTitles: {
      surface: "Enter your measurements",
      density: "Describe the planting",
      seeds: "Adjust the parameters",
      inputs: "Describe the product",
    },

    diagramTitles: {
      surface: "Check the diagram",
      density: "Check the spacing",
      seeds: "Understand the calculation",
      inputs: "Check the conversion",
    },

    parcelShape: "Field shape",
    rectangle: "Rectangle",
    triangle: "Triangle",
    irregular: "Irregular shape",
    length: "Length",
    width: "Width",
    calculationName: "Calculation name",
    culture: "Crop",
    rowSpacing: "Distance between rows",
    plantSpacing: "Distance between plants",
    plantsPerHole: "Plants per hole",
    requiredPlants: "Required plants",
    germination: "Germination rate",
    margin: "Safety margin",
    thousandWeight: "Weight of 1,000 seeds",
    inputType: "Input type",
    fertilizer: "Fertilizer",
    amendment: "Soil amendment",
    treatment: "Treatment product",
    productName: "Product name",
    referenceDose: "Reference rate",
    packaging: "Package size",
    applications: "Number of applications",

    hints: {
      surface: "For a complex shape, divide the field into simple zones.",
      density: "Adapt these values to the variety and local advice.",
      seeds: "Seed weight varies according to variety and seed lot.",
      inputs: "Copy the rate and unit exactly from your source.",
    },

    diagramHints: {
      surface: "The diagram adjusts to the entered measurements.",
      density: "Visually check the distance between rows and plants.",
      seeds: "You can change the rate shown on your seed label.",
      inputs: "The displayed rate was entered manually.",
    },

    calculate: {
      surface: "Calculate area",
      density: "Calculate density",
      seeds: "Calculate seeds",
      inputs: "Calculate quantity",
    },

    clear: "Clear",
    estimatedResult: "ESTIMATED RESULT",
    verified: "Calculation verified",
    saveCalculation: "Save this calculation",
    copy: "Copy",
    grains: "seeds",
    bags: "bag(s)",

    formulas: {
      surface: "{a} m × {b} m = {result}",
      density: "{s} ÷ ({r} × {p}) = {result}",
      seeds: "{n} ÷ {g}% with a {m}% margin = {result}",
      inputs: "{d} kg/ha × {h} ha = {result}",
    },

    cautionTitles: {
      surface: "Check your measurements",
      density: "Check the selected spacing",
      seeds: "Check your seed lot",
      inputs: "Before any application",
    },

    cautionTexts: {
      surface:
        "The result depends on the entered dimensions. Measure irregular fields in several zones.",
      density:
        "Suitable distances vary according to crop, variety, soil and local practices.",
      seeds:
        "Germination rate and seed weight may vary according to variety, supplier and storage.",
      inputs:
        "Check the product, crop, growth stage, protective equipment and safety instructions.",
    },

    aiTitle: "AgriMboa explanation",
    aiIntro:
      "AgriMboa can explain the result and check the general consistency of the values.",
    aiLoading: "AgriMboa is analysing the calculation…",
    askAi: "Ask for an explanation",

    restart: "Start again",
    otherTool: "Choose another calculator",
    finishSave: "Finish and save",

    useFor: {
      density: "Use this result for density",
      seeds: "Use this result for seeds",
      inputs: "Use this result for inputs",
      summary: "View the summary",
    },

    savedDone: "Calculations completed and saved",
    savedOffline: "This information remains available offline on this device.",
    rename: "Rename the field",
    viewCalculation: "View calculation",
    parcelNotes: "Field notes",
    notePlaceholder: "Add a useful note: variety, planned date, supplier…",
    saveNote: "Save note",
    nextActions: "Next actions",
    viewCropGuide: "View crop guide",
    createReminder: "Create a reminder",
    openHistory: "Open history",
    verifyEstimates: "Estimates to verify",
    verifyEstimatesText:
      "Results depend on entered data. Follow the product label or the advice of a technician.",
    safetyAdvice: "View safety advice",
    editCalculation: "Edit a calculation",
    newJourney: "New journey",
    exportSummary: "Export summary as PDF",
    finish: "Finish",

    enterValues: "Enter your values",
    areaHectares: "Cultivated area",
    expectedYield: "Expected yield",
    totalCosts: "Total costs",
    expectedRevenue: "Expected revenue",
    hectaresToConvert: "Hectares to convert",
    calculateNow: "Calculate",
    understandCalculation: "Understand the calculation",
    startJourney: "Start the journey",

    utilityHints: {
      harvest:
        "Use a realistic yield from previous harvests or a reliable local source.",
      budget: "Include seeds, inputs, transport, labour and storage costs.",
      converter: "One hectare is exactly 10,000 square metres.",
    },

    utilityExplanations: {
      harvest: "The area is multiplied by the expected yield per hectare.",
      budget: "The result is expected revenue minus planned expenses.",
      converter: "The number of hectares is multiplied by 10,000.",
    },
  },
  help: {
    heroAlt: "Farmer consulting the AgriMboa Help Centre",
    eyebrow: "Support",
    title: "How can we help you?",
    subtitle:
      "Quickly find an answer or learn how to use AgriMboa, even offline.",
    searchPlaceholder: "Search for a question or feature...",
    voiceRequest: "Ask by voice",
    listening: "Listening...",
    voiceUnavailable: "Voice recognition is not available on this device.",

    topics: {
      discover: {
        title: "Discover the application",
        description: "Understand the main features",
      },
      diagnosis: {
        title: "Start a diagnosis",
        description: "Follow the process step by step",
      },
      calculators: {
        title: "Use the calculators",
        description: "Area, density, seeds and inputs",
      },
      offline: {
        title: "Manage offline mode",
        description: "Downloads and storage",
      },
    },

    faqTitle: "Frequently asked questions",
    faq: {
      offline: {
        question: "Does AgriMBoa work without Internet?",
        answer:
          "Yes. Downloaded guides, calculators, saved diagnoses and history remain available offline.",
      },
      voice: {
        question: "How can I speak instead of typing?",
        answer:
          "Press the microphone button, allow microphone access and clearly describe the problem.",
      },
      skip: {
        question: "Can I skip diagnosis questions?",
        answer:
          "Some questions can be skipped. Questions required to produce the diagnosis must still be answered.",
      },
      crop: {
        question: "How can I change the selected crop?",
        answer:
          "Return to the first diagnosis step and select another crop. Incompatible answers will be reset.",
      },
      history: {
        question: "Where can I find my previous results?",
        answer:
          "Open the History page. Diagnoses saved on this device remain visible without an Internet connection.",
      },
      export: {
        question: "How can I export a result as PDF?",
        answer:
          "Open a completed diagnosis and select the Export or PDF button on the result page.",
      },
    },

    noResult: "No answer matches your search.",
    allQuestions: "View all questions",
    quickGuides: "Quick guides",

    guides: {
      start: "Getting started with AgriMboa",
      diagnosis: "Complete a guided diagnosis",
      offline: "Download guides for offline use",
      results: "Understand diagnosis results",
    },

    minutes: "min",
    allGuides: "View all guides",
    appStatus: "Application status",
    appWorking: "The application is working correctly",
    offlineFiles: "{count} guides available offline",
    lastCheck: "Last checked: today at {time}",
    checkStorage: "Check storage",

    notFoundTitle: "Couldn’t find the answer?",
    notFoundText:
      "Describe your difficulty. Your message will be stored on this device and can be sent when a connection becomes available.",
    reportProblem: "Report a problem",
    contactUs: "Contact us",
    reportSubject: "AgriMboa problem report",
    contactSubject: "AgriMboa support request",
    privacy: "No data is sent without your permission.",
  },
} as const;
