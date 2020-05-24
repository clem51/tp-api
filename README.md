# TP API

## Installation

```
npm install
npm run dev
```

## But de l'application en une phrase

Simulateur de draft Magic the Gathering (Extension War Of The Spark).

## URL de l'API utilisée

https://scryfall.com/docs/api

## Liste des routes sollicitées

"https://api.scryfall.com/cards/search?order=rarity&q=set%3Awar".

J'ai plus de voiture....

## Fonctionnement détaillé de l'application

<p align="center">
  <img src="../tp-api/src/assets/images/WAR_logo.png">
</p>

Le principe est de reproduire un draft sur Magic et le fonctionnement est assez complexe.
C'est assez long a expliquer mais en substance :

Chaque joueur commence avec trois boosters, il pick une carte et le fait passer a son voisin de
gauche qui as lui même pris une carte dans son booster, il reprends une carte dans celui qu'il vient d'avoir
et ainsi de suite jusqu'à épuisement du booster.
Ensuite le joueur ouvre un autre booster mais le passe a son voisin de droite qui a son tour le passe a son voisin de droite
après son pick etc..
Et pour le dernier booster pareil mais dans l'autre sens ( vers la gauche ).

<p align="center">
  <img src="./src/assets/images/plan_draft.png" alt = "Plan Draft"
</p>

Le but est de se constituer un deck le plus optimisé possible, selon différents archétypes ( variables selon les extensions par exemple dans war of the spark sur lequel j'ai décidé de faire le TP : Azorius Fly ),
et bien sûr les joueurs devront jouer les uns contre les autres ce que je n'ai pas implémenté et que je n'en ai pas l'intention
sinon je vais avoir des problèmes avec Wizard of the Coast ( l'éditeur de Magic ). Si c'est du chinois je pense que le lien le résumera mieux que moi.

Voir les principes de draft [ici](https://magic.wizards.com/fr/articles/archive/how-play-limited/le-booster-draft-de-quoi-il-sagit-et-comment-y-jouer-2017-11-07).

Tips :

-Il semblerait que Firefox gère mieux l'affichage des images, elles sont plus rapides à apparaitre.
Pour changer la résolution des images si votre pc/navigateur/réseau est lent :
Ligne 32/33 dans script.js commentez la ligne avec "\$img.src = card.image_uris.png" et décommentez la ligne en dessous,
cela aura par contre un effet esthétique car le animation et les effets de hover sont prévues pour des images en png.

<p align="center">
  <img src="./src/assets/images/screenreadme1.png">
</p>

-Il est possible de changer d'extension :
Ligne 2/3 dans le script.js toujours commentez la ligne 2 et décommentez la ligne en dessous.

<p align="center">
  <img src="./src/assets/images/screenreadme2.png">
</p>

Prochaines features :

- Grâce à un menu déroulant pouvoir changer d'extension à drafter.

- Partager sont Deck un fois la phase de picks finie.

- Soon...
