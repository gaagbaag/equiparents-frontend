"use client";

import { useState } from "react";
import { useHistory } from "../hooks/useHistory";
import { format } from "date-fns";

import {
  FaUser,
  FaCalendarAlt,
  FaHeart,
  FaMoneyBill,
  FaEnvelope,
  FaTerminal,
  FaBirthdayCake,
  FaDotCircle,
} from "react-icons/fa";
import { ReactNode } from "react";

type HistoryEntry = {
  id: string;
  summary: string;
  type: string;
  createdAt: string;
  category?: {
    icon?: string;
    color?: string;
  };
};

type HistoryListProps = {
  recentOnly?: boolean;
  refreshKey?: number;
};

function renderIcon(icon: string): ReactNode {
  switch (icon) {
    case "user":
      return <FaUser />;
    case "calendar":
      return <FaCalendarAlt />;
    case "heart":
      return <FaHeart />;
    case "money":
      return <FaMoneyBill />;
    case "mail":
      return <FaEnvelope />;
    case "terminal":
      return <FaTerminal />;
    case "cake":
      return <FaBirthdayCake />;
    case "dots":
    default:
      return <FaDotCircle />;
  }
}

export default function HistoryList({
  recentOnly = true,
  refreshKey,
}: HistoryListProps) {
  const { history, loading, error } = useHistory(recentOnly, refreshKey);
  const [filter, setFilter] = useState<string | null>(null);

  const filteredHistory = filter
    ? history.filter((entry: HistoryEntry) => entry.type === filter)
    : history;

  const uniqueTypes = Array.from(
    new Set(history.map((h: HistoryEntry) => h.type))
  );

  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p>Error: {error}</p>;
  if (history.length === 0) return <p>No hay historial aún.</p>;

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="filter">Filtrar por tipo:</label>{" "}
        <select
          id="filter"
          onChange={(e) => setFilter(e.target.value || null)}
          value={filter || ""}
        >
          <option value="">Todos</option>
          {uniqueTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <ul>
        {filteredHistory.map((entry: HistoryEntry) => (
          <li
            key={entry.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              padding: "0.5rem",
              borderRadius: "6px",
              backgroundColor: entry.category?.color || "#f3f4f6",
            }}
          >
            {entry.category?.icon && (
              <span
                style={{
                  marginRight: "0.75rem",
                  fontSize: "1.2rem",
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "50%",
                  width: "1.8rem",
                  height: "1.8rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {renderIcon(entry.category.icon)}
              </span>
            )}

            <div>
              <strong>{entry.summary}</strong>
              <div style={{ fontSize: "0.85rem", color: "#333" }}>
                {format(new Date(entry.createdAt), "dd/MM/yyyy HH:mm")} —{" "}
                {entry.type}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
