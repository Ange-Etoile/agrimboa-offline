# Centre d’aide AgriMboa

## Route à ajouter

Ajoutez cette route avant la route dynamique `/diagnosis/:step?` :

```ts
{
  path: "/help",
  name: "help",
  component: () => import("@/views/HelpCenterView.vue"),
},
```

Le lien « Aide » du menu desktop doit pointer vers `/help`. Sur mobile, la page est accessible depuis « Plus » ou directement avec `router.push("/help")`.

## Traductions

Les blocs `help` français, anglais et pidgin sont fournis séparément dans la réponse. Ils ne sont volontairement pas inclus dans cette archive afin de ne pas écraser vos fichiers de langue existants.

## Fonctionnalités

- recherche locale dans les FAQ et les guides ;
- recherche vocale via l’API de reconnaissance disponible sur l’appareil ;
- FAQ en accordéon ;
- navigation vers le diagnostic, les calculateurs, la bibliothèque et l’historique ;
- vérification non destructive du stockage local ;
- contact par l’application de messagerie installée ;
- fonctionnement sans appel réseau obligatoire.
