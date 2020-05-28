import { customSelect } from "./customSelect";

const $button = document.querySelector(".start--button");
const $cardsContainer = document.querySelector(".cards");
const $loader = document.querySelector(".loader--wrapper");
const $listContainer = document.querySelector(".cardList");
const $header = document.querySelector(".header--image");
const $pickNumber = document.querySelector(".pick--number");
const $extensionSelector = document.querySelector(".select--wrapper");
const $instructions = document.querySelector(".instructions");
const $notation = document.querySelector(".toggle--notation");
const API_URL = "https://murmuring-springs-05651.herokuapp.com/cards";
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
  $pickNumber.innerHTML = "";
  $pickNumber.textContent = "Here's your draft picks";
  // TODO post picked card to API
};

const createCardElement = (card, index, selectedCards, boosters, handler) => {
  let $el = document.createElement("li");
  let $infoRating = document.createElement("div");
  // create image element
  let $img = document.createElement("img");
  // set src of the element
  $img.src = card.image_uris.large;
  // append it to $el
  $el.appendChild($infoRating);
  $el.appendChild($img);
  $infoRating.innerHTML = card.ratings;
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
  boosters[index % boosters.length].forEach((card) => {
    $listContainer.appendChild(
      createCardElement(card, index, selectedCards, boosters, handleClick)
    );
  });
  $fragment.appendChild($listContainer);
  $cardsContainer.appendChild($fragment);
  // insert the pick number and instructions
  $pickNumber.textContent = `Pick ${index + 1} : \nSelect a card.`;
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

const startDraft = (set) => {
  fetch(`https://api.scryfall.com/cards/search?order=rarity&q=set%3A${set}`)
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
          let boosters = Array.from({ length: 8 }).map((_) =>
            createBooster(cards)
          );
          let data = boosters.flat().map((c) => c.name);
          return fetch(`${API_URL}/${set}`, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cards: data }),
          })
            .then((res) => res.json())
            .then((data) => [data, boosters]);
        });
    })
    .then(([ratings, boosters]) => {
      $loader.classList.add("hidden");
      // $notation.classList.remove("hidden");

      // plug cards and ratings together
      boosters.forEach((booster) =>
        booster.forEach((card) => {
          let found = ratings.find((c) => c.name == card.name);
          found ? (card.ratings = found.rating) : (card.ratings = 0);
        })
      );

      // handle logic to get the next booster
      renderBooster(0, [], boosters);

      // $notation.addEventListener("click", () => {
      //   $infoRating.classList.toggle("hidden");
      // });
    })
    .catch((err) => console.log(`Boom ${err}`));
};

customSelect();
