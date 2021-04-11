const getFromLocalStorage = () => {
  const localStorageData = JSON.parse(localStorage.getItem("cities"));

  if (localStorageData !== null) {
    return localStorageData;
  } else {
    return [];
  }
};

const getDataByCityName = (event) => {
  const target = $(event.target);
  if (target.is("li")) {
    const cityName = target.data("city");
    console.log(cityName);
  }
};

const onSubmit = (event) => {
  event.preventDefault();

  const cityName = $("#city-input").val();
  const cities = getFromLocalStorage();

  cities.push(cityName);

  localStorage.setItem("cities", JSON.stringify(cities));

  renderCitiesFromLocalStorage();

  $("#city-input").val("");
};

const renderCitiesFromLocalStorage = () => {
  $("#searched-cities").empty();

  const cities = getFromLocalStorage();

  const ul = $("<ul>").addClass("list-group");

  const appendListItemToUl = (city) => {
    const li = $("<li>")
      .addClass("list-group-item")
      .attr("data-city", city)
      .text(city);

    // li.on("click", onClick);
    ul.append(li);
  };

  cities.forEach(appendListItemToUl);

  ul.on("click", getDataByCityName);

  $("#searched-cities").append(ul);
};

const onReady = () => {
  renderCitiesFromLocalStorage();
};
$("#search-by-city-form").on("submit", onSubmit);
$(document).ready(onReady);
