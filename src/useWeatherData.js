import { useEffect, useState } from "react";

const KEY = "b85ba958f57100940d2bf7395ad5ad45";

export function useWeatherData(inputValue) {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

          if (inputValue.length > 2) setWeatherData(data);

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

      return function () {
        controller.abort();
      };
    },
    [inputValue]
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

  return { weatherData, isLoading, error, setError };
}
