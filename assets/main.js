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

    renderAllCards(cityName);
  }
};

const transformCurrentDayData = (data, name) => {
  const current = data.current;
  return {
    cityName: name,
    temperature: current.temp,
    humidity: current.humidity,
    windSpeed: current.wind_speed,
    date: moment.unix(data.dt).format("MM/DD/YYYY"),
    iconURL: `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
    uvi: current.uvi,
  };
};

const transformForecastData = (data) => {
  return {
    date: moment.unix(data.dt).format("MM/DD/YYYY"),
    iconURL: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    temperature: data.temp.day,
    humidity: data.humidity,
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

  renderAllCards(cityName);
};

const renderAllCards = async (cityName) => {
  const currentDayUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`;

  const currentDayResponse = await fetchData(currentDayUrl);

  const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentDayResponse.coord.lat}&lon=${currentDayResponse.coord.lon}&exclude=minutely,hourly&units=imperial&appid=${API_KEY}`;

  const forecastResponse = await fetchData(forecastUrl);

  const cardsData = forecastResponse.daily.map(transformForecastData);

  $("#forecast-cards-container").empty();

  cardsData.slice(1, 6).forEach(renderForecastCard);

  const currentDayData = transformCurrentDayData(
    forecastResponse,
    currentDayResponse.name
  );

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
    <div class="py-2">UV Index ${data.uvi}</div>
  </div>
</div>`;

  $("#current-day-card").append(card);
};

const renderForecastCard = (data) => {
  const card = `<div
  class="card mh=100 bg-primary text-light rounded card-block"
>
  <h5 class="card-title p-1">${data.date}</h5>
  <img src="${data.iconURL}" />

  <h6 class="card-subtitle mb-2 text-light p-md-2">
    Temperature: ${data.temperature} &deg F
  </h6>
  <h6 class="card-subtitle mb-2 text-light p-md-2">
    Humidity:${data.humidity} %
  </h6>
</div>`;
  $("#forecast-cards-container").append(card);
};
const onReady = () => {
  renderCitiesFromLocalStorage();
};

$("#search-by-city-form").on("submit", onSubmit);
$(document).ready(onReady);
