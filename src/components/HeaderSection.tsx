import { WeatherApiData } from "../App";
type HeaderSectionProps = {
  address: string;
  weatherApiData: WeatherApiData;
};
export const HeaderSection = ({
  address,
  weatherApiData,
}: HeaderSectionProps) => {
  return (
    <header className="m-5">
      <p className="text-xl">{address}</p>
      <p className="text-5xl">{Math.round(weatherApiData.current.temp)}°</p>
      <p>{weatherApiData.current.weather[0].main}</p>
      <ul className="flex  justify-around">
        <li>
          H:
          {weatherApiData.daily[0].temp.max
            ? Math.round(weatherApiData.daily[0].temp.max)
            : "N/A"}
        </li>
        <li>
          L:
          {weatherApiData.daily[0].temp.min
            ? Math.round(weatherApiData.daily[0].temp.min)
            : "N/A"}
        </li>
      </ul>
    </header>
  );
};
