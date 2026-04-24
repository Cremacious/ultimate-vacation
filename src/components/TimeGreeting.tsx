"use client";

import { useState, useEffect } from "react";

interface TimeGreetingProps {
  firstName: string;
  tripCount: number;
  nextDays: number | null;
}

// Greeting color shifts with time of day — cyan morning, yellow afternoon, pink evening, purple night
function greetingColor(hour: number): string {
  if (hour >= 5 && hour < 11) return "#00A8CC";   // morning — cyan
  if (hour >= 11 && hour < 17) return "#FFD600";  // afternoon — yellow
  if (hour >= 17 && hour < 23) return "#FF2D8B";  // evening — pink
  return "#A855F7";                                 // night — purple
}

export default function TimeGreeting({ firstName, tripCount, nextDays }: TimeGreetingProps) {
  const [greeting, setGreeting] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [color, setColor] = useState("#00A8CC");

  useEffect(() => {
    const h = new Date().getHours();
    let variants: string[];
    if (h >= 5 && h < 11) {
      variants = [`Morning, ${firstName}.`, `Rise and wave, ${firstName}.`, `Good morning, ${firstName}.`];
    } else if (h >= 11 && h < 17) {
      variants = [`Hey ${firstName}.`, `What's good, ${firstName}.`, `Afternoon, ${firstName}.`];
    } else if (h >= 17 && h < 23) {
      variants = [`Evening, ${firstName}.`, `End of day, ${firstName}. Let's plan something.`];
    } else {
      variants = [`Still up, ${firstName}?`, `Night owl energy. Respect.`];
    }
    setGreeting(variants[Math.floor(Math.random() * variants.length)]);
    setColor(greetingColor(h));

    if (tripCount === 0) {
      setSubtitle("Nowhere to be yet. That's about to change.");
    } else if (nextDays !== null && nextDays === 0) {
      setSubtitle("Today's the day. Go have the best time.");
    } else if (nextDays !== null && nextDays === 1) {
      setSubtitle("Tomorrow. You're basically already there.");
    } else if (nextDays !== null && nextDays > 0) {
      setSubtitle(`${nextDays} days and counting. It'll be here before you know it.`);
    } else {
      setSubtitle(`${tripCount} trip${tripCount === 1 ? "" : "s"} in the books. Keep going.`);
    }
  }, [firstName, tripCount, nextDays]);

  return (
    <div
      className="mt-6 mb-4 rounded-2xl border border-[#3A3A3A] px-6 py-5"
      style={{ backgroundColor: "#2E2E2E" }}
    >
      {greeting && (
        <>
          <p
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-fredoka)", color }}
          >
            {greeting}
          </p>
          <p className="mt-1 text-base text-white/90">{subtitle}</p>
        </>
      )}
    </div>
  );
}
