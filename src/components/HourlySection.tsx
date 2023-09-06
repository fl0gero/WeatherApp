import { getDateWithOffset } from "../utils/utils";
import { WeatherApiData } from "../App";

type HourlySectionProps = {
  weatherData?: WeatherApiData;
  measurement: string;
};

export const HourlySection = ({
  weatherData,
  measurement,
}: HourlySectionProps) => {
  return (
    <section className="col-span-4  flex   grid-rows-1  items-center gap-4 overflow-scroll overscroll-y-contain rounded-lg bg-white bg-opacity-10">
      <ul className="flex h-1/2 flex-row">
        {weatherData?.hourly.map((currentHour, index) => {
          let hour = getDateWithOffset(
            currentHour.dt,
            weatherData.timezone_offset,
          );
          if (index <= 24) {
            return (
              <li className=" w-14">
                {index === 0
                  ? "Now"
                  : hour.getHours() === 0
                  ? "00"
                  : hour.getHours()}
                <img
                  src={`https://openweathermap.org/img/wn/${currentHour.weather[0].icon}.png`}
                />
                {Math.floor(currentHour.temp)}
                {measurement}
              </li>
            );
          }
        })}
      </ul>
    </section>
  );
};
