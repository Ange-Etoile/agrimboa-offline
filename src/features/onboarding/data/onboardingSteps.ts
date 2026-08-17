import {
  BookOpenCheck,
  MapPin,
  MessageSquareMore,
  ScanSearch,
  ShieldCheck,
  Smartphone,
  Sprout,
  WifiOff,
} from "lucide-vue-next";

export const onboardingSteps = [
  {
    eyebrow: "COMMENT ÇA MARCHE",
    title: "Identifiez facilement un problème",
    description:
      "Décrivez simplement ce que vous observez sur votre culture. AgriMboa vous pose quelques questions pour mieux comprendre la situation.",
    image: "diagnosis",
    items: [
      {
        label: "Choisissez la culture concernée",
        icon: Sprout,
      },
      {
        label: "Indiquez les symptômes observés",
        icon: ScanSearch,
      },
      {
        label: "Répondez à quelques questions simples",
        icon: MessageSquareMore,
      },
    ],
  },
  {
    eyebrow: "COMMENT ÇA MARCHE",
    title: "Recevez des conseils agricoles fiables",
    description:
      "AgriMboa recherche dans des guides agricoles enregistrés sur votre appareil pour vous proposer des recommandations claires et prudentes.",
    image: "guides",
    items: [
      {
        label: "Des informations provenant de guides fiables",
        icon: ShieldCheck,
      },
      {
        label: "Des recommandations expliquées simplement",
        icon: MessageSquareMore,
      },
      {
        label: "Les sources utilisées restent consultables",
        icon: BookOpenCheck,
      },
    ],
  },
  {
    eyebrow: "COMMENT ÇA MARCHE",
    title: "Utilisez AgriMboa sans Internet",
    description:
      "Le modèle d’intelligence artificielle et les guides agricoles sont enregistrés sur votre appareil. Vous pouvez donc consulter AgriMboa même lorsque le réseau est indisponible.",
    image: "guides",
    items: [
      {
        label: "Aucune connexion requise pendant l’utilisation",
        icon: WifiOff,
      },
      {
        label: "Vos consultations restent sur cet appareil",
        icon: Smartphone,
      },
      {
        label: "AgriMboa reste disponible où que vous soyez",
        icon: MapPin,
      },
    ],
  },
] as const;