const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("timezone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

const API_KEY = 'f9c7bc30ffe213f78746026889dd3312';

const background =["tree","cloud","mountain","snow","thunder"];
const ranNum = Math.floor(Math.random() *background.length);
function backgroundImage() {
  document.body.style.backgroundImage = `url(images/${background[ranNum]}.jpg)`;
}
backgroundImage();

const dayArray = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const monthArray = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDate();
  const hour = time.getHours();
  const hours12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
  (hours12HrFormat < 10 ? `0${hours12HrFormat}` : hours12HrFormat) + ":" + (minutes < 10 ? `0${minutes}` : minutes) + " " + `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = dayArray[day] + ", " + date + " " + monthArray[month];
}, 1000);

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let {latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
      .then(res=> res.json())
      .then(data => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

getWeatherData()

function showWeatherData (data) {
  let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

timezone.innerHTML = data.timezone;
countryEl.innerHTML = data.lat + "N" + data.lon+"E"

currentWeatherItemsEl.innerHTML =
  `<div class="weather-item">
     <div>Humidity</div>
     <div>${humidity}</div>
   </div>
   <div class="weather-item">
     <div>Pressure</div>
     <div>${pressure}</div>
   </div>
   <div class="weather-item">
     <div>Sunrise</div>
     <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
     </div>
    <div class="weather-item">
     <div>Sunset</div>
     <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
     </div>
    <div class="weather-item">
     <div>Wind Speed</div>
     <div>${wind_speed}</div>
    </div>
     `;

     let otherDayForecast = "";
     data.daily.forEach((day, idx) => {
      if(idx == 0){
        currentTempEl.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon" />
        <div class="other">
        <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
        <div class="temp">Day - ${day.temp.day}; C</div>
        <div class="temp">Night - ${day.temp.night}; C</div>
      </div>`

      
    }else{
        otherDayForecast += 
        `<div class="weather-forecast-item">
        <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon" />
        <div class="temp">Day - ${day.temp.day}; C</div>
        <div class="temp">Night - ${day.temp.night}; C</div>
      </div>`
      }
     })
     weatherForecastEl.innerHTML = otherDayForecast;
}

// https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js