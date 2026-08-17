INSERT OR IGNORE INTO agricultural_guides (
    id,
    title,
    slug,
    language,
    crop,
    category,
    source_name,
    source_url,
    content,
    is_available_offline
)
VALUES (
    'guide-maize-faw-identification-fr',
    'Reconnaître la chenille légionnaire sur le maïs',
    'reconnaitre-chenille-legionnaire-mais',
    'fr',
    'maize',
    'diagnosis',
    'Organisation des Nations Unies pour l’alimentation et l’agriculture',
    'https://openknowledge.fao.org/handle/20.500.14283/i8665en',
    'Observez régulièrement plusieurs endroits du champ, particulièrement les jeunes plants. Recherchez des feuilles présentant des trous irréguliers, des zones grattées ou des dégâts concentrés dans le cornet du maïs. La présence de déjections dans le cornet peut accompagner une infestation de chenilles. Ces signes ne suffisent pas toujours à confirmer l’espèce. Examinez plusieurs plants et, en cas de doute, demandez l’avis d’un agent de vulgarisation agricole. Évitez d’appliquer un pesticide uniquement à partir d’un symptôme non confirmé.',
    1
);

INSERT OR IGNORE INTO agricultural_guides (
    id,
    title,
    slug,
    language,
    crop,
    category,
    source_name,
    source_url,
    content,
    is_available_offline
)
VALUES (
    'guide-maize-faw-management-fr',
    'Réagir prudemment aux dégâts de chenilles sur le maïs',
    'gestion-chenille-legionnaire-mais',
    'fr',
    'maize',
    'action-plan',
    'Organisation des Nations Unies pour l’alimentation et l’agriculture',
    'https://openknowledge.fao.org/handle/20.500.14283/i8665en',
    'Commencez par évaluer la proportion de plants touchés et le stade de développement du maïs. Préservez les insectes utiles et évitez les traitements systématiques. Maintenez le champ en bon état, surveillez fréquemment les jeunes plants et retirez manuellement les chenilles lorsque cette intervention reste possible sur une petite parcelle. Avant toute utilisation d’un produit phytosanitaire, consultez un conseiller agricole et respectez strictement les produits homologués, les doses, les équipements de protection et les délais de sécurité applicables dans votre pays.',
    1
);

INSERT OR IGNORE INTO agricultural_guides (
    id,
    title,
    slug,
    language,
    crop,
    category,
    source_name,
    source_url,
    content,
    is_available_offline
)
VALUES (
    'guide-cassava-mosaic-identification-fr',
    'Reconnaître les signes de mosaïque du manioc',
    'reconnaitre-mosaique-manioc',
    'fr',
    'cassava',
    'diagnosis',
    'Organisation des Nations Unies pour l’alimentation et l’agriculture',
    'https://www.fao.org/4/i1460e/i1460e.pdf',
    'La mosaïque du manioc peut provoquer une alternance de zones vert clair et vert foncé sur les feuilles, une déformation du limbe, une réduction de la taille des feuilles et un ralentissement de la croissance. L’intensité des signes peut varier selon la variété, l’âge de la plante et les conditions du champ. Observez plusieurs plants avant de conclure. D’autres problèmes peuvent produire des symptômes proches. Pour une confirmation, contactez un service agricole ou un spécialiste de la santé des plantes.',
    1
);

INSERT OR IGNORE INTO agricultural_guides (
    id,
    title,
    slug,
    language,
    crop,
    category,
    source_name,
    source_url,
    content,
    is_available_offline
)
VALUES (
    'guide-cassava-healthy-planting-fr',
    'Réduire les risques de maladies du manioc',
    'reduire-risques-maladies-manioc',
    'fr',
    'cassava',
    'prevention',
    'Organisation des Nations Unies pour l’alimentation et l’agriculture',
    'https://openknowledge.fao.org/handle/20.500.14283/i3278e',
    'Utilisez de préférence des boutures saines provenant d’une source connue et observez les plants mères avant le prélèvement. Évitez de multiplier des tiges provenant de plants présentant des feuilles déformées, des mosaïques marquées ou une croissance très faible. Nettoyez les outils entre les parcelles, surveillez régulièrement la culture et signalez rapidement les symptômes inhabituels. Lorsque cela est recommandé localement, utilisez des variétés améliorées ou tolérantes fournies par des services agricoles reconnus.',
    1
);

UPDATE app_resources
SET
    version = '1.0.0',
    status = 'ready',
    size_bytes = (
        SELECT COUNT(*)
        FROM agricultural_guides
        WHERE is_available_offline = 1
    ),
    installed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'agricultural-guides';