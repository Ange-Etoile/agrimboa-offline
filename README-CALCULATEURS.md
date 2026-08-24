# Mise à jour Calculateurs agricoles AgriMboa

Cette livraison ajoute le module des calculateurs sans supprimer les fonctionnalités existantes.

## Parcours livré

1. Liste responsive de six outils.
2. Surface d’une parcelle.
3. Densité et espacement.
4. Quantité de semences.
5. Conversion d’une dose d’intrant.
6. Synthèse liée de la parcelle.

Les quatre calculs principaux sont déterministes et fonctionnent sans Internet. Les données sont transmises d’une étape à la suivante et enregistrées dans SQLite par la migration 008.

## Rôle de l’IA

La commande Rust `generate_calculator_advice` utilise la même stratégie que le diagnostic : Groq si `GROQ_API_KEY` est disponible, puis Qwen local. L’IA explique et vérifie la cohérence, mais ne remplace jamais les formules et ne choisit jamais une dose d’intrant.

Une indisponibilité des moteurs ne bloque pas le résultat : le frontend affiche un conseil de secours prudent.

## Installation

Les traductions ne sont pas incluses dans le ZIP. Ajoutez l’objet `calculators` fourni séparément dans vos fichiers `fr`, `en` et `pcm`.

```bash
npm run build
npm run tauri dev
```
