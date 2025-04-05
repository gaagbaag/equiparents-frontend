"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/slices/authSlice";
import { getRedirectRoute } from "@/utils/getRedirectRoute";
import { logFetchError } from "@/utils/logFetchError";
import { redirectIfProfileComplete } from "@/utils/redirectIfProfileComplete";
import { useCountries, Country } from "@/hooks/useCountries";
import { validatePhone } from "@/utils/validatePhone";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { CountryCode } from "libphonenumber-js";
import styles from "@/styles/pages/profile.module.css";
import AddressForm from "@/components/onboarding/AddressForm";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const countries = useCountries();

  const token = useAppSelector((state) => state.auth.token);
  const roles = useAppSelector((state) => state.auth.roles);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryCode, setCountryCode] = useState<CountryCode | "">("");
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
    if (!token) {
      router.push("/api/auth/login");
      return;
    }

    const preload = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Error al obtener datos del perfil");
        }

        const data = await res.json();

        dispatch(
          setUser({
            user: data,
            token,
            roles: [data.role || "parent"],
          })
        );

        // ✅ Si el perfil ya está completo, redirigir inmediatamente
        if (data.firstName && data.lastName && data.phone) {
          if (data.role === "admin") {
            router.push("/admin/dashboard");
          } else if (data.parentalAccountId) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding/family");
          }
          return;
        }

        // Precargar campos para completar perfil
        if (data.countryCode) {
          setCountryCode(data.countryCode);
          const match = countries.find(
            (c) => c.iso2.toUpperCase() === data.countryCode
          );
          if (match) setSelectedCountry(match);
        }

        if (data.address) setAddress((prev) => ({ ...prev, ...data.address }));
        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName) setLastName(data.lastName);
        if (data.phone) setPhone(data.phone);
      } catch (err) {
        logFetchError(
          err instanceof Error ? err : new Error("Error desconocido"),
          "Precargar perfil"
        );
      } finally {
        setIsLoaded(true);
      }
    };

    preload();
  }, [token, dispatch, countries, router]); // ✅ sin storedUser

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!countryCode) return setError("Debes seleccionar un país.");
    if (!validatePhone(phone, countryCode))
      return setError(
        "Número de teléfono no válido para el país seleccionado."
      );

    if (!token) {
      setError("Token no disponible.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phone,
            countryCode,
            address,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al actualizar datos");
      }

      const data = await res.json();
      dispatch(setUser({ user: data, token, roles }));

      // Redirige según estado del perfil y cuenta
      redirectIfProfileComplete();
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
            value={selectedCountry?.iso2.toUpperCase() || ""}
            onChange={(e) => {
              const selected = countries.find(
                (c) => c.iso2.toUpperCase() === e.target.value
              );
              if (selected) {
                setSelectedCountry(selected);
                setCountryCode(selected.iso2.toUpperCase() as CountryCode);
              }
            }}
            required
            className={styles.input}
          >
            <option value="">Selecciona un país</option>
            {countries.map((country) => (
              <option key={country.iso2} value={country.iso2.toUpperCase()}>
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
