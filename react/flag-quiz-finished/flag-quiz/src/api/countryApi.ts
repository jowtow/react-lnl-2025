export type Country = {
  id: string;
  name: string;
  flagUrl: string;
};

export async function GetAllCountries(): Promise<Country[]> {
  const response = await fetch(
    `https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cioc`
  );
  const countriesResult = await response.json();
  const result = countriesResult
    .filter((x: any) => x.cioc !== undefined && x.cioc !== "")
    .map(
      (x: any) =>
        ({
          id: x.cioc,
          name: x.name.common,
          flagUrl: x.flags.png,
        } satisfies Country)
    );
  return result;
}
