"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCountries, Country } from "@/hooks/useCountries";
import { validatePhone } from "@/utils/validatePhone";
import { getSession } from "@/utils/session";
import { logFetchError } from "@/utils/logFetchError";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { CountryCode } from "libphonenumber-js";
import styles from "@/styles/pages/profile.module.css";
import AddressForm from "@/components/onboarding/AddressForm";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const countries = useCountries();

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
    const fetchData = async () => {
      const session = await getSession();
      if (!session?.user) {
        router.push("/api/auth/login");
        return;
      }

      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        if (accessToken) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          if (!res.ok) throw new Error("No se pudo obtener perfil");
          const data = await res.json();

          dispatch(
            setUser({
              user: data,
              token: accessToken,
              roles: [data.role || "parent"],
            })
          );

          if (
            data.firstName &&
            data.lastName &&
            data.phone &&
            data.countryCode
          ) {
            router.push(
              data.role === "admin" ? "/admin/dashboard" : "/dashboard"
            );
            return;
          }

          if (data.countryCode) {
            setCountryCode(data.countryCode);
            const matched = countries.find(
              (c) => c.iso2.toUpperCase() === data.countryCode
            );
            if (matched) setSelectedCountry(matched);
          }
        }
      } catch (err) {
        logFetchError(
          "Precargar perfil",
          err instanceof Error ? err.message : "Error desconocido"
        );
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [router, countries, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!countryCode) {
      setError("Debes seleccionar un país.");
      return;
    }

    if (!validatePhone(phone, countryCode)) {
      setError("Número de teléfono no válido para el país seleccionado.");
      return;
    }

    try {
      const tokenRes = await fetch("/api/auth/token");
      const { accessToken } = await tokenRes.json();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
      dispatch(
        setUser({
          user: data,
          token: accessToken,
          roles: [data.role || "parent"],
        })
      );

      router.push(
        data.role === "admin" ? "/admin/dashboard" : "/onboarding/family"
      );
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
