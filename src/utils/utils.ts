export const getDateWithOffset = (dt: number, timezoneOffset: number): Date => {
  const date = new Date(
    (dt + timezoneOffset + new Date().getTimezoneOffset() * 60) * 1000,
  );
  return date;
};
