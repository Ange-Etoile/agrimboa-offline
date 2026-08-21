# Mise à jour résultats AgriMboa

Copiez le contenu de cette archive à la racine du projet en conservant l’arborescence. Les fichiers portant le même nom doivent être remplacés.

## Ce qui est ajouté

- déblocage du bouton de fin de collecte ;
- écran d’analyse responsive ;
- résultat final avec vue d’ensemble, plan d’action, explication et suivi ;
- génération hybride Groq/Qwen local avec résultat prudent de secours ;
- sauvegarde des consultations, réponses et résultats dans SQLite ;
- conservation des commandes Whisper déjà intégrées ;
- validation stricte du choix IA contre la banque SQLite, avec repli automatique
  sur une question autorisée si le modèle renvoie un code incorrect.
- récupération champ par champ des réponses IA : un champ imparfait ne remplace
  plus tout le diagnostic par le secours générique ;
- badge distinct pour Groq, Qwen local et le conseil local de secours ;
- conseils de secours différents pour maïs, manioc, tomate et plantain.

## Structure des résultats

La vue `DiagnosisResultView.vue` orchestre les composants suivants :

- `DiagnosisResultHero.vue` : synthèse, confiance et actions principales ;
- `DiagnosisResultTabs.vue` : navigation entre les quatre sections ;
- `DiagnosisOverview.vue` : cause probable, actions et alertes ;
- `DiagnosisActionPlan.vue` : plan d’action chronologique ;
- `DiagnosisExplanation.vue` : indices, limites et sources ;
- `DiagnosisFollowUp.vue` : formulaire et historique de suivi ;
- `DiagnosisResultFooter.vue` : navigation et enregistrement.

## Démarrage

Terminal 1 :

```bat
llama-server -hf Qwen/Qwen2.5-3B-Instruct-GGUF:Q4_K_M --host 127.0.0.1 --port 11435 -c 2048 -t 2 -ngl 0 -np 1
```

Terminal 2, avec Groq facultatif :

```bat
set GROQ_API_KEY=gsk_votre_cle
set CARGO_BUILD_JOBS=2
npm run tauri dev
```

Sans clé Groq, ne définissez pas `GROQ_API_KEY` : le moteur local est utilisé. Si aucun moteur ne répond, l’interface produit tout de même un résultat agronomique prudent fondé sur les réponses.

## Routes ajoutées

- `/diagnosis/analyzing`
- `/diagnosis/result/overview`
- `/diagnosis/result/action`
- `/diagnosis/result/why`
- `/diagnosis/result/followup`

La migration `005_seed_follow_up_questions.sql` existe déjà dans le projet et ne
doit pas être recréée sous le même numéro. Cette archive ne la remplace pas.

Les clés de traduction de l’écran d’analyse sont fournies séparément dans le message d’accompagnement, conformément à la demande.
