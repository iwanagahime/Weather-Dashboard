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

const renderCitiesFromLocalStorage = () => {
  const cities = getFromLocalStorage();
  const ul = $("<ul>").addClass("list-group");
  const appendListItemToUl = (city) => {
    const li = `<li class="list-group-item">${city}</li>`;
    ul.append(li);
  };
  cities.forEach(appendListItemToUl);

  $("#searched-cities").append(ul);
  console.log(cities);
};

const onReady = () => {
  renderCitiesFromLocalStorage();
};
$("#search-by-city-form").on("submit", onSubmit);
$(document).ready(onReady);
