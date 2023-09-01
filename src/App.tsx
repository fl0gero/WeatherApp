import { useEffect, useState } from "react";
import "./App.css";
import PlacesAutocomplete from "react-places-autocomplete";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";

function App() {
  type WeatherApiData = {
    current: {
      feels_like: number;
      humidity: number;
      pressure: number;
      sunrise: number;
      sunset: number;
      temp: number;
      uvi: number;
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

  const [weatherApiData, setWeatherApiData] = useState<WeatherApiData>();
  const [adress, setAdress] = useState<string>();
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    console.log(ll);
    setAdress(value);
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
    <>
      <p>lat:{coordinates?.lat}</p>
      <p>lng:{coordinates?.lng}</p>
      <p>Adress:{adress}</p>
      <PlacesAutocomplete
        value={adress}
        onChange={setAdress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="flex flex-col fixed top-5 right-5">
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "",
              })}
            />
            <div className="flex flex-col absolute top-5">
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
      <div className="grid grid-cols-4 grid-rows-4 gap-4">
        <section className="row-start-2 row-span-3 col-span-2 bg-white bg-opacity-5 px-4 rounded-lg min-h-[27rem]">
          <p>8 day forecast</p>
          {weatherApiData?.daily.map((currentDay, index) => {
            let day = new Date(currentDay.dt * 1000);

            return (
              <>
                <hr />
                <ul className="grid grid-cols-8 grid-rows-1 gap-4  text-white">
                  <li className="col-span-2 flex justify-center items-center">
                    {index === 0 ? "Today" : dayOfWeek[Number(day.getDay())]}{" "}
                  </li>
                  <li className="col-span-1 flex justify-center items-center">
                    <img
                      className="flex left-6 justify-center items-center"
                      src={`https://openweathermap.org/img/wn/${currentDay.weather[0].icon}.png`}
                    />
                  </li>
                  <li className="col-start-5 flex justify-center items-center">
                    min:{Math.floor(currentDay.temp.min)}
                  </li>
                  <li className="col-start-6 flex justify-center items-center">
                    max:{Math.floor(currentDay.temp.max)}
                  </li>
                </ul>
              </>
            );
          })}
        </section>
        <section className="flex grid-rows-1  col-span-4 gap-4 overscroll-y-contain overflow-scroll">
          {weatherApiData?.hourly.map((currentHour, index) => {
            let hour = new Date(currentHour.dt * 1000);
            if (index <= 24) {
              return (
                <span>
                  {index === 0
                    ? "Now"
                    : hour.getHours() === 0
                    ? 24
                    : hour.getHours()}
                  <img
                    src={`https://openweathermap.org/img/wn/${currentHour.weather[0].icon}.png`}
                  />
                  {Math.floor(currentHour.temp)}°
                </span>
              );
            }
          })}
        </section>
        <section className="col-span-1 row-span-1">
          <ul>
            <li>UV-index</li>
            <li>{weatherApiData?.current.uvi}</li>
          </ul>
        </section>
        <section className="col-span-1 row-span-1">
          <ul>
            <li>Sunrise</li>
            <li>{weatherApiData?.current.sunrise}</li>
          </ul>
        </section>
        <section className="col-span-1 row-span-1">
          <ul>
            <li>Wind</li>
            <li>
              {weatherApiData?.daily[0].wind_speed
                ? Math.floor(weatherApiData.daily[0].wind_speed * 3.6)
                : null}
            </li>
          </ul>
        </section>
        <section className="col-span-1 row-span-1">
          <ul>
            <li>Pressure</li>
            <li>{weatherApiData?.current.pressure} hPa</li>
          </ul>
        </section>
        <section className="col-span-1 row-span-1">
          <ul>
            <li>Feels like</li>
            <li>
              {weatherApiData?.current.feels_like
                ? Math.floor(weatherApiData?.current.feels_like)
                : null}
            </li>
          </ul>
        </section>
        <section className="col-span-1 row-span-1">
          <ul>
            <li>Humidity</li>
            <li>{weatherApiData?.current.humidity}</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export default App;
