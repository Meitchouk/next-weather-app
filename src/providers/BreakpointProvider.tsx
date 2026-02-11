"use client";

import { createContext, useContext } from "react";
import { useBreakpoint, type BreakpointInfo } from "@/hooks/useBreakpoint";

const BreakpointContext = createContext<BreakpointInfo | null>(null);

export function BreakpointProvider({ children }: { children: React.ReactNode }) {
  const breakpoint = useBreakpoint();

  return (
    <BreakpointContext.Provider value={breakpoint}>
      {children}
    </BreakpointContext.Provider>
  );
}

/** @throws if used outside `<BreakpointProvider>`. */
export function useBreakpointContext(): BreakpointInfo {
  const ctx = useContext(BreakpointContext);

  if (!ctx) {
    throw new Error(
      "useBreakpointContext must be used within a <BreakpointProvider>. " +
        "Wrap your app with <BreakpointProvider> (or use <AppProviders>).",
    );
  }

  return ctx;
}
