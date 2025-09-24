import { useEffect, useState } from "react";
import "./App.css";

function orderFunc(a, b, order, sortBy) {
  const aProp =
    sortBy === "region"
      ? a.region
      : sortBy === "population"
      ? a.population
      : a.name.common;
  const bProp =
    sortBy === "region"
      ? b.region
      : sortBy === "population"
      ? b.population
      : b.name.common;

  return order === "asc" ? (aProp > bProp ? 1 : -1) : aProp > bProp ? -1 : 1;
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [order, setOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("name");

  const filteredCountries = countries
    .filter((x) =>
      x.name.common.toUpperCase().includes(searchTerm.toUpperCase())
    )
    .filter((x) => x.cioc !== undefined && x.cioc !== "")
    .sort((a, b) => orderFunc(a, b, order, sortBy));

  const favoriteCountries = countries
    .filter((x) => x.favorite === true)
    .sort((a, b) => (a.stateChanged > b.stateChanged ? 1 : -1));

  const toggleCountryFavorite = (cioc) => {
    setCountries(
      countries.map((x) =>
        x.cioc === cioc
          ? { ...x, favorite: !x.favorite, stateChanged: new Date() }
          : x
      )
    );
  };

  useEffect(() => {
    const doFetch = async () => {
      const response = await fetch(
        `https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cioc`
      );
      const countryResult = await response.json();
      setCountries(countryResult);
    };

    doFetch();
  }, []);

  return (
    <>
      <div id="favorite-results">
        {favoriteCountries.map((x) => (
          <div className="favorite-result" key={x.cioc}>
            <img
              className="favorite-flag"
              src={x.flags.png}
              alt={x.flags.alt}
            />
            <button
              className="favorite-remove"
              onClick={() => toggleCountryFavorite(x.cioc)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <h1>Country Finder</h1>
      <input
        id="country-search"
        type="text"
        placeholder="Search for a country"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <button onClick={() => setOrder((x) => (x === "asc" ? "desc" : "asc"))}>
        {order === "asc" ? "👆" : "👇"}
      </button>
      <select
        placeholder="Sort By.."
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="population">Population</option>
        <option value="region">Region</option>
      </select>
      <p>{searchTerm}</p>
      <div>
        {filteredCountries.map((x) => (
          <CountryDisplay
            country={x}
            key={x.cioc}
            toggleCountryFavorite={toggleCountryFavorite}
          />
        ))}
      </div>
    </>
  );
}

function CountryDisplay({ country, toggleCountryFavorite }) {
  return (
    <div className="country-result" key={country.cioc}>
      <h2 className="country-name">{country.name.common}</h2>
      <div className="country-data">
        <div className="country-data-left">
          <button
            className="country-favorite"
            onClick={() => toggleCountryFavorite(country.cioc)}
          >
            {country.favorite ? "Unfavorite 😭" : "Favorite 💖"}
          </button>
          <p className="country-population">
            Population:&nbsp;{country.population.toLocaleString()}
          </p>
          <p className="country-region">Region:&nbsp;{country.region}</p>
          <p className="country-capital">
            Capital:&nbsp;{country.capital?.[0]}
          </p>
        </div>
        <img
          className="country-img"
          src={country.flags.png}
          alt={country.flags.alt}
        />
      </div>
      <Flag />
    </div>
  );
}

const country = "Canada";
const description = "We are nice";
const myCountry = (
  <div>
    <h1>{country}</h1>
    <p>{description}</p>
  </div>
);

const foo = myCountry;

function Flag(flag) {
  const [title, setTitle] = useState("");
  return (
    <div>
      <h1>{title}</h1>
      <img src={flag.src} alt={flag.alt} />
      <button onClick={() => setTitle("John was here")}>John Button</button>
    </div>
  );
}

export default App;
