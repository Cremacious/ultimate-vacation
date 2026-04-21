"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type CurrentTrip = {
  id: string;
  name: string;
  ballColor: string;
};

interface AppShellContextValue {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  currentTrip: CurrentTrip | null;
  setCurrentTrip: (trip: CurrentTrip | null) => void;
}

const AppShellContext = createContext<AppShellContextValue>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  currentTrip: null,
  setCurrentTrip: () => {},
});

export function useAppShell() {
  return useContext(AppShellContext);
}

export default function AppShellProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<CurrentTrip | null>(null);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <AppShellContext.Provider
      value={{ sidebarOpen, toggleSidebar, closeSidebar, currentTrip, setCurrentTrip }}
    >
      {children}
    </AppShellContext.Provider>
  );
}
