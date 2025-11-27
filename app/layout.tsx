import type { Metadata } from "next";
import { Fraunces, Cormorant_Garamond, Space_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Plant a flower in Charvi's garden!",
  description: "draw and plant a tiny flower in charvs' secret garden. no accounts, no names, just quiet kindness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={[
          fraunces.variable,
          cormorant.variable,
          spaceMono.variable,
          jetBrainsMono.variable,
          "antialiased bg-white",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
