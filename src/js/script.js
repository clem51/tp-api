console.log("Hello world");

// create new request
const request = new XMLHttpRequest();

// use request to open the api's url
request.open(
  "GET",
  "https://api.scryfall.com/cards/search?order=rarity&q=set%3Awar"
);

// response type expected
request.responseType = "json";

request.send();

fetch("https://api.scryfall.com/cards/search?order=rarity&q=set%3Awar").then(
  function (response) {
    response.json().then(function (json) {
      poemDisplay.textContent = json;
    });
  }
);
