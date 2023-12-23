import { useEffect, useRef, useState } from "react";
import { useWeatherData } from "./useWeatherData";
import "./index.css";

const options = [
  "",
  "Istanbul",
  "Ankara",
  "İzmir",
  "Antalya",
  "Bursa",
  "Denizli",
  "Konya",
  "London",
  "Tokyo",
  "Paris",
];

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [select, setSelect] = useState("");

  //! Custom hook which takes weather data based location and search.
  const { weatherData, isLoading, fiveDay } = useWeatherData(
    inputValue,
    select,
    setSelect
  );

  return (
    <div className="app-container">
      <Header />
      <Form
        select={select}
        setSelect={setSelect}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      <WeatherContainer isLoading={isLoading} weatherData={weatherData} />
      <NextDaysWeather fiveDay={fiveDay} />
    </div>
  );
}

function Header() {
  return (
    <div className="app__text">
      <h1 className="app__text-head">⛅Weather - App</h1>
    </div>
  );
}

function Form({ inputValue, setInputValue, select, setSelect }) {
  const inputEl = useRef(null);

  // Enter key listener
  useEffect(
    function () {
      function handleEnterEvent(e) {
        // Zaten aktifse yeniden set etme.
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();
          setInputValue("");
        }
      }
      document.addEventListener("keydown", handleEnterEvent);

      // cleanup function
      return function () {
        document.removeEventListener("keydown", handleEnterEvent);
      };
    },
    [setInputValue]
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} className="form-container">
      <input
        type="text"
        className="input-field "
        placeholder="Search for a city"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        ref={inputEl}
      />
      <select value={select} onChange={(e) => setSelect(e.target.value)}>
        {options.map((option) => {
          return <option value={option}>{option}</option>;
        })}
      </select>
    </form>
  );
}

function WeatherContainer({ weatherData, isLoading }) {
  // Headers
  const data = ["City", "Country", "Temperature", "Description", "Humidity"];
  // Infos
  const infoArray = [
    weatherData?.name,

    weatherData?.sys?.country,

    weatherData?.main?.temp
      ? Math.round(weatherData?.main?.temp - 273.15) + "°C"
      : "",

    weatherData?.weather?.at(0)?.description
      ? weatherData.weather.at(0).description.slice(0, 1).toUpperCase() +
        weatherData.weather.at(0).description.slice(1)
      : "",

    weatherData?.main?.humidity ? weatherData?.main?.humidity + " %" : "",
  ];
  return (
    <div className="weather-container">
      {data.map((el, i) => (
        <div className="weathers">
          <WeatherHeader key={el} el={el}>
            {el}
          </WeatherHeader>
          {isLoading ? (
            <p className="weather-data">⏳ Loading...</p>
          ) : (
            <WeatherInfo key={el.slice(0, 2)}>{infoArray[i]}</WeatherInfo>
          )}
        </div>
      ))}
    </div>
  );
}

// Info names
function WeatherHeader({ children }) {
  return <div className="headers">{children}</div>;
}

// Actual info
function WeatherInfo({ children }) {
  return <div className="weather-data">{children}</div>;
}

// 5 Day Data
function NextDaysWeather({ fiveDay }) {
  if (!fiveDay) return;

  const { list } = fiveDay;

  // oneDay = 8
  const oneDay = list?.length / 5;
  const fiveDayResults = Array.from(
    { length: list?.length / oneDay },
    (_, index) => list.slice(index * oneDay, (index + 1) * oneDay)
  );
  console.log(fiveDayResults);

  return (
    <div className="fiveDayContainer">
      {fiveDayResults.map((day, i) => (
        <div className="oneDayContainers">
          <h3 className="fiveDayDates">
            {day[i].dt_txt.slice(0, 10)} / &nbsp;
            <span>{day[i].dt_txt.slice(11, -3)}</span>
          </h3>
          <p className="fiveDayTemp">
            {Math.round(day[i].main.temp - 273.15)} °C
          </p>
        </div>
      ))}
      {/* <div className="oneDayContainers">
        <h3 className="fiveDayDates">
          2023-12-24 / <span className="fiveDayTimes">00:00:00</span>
        </h3>
        <p className="fiveDayTemp">7 °C</p>
      </div>
      <div className="oneDayContainers">
        <h3 className="fiveDayDates">
          2023-12-24 / <span className="fiveDayTimes">00:00:00</span>
        </h3>
        <p className="fiveDayTemp">7 °C</p>
      </div>
      <div className="oneDayContainers">
        <h3 className="fiveDayDates">
          2023-12-24 / <span className="fiveDayTimes">00:00:00</span>
        </h3>
        <p className="fiveDayTemp">7 °C</p>
      </div>
      <div className="oneDayContainers">
        <h3 className="fiveDayDates">
          2023-12-24 / <span className="fiveDayTimes">00:00:00</span>
        </h3>
        <p className="fiveDayTemp">7 °C</p>
      </div> */}
    </div>
  );
}
