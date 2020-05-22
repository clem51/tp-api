const API_URL =
  "https://api.scryfall.com/cards/search?order=rarity&q=set%3Awar";
// random number function
const getRandomNumberInRange = (max) => Math.floor(Math.random() * max);

// pick a random card inside array
const getRandomCards = (cards, number) => {
  return Array.from({ length: number }).map(
    (_) => cards[getRandomNumberInRange(cards.length)]
  );
};

const createCardElement = (card) => {
  let $el = document.createElement("div");
  // create image element
  let $img = document.createElement("img");
  // set src of the element
  $img.src = card.image_uris.png;
  // append it to $el
  $el.appendChild($img);
  return $el;
};

const createBooster = (rares, uncommon, common) => {
  return [
    ...getRandomCards(rares, 1),
    ...getRandomCards(uncommon, 3),
    ...getRandomCards(common, 11),
  ];
};

fetch(API_URL)
  .then((res) => res.json())
  .then((payload) => {
    // request the next page as pagination is set to 175 cards
    // but we need the full set ( 260+ cards)
    return fetch(payload.next_page)
      .then((res) => res.json())
      .then((res) => {
        const cards = payload.data.concat(res.data);
        // get 1 rare | legendary card
        const rares = cards.filter(
          (card) => card.rarity == "rare" || card.rarity == "mythic"
        );
        // get 3 uncommon cards
        const uncommon = cards.filter((card) => card.rarity == "uncommon");
        // get 11 common cards
        const common = cards.filter((card) => card.rarity == "common");
        // return 8 boosters
        return Array.from({ length: 2 }).map((_) =>
          createBooster(rares, uncommon, common)
        );
      });
  })
  .then((boosters) => {
    console.log(boosters);

    const $fragment = document.createDocumentFragment();
    boosters[0].forEach((card) =>
      $fragment.appendChild(createCardElement(card))
    );
    document.querySelector(".cards").appendChild($fragment);
  })
  .catch((err) => console.log(`Boom ${err}`));
