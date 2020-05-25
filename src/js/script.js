const API_URL =
  "https://api.scryfall.com/cards/search?order=rarity&q=set%3Awar";
// "https://api.scryfall.com/cards/search?order=rarity&q=set%3Aikoria";
const $button = document.querySelector(".start--button");
const $cardsContainer = document.querySelector(".cards");
const $loader = document.querySelector(".lds-ring");
const $listContainer = document.querySelector(".cardList");
const $header = document.querySelector(".header--image");
const $pickNumber = document.querySelector(".pick--number");
//const $extensionSelector = document.querySelector(".extension--selector");
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
  //$extensionSelector.classList.add("hidden");
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
  $pickNumber.innerHTML = "";
  $pickNumber.textContent = "Here's your draft picks";
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
// code to move to the other file
var x, i, j, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /* When an item is clicked, update the original select box,
        and the selected item: */
      var y, i, k, s, h;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      h = this.parentNode.previousSibling;
      for (i = 0; i < s.length; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          for (k = 0; k < y.length; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x,
    y,
    i,
    arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);
