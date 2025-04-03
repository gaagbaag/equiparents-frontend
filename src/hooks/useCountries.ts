import { useMemo } from "react";
import rawData from "country-telephone-data";

export interface Country {
  name: string;
  iso2: string;
  dialCode: string;
}

export function useCountries(): Country[] {
  return useMemo(() => {
    const rawCountries = (rawData as any).allCountries;
    if (!Array.isArray(rawCountries)) return [];

    return rawCountries
      .map((entry: any) => {
        const { iso2, name, dialCode } = entry;
        if (!iso2 || !name || !dialCode) return null;
        return { iso2, name, dialCode };
      })
      .filter(Boolean) as Country[];
  }, []);
}
