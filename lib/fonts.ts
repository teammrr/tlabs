import { Fraunces, IBM_Plex_Sans_Thai, Noto_Serif_Thai } from "next/font/google";

// Self-hosted by next/font at build time: no runtime request to Google.
// Display stack falls back per glyph: Fraunces (Latin) -> Noto Serif Thai.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  weight: ["600"],
  display: "swap",
  variable: "--font-noto-serif-thai",
});

const plexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex-sans-thai",
});

export const fontVariables = [
  fraunces.variable,
  notoSerifThai.variable,
  plexSansThai.variable,
].join(" ");
