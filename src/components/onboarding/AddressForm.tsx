// src/components/onboarding/AddressForm.tsx
"use client";

import { ChangeEvent } from "react";

export default function AddressForm({
  address,
  onChange,
  errors,
}: {
  address: {
    country: string;
    state?: string;
    city: string;
    zipCode?: string;
    street?: string;
    number?: string;
    departmentNumber?: string; // Añadido aquí
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div>
      <label>
        Calle
        <input
          type="text"
          value={address.street}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("street", e.target.value)
          }
        />
      </label>

      <label>
        Número
        <input
          type="text"
          value={address.number}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("number", e.target.value)
          }
        />
      </label>

      <label>
        Número de Departamento
        <input
          type="text"
          value={address.departmentNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("departmentNumber", e.target.value)
          }
        />
      </label>

      <label>
        Ciudad
        <input
          type="text"
          value={address.city}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("city", e.target.value)
          }
        />
      </label>

      <label>
        Estado
        <input
          type="text"
          value={address.state}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("state", e.target.value)
          }
        />
      </label>

      <label>
        Código Postal
        <input
          type="text"
          value={address.zipCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange("zipCode", e.target.value)
          }
        />
      </label>

      {errors.address && <p>{errors.address}</p>}
    </div>
  );
}
