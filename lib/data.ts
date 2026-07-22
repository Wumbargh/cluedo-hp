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

export const COLUMNS_PER_ROW = 5;
