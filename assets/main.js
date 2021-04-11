const API_KEY = "90496a8a768bcd7563d02c4a1d063af1";

const getFromLocalStorage = () => {
  const localStorageData = JSON.parse(localStorage.getItem("cities"));

  if (localStorageData !== null) {
    return localStorageData;
  } else {
    return [];
  }
};

const fetchData = async (url) => {
  try {
    const responseFromApi = await fetch(url);

    const dataFromServer = await responseFromApi.json();

    return dataFromServer;
  } catch (error) {
    console.log(error);
  }
};

const getDataByCityName = async (event) => {
  const target = $(event.target);
  if (target.is("li")) {
    const cityName = target.data("city");

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`;

    const data = await fetchData(url);

    const currentDayData = transformData(data);

    renderCurrentDayCard(currentDayData);
  }
};

const transformData = (data) => {
  return {
    cityName: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    date: moment.unix(data.dt).format("MM/DD/YYYY"),
    iconURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  };
};

const onSubmit = async (event) => {
  event.preventDefault();

  const cityName = $("#city-input").val();
  const cities = getFromLocalStorage();

  cities.push(cityName);

  localStorage.setItem("cities", JSON.stringify(cities));

  renderCitiesFromLocalStorage();

  $("#city-input").val("");

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`;

  const data = await fetchData(url);

  const currentDayData = transformData(data);

  renderCurrentDayCard(currentDayData);
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

    ul.append(li);
  };

  cities.forEach(appendListItemToUl);

  ul.on("click", getDataByCityName);

  $("#searched-cities").append(ul);
};

const renderCurrentDayCard = (data) => {
  $("#current-day-card").empty();

  const card = `<div class="card">
  <div class="card-body">
    <h2>
      ${data.cityName} (${data.date}) <img src="${data.iconURL}"/>
    </h2>
    <div class="py-2">Temperature: ${data.temperature} &deg; F</div>
    <div class="py-2">Humidity: ${data.humidity}%</div>
    <div class="py-2">Wind Speed: ${data.windSpeed} MPH</div>
    <div class="py-2">UV Index 45</div>
  </div>
</div>`;

  $("#current-day-card").append(card);
};

const onReady = () => {
  renderCitiesFromLocalStorage();
};

$("#search-by-city-form").on("submit", onSubmit);
$(document).ready(onReady);
