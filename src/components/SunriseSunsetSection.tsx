import { BaseSection } from "./BaseSection";

type SunriseSunsetSectionProps = {
  sunrise?: number;
  sunset?: number;
  current?: number;
};

export const SunriseSunsetSection = ({
  sunrise,
  sunset,
  current,
}: SunriseSunsetSectionProps) => {
  const sunriseTime = new Date(Number(sunrise) * 1000);
  const sunsetTime = new Date(Number(sunset) * 1000);
  const currentTime = new Date(Number(current) * 1000);
  const isSunset = currentTime > sunriseTime;
  return (
    <BaseSection
      title={isSunset ? "Sunset" : "Sunrise"}
      value={
        isSunset
          ? `${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`
          : `${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`
      }
      description={
        isSunset
          ? `Sunrise: ${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`
          : `Sunset: ${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`
      }
    ></BaseSection>
  );
};
