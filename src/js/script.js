const API_URL =
  "https://api.scryfall.com/cards/search?order=rarity&q=set%3Awar";
const $button = document.querySelector(".button");
const $cardsContainer = document.querySelector(".cards");
const $loader = document.querySelector(".lds-ring");
const $listContainer = document.querySelector(".cardList");
// random number function
const getRandomNumberInRange = (max) => Math.floor(Math.random() * max);

// make disappear the button after cliking
$button.addEventListener("click", () => {
  $button.classList.add("hidden");
  $loader.classList.remove("hidden");
  startDraft();
});

// pick a random card inside array
const getRandomCards = (cards, number) => {
  return Array.from({ length: number }).map(
    (_) => cards[getRandomNumberInRange(cards.length)]
  );
};

const createCardElement = (card, booster, idx, selectedCards, boosters) => {
  let $el = document.createElement("li");
  // create image element
  let $img = document.createElement("img");
  // set src of the element
  $img.src = card.image_uris.png;
  // append it to $el
  $el.appendChild($img);
  // $el.innerHTML = card.name;
  $el.addEventListener("click", () => {
    // remove and returns the selected card from booster
    booster.splice(idx, 1);
    // add removed card to our deck
    selectedCards.push(card);
    // handle logic to get the next booster
    renderBooster(boosters[1], selectedCards, boosters);
  });
  return $el;
};

const createBooster = (rares, uncommon, common) => {
  return [
    ...getRandomCards(rares, 1),
    ...getRandomCards(uncommon, 3),
    ...getRandomCards(common, 11),
  ];
};

const renderBooster = (booster, selectedCards, boosters) => {
  $listContainer.innerHTML = "";
  const $fragment = document.createDocumentFragment();
  booster.forEach((card, idx) =>
    $listContainer.appendChild(
      createCardElement(card, booster, idx, selectedCards, boosters)
    )
  );
  $fragment.appendChild($listContainer);
  $cardsContainer.appendChild($fragment);
};

const startDraft = () => {
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
      $loader.classList.add("hidden");
      const $fragment = document.createDocumentFragment();
      const selectedCards = [];
      // handle logic to get the next booster
      renderBooster(boosters[0], selectedCards, boosters);
    })
    .catch((err) => console.log(`Boom ${err}`));
};
