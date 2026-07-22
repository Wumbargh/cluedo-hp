"use client";

import { useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  COLOR_PALETTE,
  COLUMNS_PER_ROW,
  DEFAULT_PLAYER_NAMES,
} from "@/lib/data";

const STORAGE_KEY = "cluedo-hp-ermittlungsblock";
const LONG_PRESS_MS = 500;

type Mark = "" | "x" | "-";

type Cell = {
  mark: Mark;
  color: string | null;
};

type CellState = Record<string, Cell>;
type SolutionState = Record<string, Mark>;

type SaveData = {
  cells: CellState;
  solutions: SolutionState;
  playerNames: string[];
  lastColor: string | null;
};

const EMPTY_CELL: Cell = { mark: "", color: null };

function cellKey(categoryId: string, itemIndex: number, col: number) {
  return `${categoryId}:${itemIndex}:${col}`;
}

function solutionKey(categoryId: string, itemIndex: number) {
  return `${categoryId}:${itemIndex}`;
}

function nextMark(mark: Mark): Mark {
  if (mark === "") return "x";
  if (mark === "x") return "-";
  return "";
}

function migrate(raw: unknown): SaveData {
  const result: SaveData = {
    cells: {},
    solutions: {},
    playerNames: [...DEFAULT_PLAYER_NAMES],
    lastColor: null,
  };
  if (!raw || typeof raw !== "object") return result;
  const obj = raw as Record<string, unknown>;

  // New format already has a "cells" key.
  const rawCells = (obj.cells ?? obj) as Record<string, unknown>;
  for (const [key, value] of Object.entries(rawCells)) {
    if (typeof value === "boolean") {
      if (value) result.cells[key] = { mark: "x", color: null };
    } else if (value && typeof value === "object") {
      const v = value as Partial<Cell>;
      result.cells[key] = {
        mark: v.mark === "x" || v.mark === "-" ? v.mark : "",
        color: typeof v.color === "string" ? v.color : null,
      };
    }
  }

  if (obj.solutions && typeof obj.solutions === "object") {
    for (const [key, value] of Object.entries(
      obj.solutions as Record<string, unknown>
    )) {
      if (value === "x" || value === "-") result.solutions[key] = value;
    }
  }

  if (Array.isArray(obj.playerNames)) {
    const names = obj.playerNames as unknown[];
    result.playerNames = DEFAULT_PLAYER_NAMES.map(
      (fallback, i) => (typeof names[i] === "string" ? (names[i] as string) : fallback)
    );
  }

  if (typeof obj.lastColor === "string") {
    result.lastColor = obj.lastColor;
  }

  return result;
}

export default function Page() {
  const [cells, setCells] = useState<CellState>({});
  const [solutions, setSolutions] = useState<SolutionState>({});
  const [playerNames, setPlayerNames] = useState<string[]>(DEFAULT_PLAYER_NAMES);
  const [lastColor, setLastColor] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = migrate(JSON.parse(saved));
        setCells(data.cells);
        setSolutions(data.solutions);
        setPlayerNames(data.playerNames);
        setLastColor(data.lastColor);
      }
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const data: SaveData = { cells, solutions, playerNames, lastColor };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [cells, solutions, playerNames, lastColor, loaded]);

  function cycleCell(key: string) {
    setCells((prev) => {
      const current = prev[key] ?? EMPTY_CELL;
      return { ...prev, [key]: { ...current, mark: nextMark(current.mark) } };
    });
  }

  function applyColor(key: string, color: string | null) {
    setCells((prev) => {
      const current = prev[key] ?? EMPTY_CELL;
      return { ...prev, [key]: { ...current, color } };
    });
    if (color) setLastColor(color);
    setPickerTarget(null);
  }

  function cycleSolution(key: string) {
    setSolutions((prev) => ({ ...prev, [key]: nextMark(prev[key] ?? "") }));
  }

  function renamePlayer(index: number, name: string) {
    setPlayerNames((prev) => prev.map((p, i) => (i === index ? name : p)));
  }

  function reset() {
    if (window.confirm("Wirklich den gesamten Ermittlungsblock zurücksetzen?")) {
      setCells({});
      setSolutions({});
      setPlayerNames([...DEFAULT_PLAYER_NAMES]);
    }
  }

  const gridTemplate = `2.1rem minmax(72px,1fr) repeat(${COLUMNS_PER_ROW}, minmax(1.7rem, 2.3rem))`;

  return (
    <div className="page">
      <div className="masthead">
        <h1>Ermittlungsblock</h1>
        <p>Cluedo · Harry Potter Edition</p>
      </div>

      {CATEGORIES.map((category) => (
        <div className="card" key={category.id}>
          <div className="card-header">{category.title}</div>

          <div className="grid-row header-row" style={{ gridTemplateColumns: gridTemplate }}>
            <span className="solution-label" title="Lösung?">
              ?
            </span>
            <span />
            {playerNames.map((name, i) => (
              <input
                key={i}
                className="name-input"
                value={name}
                maxLength={12}
                onChange={(e) => renamePlayer(i, e.target.value)}
                aria-label={`Name Spalte ${i + 1}`}
              />
            ))}
          </div>

          {category.items.map((item, itemIndex) => {
            const solKey = solutionKey(category.id, itemIndex);
            const solMark = solutions[solKey] ?? "";
            return (
              <div
                className="grid-row"
                style={{ gridTemplateColumns: gridTemplate }}
                key={item}
              >
                <MarkButton
                  mark={solMark}
                  className="solution-toggle"
                  ariaLabel={`${item} – Lösung`}
                  onClick={() => cycleSolution(solKey)}
                />
                <span className="row-label">{item}</span>
                {Array.from({ length: COLUMNS_PER_ROW }).map((_, col) => {
                  const key = cellKey(category.id, itemIndex, col);
                  const cell = cells[key] ?? EMPTY_CELL;
                  return (
                    <MarkButton
                      key={col}
                      mark={cell.mark}
                      color={cell.color}
                      className="cell"
                      ariaLabel={`${item} – ${playerNames[col]}`}
                      onClick={() => cycleCell(key)}
                      onLongPress={() => setPickerTarget(key)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}

      <div className="actions">
        <button type="button" className="reset-button" onClick={reset}>
          Zurücksetzen
        </button>
      </div>
      <p className="status">Wird automatisch nur auf diesem Gerät gespeichert.</p>

      {pickerTarget && (
        <ColorPicker
          currentColor={cells[pickerTarget]?.color ?? null}
          lastColor={lastColor}
          onPick={(color) => applyColor(pickerTarget, color)}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </div>
  );
}

function MarkButton({
  mark,
  color,
  className,
  ariaLabel,
  onClick,
  onLongPress,
}: {
  mark: Mark;
  color?: string | null;
  className: string;
  ariaLabel: string;
  onClick: () => void;
  onLongPress?: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handlePointerDown() {
    if (!onLongPress) return;
    longPressFired.current = false;
    timerRef.current = setTimeout(() => {
      longPressFired.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  }

  function handleClick() {
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    onClick();
  }

  return (
    <button
      type="button"
      className={className}
      data-mark={mark}
      style={color ? { backgroundColor: color } : undefined}
      aria-label={`${ariaLabel}${mark ? `, ${mark}` : ""}`}
      onPointerDown={handlePointerDown}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      onPointerCancel={clearTimer}
      onContextMenu={(e) => e.preventDefault()}
      onClick={handleClick}
    >
      {mark === "x" ? "✕" : mark === "-" ? "–" : ""}
    </button>
  );
}

function ColorPicker({
  currentColor,
  lastColor,
  onPick,
  onClose,
}: {
  currentColor: string | null;
  lastColor: string | null;
  onPick: (color: string | null) => void;
  onClose: () => void;
}) {
  const preselected = currentColor ?? lastColor;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <p className="modal-title">Farbe wählen</p>
        <div className="swatches">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              className="swatch"
              style={{ backgroundColor: c }}
              data-active={c === preselected}
              aria-label={`Farbe ${c}`}
              onClick={() => onPick(c)}
            />
          ))}
          <button
            type="button"
            className="swatch swatch-clear"
            aria-label="Keine Farbe"
            onClick={() => onPick(null)}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
