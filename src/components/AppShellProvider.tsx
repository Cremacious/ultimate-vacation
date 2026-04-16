"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface AppShellContextValue {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const AppShellContext = createContext<AppShellContextValue>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
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
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <AppShellContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </AppShellContext.Provider>
  );
}
