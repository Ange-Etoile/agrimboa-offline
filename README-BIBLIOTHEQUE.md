# Mise à jour Bibliothèque agricole AgriMboa

Cette livraison ajoute la bibliothèque hors ligne sans supprimer les pages déjà présentes.

## Contenu

- 48 fiches SQLite : 12 maïs, 9 manioc, 11 tomate, 9 plantain et 7 fiches transversales.
- Page Bibliothèque responsive fidèle aux maquettes.
- Fiche détaillée responsive avec lecture vocale, favoris, progression et impression PDF.
- Recherche, filtres par culture et sujet, pagination et contenu recommandé.
- Routes `/library` et `/library/:slug`.

## Installation

Ajoutez ensuite les clés `library` fournies séparément dans les trois fichiers de langue existants. Elles ne sont volontairement pas incluses dans ce ZIP.

Lancez enfin :

```bash
npm run build
npm run tauri dev
```

La migration 007 est appliquée automatiquement au prochain démarrage Tauri. Une application ayant déjà exécuté une ancienne migration 007 de test doit utiliser une nouvelle version de migration ou supprimer uniquement sa base de développement avant le test.
