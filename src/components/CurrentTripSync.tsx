"use client";

import { useEffect } from "react";
import { useAppShell } from "./AppShellProvider";

interface CurrentTripSyncProps {
  id: string;
  name: string;
  ballColor: string;
}

export default function CurrentTripSync({ id, name, ballColor }: CurrentTripSyncProps) {
  const { setCurrentTrip } = useAppShell();

  useEffect(() => {
    setCurrentTrip({ id, name, ballColor });
    return () => setCurrentTrip(null);
  }, [id, name, ballColor, setCurrentTrip]);

  return null;
}
