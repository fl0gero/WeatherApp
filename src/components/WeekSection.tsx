import { getDateWithOffset } from "../utils/utils";
import { WeatherApiData } from "../App";

type WeekSectionProps = {
  title: string;
  weatherData?: WeatherApiData;
  measurement: string;
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

export const WeekSection = ({
  title,
  weatherData,
  measurement,
}: WeekSectionProps) => {
  if (weatherData)
    return (
      <section className="row-span-3 row-start-2 min-h-[30rem] rounded-lg bg-white bg-opacity-10 p-4 px-4 lg:col-span-2">
        <p className="opacity-50">{title}</p>
        <ul>
          {weatherData.daily.map((currentDay, index) => {
            const day = getDateWithOffset(
              currentDay.dt,
              weatherData.timezone_offset,
            );

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
                    <span>
                      min:{Math.floor(currentDay.temp.min)}
                      {measurement}
                    </span>
                    <span>
                      max:{Math.floor(currentDay.temp.max)}
                      {measurement}
                    </span>
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
      </section>
    );
};
