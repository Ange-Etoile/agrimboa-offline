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
} as const;