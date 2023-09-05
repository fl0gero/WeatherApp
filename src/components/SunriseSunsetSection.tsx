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
          ? `${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`
          : `${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`
      }
    >
      <h2 className="absolute bottom-4 left-4">
        {isSunset
          ? `Sunrise: ${sunriseTime.getHours()}:${sunriseTime.getMinutes()}`
          : `Sunset: ${sunsetTime.getHours()}:${sunsetTime.getMinutes()}`}
      </h2>
    </BaseSection>
  );
};
