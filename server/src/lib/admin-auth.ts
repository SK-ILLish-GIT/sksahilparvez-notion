import type { Request } from "express";
import { config } from "../config.js";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./admin-session.js";

export function isAdminEnabled(): boolean {
  return Boolean(config.adminPassword || config.adminApiKey);
}

export function isAdminAuthenticated(req: Request): boolean {
  if (config.adminApiKey) {
    const auth = req.header("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : "";
    if (token && token === config.adminApiKey) return true;
  }

  const secret = config.sessionSecret;
  if (!secret) return false;

  const sessionToken = req.cookies?.[ADMIN_SESSION_COOKIE] as
    | string
    | undefined;
  return verifySessionToken(sessionToken, secret);
}
