const API_URL =
  "https://api.scryfall.com/cards/search?order=rarity&q=set%3Awar";
// "https://api.scryfall.com/cards/search?order=rarity&q=set%3Aikoria";
const $button = document.querySelector(".start--button");
const $cardsContainer = document.querySelector(".cards");
const $loader = document.querySelector(".lds-ring");
const $listContainer = document.querySelector(".cardList");
const $header = document.querySelector(".header--image");

// random number function
const getRandomNumberInRange = (max) => Math.floor(Math.random() * max);
// check if the booster is empty
const isEmpty = (a) => Array.isArray(a) && a.every(isEmpty);

// make disappear the button after cliking
$button.addEventListener("click", () => {
  $header.classList.add("hidden");
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

const createRecap = (selectedCards) => {
  // Empty remaining elements
  $listContainer.innerHTML = "";
  // Inject selected cards
  const $fragment = document.createDocumentFragment();
  selectedCards.forEach((card) => {
    $listContainer.appendChild(
      createCardElement(card, 0, null, null, () => {})
    );
    $fragment.appendChild($listContainer);
    $cardsContainer.appendChild($fragment);
  });
};

const createCardElement = (card, index, selectedCards, boosters, handler) => {
  let $el = document.createElement("li");
  // create image element
  let $img = document.createElement("img");
  // set src of the element
  $img.src = card.image_uris.png;
  // $img.src = card.image_uris.large;
  // append it to $el
  $el.appendChild($img);
  // $el.innerHTML = card.name;
  $el.addEventListener("click", handler(boosters, index, card, selectedCards));
  return $el;
};

const createBooster = ({ rares, uncommon, common }) => {
  return [
    ...getRandomCards(rares, 1),
    ...getRandomCards(uncommon, 3),
    ...getRandomCards(common, 11),
  ];
};

const renderBooster = (index, selectedCards, boosters) => {
  $listContainer.innerHTML = "";
  const $fragment = document.createDocumentFragment();
  boosters[index % boosters.length].forEach((card) =>
    $listContainer.appendChild(
      createCardElement(card, index, selectedCards, boosters, handleClick)
    )
  );
  $fragment.appendChild($listContainer);
  $cardsContainer.appendChild($fragment);
};

const handleClick = (boosters, index, card, selectedCards) => () => {
  let currentBooster = boosters[index % boosters.length];
  // remove and returns the selected card from booster
  currentBooster.splice(
    currentBooster.findIndex((c) => c.id == card.id),
    1
  );
  // Remove another card randomly from boosters, this represents other players picks
  boosters.forEach((b) => b.splice(getRandomNumberInRange(b.length), 1));

  // add removed card to our deck
  selectedCards.push(card);

  if (boosters.every(isEmpty)) {
    createRecap(selectedCards);
  } else {
    // handle logic to get the next booster
    renderBooster((index += 1), selectedCards, boosters);
  }
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
          let cards = payload.data.concat(res.data);
          // filter rare unco and commons
          cards = {
            rares: cards.filter(
              (card) => card.rarity == "rare" || card.rarity == "mythic"
            ),
            uncommon: cards.filter((card) => card.rarity == "uncommon"),
            common: cards.filter((card) => card.rarity == "common"),
          };
          // return 8 boosters
          return Array.from({ length: 8 }).map((_) => createBooster(cards));
        });
    })
    .then((boosters) => {
      $loader.classList.add("hidden");
      // handle logic to get the next booster
      renderBooster(0, [], boosters);
    })
    .catch((err) => console.log(`Boom ${err}`));
};
