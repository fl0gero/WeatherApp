import { useEffect, useState } from "react";
import "./App.css";
import PlacesAutocomplete from "react-places-autocomplete";
import { SunriseSunsetSection } from "./components/SunriseSunsetSection";
import { BaseSection } from "./components/BaseSection";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";

type WeatherApiData = {
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
};

const dayOfWeek: Array<string> = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function App() {
  const [weatherApiData, setWeatherApiData] = useState<WeatherApiData>();
  const [address, setAddress] = useState<string>();
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    console.log(ll);
    setAddress(value);
    setCoordinates(ll);
  };

  // API KEY AND URL
  const apiKey = "f3a81f86e561414fe94d1d0b0332165f";
  const apiUrl = ` https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates?.lat}&lon=${coordinates?.lng}&exclude=weekly&units=metric&appid=${apiKey}`;

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

  return (
    <div className="flex flex-col items-center text-white">
      <p>lat:{coordinates?.lat}</p>
      <p>lng:{coordinates?.lng}</p>
      <p>Address:{address}</p>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className=" fixed right-5 top-5 flex flex-col">
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
        <section className="col-span-2 row-span-3 row-start-2 min-h-[30rem] rounded-lg bg-white bg-opacity-5 p-4 px-4">
          <p className="opacity-50">8 day forecast</p>
          <ul>
            {weatherApiData?.daily.map((currentDay, index) => {
              const day = new Date(currentDay.dt * 1000);

              return (
                <li className="m-2">
                  <hr />
                  <ul className="grid h-16 grid-cols-[20%_20%_50%] grid-rows-1  gap-4 align-middle ">
                    <li className=" flex items-center justify-center">
                      {index === 0 ? "Today" : dayOfWeek[Number(day.getDay())]}
                    </li>
                    <li className="flex h-14 w-14  items-center justify-center">
                      <img
                        className="flex h-max w-max justify-center"
                        src={`https://openweathermap.org/img/wn/${currentDay.weather[0].icon}.png`}
                      />
                    </li>
                    <li className=" flex items-center justify-between ">
                      <span>min:{Math.floor(currentDay.temp.min)}</span>
                      <span>max:{Math.floor(currentDay.temp.max)}</span>
                    </li>
                  </ul>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="col-span-4 flex  grid-rows-1  items-center gap-4 overflow-scroll overscroll-y-contain rounded-lg bg-white bg-opacity-5">
          <ul className="flex h-1/2 flex-row">
            {weatherApiData?.hourly.map((currentHour, index) => {
              const hour = new Date(currentHour.dt * 1000);
              if (index <= 24) {
                return (
                  <li className=" w-14">
                    {index === 0
                      ? "Now"
                      : hour.getHours() === 0
                      ? 24
                      : hour.getHours()}
                    <img
                      src={`https://openweathermap.org/img/wn/${currentHour.weather[0].icon}.png`}
                    />
                    {Math.floor(currentHour.temp)}°
                  </li>
                );
              }
            })}
          </ul>
        </section>
        <section className="col-span-1 row-span-1 flex flex-col rounded-lg bg-white bg-opacity-5 p-3">
          <h3 className="w-fit opacity-50">UV-index</h3>
          <h1 className="mt-4 w-fit text-5xl">
            {weatherApiData?.current.uvi
              ? Math.round(weatherApiData.current.uvi)
              : 0}
          </h1>
          <h2 className="w-fit text-xl">
            {weatherApiData?.current.uvi === 0
              ? weatherApiData.current.uvi <= 2
                ? "Low"
                : weatherApiData.current.uvi <= 5
                ? "Moderate"
                : weatherApiData.current.uvi <= 7
                ? "High"
                : weatherApiData.current.uvi <= 11
                ? "Very high"
                : null
              : null}
          </h2>
        </section>
        <SunriseSunsetSection
          sunrise={weatherApiData?.current.sunrise}
          sunset={weatherApiData?.current.sunset}
          current={weatherApiData?.current.dt}
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
