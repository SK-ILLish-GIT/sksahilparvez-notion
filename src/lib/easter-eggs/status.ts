import { isLateNightIST } from "./time";

export function getDisplayStatus(defaultStatus: string): string {
  if (isLateNightIST()) return "Probably debugging";
  return defaultStatus;
}
