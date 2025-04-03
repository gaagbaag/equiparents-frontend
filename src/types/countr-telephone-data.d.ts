declare module "country-telephone-data" {
  export interface RawCountry {
    name: string;
    iso2: string;
    dialCode: string;
    priority?: number;
    areaCodes?: string[] | null;
  }

  export const allCountries: RawCountry[];
}
