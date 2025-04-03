import { useEffect, useState } from "react";
import { CountryCode } from "libphonenumber-js";

interface IpApiResponse {
  country?: string;
}

export function useAutoCountryCode(): CountryCode | null {
  const [code, setCode] = useState<CountryCode | null>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data: IpApiResponse = await res.json();
        if (data?.country) {
          setCode(data.country.toUpperCase() as CountryCode);
        }
      } catch (error) {
        console.error("❌ No se pudo detectar país automáticamente:", error);
      }
    };

    fetchCountry();
  }, []);

  return code;
}
