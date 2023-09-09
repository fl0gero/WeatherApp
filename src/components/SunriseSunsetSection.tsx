import { BaseSection } from "./BaseSection";

type SunriseSunsetSectionProps = {
  sunrise?: Date;
  sunset?: Date;
  current?: Date;
};

export const SunriseSunsetSection = ({
  sunrise,
  sunset,
  current,
}: SunriseSunsetSectionProps) => {
  const sunriseTime = sunrise ? sunrise : new Date();
  const sunsetTime = sunset ? sunset : new Date();
  const currentTime = current ? current : new Date();
  const isSunset = currentTime.getHours() < sunsetTime.getHours();
  return (
    <BaseSection
      title={isSunset ? "Sunset" : "Sunrise"}
      value={
        isSunset
          ? `${sunsetTime.getHours()}:${
              String(sunriseTime.getMinutes()).length < 2
                ? `0${sunriseTime.getMinutes()}`
                : sunriseTime.getMinutes()
            }`
          : `${sunriseTime.getHours()}:${
              String(sunsetTime.getMinutes()).length < 2
                ? `0${sunsetTime.getMinutes()}`
                : sunsetTime.getMinutes()
            }`
      }
    >
      <h2 className="absolute bottom-4 left-4">
        {isSunset
          ? `Sunrise: ${sunriseTime.getHours()}:${
              String(sunriseTime.getMinutes()).length < 2
                ? `0${sunriseTime.getMinutes()}`
                : sunriseTime.getMinutes()
            }`
          : `Sunset: ${sunsetTime.getHours()}:${
              String(sunsetTime.getMinutes()).length < 2
                ? `0${sunsetTime.getMinutes()}`
                : sunsetTime.getMinutes()
            }`}
      </h2>
    </BaseSection>
  );
};
