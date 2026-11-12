import { Archivo, Public_Sans } from "next/font/google";

export const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

export const fontVariables = `${publicSans.variable} ${archivo.variable}`;

export const FONT_DISPLAY = "font-[family-name:var(--font-archivo)]";

export const WDTH = {
  104: "[font-variation-settings:'wdth'_104]",
  108: "[font-variation-settings:'wdth'_108]",
  110: "[font-variation-settings:'wdth'_110]",
  112: "[font-variation-settings:'wdth'_112]",
  115: "[font-variation-settings:'wdth'_115]",
} as const;
