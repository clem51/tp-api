import { customSelect } from "./customSelect";
import "regenerator-runtime/runtime";

const $button = document.querySelector(".start--button");
const $cardsContainer = document.querySelector(".cards");
const $loader = document.querySelector(".loader--wrapper");
const $listContainer = document.querySelector(".cardList");
const $header = document.querySelector(".header--image");
const $pickNumber = document.querySelector(".pick--number");
const $extensionSelector = document.querySelector(".select--wrapper");
const $instructions = document.querySelector(".instructions");
const $notationButton = document.querySelector(".toggle--notation");
const API_URL = "https://murmuring-springs-05651.herokuapp.com/cards";

const state = {
  index: 0,
  selectedCards: [],
};

// random number function
const getRandomNumberInRange = (max) => Math.floor(Math.random() * max);
// check if the booster is empty
const isEmpty = (a) => Array.isArray(a) && a.every(isEmpty);

// make disappear the button, the image and
// make appear the loader and the pick number after cliking
$button.addEventListener("click", () => {
  $header.classList.add("hidden");
  $button.classList.add("hidden");
  $loader.classList.remove("hidden");
  $pickNumber.classList.remove("hidden");
  $extensionSelector.classList.add("hidden");
  $instructions.classList.add("hidden");
  startDraft(document.querySelector(".select-selected").dataset.ext);
});

// pick a random card inside array
const getRandomCards = (cards, number) => {
  return Array.from({ length: number }).map(
    (_) => cards[getRandomNumberInRange(cards.length)]
  );
};

const createRecap = (selectedCards, set) => {
  // Empty remaining elements
  $listContainer.innerHTML = "";
  // Inject selected cards
  const $fragment = document.createDocumentFragment();
  selectedCards.forEach((card) => {
    $listContainer.appendChild(createCardElement(card, () => {}, {}));
    $fragment.appendChild($listContainer);
    $cardsContainer.appendChild($fragment);
  });
  $pickNumber.innerHTML = "";
  $pickNumber.textContent = "Here's your draft picks";

  fetch(`${API_URL}/${set}/record`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cards: selectedCards.map((card) => card.name) }),
  });
};

const createCardElement = (card, handler, state) => {
  let $el = document.createElement("li");
  let $infoRating = document.createElement("div");
  $infoRating.classList.add("notation");
  // create image element
  let $img = document.createElement("img");
  // set src of the element
  $img.src = card.image_uris.large;
  // append it to $el
  $el.appendChild($infoRating);
  $el.appendChild($img);
  $infoRating.innerHTML = card.ratings;
  $el.addEventListener("click", handler(card, state));
  return $el;
};

const createBooster = ({ rares, uncommon, common }) => {
  return [
    ...getRandomCards(rares, 1),
    ...getRandomCards(uncommon, 3),
    ...getRandomCards(common, 11),
  ];
};

const renderBooster = (state) => {
  const { index, boosters } = state;
  $listContainer.innerHTML = "";
  const $fragment = document.createDocumentFragment();
  boosters[index % boosters.length].forEach((card) => {
    $listContainer.appendChild(createCardElement(card, handleClick, state));
  });
  $fragment.appendChild($listContainer);
  $cardsContainer.appendChild($fragment);
  // insert the pick number and instructions
  $pickNumber.textContent = `Pick ${index + 1} : \nSelect a card.`;
};

const handleClick = (card, state) => () => {
  let { boosters, index, selectedCards, set } = state;
  let currentBooster = boosters[index % boosters.length];
  // remove and returns the selected card from booster
  currentBooster.splice(
    currentBooster.findIndex((c) => c.id == card.id),
    1
  );
  // Remove another card randomly from boosters, this represents other players picks
  boosters.forEach((b) => {
    if (b !== currentBooster) {
      b.splice(getRandomNumberInRange(b.length), 1);
    }
  });

  // add removed card to our deck
  selectedCards.push(card);

  if (boosters.every(isEmpty)) {
    createRecap(selectedCards, set);
  } else {
    // handle logic to get the next booster
    renderBooster({ index: (index += 1), selectedCards, boosters, set });
  }
};
//the api call to get the cards from sets
const startDraft = async (set) => {
  const res = await fetch(
    `https://api.scryfall.com/cards/search?order=rarity&q=set%3A${set}`
  );

  const payload = await res.json();
  let nextPage = await fetch(payload.next_page);
  nextPage = await nextPage.json();

  // request the next page as pagination is set to 175 cards
  // but we need the full set ( 260+ cards)
  let cards = payload.data.concat(nextPage.data);
  // filter rare unco and commons
  cards = {
    rares: cards.filter(
      (card) => card.rarity == "rare" || card.rarity == "mythic"
    ),
    uncommon: cards.filter((card) => card.rarity == "uncommon"),
    common: cards.filter((card) => card.rarity == "common"),
  };
  // return 8 boosters
  let boosters = Array.from({ length: 8 }).map((_) => createBooster(cards));
  let ratings = await fetch(`${API_URL}/${set}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cards: boosters.flat().map((c) => c.name) }),
  });
  ratings = await ratings.json();

  // hide loader and show cards and notations button
  $loader.classList.add("hidden");
  $notationButton.classList.remove("hidden");

  // // plug cards and ratings together
  boosters.forEach((booster) =>
    booster.forEach((card) => {
      let found = ratings.find((c) => c.name == card.name);
      found ? (card.ratings = found.rating) : (card.ratings = 0);
    })
  );

  renderBooster({
    ...state,
    boosters,
    set,
  });
};

// show/hide notations on cards
$notationButton.addEventListener("click", () => {
  const $notation = document.querySelectorAll("div.notation");
  $notation.forEach(($el) => {
    $el.classList.toggle("hidden");
  });
});

customSelect();
