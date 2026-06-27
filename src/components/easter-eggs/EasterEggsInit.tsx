import { useEffect } from "react";
import { logConsoleEasterEgg } from "@/lib/easter-eggs/console";

export function EasterEggsInit() {
  useEffect(() => {
    logConsoleEasterEgg();
  }, []);

  return null;
}
