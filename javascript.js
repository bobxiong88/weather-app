const C = document.querySelector("#C");
const F = document.querySelector("#F");
const K = document.querySelector("#K");
const input = document.querySelector("#city");
const error = document.querySelector("#error");

const city = document.querySelector("#left");
const temperature = document.querySelector("#temperature");
const condition = document.querySelector("#condition");
const wind = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");
const pressure = document.querySelector("#pressure");

const key = "a4bb711d04d826146a71f1c7214e615a";
let mode = "C";

let cityData = {};
let weatherData = {};

async function getCoords(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}`
    );
    let data = await response.json();
    data = data[0];
    console.log("Success!");
    //console.log(data);
    cityData = {
      city: data.name,
      country: data.country,
      lat: data.lat,
      lon: data.lon,
    };
  } catch {
    console.log("Failed!");
    cityData = {};
  }
}

async function getWeather(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
    );
    let data = await response.json();
    console.log("Success!");
    weatherData = {
      temp: data.main.temp,
      condition: data.weather[0].main,
      wind: data.wind.speed,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
    };
  } catch {
    console.log("failed!");
    weatherData = {};
  }
}

function refresh() {
  city.textContent = `${cityData.city}, ${cityData.country}`;
  condition.textContent = weatherData.condition;
  wind.textContent = `Wind speed: ${weatherData.wind} km/h`;
  humidity.textContent = `Humidity: ${weatherData.humidity}%`;
  pressure.textContent = `Pressure: ${Math.round(
    weatherData.pressure / 10
  )} kPa`;
  let temp;
  if (mode === "C") {
    temp = Math.round(weatherData.temp - 273.5);
  } else if (mode === "F") {
    temp = Math.round(((weatherData.temp - 273.5) * 9) / 5 + 32);
  } else {
    temp = Math.round(weatherData.temp);
  }
  temperature.textContent = `${temp}°${mode}`;
}

async function setCity(city) {
  await getCoords(city);
  if (cityData !== {} && cityData.city !== undefined) {
    await getWeather(cityData.lat, cityData.lon);
    if (weatherData !== {} && weatherData.temp !== undefined) {
      error.textContent = "";
      refresh();
    }
  } else {
    error.textContent = "Invalid city, please try again!";
  }
}

C.addEventListener("click", () => {
  C.className = "visible";
  F.className = "";
  K.className = "";
  mode = "C";
  refresh();
});

F.addEventListener("click", () => {
  C.className = "";
  F.className = "visible";
  K.className = "";
  mode = "F";
  refresh();
});

K.addEventListener("click", () => {
  C.className = "";
  F.className = "";
  K.className = "visible";
  mode = "K";
  refresh();
});

input.addEventListener("keyup", async (event) => {
  if (event.code === "Enter") {
    event.preventDefault();
    console.log(input.value);
    setCity(input.value);
  }
});

setCity("Coquitlam");
