import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const PULSE_AFTER_MS = 60_000;

const TimeOnSitePulseContext = createContext(false);

export function TimeOnSitePulseProvider({ children }: { children: ReactNode }) {
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShouldPulse(true), PULSE_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <TimeOnSitePulseContext.Provider value={shouldPulse}>
      {children}
    </TimeOnSitePulseContext.Provider>
  );
}

export function useTimeOnSitePulse() {
  return useContext(TimeOnSitePulseContext);
}
