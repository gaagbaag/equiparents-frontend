// src/utils/validatePhone.ts
import { isValidPhoneNumber, CountryCode } from "libphonenumber-js";

export function validatePhone(phone: string, countryCode: string): boolean {
  try {
    return isValidPhoneNumber(phone, countryCode as CountryCode);
  } catch {
    return false;
  }
}
