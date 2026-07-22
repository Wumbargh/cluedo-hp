"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, COLUMNS_PER_ROW } from "@/lib/data";

const STORAGE_KEY = "cluedo-hp-ermittlungsblock";

type CheckState = Record<string, boolean>;

function cellKey(categoryId: string, itemIndex: number, col: number) {
  return `${categoryId}:${itemIndex}:${col}`;
}

export default function Page() {
  const [checks, setChecks] = useState<CheckState>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setChecks(JSON.parse(saved));
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
  }, [checks, loaded]);

  function toggle(key: string) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    if (window.confirm("Wirklich den gesamten Ermittlungsblock zurücksetzen?")) {
      setChecks({});
    }
  }

  return (
    <div className="page">
      <div className="masthead">
        <h1>Ermittlungsblock</h1>
        <p>Cluedo · Harry Potter Edition</p>
      </div>

      {CATEGORIES.map((category) => (
        <div className="card" key={category.id}>
          <div className="card-header">{category.title}</div>
          {category.items.map((item, itemIndex) => (
            <div className="row" key={item}>
              <span className="row-label">{item}</span>
              <div className="row-boxes">
                {Array.from({ length: COLUMNS_PER_ROW }).map((_, col) => {
                  const key = cellKey(category.id, itemIndex, col);
                  const checked = !!checks[key];
                  return (
                    <button
                      key={col}
                      type="button"
                      className="checkbox"
                      data-checked={checked}
                      aria-label={`${item} – Feld ${col + 1}${checked ? ", angekreuzt" : ""}`}
                      aria-pressed={checked}
                      onClick={() => toggle(key)}
                    >
                      {checked ? "✕" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="actions">
        <button type="button" className="reset-button" onClick={reset}>
          Zurücksetzen
        </button>
      </div>
      <p className="status">
        Wird automatisch nur auf diesem Gerät gespeichert.
      </p>
    </div>
  );
}
