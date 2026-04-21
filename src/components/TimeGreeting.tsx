"use client";

import { useState, useEffect } from "react";

interface TimeGreetingProps {
  firstName: string;
  tripCount: number;
  nextDays: number | null;
}

export default function TimeGreeting({ firstName, tripCount, nextDays }: TimeGreetingProps) {
  const [greeting, setGreeting] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    let variants: string[];
    if (h >= 5 && h < 11) {
      variants = [`Good morning, ${firstName}.`, `Rise and plan, ${firstName}.`];
    } else if (h >= 11 && h < 17) {
      variants = [`Good afternoon, ${firstName}.`, `Lunch-hour scroll, ${firstName}?`];
    } else if (h >= 17 && h < 23) {
      variants = [`Evening, ${firstName}.`, `Planning tonight?`];
    } else {
      variants = [`Still up, ${firstName}?`, `Night owl planning. Respect.`];
    }
    setGreeting(variants[Math.floor(Math.random() * variants.length)]);

    if (tripCount === 0) {
      setSubtitle("No trips planned yet.");
    } else if (nextDays !== null && nextDays >= 0) {
      const label = nextDays === 0 ? "today" : `${nextDays} days away`;
      setSubtitle(`Your next adventure: ${label}`);
    } else {
      setSubtitle(`${tripCount} trip${tripCount === 1 ? "" : "s"} in the works`);
    }
  }, [firstName, tripCount, nextDays]);

  return (
    <div className="px-4 sm:px-6 pt-6 pb-4 min-h-[56px]">
      {greeting && (
        <>
          <p
            className="text-lg"
            style={{ fontFamily: "var(--font-fredoka)", color: "#00E5FF" }}
          >
            {greeting}
          </p>
          <p className="text-sm text-white mt-0.5">{subtitle}</p>
        </>
      )}
    </div>
  );
}
