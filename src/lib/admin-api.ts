const API_BASE = import.meta.env.VITE_API_URL ?? "";

const adminFetch = (path: string, init?: RequestInit) =>
  fetch(`${API_BASE}${path}`, { credentials: "include", ...init });

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export interface AdminMeta {
  enabled: boolean;
  loginEnabled: boolean;
  keys: string[];
}

export interface AdminSession {
  authenticated: boolean;
  enabled: boolean;
}

export interface ContentSection {
  key: string;
  data: unknown;
  updatedAt?: string;
}

export async function fetchAdminMeta(): Promise<AdminMeta> {
  const res = await adminFetch("/api/admin/meta");
  return parseJson<AdminMeta>(res);
}

export async function fetchAdminSession(): Promise<AdminSession> {
  const res = await adminFetch("/api/admin/session");
  return parseJson<AdminSession>(res);
}

export async function adminLogin(password: string): Promise<void> {
  const res = await adminFetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  await parseJson(res);
}

export async function adminLogout(): Promise<void> {
  const res = await adminFetch("/api/admin/logout", { method: "POST" });
  await parseJson(res);
}

export async function fetchContentSection(
  key: string,
): Promise<ContentSection> {
  const res = await adminFetch(`/api/content/${key}`);
  return parseJson<ContentSection>(res);
}

export async function saveContentSection(
  key: string,
  data: unknown,
): Promise<ContentSection> {
  const res = await adminFetch(`/api/content/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  return parseJson<ContentSection>(res);
}
