import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { connectDb } from "./db.js";
import { adminRouter } from "./routes/admin.js";
import { contentRouter } from "./routes/content.js";
import { visitsRouter } from "./routes/visits.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveDistPath(): string | null {
  const candidates = [
    path.resolve(__dirname, "../../dist"),
    path.resolve(process.cwd(), "dist"),
    path.resolve(process.cwd(), "../dist"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "index.html"))) {
      return candidate;
    }
  }

  return null;
}

const app = express();

app.use(
  cors({
    origin: config.corsOrigins,
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/visits", visitsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/content", contentRouter);

const distPath = resolveDistPath();

if (distPath) {
  app.use(express.static(distPath, { index: false }));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  console.log(`Serving frontend from ${distPath}`);
} else {
  console.log("No dist/ build found — API only mode");
}

async function start() {
  await connectDb();
  app.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
