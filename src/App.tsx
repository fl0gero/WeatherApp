import { useEffect, useState } from "react";
import "./App.css";
import PlacesAutocomplete from "react-places-autocomplete";
import { SunriseSunsetSection } from "./components/SunriseSunsetSection";
import { BaseSection } from "./components/BaseSection";
import { getDateWithOffset } from "./utils/utils";
import { WeekSection } from "./components/WeekSection";
import { HourlySection } from "./components/HourlySection";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";

export type WeatherApiData = {
  current: {
    feels_like: number;
    humidity: number;
    pressure: number;
    sunrise: number;
    sunset: number;
    temp: number;
    uvi: number;
    dt: number;
    visibility: number;
    wind_speed: number;
    weather: Array<{
      description: string;
      main: string;
    }>;
  };
  daily: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    wind_speed: number;
    temp: { min: number; max: number };
    weather: Array<{
      description: string;
      icon: string;
      id: number;
      main: string;
    }>;
  }>;
  hourly: Array<{
    dt: number;
    temp: number;
    weather: Array<{
      description: string;
      icon: string;
      id: number;
      main: string;
    }>;
  }>;
  lat: number;
  lon: number;
  minutely: Array<number>;
  timezone_offset: number;
};

const morningGradient = [
  "bg-gradient-to-b",
  "from-blue-300",
  "from-10%",
  "via-orange-200",
  "via-80%",
  "to-orange-400",
  "to-100%",
  "transition",
  "ease-in-out",
  "delay-150",
];
const dayGradient = [
  "bg-gradient-to-b",
  "from-sky-500",
  "from-10%",
  "via-sky-300",
  "via-80%",
  "to-blue-200",
  "to-100%",
  "transition",
  "ease-in-out",
  "delay-150",
];
const eveningGradient = [
  "bg-gradient-to-b",
  "from-violet-400",
  "from-10%",
  "via-orange-300",
  "via-80%",
  "to-orange-600",
  "to-100%",
  "transition",
  "ease-in-out",
  "delay-150",
];
const nightGradient = [
  "bg-gradient-to-b",
  "from-slate-900",
  "from-10%",
  "via-blue-900",
  "via-80%",
  "to-indigo-800",
  "to-100%",
  "transition",
  "ease-in-out",
  "delay-150",
];

function App() {
  const [weatherApiData, setWeatherApiData] = useState<WeatherApiData>();
  const [address, setAddress] = useState<string>();
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const uviStatus = () => {
    if (weatherApiData?.current.uvi) {
      const uvi = Math.round(weatherApiData?.current.uvi);
      if (uvi <= 2) {
        return "Low";
      } else if (uvi <= 5) {
        return "Moderate";
      } else if (uvi <= 7) {
        return "High";
      } else if (uvi <= 11) {
        return "Very high";
      }
    }
    return "Low";
  };

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(ll);
  };

  // API KEY AND URL
  const apiKey = "f3a81f86e561414fe94d1d0b0332165f";
  const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?precipitation&lat=${coordinates?.lat}&lon=${coordinates?.lng}&exclude=weekly&units=metric&appid=${apiKey}`;

  useEffect(() => {
    if (coordinates) {
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          setWeatherApiData(data);
        });
    }
  }, [apiUrl]);
  console.log(weatherApiData);

  if (weatherApiData?.current.dt) {
    const dt = getDateWithOffset(
      weatherApiData.current.dt,
      weatherApiData.timezone_offset,
    );
    const currentHour = dt.getHours();

    if (currentHour <= 5) {
      document.body.className = "";
      document.body.classList.add(...nightGradient);
    } else if (currentHour <= 12) {
      document.body.className = "";
      document.body.classList.add(...morningGradient);
    } else if (currentHour <= 17) {
      document.body.className = "";
      document.body.classList.add(...dayGradient);
    } else if (currentHour <= 21) {
      document.body.className = "";
      document.body.classList.add(...eveningGradient);
    }
  }

  return (
    <div className="flex flex-col items-center text-white">
      <p>lat:{coordinates?.lat}</p>
      <p>lng:{coordinates?.lng}</p>
      <p>Address:{address}</p>
      <p>{weatherApiData?.current.weather[0].main}</p>
      <ul className="flex w-1/12 justify-between">
        <li>H:{Math.round(Number(weatherApiData?.daily[0].temp.max))}</li>
        <li>
          L:
          {weatherApiData?.daily[0].temp.min
            ? Math.round(weatherApiData?.daily[0].temp.min)
            : "N/A"}
        </li>
      </ul>

      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className=" fixed right-5 top-5 flex flex-col text-black">
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "",
              })}
            />
            <div className="absolute top-5 flex flex-col">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <div className="grid aspect-square max-w-[55rem] grid-cols-4 grid-rows-4 gap-4">
        <WeekSection
          title="8 day forecast"
          weatherData={weatherApiData}
          measurement="°"
        />
        <HourlySection weatherData={weatherApiData} measurement="°" />

        <BaseSection
          title="UV-index"
          value={
            weatherApiData?.current.uvi
              ? weatherApiData?.current.uvi > 0
                ? weatherApiData?.current.uvi
                : "0"
              : "0"
          }
          description={uviStatus()}
        />
        <SunriseSunsetSection
          sunrise={getDateWithOffset(
            weatherApiData?.current.sunrise!,
            weatherApiData?.timezone_offset!,
          )}
          sunset={getDateWithOffset(
            weatherApiData?.current.sunset!,
            weatherApiData?.timezone_offset!,
          )}
          current={
            weatherApiData?.current.dt
              ? getDateWithOffset(
                  weatherApiData?.current.dt,
                  weatherApiData?.timezone_offset,
                )
              : new Date()
          }
        />
        <BaseSection
          title="Wind"
          value={weatherApiData?.current.wind_speed}
          description="km/h"
        />
        <BaseSection
          title="Pressure"
          value={weatherApiData?.current.pressure}
          description="hPa"
        />
        <BaseSection
          title="Feels like"
          value={weatherApiData?.current.feels_like}
          measurement="°"
        />
        <BaseSection
          title="Humidity"
          value={weatherApiData?.current.humidity}
          measurement="%"
        />
      </div>
    </div>
  );
}

export default App;
