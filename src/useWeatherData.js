import { useEffect, useState } from "react";

const KEY = "b85ba958f57100940d2bf7395ad5ad45";

export function useWeatherData(inputValue, select) {
  const [weatherData, setWeatherData] = useState(null);
  const [fiveDay, setFiveDay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Controls Input and Select menu API calls
  useEffect(
    function () {
      const controller = new AbortController();

      const fetchData = async function (url) {
        try {
          setError("");
          setIsLoading(true);

          const res = await fetch(url, { signal: controller.signal });
          const data = await res.json();

          if (!res.ok) throw new Error("Something went wrong..");

          // Select varken bile inputa yazı girilirse onu çağır, Aynı şekilde tersi içinde geçerli
          if (inputValue) {
            setWeatherData(data);
          }
          if (select) setWeatherData(data);

          setIsLoading(false);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
          setIsLoading(false);
        }
      };

      if (inputValue) {
        const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${KEY}`;
        fetchData(searchUrl);
      }

      if (select) {
        const selectUrl = `https://api.openweathermap.org/data/2.5/weather?q=${select}&appid=${KEY}`;
        fetchData(selectUrl);
      }

      return function () {
        controller.abort();
      };
    },
    [inputValue, select]
  );

  // Position Based Data
  useEffect(function () {
    const controller = new AbortController();

    const fetchData = async function (url) {
      try {
        setError("");
        setIsLoading(true);

        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        if (!res.ok) throw new Error("Something went wrong..");

        setWeatherData(data);
        setIsLoading(false);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
        setIsLoading(false);
      }
    };

    const getPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}`;
          fetchData(weatherUrl);
        },
        (error) => {
          setError("Cannot retrieve your location. Please try again.");
          setIsLoading(false);
        }
      );
    };
    getPosition();

    return function () {
      controller.abort();
    };
  }, []); // Boş bağımlılık dizisi sayesinde sadece sayfa mount olduğunda çalışır.

  // Handle 5 Day Forecast
  useEffect(
    function () {
      const controller = new AbortController();

      const fetchData = async function () {
        try {
          setError("");
          setIsLoading(true);

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${inputValue}&appid=${KEY}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          setFiveDay(data);

          if (!res.ok) throw new Error("Something went wrong..");

          setIsLoading(false);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
          setIsLoading(false);
        }
      };
      fetchData();

      return function () {
        controller.abort();
      };
    },
    [inputValue]
  );

  return { weatherData, isLoading, fiveDay };
}
