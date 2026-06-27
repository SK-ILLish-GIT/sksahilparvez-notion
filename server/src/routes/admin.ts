import { Router } from "express";
import { CONTENT_KEYS, config } from "../config.js";
import { isAdminAuthenticated, isAdminEnabled } from "../lib/admin-auth.js";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "../lib/admin-session.js";

export const adminRouter = Router();

adminRouter.get("/meta", (_req, res) => {
  res.json({
    enabled: isAdminEnabled(),
    loginEnabled: Boolean(config.adminPassword),
    keys: CONTENT_KEYS,
  });
});

adminRouter.get("/session", (req, res) => {
  res.json({
    authenticated: isAdminAuthenticated(req),
    enabled: isAdminEnabled(),
  });
});

adminRouter.post("/login", (req, res) => {
  if (!config.adminPassword) {
    res.status(503).json({ error: "Admin login is disabled" });
    return;
  }

  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!verifyPassword(password, config.adminPassword)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const secret = config.sessionSecret;
  if (!secret) {
    res.status(503).json({ error: "Admin session is not configured" });
    return;
  }

  const token = createSessionToken(secret);
  res.cookie(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
  res.json({ ok: true });
});

adminRouter.post("/logout", (_req, res) => {
  res.clearCookie(ADMIN_SESSION_COOKIE, { path: "/" });
  res.json({ ok: true });
});
