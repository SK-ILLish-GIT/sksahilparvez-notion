import { portfolio } from "@/data";

let logged = false;

export function logConsoleEasterEgg() {
  if (logged || typeof window === "undefined") return;
  logged = true;

  const { github } = portfolio.site;

  console.log(
    "%c👋 Hey, fellow engineer!",
    "font-size: 15px; font-weight: 700; color: #10b981;",
  );
  console.log(
    "%cIf you're reading this, you're our kind of engineer.",
    "font-size: 12px; color: #8f8778;",
  );
  console.log(
    "%cSK Sahil Parvez — open to full-stack / backend roles. Let's build something useful together.",
    "font-size: 12px; color: inherit;",
  );
  console.log(
    `%c→ ${github}`,
    "font-size: 12px; color: #2383e2; text-decoration: underline;",
  );
}
