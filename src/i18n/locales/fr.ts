export default {
  common: {
    continue: "Continuer",
    next: "Suivant",
    back: "Retour",
    skip: "Passer",
    start: "Commencer",
    ready: "Prêt",
    loading: "En cours",
    showDetails: "Afficher les détails",
    accessHome: "Accéder à l’accueil",
    pending: "En attente",
    error: "Erreur",
    retry: "Réessayer",
    hideDetails: "Masquer les détails",
  },

  language: {
    title: "Choisissez votre langue",
    description: "Sélectionnez la langue que vous souhaitez utiliser.",
    legend: "Sélectionnez votre langue",
    imageAlt:
      "Agricultrice camerounaise dans une exploitation de maïs et de manioc",

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

    changeLater: "Vous pourrez modifier la langue plus tard.",
  },
  navigation: {
    main: "Navigation principale",
    home: "Accueil",
    library: "Bibliothèque",
    calculators: "Calculateurs",
    calculate: "Calculer",
    history: "Historique",
    help: "Aide",
    more: "Plus",
    settings: "Paramètres",
    language: "Langue",
    changeLanguage: "Changer de langue",
    about: "À propos d’AgriMboa",
    closeMenu: "Fermer le menu",
  },

  home: {
    hero: {
      greeting: "Bonjour",
      title: "Comment pouvons-nous aider votre culture aujourd’hui ?",
      description:
        "Décrivez un problème, consultez un guide ou effectuez un calcul agricole.",
      start: "Commencer une consultation",
      howItWorks: "Voir comment ça marche",
      imageAlt: "Agricultrice camerounaise utilisant AgriMboa dans son champ",
    },

    quickAccess: "Accès rapides",

    actions: {
      diagnosis: {
        title: "Identifier un problème",
        description: "Décrivez les symptômes observés",
      },
      guides: {
        title: "Consulter les guides",
        description: "Accédez aux conseils enregistrés",
      },
      calculator: {
        title: "Faire un calcul",
        description: "Semences, surface et espacement",
      },
    },

    crops: {
      title: "Cultures disponibles",
      maize: "Maïs",
      cassava: "Manioc",
      tomato: "Tomate",
    },

    lastConsultation: {
      title: "Dernière consultation",
      confidence: "Confiance moyenne",
      symptoms: "Feuilles jaunes et bords secs",
      time: "Aujourd’hui, 10:24",
      resume: "Reprendre",
    },
  },
  diagnosis: {
    common: {
      newConsultation: "NOUVELLE CONSULTATION",
      consultation: "CONSULTATION — {crop}",
      additionalQuestion: "QUESTION COMPLÉMENTAIRE — {crop}",
      backHome: "Retour à l’accueil",
      backCrop: "Retour au choix de la culture",
      backQuestion: "Retour à la question précédente",
      backDescription: "Retour à la description",
      back: "Retour",
      continue: "Continuer",
      cancel: "Annuler",
      saveQuit: "Enregistrer et quitter",
      showResult: "Voir le résultat",
      clear: "Effacer",
      edit: "Modifier",
      selectedOne: "1 élément sélectionné",
      selectedMany: "{count} éléments sélectionnés",
      answerSelected: "1 réponse sélectionnée",
      savedLocally: "Votre progression est enregistrée localement.",
      savedDevice: "Enregistré uniquement sur cet appareil.",
      questionProgress: "Question {current} sur {total}",
    },

    phases: {
      crop: "Culture",
      observations: "Observations",
      questions: "Questions",
      result: "Résultat",
    },

    crop: {
      title: "Quelle culture souhaitez-vous examiner ?",
      description:
        "Sélectionnez la culture concernée par le problème que vous observez.",
      maize: "Maïs",
      maizeCategory: "Céréales",
      cassava: "Manioc",
      cassavaCategory: "Racines et tubercules",
      tomato: "Tomate",
      tomatoCategory: "Légumes",
      other: "Une autre culture ?",
      otherDescription: "D’autres cultures seront ajoutées prochainement.",
      soon: "Bientôt disponible",
      why: "Pourquoi choisir la culture ?",
      whyDescription:
        "Les questions et les recommandations seront adaptées à votre sélection.",
      continueWith: "Continuer avec le {crop}",
      plantain: "Plantain",
      plantainCategory: "Bananiers et plantains",
    },

    plantPart: {
      title: "Quelle partie de la plante est touchée ?",
      description:
        "Sélectionnez la zone où vous observez le problème. Vous pouvez choisir plusieurs réponses.",
      shortDescription: "Sélectionnez une ou plusieurs réponses.",
      leaves: "Feuilles",
      stem: "Tige",
      roots: "Racines",
      ears: "Épis ou grains",
      wholePlant: "Toute la plante",
      unknown: "Je ne sais pas",
      unsure: "Vous hésitez ?",
      unsureDescription:
        "Choisissez « Je ne sais pas ». AgriMboa vous posera d’autres questions.",
      commonDescription:
        "Sélectionnez la zone où vous observez le problème. Vous pouvez choisir plusieurs réponses.",

      maize: {
        title: "Quelle partie du plant de maïs est touchée ?",
      },

      cassava: {
        title: "Quelle partie du plant de manioc est touchée ?",
      },

      tomato: {
        title: "Quelle partie du plant de tomate est touchée ?",
      },

      plantain: {
        title: "Quelle partie du plantain est touchée ?",
      },
    },

    symptoms: {
      title: "Que voyez-vous sur les feuilles ?",
      description: "Sélectionnez tous les symptômes que vous observez.",
      yellowing: "Jaunissement",
      spots: "Taches",
      holes: "Trous",
      dryEdges: "Bords secs",
      deformation: "Déformation",
      insects: "Présence d’insectes",
      absent: "Observation absente ?",
      absentDescription:
        "Vous pourrez la décrire avec vos propres mots à l’étape suivante.",
      commonDescription: "Sélectionnez tous les symptômes que vous observez.",

      maize: {
        title: "Que voyez-vous sur le maïs ?",
      },

      cassava: {
        title: "Que voyez-vous sur le manioc ?",
      },

      tomato: {
        title: "Que voyez-vous sur la tomate ?",
      },

      plantain: {
        title: "Que voyez-vous sur le plantain ?",
      },
    },

    yellowing: {
      title: "Où le jaunissement a-t-il commencé ?",
      description:
        "Choisissez l’endroit où le jaunissement est apparu en premier.",
      lowerLeaves: "Feuilles du bas",
      newLeaves: "Nouvelles feuilles",
      leafTips: "Extrémités des feuilles",
      leafEdges: "Bords des feuilles",
      wholePlant: "Toute la plante",
      unknown: "Je ne sais pas",
      unsure: "Vous n’êtes pas certain ?",
      unsureDescription: "Choisissez « Je ne sais pas ».",
    },

    description: {
      eyebrow: "CONSULTATION — {crop} · DESCRIPTION LIBRE",
      title: "Décrivez ce que vous observez",
      subtitle:
        "Écrivez votre observation ou utilisez votre voix. Vous pourrez corriger le texte avant de continuer.",
      observation: "Votre observation",
      placeholder:
        "Décrivez les symptômes, leur emplacement et le moment où ils ont commencé…",
      write: "Écrire",
      speak: "Parler",
      useVoice: "Utiliser ma voix",
      dictate: "Dicter mon observation",
      pressToStart: "Appuyez pour commencer",
      microphoneReady: "Microphone prêt",
      maximumDuration: "Durée maximale : 1 minute",
      offlineVoice:
        "La transcription et l’analyse restent disponibles hors ligne.",
      characters: "{current} / {maximum} caractères",
      guidedDiagnosis: "Vous avez choisi le diagnostic guidé",
      previousAnswers: "Revenir aux réponses précédentes",
      skip: "Passer cette question",
      skipDescription: "Vous pourrez toujours ajouter des détails plus tard.",
    },

    extent: {
      title: "Combien de plants sont touchés ?",
      description:
        "Cette information nous aide à estimer l’étendue du problème dans votre champ.",
      adapted: "Question adaptée à vos observations",
      onePlant: "Un seul plant",
      fewPlants: "Quelques plants",
      smallArea: "Une petite zone",
      severalAreas: "Plusieurs zones",
      almostField: "Presque tout le champ",
      unknown: "Je ne sais pas",
      why: "Pourquoi cette question ?",
      whyDescription:
        "Vous avez déjà fourni plusieurs observations. Nous demandons seulement l’information encore manquante.",
      skip: "Passer cette question",
      skipDescription:
        "Le résultat sera calculé avec les informations déjà fournies.",
    },
    parts: {
      leaves: "Feuilles",
      stem: "Tige",
      stems: "Tiges",
      roots: "Racines",
      tuberousRoots: "Racines tubéreuses",
      collar: "Collet",
      ears: "Épis ou grains",
      flowers: "Fleurs",
      fruits: "Fruits",
      pseudostem: "Pseudo-tronc",
      corm: "Corme et racines",
      inflorescence: "Fleur du plantain",
      fruitBunch: "Régime de plantains",
      wholePlant: "Toute la plante",
      unknown: "Je ne sais pas",
    },

    observations: {
      yellowing: "Jaunissement",
      spots: "Taches",
      brownSpots: "Taches brunes",
      blackSpots: "Stries ou taches noires",
      holes: "Trous",
      dryEdges: "Bords secs",
      deformation: "Déformation",
      wilting: "Flétrissement",
      mosaic: "Mosaïque jaune et verte",
      rootRot: "Pourriture des racines",
      whiteflies: "Présence de mouches blanches",
      leafCurling: "Feuilles enroulées",
      blossomEndRot: "Pourriture au bas du fruit",
      insects: "Présence d’insectes",
      pseudostemRot: "Pourriture du pseudo-tronc",
      fruitDamage: "Dégâts sur le régime",
    },
  },
  offline: {
    worksOffline: "Fonctionne sans Internet",
    dataStaysOnDevice: "Vos données restent sur cet appareil.",
    readyOffline: "Prêt à fonctionner hors ligne",
    noInternetRequired: "Aucune connexion Internet nécessaire",
    preparedOnDevice: "Tout est préparé directement sur votre appareil.",
  },

  onboarding: {
    eyebrow: "COMMENT ÇA MARCHE",
    imageAlt: "Agricultrice camerounaise utilisant AgriMboa dans son champ",

    step1: {
      title: "Identifiez facilement un problème",
      description:
        "Décrivez simplement ce que vous observez sur votre culture. AgriMboa vous pose quelques questions pour mieux comprendre la situation.",

      features: {
        crop: "Choisissez la culture concernée",
        symptoms: "Indiquez les symptômes observés",
        questions: "Répondez à quelques questions simples",
      },
    },

    step2: {
      title: "Recevez des conseils agricoles fiables",
      description:
        "AgriMboa recherche dans des guides agricoles enregistrés sur votre appareil pour vous proposer des recommandations claires et prudentes.",

      features: {
        reliable: "Des informations provenant de guides fiables",
        explanations: "Des recommandations expliquées simplement",
        sources: "Les sources utilisées restent consultables",
      },
    },

    step3: {
      title: "Utilisez AgriMboa sans Internet",
      description:
        "Le modèle d’intelligence artificielle et les guides agricoles sont enregistrés sur votre appareil. Vous pouvez donc consulter AgriMboa même lorsque le réseau est indisponible.",

      features: {
        noConnection: "Aucune connexion requise pendant l’utilisation",
        consultations: "Vos consultations restent sur cet appareil",
        available: "AgriMboa reste disponible où que vous soyez",
      },
    },

    progress: "{current} sur {total}",
  },

  preparation: {
    eyebrow: "DÉMARRAGE",
    title: "Préparation d’AgriMboa",
    description:
      "Nous vérifions les ressources nécessaires au fonctionnement hors ligne. Cette opération peut prendre quelques instants.",
    imageAlt: "Agricultrice préparant AgriMboa pour une utilisation hors ligne",
    progressLabel: "Préparation en cours",

    resources: {
      model: {
        title: "Modèle d’intelligence artificielle",
        description: "Chargement du moteur local",
      },

      guides: {
        title: "Guides agricoles",
        description: "Vérification des guides hors ligne",
      },
      storage: {
        title: "Stockage local",
        description: "Vos consultations seront enregistrées ici",
      },
    },
  },
  diagnosisResult: {
    common: {
      back: "Retour",
    },

    analysis: {
      eyebrow: "ANALYSE LOCALE EN COURS",
      title: "Nous analysons vos observations",
      subtitle:
        "L’assistant compare vos réponses avec les connaissances agricoles disponibles sur votre appareil.",
      progress: "Analyse",
      stage1: "Observations enregistrées",
      stage1Detail: "Vos réponses ont été préparées pour l’analyse.",
      stage2: "Recherche des causes probables",
      stage2Detail: "Comparaison avec les symptômes agricoles connus.",
      stage3: "Préparation des recommandations",
      summary: "Résumé de vos observations",
      crop: "Culture",
      parts: "Parties touchées",
      symptoms: "Symptômes",
      notSpecified: "Non précisé",
      local: "Analyse locale et confidentielle",
      localDetail: "Les observations restent enregistrées sur votre appareil.",
      cancel: "Annuler l’analyse",
    },
  },
  history: {
    eyebrow: "VOS ACTIVITÉS",
    title: "Historique des diagnostics",
    subtitle:
      "Retrouvez vos diagnostics, reprenez un suivi et consultez les recommandations enregistrées sur cet appareil.",

    newDiagnosis: "Nouveau diagnostic",
    exportHistory: "Exporter l’historique",
    export: "Exporter",

    search: "Rechercher une culture ou un résultat…",
    filters: "Filtres",
    allCrops: "Toutes les cultures",
    allPeriods: "Toutes les périodes",
    recent: "Plus récents",
    oldest: "Plus anciens",
    confidence: "Confiance",
    local: "Stockés localement",

    all: "Tous",
    ongoing: "Suivis en cours",
    completed: "Terminés",
    drafts: "Brouillons",

    today: "Aujourd’hui",
    loading: "Chargement de l’historique…",
    noResult: "Aucun diagnostic ne correspond à vos filtres.",

    open: "Ouvrir",
    consult: "Consulter",
    addFollowUp: "Ajouter un suivi",
    nextObservation: "Prochaine observation",
    actionsCompleted: "actions terminées",
    created: "Créé",

    watch: "À surveiller",
    followUp: "Suivi en cours",
    done: "Terminé",
    draft: "Brouillon",
    recommended: "Nouvelle observation recommandée",

    upcoming: "Suivis à venir",
    viewAll: "Voir tous les suivis",

    localTitle: "Vos données restent sur cet appareil",
    manage: "Gérer mes données",
    diagnosticsStored: "diagnostics stockés localement",

    previous: "Précédent",
    next: "Suivant",
    of: "sur",
    diagnostics: "diagnostics",

    tomorrow: "Demain",
    inDays: "Dans {days} jours",
    todayDue: "Aujourd’hui",

    maize: "Maïs",
    cassava: "Manioc",
    tomato: "Tomate",
    plantain: "Plantain",

    priority: "Priorité",
    low: "Faible",
    moderate: "Modérée",
    high: "Élevée",
  },
  library: {
    eyebrow: "Conseils agricoles hors ligne",
    title: "Bibliothèque agricole",
    subtitle:
      "Trouvez des fiches pratiques pour reconnaître les problèmes, protéger vos cultures et améliorer vos pratiques.",
    search: "Rechercher une culture, un symptôme ou un problème…",
    offlineSheets: "fiches disponibles hors ligne",
    explore: "Explorer",
    crops: "Cultures",
    problems: "Problèmes",
    guides: "Guides pratiques",
    saved: "Enregistrés",
    save: "Enregistrer",
    findQuickly: "Trouver rapidement",
    whatLooking: "Que recherchez-vous ?",
    availableOffline: "Disponible hors ligne",
    byCrop: "Par culture",
    popularCrops: "Cultures populaires",
    sheets: "fiches",
    recommended: "Recommandé",
    usefulNow: "Conseils utiles en ce moment",
    seeAll: "Voir toutes les fiches",
    offlineTitle: "Votre bibliothèque reste disponible hors ligne",
    offlineText: "{count} fiches sont stockées directement sur cet appareil.",
    manageContent: "Gérer le contenu hors ligne",
    continueReading: "Continuer la lecture",
    resume: "Reprendre",
    needHelp: "Vous ne trouvez pas votre problème ?",
    diagnosisText: "Lancez un diagnostic guidé à partir de vos observations.",
    startDiagnosis: "Démarrer un diagnostic",
    results: "Résultats de recherche",
    sheetsFound: "fiches trouvées",
    clearFilters: "Effacer les filtres",
    loading: "Chargement de la bibliothèque…",
    noResults: "Aucune fiche ne correspond à votre recherche.",
    minutes: "min de lecture",
    verifiedContent: "Contenu agricole vérifié",
    listen: "Écouter la fiche",
    stopListening: "Arrêter la lecture",
    downloadPdf: "Télécharger en PDF",
    recognizeTitle: "Comment reconnaître ce problème ?",
    recognizeText:
      "Observez plusieurs plants et comparez les feuilles jeunes et âgées. La position et l’évolution des signes permettent d’éviter une mauvaise interprétation.",
    stageEarly: "Début",
    stageEarlyText:
      "Les premiers signes apparaissent généralement sur les feuilles les plus âgées.",
    stageAdvanced: "Progression",
    stageAdvancedText:
      "Les zones jaunes peuvent brunir et se dessécher progressivement.",
    stagePlant: "Plant atteint",
    stagePlantText:
      "La croissance ralentit lorsque le problème devient important.",
    frequentSigns: "Signes fréquemment observés",
    doNotConfuse: "À ne pas confondre",
    whyImportant: "Pourquoi c’est important",
    potassiumRole: "Le rôle du potassium dans la plante",
    potassiumText:
      "Le potassium participe à la gestion de l’eau, à la solidité de la plante et au remplissage des grains. Une correction doit tenir compte du sol et des besoins réels de la culture.",
    beforeActing: "Avant d’agir",
    beforeActingText:
      "Confirmez vos observations sur plusieurs plants avant d’appliquer un traitement ou un engrais.",
    inSummary: "En résumé",
    updatedLocally: "Cette fiche est enregistrée sur votre appareil.",
    needPersonalized: "Besoin d’un conseil personnalisé ?",
    backToLibrary: "Retour à la bibliothèque",

    categories: {
      crop: "Cultures",
      disease: "Maladies",
      deficiency: "Carences",
      pest: "Ravageurs",
      practice: "Bonnes pratiques",
      guide: "Guide pratique",
    },

    categoryDescriptions: {
      crop: "Conseils classés par culture",
      disease: "Reconnaître les maladies",
      deficiency: "Identifier les carences",
      pest: "Repérer les ravageurs",
      practice: "Améliorer vos pratiques",
    },

    cropNames: {
      maize: "Maïs",
      cassava: "Manioc",
      tomato: "Tomate",
      plantain: "Plantain",
      general: "Toutes les cultures",
    },

    cropDescriptions: {
      maize: "Nutrition, maladies, ravageurs et récolte",
      cassava: "Feuilles, racines, boutures et conservation",
      tomato: "Pépinière, maladies, arrosage et fruits",
      plantain: "Feuilles, bulbe, pseudotronc et régime",
    },

    detailTabs: {
      overview: "Vue d’ensemble",
      symptoms: "Symptômes",
      causes: "Causes possibles",
      actions: "Actions",
      prevention: "Prévention",
    },
  },
  calculators: {
    eyebrow: "Outils pratiques",
    title: "Calculateurs agricoles",
    subtitle:
      "Préparez vos travaux et estimez vos besoins avec des outils simples, disponibles hors ligne.",
    search: "Rechercher un calculateur…",
    offlineTools: "outils disponibles hors ligne",
    recommended: "Calculateur recommandé",
    simple: "Simple",
    noConnection: "Sans connexion",
    localUnits: "Unités locales",
    calculateSurface: "Calculer une surface",
    viewExample: "Voir un exemple",
    allTools: "Tous les calculateurs",
    open: "Ouvrir",
    recent: "Calcul récent",
    resume: "Reprendre",
    estimatesTitle: "Des estimations, pas des prescriptions",
    estimatesText:
      "Les résultats servent à préparer vos décisions. Vérifiez les valeurs avec les réalités de votre parcelle et les conseils locaux.",
    needHelp: "Besoin d’aide pour choisir un outil ?",
    needHelpText: "Décrivez ce que vous souhaitez calculer.",
    askAgrimboa: "Demander à AgriMboa",

    back: "Retour aux calculateurs",
    offlineCalculator: "CALCULATEUR HORS LIGNE",
    completed: "PARCOURS TERMINÉ",
    summaryTitle: "Synthèse de votre parcelle",

    pageDescriptions: {
      surface:
        "Saisissez les dimensions de votre terrain pour obtenir sa surface dans plusieurs unités.",
      density:
        "Estimez le nombre de plants selon la surface et les distances de plantation.",
      seeds: "Estimez la quantité de semences à prévoir pour votre parcelle.",
      inputs:
        "Convertissez une dose connue selon la surface réelle de votre parcelle.",
      summary:
        "Retrouvez tous les résultats de votre parcours dans un seul récapitulatif.",
      harvest:
        "Projetez une récolte indicative à partir de la surface et du rendement attendu.",
      budget: "Comparez les dépenses prévues aux recettes attendues.",
      converter: "Convertissez rapidement les hectares en mètres carrés.",
    },

    tool: {
      surface: {
        title: "Surface de parcelle",
        description:
          "Calculez la surface d’un terrain rectangulaire, triangulaire ou irrégulier.",
      },
      density: {
        title: "Densité et espacement",
        description:
          "Estimez le nombre de plants selon les distances choisies.",
      },
      seeds: {
        title: "Quantité de semences",
        description:
          "Préparez une estimation à partir de la surface et de la densité.",
      },
      inputs: {
        title: "Quantité d’intrants",
        description: "Convertissez une dose vérifiée selon la surface réelle.",
      },
      harvest: {
        title: "Estimation de récolte",
        description:
          "Projetez une quantité indicative à partir d’un rendement attendu.",
      },
      budget: {
        title: "Budget de culture",
        description:
          "Additionnez les dépenses prévues et comparez-les aux recettes.",
      },
      converter: {
        title: "Convertisseur d’unités",
        description:
          "Convertissez hectares, mètres carrés, kilogrammes et sacs.",
      },
      summary: {
        title: "Synthèse de la parcelle",
        description: "Consultez les résultats liés de votre parcours.",
      },
    },

    crop: {
      maize: "Maïs",
      cassava: "Manioc",
      tomato: "Tomate",
      plantain: "Plantain",
    },

    recoveredData: "Données récupérées",
    previousCalculation: "Depuis le calcul précédent",
    useVerifiedDose: "Utilisez une dose vérifiée",
    useVerifiedDoseText:
      "Saisissez la dose indiquée sur l’étiquette du produit ou recommandée par un technicien agricole.",
    noDoseChoice: "L’application ne choisit pas le dosage à votre place.",

    formTitles: {
      surface: "Entrez vos mesures",
      density: "Renseignez la plantation",
      seeds: "Ajustez vos paramètres",
      inputs: "Renseignez le produit",
    },

    diagramTitles: {
      surface: "Vérifiez le schéma",
      density: "Vérifiez l’espacement",
      seeds: "Comprenez le calcul",
      inputs: "Vérifiez la conversion",
    },

    parcelShape: "Forme de la parcelle",
    rectangle: "Rectangle",
    triangle: "Triangle",
    irregular: "Forme irrégulière",
    length: "Longueur",
    width: "Largeur",
    calculationName: "Nom du calcul",
    culture: "Culture",
    rowSpacing: "Distance entre les lignes",
    plantSpacing: "Distance entre les plants",
    plantsPerHole: "Plants par poquet",
    requiredPlants: "Plants nécessaires",
    germination: "Taux de germination",
    margin: "Marge de sécurité",
    thousandWeight: "Poids de 1 000 grains",
    inputType: "Type d’intrant",
    fertilizer: "Engrais",
    amendment: "Amendement",
    treatment: "Produit de traitement",
    productName: "Nom du produit",
    referenceDose: "Dose de référence",
    packaging: "Conditionnement",
    applications: "Nombre d’applications",

    hints: {
      surface:
        "Pour une forme complexe, divisez la parcelle en plusieurs zones simples.",
      density: "Adaptez ces valeurs à votre variété et aux conseils locaux.",
      seeds: "Le poids varie selon la variété et le lot de semences.",
      inputs: "Recopiez exactement la dose et l’unité de votre source.",
    },

    diagramHints: {
      surface: "Le schéma s’adapte aux mesures saisies.",
      density:
        "Vérifiez visuellement la distance entre les lignes et les plants.",
      seeds:
        "Vous pouvez modifier le taux indiqué sur l’étiquette de votre lot.",
      inputs: "La dose affichée a été saisie manuellement.",
    },

    calculate: {
      surface: "Calculer la surface",
      density: "Calculer la densité",
      seeds: "Calculer les semences",
      inputs: "Calculer la quantité",
    },

    clear: "Effacer",
    estimatedResult: "RÉSULTAT ESTIMÉ",
    verified: "Calcul vérifié",
    saveCalculation: "Enregistrer ce calcul",
    copy: "Copier",
    grains: "graines",
    bags: "sac(s)",

    formulas: {
      surface: "{a} m × {b} m = {result}",
      density: "{s} ÷ ({r} × {p}) = {result}",
      seeds: "{n} ÷ {g} % avec {m} % de marge = {result}",
      inputs: "{d} kg/ha × {h} ha = {result}",
    },

    cautionTitles: {
      surface: "Vérifiez vos mesures",
      density: "Vérifiez l’espacement choisi",
      seeds: "Vérifiez votre lot de semences",
      inputs: "Avant toute application",
    },

    cautionTexts: {
      surface:
        "Le résultat dépend des dimensions saisies. Pour une parcelle irrégulière, mesurez plusieurs zones et additionnez leurs surfaces.",
      density:
        "Les distances adaptées varient selon la culture, la variété, le sol et les pratiques locales.",
      seeds:
        "Le taux de germination et le poids des grains peuvent varier selon la variété, le fournisseur et la conservation.",
      inputs:
        "Vérifiez le produit, la culture, le stade de croissance, les équipements de protection et les consignes de sécurité.",
    },

    aiTitle: "Explication d’AgriMboa",
    aiIntro:
      "AgriMboa peut expliquer le résultat et vérifier la cohérence générale des valeurs.",
    aiLoading: "AgriMboa analyse le calcul…",
    askAi: "Demander une explication",

    restart: "Recommencer",
    otherTool: "Choisir un autre calculateur",
    finishSave: "Terminer et enregistrer",

    useFor: {
      density: "Utiliser ce résultat pour la densité",
      seeds: "Utiliser ce résultat pour les semences",
      inputs: "Utiliser ce résultat pour les intrants",
      summary: "Afficher la synthèse",
    },

    savedDone: "Calculs terminés et enregistrés",
    savedOffline:
      "Ces informations restent disponibles hors ligne sur cet appareil.",
    rename: "Renommer la parcelle",
    viewCalculation: "Voir le calcul",
    parcelNotes: "Notes de la parcelle",
    notePlaceholder:
      "Ajoutez une note utile : variété, date prévue, fournisseur…",
    saveNote: "Enregistrer la note",
    nextActions: "Prochaines actions",
    viewCropGuide: "Consulter la fiche de la culture",
    createReminder: "Créer un rappel",
    openHistory: "Ouvrir l’historique",
    verifyEstimates: "Des estimations à vérifier",
    verifyEstimatesText:
      "Les résultats dépendent des données saisies. Pour les dosages et les pratiques agricoles, suivez l’étiquette du produit ou l’avis d’un technicien.",
    safetyAdvice: "Voir les conseils de sécurité",
    editCalculation: "Modifier un calcul",
    newJourney: "Nouveau parcours",
    exportSummary: "Exporter le récapitulatif en PDF",
    finish: "Terminer",

    enterValues: "Entrez vos valeurs",
    areaHectares: "Surface cultivée",
    expectedYield: "Rendement attendu",
    totalCosts: "Dépenses totales",
    expectedRevenue: "Recettes attendues",
    hectaresToConvert: "Hectares à convertir",
    calculateNow: "Calculer",
    understandCalculation: "Comprenez le calcul",
    startJourney: "Commencer le parcours",

    utilityHints: {
      harvest:
        "Utilisez un rendement réaliste provenant de vos récoltes précédentes ou d’une source locale fiable.",
      budget:
        "Ajoutez toutes les dépenses : semences, intrants, transport, main-d’œuvre et stockage.",
      converter: "Un hectare correspond exactement à 10 000 mètres carrés.",
    },

    utilityExplanations: {
      harvest:
        "La surface est multipliée par le rendement attendu par hectare.",
      budget:
        "Le résultat correspond aux recettes attendues moins les dépenses.",
      converter: "La valeur en hectares est multipliée par 10 000.",
    },
  },
  help: {
    heroAlt: "Assistant agricole consultant le Centre d’aide AgriMboa",
    eyebrow: "Assistance",
    title: "Comment pouvons-nous vous aider ?",
    subtitle:
      "Trouvez rapidement une réponse ou apprenez à utiliser AgriMboa, même hors ligne.",
    searchPlaceholder: "Rechercher une question ou une fonctionnalité...",
    voiceRequest: "Demander par la voix",
    listening: "Je vous écoute...",
    voiceUnavailable:
      "La reconnaissance vocale n’est pas disponible sur cet appareil.",

    topics: {
      discover: {
        title: "Découvrir l’application",
        description: "Comprendre les fonctions principales",
      },
      diagnosis: {
        title: "Lancer un diagnostic",
        description: "Suivre les étapes pas à pas",
      },
      calculators: {
        title: "Utiliser les calculateurs",
        description: "Surface, densité, semences et intrants",
      },
      offline: {
        title: "Gérer le mode hors ligne",
        description: "Téléchargements et stockage",
      },
    },

    faqTitle: "Questions fréquentes",
    faq: {
      offline: {
        question: "AgriMboa fonctionne-t-il sans Internet ?",
        answer:
          "Oui. Les fiches téléchargées, les calculateurs, les diagnostics enregistrés et l’historique restent accessibles hors ligne.",
      },
      voice: {
        question: "Comment parler au lieu d’écrire ?",
        answer:
          "Appuyez sur le bouton du microphone, autorisez l’accès au micro, puis décrivez clairement votre problème.",
      },
      skip: {
        question: "Puis-je passer les questions du diagnostic ?",
        answer:
          "Certaines questions peuvent être ignorées. Les questions indispensables au diagnostic doivent cependant recevoir une réponse.",
      },
      crop: {
        question: "Comment modifier la culture choisie ?",
        answer:
          "Revenez à la première étape du diagnostic et sélectionnez une autre culture. Les réponses incompatibles seront réinitialisées.",
      },
      history: {
        question: "Où retrouver mes anciens résultats ?",
        answer:
          "Ouvrez la page Historique. Les diagnostics enregistrés sur cet appareil y sont affichés, même sans connexion.",
      },
      export: {
        question: "Comment exporter un résultat en PDF ?",
        answer:
          "Ouvrez un diagnostic terminé, puis utilisez le bouton Exporter ou PDF présent sur la page du résultat.",
      },
    },

    noResult: "Aucune réponse ne correspond à votre recherche.",
    allQuestions: "Voir toutes les questions",
    quickGuides: "Guides rapides",

    guides: {
      start: "Premiers pas avec AgriMboa",
      diagnosis: "Faire un diagnostic guidé",
      offline: "Télécharger des fiches hors ligne",
      results: "Comprendre les résultats",
    },

    minutes: "min",
    allGuides: "Voir tous les guides",
    appStatus: "État de l’application",
    appWorking: "L’application fonctionne correctement",
    offlineFiles: "{count} fiches disponibles hors ligne",
    lastCheck: "Dernière vérification : aujourd’hui à {time}",
    checkStorage: "Vérifier le stockage",

    notFoundTitle: "Vous n’avez pas trouvé la réponse ?",
    notFoundText:
      "Décrivez votre difficulté. Votre message sera conservé sur l’appareil et pourra être envoyé lorsqu’une connexion sera disponible.",
    reportProblem: "Signaler un problème",
    contactUs: "Nous contacter",
    reportSubject: "Signalement d’un problème AgriMboa",
    contactSubject: "Demande d’assistance AgriMboa",
    privacy: "Aucune donnée n’est envoyée sans votre autorisation.",
  },
} as const;
