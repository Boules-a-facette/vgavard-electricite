# Vérification de la reprise — vgavard-electricite.com

29 septembre 2026. Contrôle fait par l'orchestrateur après la construction déléguée, sur le site
servi en local (`python3 -m http.server 8899`), comparé page par page à l'original en ligne.

## Ce qui a été mesuré

**Correction apportée après le premier passage.** Les styles calculés divergeaient sur la
typographie : l'original met les titres de contenu en capitales (`h1` et `h2` en
`text-transform: uppercase`) et garde le corps en Arial, « Terminal Dosis » ne servant qu'aux
titres (réglage Enfold `default_font = Arial`). La copie faisait l'inverse : titres en bas de
casse, corps en Terminal Dosis. Corrigé dans `assets/css/site.css`. Après correction, l'écart de
styles calculés est **nul sur les quatre pages** (seul reste un `<h4>` vide sans effet visuel,
présent dans l'original et absent de la copie).

| Contrôle | Résultat |
|---|---|
| Les 4 URL d'origine répondent 200, plus `404.html` | conforme |
| Aucune ressource manquante (44 références locales vérifiées) | conforme |
| Aucune requête vers `vgavard-electricite.com` | conforme — le domaine n'apparaît que dans les `canonical` et le sitemap, ce qui est voulu |
| Débordement horizontal à 375 px | aucun sur les 4 pages (`scrollWidth` = 375) |
| Styles calculés `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `body` | identiques à l'original sur les 4 pages |
| Les 4 corrections demandées (§7 de la spec) | appliquées : lien « Accueil » vers `/`, encart « Devis Gratuit » vers Contact, placeholder remplacé, coquille de téléphone corrigée, message de confirmation du formulaire adapté |
| Formulaire | présent sur Contact, champs Nom / E-Mail / Téléphone / Sujet / Message, bouton « Envoyer » |
| Rendus visuels comparés | accueil en 1440 px, pied de page en 1440 px, page Contact en 1440 px |

## Non vérifié, à regarder sur un vrai navigateur

- **La carte de la page Contact.** L'`iframe` est correct : elle charge un document Google
  inter-origine, et l'URL d'intégration répond 200 avec le HTML de carte. Mais elle ne peint pas
  dans le navigateur automatisé utilisé pour ce contrôle — alors que la **même URL**, dans l'iframe
  plus petite du pied de page, s'y affiche normalement. C'est une limite du navigateur
  d'automatisation, pas un défaut du site. À confirmer à l'œil sur le Brave de Benjamin.
  À noter : la carte de l'original est, elle, **cassée** dans un vrai navigateur — Google affiche
  « Impossible de charger Google Maps correctement sur cette page ».
- Le défilement du hero et l'ouverture des galeries en visionneuse : écrits, jamais exercés.
- L'ouverture réelle d'un logiciel de messagerie par le formulaire.
- Les pages Prestations, Réalisations et Contact en 1440 et 768 px : seuls les styles calculés ont
  été comparés, pas les rendus image par image.

## Écarts connus, assumés

- Le menu surligne « Accueil » comme page courante sur l'accueil. L'original ne le fait pas, parce
  que son lien de menu pointait vers une URL morte que WordPress ne pouvait pas reconnaître. C'est
  la conséquence directe de la correction du lien mort.
- L'icône de recherche du menu de l'original n'est pas reprise : elle ne menait à rien d'utile, la
  recherche interne n'ayant aucun contenu à indexer.
- Le pied de page reprend le widget « Nos travaux » de l'original, qui affiche l'article de
  démonstration du thème (« Electricité, 30 juin 2015 »). Fidèle à l'original, mais c'est
  précisément le genre de contenu que la cliente voudra sans doute remplacer.
