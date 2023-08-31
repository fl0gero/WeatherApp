import { useEffect, useState } from "react";
import "./App.css";
import PlacesAutocomplete from "react-places-autocomplete";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";

function App() {
  type weatherApiData = {
    current: Array<number>;
    daily: Array<number>;
    hourly: Array<{ dt: number; temp: number }>;
    lat: number;
    lon: number;
    minutely: Array<number>;
  };
  const [apiData, setApiData] = useState<weatherApiData>();
  const [adress, setAdress] = useState();
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleSelect = async (value: any) => {
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
          setApiData(data);
        });
    }
  }, [apiUrl]);
  console.log(apiData);

  console.log(apiData?.hourly[0].dt);

  // Unix timestamp in seconds
  var unixTimestamp = apiData?.hourly[0].dt;
  if (unixTimestamp) {
    // Create a new Date object using the timestamp (multiply by 1000 to convert to milliseconds)
    var date = new Date(unixTimestamp * 1000);

    // Format the date as a string
    var formattedDate = date.toLocaleString(); // This will use the browser's default locale

    console.log(`formatted date - ${formattedDate}`);
  }

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
        <section className="row-start-2 row-span-3 col-span-2">
          For a week
        </section>
        <section className="flex grid-rows-1  col-span-4 gap-4 overscroll-y-contain overflow-scroll">
          {apiData?.hourly.map((currentHour, index) => {
            let hour = new Date(currentHour.dt * 1000);
            console.log(`current hour ${hour.getHours()}`);

            if (index <= 24) {
              return (
                <span>
                  {index === 0
                    ? "Now"
                    : hour.getHours() === 0
                    ? 24
                    : Number(hour.getHours())}{" "}
                  {Math.floor(currentHour.temp)}°
                </span>
              );
            }
          })}
        </section>
        <section className="col-span-1 row-span-1">UV-index</section>
        <section className="col-span-1 row-span-1">Sunrise</section>
        <section className="col-span-1 row-span-1">Wind</section>
        <section className="col-span-1 row-span-1">Pressure</section>
        <section className="col-span-1 row-span-1">Feels like</section>
        <section className="col-span-1 row-span-1">Humidity</section>
      </div>
    </>
  );
}

export default App;
