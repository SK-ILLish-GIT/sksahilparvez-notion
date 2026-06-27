/** Hour in Asia/Kolkata (0–23). */
export function getISTHour(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const hour = parts.find((p) => p.type === "hour")?.value;
  return hour ? Number(hour) : 12;
}

/** 12:00am – 4:59am IST */
export function isLateNightIST(): boolean {
  const hour = getISTHour();
  return hour >= 0 && hour < 5;
}
