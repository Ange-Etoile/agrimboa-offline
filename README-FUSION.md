# AgriMboa - Mise à jour IA hybride Groq + Qwen local

Copiez `src` et `src-tauri` à la racine du projet et acceptez la fusion/remplacement.

## Fichiers ajoutés ou remplacés

- `src/services/local-ai.service.ts`
- `src/components/diagnosis/DynamicQuestion.vue`
- `src/features/diagnosis/types/diagnosis.ts`
- `src/stores/diagnosis.store.ts`
- `src/views/DiagnosisView.vue`
- `src-tauri/src/lib.rs`
- `src-tauri/Cargo.toml`

## Où mettre la clé Groq ?

Ne placez la clé dans aucun fichier. Dans le CMD qui lancera Tauri :

```cmd
set GROQ_API_KEY=gsk_votre_cle
set CARGO_BUILD_JOBS=2
npm run tauri dev
```

La variable créée avec `set` est temporaire et disparaît à la fermeture du CMD. Si Tauri était déjà lancé avant le `set`, arrêtez puis relancez uniquement Tauri depuis ce CMD.

Ne jamais utiliser `VITE_GROQ_API_KEY`, car une variable préfixée `VITE_` serait intégrée au frontend.

## Repli automatique

1. Rust essaie `qwen/qwen3.6-27b` sur Groq pendant 25 secondes maximum.
2. En l’absence de clé, d’Internet, de quota ou de réponse valide, Rust appelle Qwen2.5 3B local sur `127.0.0.1:11435`.
3. Le délai local est de 180 secondes.
4. L’interface indique quel moteur a répondu.

## Lancement du modèle local

```cmd
llama-server -hf Qwen/Qwen2.5-3B-Instruct-GGUF:Q4_K_M --host 127.0.0.1 --port 11435 -c 2048 -t 2 -ngl 0 -np 1
```

## Vérification

```cmd
npm run build
set GROQ_API_KEY=gsk_votre_cle
set CARGO_BUILD_JOBS=2
npm run tauri dev
```

La clé Groq ne doit jamais être commitée dans Git ou envoyée dans une capture d’écran.
