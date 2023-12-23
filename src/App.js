import { useState, useEffect } from "react";
import "./index.css";
import { useWeatherData } from "./useWeatherData";

// const KEY = "b85ba958f57100940d2bf7395ad5ad45";

const options = [
  "Istanbul",
  "Ankara",
  "İzmir",
  "Antalya",
  "Bursa",
  "Denizli",
  "Konya",
];

export default function App() {
  // const [position, setPosition] = useState({});
  const [inputValue, setInputValue] = useState("");
  // const [weatherData, setWeatherData] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [select, setSelect] = useState("");

  //! Custom hook which takes weather data based location and search.
  const { weatherData, isLoading } = useWeatherData(inputValue);

  return (
    <div className="app-container">
      <Date />
      <Header />
      <Form
        select={select}
        setSelect={setSelect}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
      <WeatherContainer isLoading={isLoading} weatherData={weatherData} />
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
  return (
    <form onSubmit={(e) => e.preventDefault()} className="form-container">
      <input
        type="text"
        className="input-field"
        placeholder="Search for a city"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
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
  // console.log(weatherData);
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

function Date() {
  return (
    <div className="day-container">
      <div className="date-container">
        <div className="date day"></div>
      </div>
      <div className="clock-container">
        <div className="clock time"></div>
      </div>
    </div>
  );
}
