import React from "react";
import styles from "@/styles/components/AddressForm.module.css";

interface Address {
  country: string;
  state: string;
  city: string;
  zipCode: string;
  street: string;
  number: string;
  departmentNumber: string;
}

interface AddressFormProps {
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
  errors: Partial<Record<keyof Address, string>>;
}

export default function AddressForm({
  address,
  onChange,
  errors,
}: AddressFormProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dirección</h2>

      <label className={styles.label}>
        País
        <input
          type="text"
          className={styles.input}
          value={address.country}
          onChange={(e) => onChange("country", e.target.value)}
          disabled={false} // ✅ permite edición si el usuario desea ajustarlo
        />
        {errors.country && <p className={styles.error}>{errors.country}</p>}
      </label>

      <label className={styles.label}>
        Estado / Región
        <input
          type="text"
          className={styles.input}
          value={address.state}
          onChange={(e) => onChange("state", e.target.value)}
        />
        {errors.state && <p className={styles.error}>{errors.state}</p>}
      </label>

      <label className={styles.label}>
        Ciudad
        <input
          type="text"
          className={styles.input}
          value={address.city}
          onChange={(e) => onChange("city", e.target.value)}
        />
        {errors.city && <p className={styles.error}>{errors.city}</p>}
      </label>

      <label className={styles.label}>
        Código postal
        <input
          type="text"
          className={styles.input}
          value={address.zipCode}
          onChange={(e) => onChange("zipCode", e.target.value)}
        />
        {errors.zipCode && <p className={styles.error}>{errors.zipCode}</p>}
      </label>

      <label className={styles.label}>
        Calle
        <input
          type="text"
          className={styles.input}
          value={address.street}
          onChange={(e) => onChange("street", e.target.value)}
        />
        {errors.street && <p className={styles.error}>{errors.street}</p>}
      </label>

      <label className={styles.label}>
        Número
        <input
          type="text"
          className={styles.input}
          value={address.number}
          onChange={(e) => onChange("number", e.target.value)}
        />
        {errors.number && <p className={styles.error}>{errors.number}</p>}
      </label>

      <label className={styles.label}>
        Departamento (opcional)
        <input
          type="text"
          className={styles.input}
          value={address.departmentNumber}
          onChange={(e) => onChange("departmentNumber", e.target.value)}
        />
        {errors.departmentNumber && (
          <p className={styles.error}>{errors.departmentNumber}</p>
        )}
      </label>
    </div>
  );
}
