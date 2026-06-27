import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const skip =
  process.env.HUSKY === "0" ||
  process.env.CI === "true" ||
  process.env.CI === "1" ||
  process.env.NODE_ENV === "production";

if (skip) {
  process.exit(0);
}

const huskyBin = resolve("node_modules/.bin/husky");
if (!existsSync(huskyBin)) {
  process.exit(0);
}

execSync("husky", { stdio: "inherit" });
