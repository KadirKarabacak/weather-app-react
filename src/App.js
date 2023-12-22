import { useEffect, useState } from "react";
import "./index.css";

const KEY = "b85ba958f57100940d2bf7395ad5ad45";

export default function App() {
  const [position, setPosition] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get "Location" data
  useEffect(function () {
    function getPosition() {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;

          setPosition({ latitude, longitude });
        },
        () => {
          setError("Can't get your location");
        }
      );
    }
    getPosition();
  }, []);

  // Use "Location" data with API
  useEffect(
    function () {
      // Cancel previous requests
      const controller = new AbortController();
      async function getJsonLocation() {
        try {
          setIsLoading(true);
          const { latitude, longitude } = position;

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}`,
            { signal: controller.signal }
          );
          const data = await res.json();

          if (!res.ok) throw new Error("Something went wrong");

          if (data) setWeatherData(data);
          setIsLoading(false);
        } catch (err) {
          // Ignore abort error
          if (err.name !== "AbortError") setError(err.message);
          setIsLoading(false);
        }
      }
      getJsonLocation();

      return function () {
        // Cancel previous requests
        controller.abort();
      };
    },
    [position]
  );

  useEffect(
    function () {
      const controller = new AbortController();
      async function getJsonSearch() {
        try {
          if (!inputValue) return;
          setIsLoading(true);

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${KEY}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          console.log(data);
          setWeatherData(data);
          setIsLoading(false);
        } catch (err) {
          if (err.name !== "AbortError")
            setError("Can't find this city. Try Another");
          setIsLoading(false);
        }
      }
      getJsonSearch();

      return function () {
        // Cancel previous requests
        controller.abort();
      };
    },
    [inputValue]
  );

  return (
    <div className="app-container">
      <Date />
      <Header error={error} />
      <Form inputValue={inputValue} setInputValue={setInputValue} />
      <WeatherContainer isLoading={isLoading} weatherData={weatherData} />
    </div>
  );
}

function Header({ error }) {
  return (
    <div className="app__text">
      <h1 className="app__text-head">{error ? error : "⛅Weather - App"}</h1>
    </div>
  );
}

function Form({ inputValue, setInputValue }) {
  return (
    <form className="form-container">
      <input
        type="text"
        className="input-field"
        placeholder="Search for a city..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit" className="submit-button">
        Search
      </button>
    </form>
  );
}

function WeatherContainer({ weatherData, isLoading }) {
  if (!weatherData) return;
  // Headers
  const data = ["City", "Country", "Temperature", "Description", "Humidity"];
  // Infos
  const infoArray = [
    weatherData?.name,

    weatherData?.sys?.country,

    weatherData?.main?.temp
      ? Math.round(weatherData?.main?.temp - 273.15) + "°C"
      : "",

    weatherData?.weather?.at(0)?.description,

    weatherData?.main?.humidity,
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
  // const [date, setDate] = useState("");

  // const now = new Date();
  // const hour = now.getHours();
  // const minute = now.getMinutes();
  // const seconds = now.getSeconds();
  // const year = now.getFullYear();
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const day = `${now.getDate()}`.padStart(2, 0);

  return (
    <div className="day-container">
      <div className="date-container">
        <div className="date day">2023/12/23</div>
      </div>
      <div className="clock-container">
        <div className="clock time">22:55:46</div>
      </div>
    </div>
  );
}
