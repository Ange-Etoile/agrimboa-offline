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
    description:
      "Sélectionnez la langue que vous souhaitez utiliser.",
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

    changeLater:
      "Vous pourrez modifier la langue plus tard.",
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
    imageAlt:
      "Agricultrice camerounaise utilisant AgriMboa dans son champ",
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
    otherDescription:
      "D’autres cultures seront ajoutées prochainement.",
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
    unsureDescription:"Choisissez « Je ne sais pas ». AgriMboa vous posera d’autres questions.",
    commonDescription:"Sélectionnez la zone où vous observez le problème. Vous pouvez choisir plusieurs réponses.",

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
    description:
      "Sélectionnez tous les symptômes que vous observez.",
    yellowing: "Jaunissement",
    spots: "Taches",
    holes: "Trous",
    dryEdges: "Bords secs",
    deformation: "Déformation",
    insects: "Présence d’insectes",
    absent: "Observation absente ?",
    absentDescription:"Vous pourrez la décrire avec vos propres mots à l’étape suivante.",
    commonDescription:"Sélectionnez tous les symptômes que vous observez.",

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
    skipDescription:
      "Vous pourrez toujours ajouter des détails plus tard.",
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
    dataStaysOnDevice:
      "Vos données restent sur cet appareil.",
    readyOffline: "Prêt à fonctionner hors ligne",
    noInternetRequired:
      "Aucune connexion Internet nécessaire",
    preparedOnDevice:
      "Tout est préparé directement sur votre appareil.",
  },

  onboarding: {
    eyebrow: "COMMENT ÇA MARCHE",
    imageAlt:
      "Agricultrice camerounaise utilisant AgriMboa dans son champ",

    step1: {
      title: "Identifiez facilement un problème",
      description:
        "Décrivez simplement ce que vous observez sur votre culture. AgriMboa vous pose quelques questions pour mieux comprendre la situation.",

      features: {
        crop: "Choisissez la culture concernée",
        symptoms: "Indiquez les symptômes observés",
        questions:
          "Répondez à quelques questions simples",
      },
    },

    step2: {
      title: "Recevez des conseils agricoles fiables",
      description:
        "AgriMboa recherche dans des guides agricoles enregistrés sur votre appareil pour vous proposer des recommandations claires et prudentes.",

      features: {
        reliable:
          "Des informations provenant de guides fiables",
        explanations:
          "Des recommandations expliquées simplement",
        sources:
          "Les sources utilisées restent consultables",
      },
    },

    step3: {
      title: "Utilisez AgriMboa sans Internet",
      description:
        "Le modèle d’intelligence artificielle et les guides agricoles sont enregistrés sur votre appareil. Vous pouvez donc consulter AgriMboa même lorsque le réseau est indisponible.",

      features: {
        noConnection:
          "Aucune connexion requise pendant l’utilisation",
        consultations:
          "Vos consultations restent sur cet appareil",
        available:
          "AgriMboa reste disponible où que vous soyez",
      },
    },

    progress: "{current} sur {total}",
  },

  preparation: {
    eyebrow: "DÉMARRAGE",
    title: "Préparation d’AgriMboa",
    description:
      "Nous vérifions les ressources nécessaires au fonctionnement hors ligne. Cette opération peut prendre quelques instants.",
    imageAlt:
      "Agricultrice préparant AgriMboa pour une utilisation hors ligne",
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
        description:
          "Vos consultations seront enregistrées ici",
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
    stage1Detail:
      "Vos réponses ont été préparées pour l’analyse.",
    stage2: "Recherche des causes probables",
    stage2Detail:
      "Comparaison avec les symptômes agricoles connus.",
    stage3: "Préparation des recommandations",
    summary: "Résumé de vos observations",
    crop: "Culture",
    parts: "Parties touchées",
    symptoms: "Symptômes",
    notSpecified: "Non précisé",
    local: "Analyse locale et confidentielle",
    localDetail:
      "Les observations restent enregistrées sur votre appareil.",
    cancel: "Annuler l’analyse",
  },
},
} as const;