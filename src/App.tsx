import { useEffect, useState } from "react";
import "./App.css";
import { SunriseSunsetSection } from "./components/SunriseSunsetSection";
import { BaseSection } from "./components/BaseSection";
import { getDateWithOffset } from "./utils/utils";
import { WeekSection } from "./components/WeekSection";
import { HourlySection } from "./components/HourlySection";
import { AutoComplete } from "./components/Autocomplete";
import { HeaderSection } from "./components/HeaderSection";
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
];
const dayGradient = [
  "bg-gradient-to-b",
  "from-sky-500",
  "from-10%",
  "via-sky-300",
  "via-80%",
  "to-blue-200",
  "to-100%",
];
const eveningGradient = [
  "bg-gradient-to-b",
  "from-violet-400",
  "from-10%",
  "via-orange-300",
  "via-80%",
  "to-orange-600",
  "to-100%",
];
const nightGradient = [
  "bg-gradient-to-b",
  "from-slate-900",
  "from-10%",
  "via-blue-900",
  "via-80%",
  "to-indigo-800",
  "to-100%",
];

function App() {
  const [weatherApiData, setWeatherApiData] = useState<WeatherApiData>();
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const uviStatus = () => {
    if (weatherApiData?.current.uvi) {
      const uvi = Math.round(weatherApiData.current.uvi);
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

    if (currentHour <= 5 || currentHour > 21) {
      document.body.className = nightGradient.join(" ");
    } else if (currentHour <= 12) {
      document.body.className = morningGradient.join(" ");
    } else if (currentHour <= 17) {
      document.body.className = dayGradient.join(" ");
    } else if (currentHour <= 21) {
      document.body.className = eveningGradient.join(" ");
    }
  }
  if (!weatherApiData) {
    return (
      <>
        <AutoComplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        />
        <main className="grid  h-max w-max place-items-center">
          <p className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white bg-opacity-10 p-4 text-white">
            There is no available data.
            <br /> Pick a city to display all weather information about it.
          </p>
        </main>
      </>
    );
  }
  return (
    <div className="flex flex-col items-center text-white">
      <HeaderSection address={address} weatherApiData={weatherApiData} />
      <AutoComplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      />
      <div className="grid max-w-[55rem] grid-cols-2 gap-4 lg:aspect-square lg:grid-cols-4 lg:grid-rows-4">
        <WeekSection
          title="8 day forecast"
          weatherData={weatherApiData}
          measurement="°"
        />
        <HourlySection weatherData={weatherApiData} measurement="°" />

        <BaseSection
          title="UV-index"
          value={weatherApiData.current.uvi}
          description={uviStatus()}
        />
        <SunriseSunsetSection
          sunrise={getDateWithOffset(
            weatherApiData.current.sunrise,
            weatherApiData.timezone_offset,
          )}
          sunset={getDateWithOffset(
            weatherApiData.current.sunrise,
            weatherApiData.timezone_offset,
          )}
          current={getDateWithOffset(
            weatherApiData.current.dt,
            weatherApiData.timezone_offset,
          )}
        />
        <BaseSection
          title="Wind"
          value={weatherApiData.current.wind_speed}
          description="km/h"
        />
        <BaseSection
          title="Pressure"
          value={weatherApiData.current.pressure}
          description="hPa"
        />
        <BaseSection
          title="Feels like"
          value={weatherApiData.current.feels_like}
          measurement="°"
        />
        <BaseSection
          title="Humidity"
          value={weatherApiData.current.humidity}
          measurement="%"
        />
      </div>
    </div>
  );
}

export default App;
