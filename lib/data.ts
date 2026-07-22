export type Category = {
  id: string;
  title: string;
  items: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "person",
    title: "Verdächtige Person",
    items: [
      "Draco Malfoy",
      "Crabbe & Goyle",
      "Lucius Malfoy",
      "Dolores Umbridge",
      "Peter Pettigrew",
      "Bellatrix Lestrange",
    ],
  },
  {
    id: "gegenstand",
    title: "Gegenstand",
    items: [
      "Schlaftrunk",
      "Verschwindekabinett",
      "Portschlüssel",
      "Impedimenta",
      "Petrificus Totalus",
      "Alraune",
    ],
  },
  {
    id: "ort",
    title: "Ort",
    items: [
      "Große Halle",
      "Krankenflügel",
      "Raum der Wünsche",
      "Klassenzimmer für Zaubertränke",
      "Pokalzimmer",
      "Klassenzimmer für Wahrsagen",
      "Eulerei",
      "Bibliothek",
      "Verteidigung gegen die dunklen Künste",
    ],
  },
];

export const COLUMNS_PER_ROW = 6;

export const DEFAULT_PLAYER_NAMES = [
  "Spieler 1",
  "Spieler 2",
  "Spieler 3",
  "Spieler 4",
  "Spieler 5",
  "Dumbledore",
];

// Six preset colors for marking cells (Colorpicker via langem Klick).
export const COLOR_PALETTE = [
  "#c0392b", // Rot
  "#2e6da4", // Blau
  "#4a8a5c", // Grün
  "#d4a017", // Gelb/Gold
  "#8464a8", // Lila
  "#d2691e", // Orange
];
