let myList = document.querySelector(".cards");

const getRandomNumberInRange = (max) => Math.floor(Math.random() * max);

const getRandomCards = (cards, number) => {
  return Array.from({ length: number }).map(
    (_) => cards[getRandomNumberInRange(cards.length)]
  );
};

fetch("https://api.scryfall.com/cards/search?order=rarity&q=set%3Awar")
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
        // return only one array from the 3 previous ones
        return [
          ...getRandomCards(rares, 1),
          ...getRandomCards(uncommon, 3),
          ...getRandomCards(common, 11),
        ];
      });
  })
  .then((booster) => {})
  .catch((err) => console.log(`Boom ${err}`));
