ALL_COUNTRY_DATA = [];

document.addEventListener("DOMContentLoaded", () => {
  init();
  loadAllCountryData();
});

function init() {
  const countrysearchelem = document.getElementById("country-search");
  countrysearchelem.addEventListener("change", () => {
    const elem = document.getElementById("country-search");
    const countrySearchTerm = elem.value;
    filterCountries(countrySearchTerm);
  });
}

async function loadAllCountryData() {
  const request = await fetch(
    `https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cioc`
  );
  const countries = await request.json();
  ALL_COUNTRY_DATA = countries
    .filter((x) => x.cioc !== undefined && x.cioc !== "")
    .sort((a, b) => (a.name.common > b.name.common ? 1 : -1));
}

function filterCountries(searchTerm) {
  const countries = ALL_COUNTRY_DATA.filter((x) =>
    x.name.common.toUpperCase().includes(searchTerm.toUpperCase())
  );

  console.log(countries);
  const template = document.getElementById("country-template");
  const resultsDiv = document.getElementById("country-results");
  resultsDiv.innerHTML = "";
  countryTemplate = template.content.querySelector("div");
  for (let i = 0; i < countries.length; i++) {
    const thisCountry = countries[i];
    const countryDisplay = document.importNode(countryTemplate, true);

    countryDisplay.id = thisCountry.cioc;
    countryDisplay.querySelector(".country-name").innerHTML =
      thisCountry.name.common;
    countryDisplay.querySelector(".country-img").src = thisCountry.flags.png;
    countryDisplay.querySelector(".country-img").alt = thisCountry.flags.alt;
    countryDisplay.querySelector(".country-population").innerHTML +=
      thisCountry.population.toLocaleString();
    countryDisplay.querySelector(".country-region").innerHTML +=
      thisCountry.region;
    countryDisplay.querySelector(".country-capital").innerHTML +=
      thisCountry.capital?.[0];

    countryDisplay.querySelector(".country-favorite").innerHTML =
      thisCountry.favorite ? "Unfavorite 😭" : "Favorite 💖";
    resultsDiv.appendChild(countryDisplay);
  }
}

function favorite(button) {
  const favoritedCountryId = button.closest(".country-result").id;

  const country = ALL_COUNTRY_DATA.find((x) => x.cioc == favoritedCountryId);
  country.favorite = country.favorite === undefined ? true : !country.favorite;

  rerenderCountry(favoritedCountryId);
  rerenderFavorites();
}

function rerenderCountry(cioc) {
  const country = ALL_COUNTRY_DATA.find((x) => x.cioc === cioc);

  const countryDisplay = document.querySelector(`.country-result#${cioc}`);
  countryDisplay.querySelector(".country-name").innerHTML = country.name.common;
  countryDisplay.querySelector(".country-img").src = country.flags.png;
  countryDisplay.querySelector(".country-img").alt = country.flags.alt;
  countryDisplay.querySelector(
    ".country-population"
  ).innerHTML = `Population: ${country.population.toLocaleString()}`;
  countryDisplay.querySelector(
    ".country-region"
  ).innerHTML = `Region: ${country.region}`;
  countryDisplay.querySelector(
    ".country-capital"
  ).innerHTML = `Capital: ${country.capital?.[0]}`;
  countryDisplay.querySelector(".country-favorite").innerHTML = country.favorite
    ? "Unfavorite 😭"
    : "Favorite 💖";
}

function rerenderFavorites() {
  const favorites = ALL_COUNTRY_DATA.filter((x) => x.favorite === true);

  const template = document.getElementById("favorite-template");
  const resultsDiv = document.getElementById("favorite-results");
  resultsDiv.innerHTML = "";
  favoriteTemplate = template.content.querySelector("div");
  for (let i = 0; i < favorites.length; i++) {
    const thisCountry = favorites[i];
    const favoriteDisplay = document.importNode(favoriteTemplate, true);

    favoriteDisplay.id = thisCountry.cioc;
    favoriteDisplay.querySelector(".favorite-flag").src = thisCountry.flags.png;
    favoriteDisplay.querySelector(".favorite-flag").alt = thisCountry.flags.alt;
    resultsDiv.appendChild(favoriteDisplay);
  }
}
