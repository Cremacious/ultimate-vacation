import type { Metadata } from "next";
import { Fredoka, Nunito, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TripWave -- Plan the trip. Not the group chat.",
  description: "Collaborative vacation planning for everyone in the group. Get everyone on the same wave.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(fredoka.variable, nunito.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
