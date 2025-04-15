// src/app/(auth)/onboarding/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CountryCode } from "libphonenumber-js";
import { setUser } from "@/redux/slices/authSlice";
import { useCountries, Country } from "@/hooks/useCountries";
import { validatePhone } from "@/utils/validatePhone";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { redirectIfProfileComplete } from "@/utils/redirectIfProfileComplete";
import AddressForm from "@/components/onboarding/AddressForm";
import type { ExtendedAuthUser } from "@/types";
import styles from "@/styles/pages/profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const countries = useCountries();

  const { token, user, roles } = useAppSelector((state) => state.auth);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryDialCode, setCountryDialCode] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    zipCode: "",
    street: "",
    number: "",
    departmentNumber: "",
  });

  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/api/auth/login");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    redirectIfProfileComplete(user as ExtendedAuthUser, router);

    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setPhone(user.phone || "");

    if (user.countryDialCode && countries.length > 0) {
      const match = countries.find(
        (c) => c.dialCode === user.countryDialCode?.replace("+", "")
      );
      if (match) {
        setSelectedCountry(match);
        setAddress((prev) => ({ ...prev, country: match.name }));
      }
    }

    if (user.address) {
      setAddress((prev) => ({ ...prev, ...user.address }));
    }

    setIsLoaded(true);
  }, [user, countries, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedCountry)
      return setError("Debes seleccionar un país para validar el teléfono.");

    const code = selectedCountry.iso2.toUpperCase() as CountryCode;
    const dial = `+${selectedCountry.dialCode}`;

    if (!validatePhone(phone, code))
      return setError(
        "Número de teléfono no válido para el país seleccionado."
      );

    if (!token) {
      setError("Token no disponible.");
      return;
    }

    const finalAddress = {
      ...address,
      country: address.country || selectedCountry.name,
    };

    const payload = {
      firstName,
      lastName,
      phone,
      countryCode: code,
      countryDialCode: dial,
      address: finalAddress,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al actualizar datos");
      }

      const data = await res.json();
      dispatch(setUser({ user: data, token, roles }));

      redirectIfProfileComplete(data, router);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (!isLoaded) return <p className={styles.loading}>Cargando...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Tu perfil</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Nombre
          <input
            type="text"
            className={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          Apellido
          <input
            type="text"
            className={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          País
          <select
            value={selectedCountry?.dialCode || ""}
            onChange={(e) => {
              const selected = countries.find(
                (c) => c.dialCode === e.target.value
              );
              if (selected) {
                setSelectedCountry(selected);
                setCountryDialCode(`+${selected.dialCode}`);
                setPhone("");
                setAddress((prev) => ({
                  ...prev,
                  country: selected.name,
                }));
              }
            }}
            required
            className={styles.input}
          >
            <option value="">Selecciona un país</option>
            {countries.map((country) => (
              <option key={country.iso2} value={country.dialCode}>
                {country.name} (+{country.dialCode})
              </option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Teléfono
          <input
            type="tel"
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>

        <AddressForm
          address={address}
          onChange={(field, value) =>
            setAddress((prev) => ({ ...prev, [field]: value }))
          }
          errors={{}}
        />

        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Guardar y continuar
        </button>
      </form>
    </div>
  );
}
