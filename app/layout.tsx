import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cluedo Harry Potter – Ermittlungsblock",
  description: "Digitaler Ermittlungsblock für Cluedo Harry Potter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
