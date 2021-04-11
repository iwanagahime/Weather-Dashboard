const getFromLocalStorage = () => {
  const localStorageData = JSON.parse(localStorage.getItem("cities"));

  if (localStorageData !== null) {
    return localStorageData;
  } else {
    return [];
  }
};
const onSubmit = (event) => {
  event.preventDefault();

  const cityName = $("#city-input").val();

  const cities = getFromLocalStorage();

  cities.push(cityName);
  console.log(cities);
  localStorage.setItem("cities", JSON.stringify(cities));
};
$("#search-by-city-form").on("submit", onSubmit);
