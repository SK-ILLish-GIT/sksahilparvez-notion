import { useCallback, useEffect, useState } from "react";
import { AdminContentPanel } from "@/components/admin/AdminContentPanel";
import { Button } from "@/components/ui/button";
import {
  adminLogin,
  adminLogout,
  fetchAdminMeta,
  fetchAdminSession,
  type AdminMeta,
} from "@/lib/admin-api";

function AdminLogin({
  onSuccess,
  disabled,
}: {
  onSuccess: () => void;
  disabled?: boolean;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminLogin(password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-sm font-medium">
          Admin password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={disabled || loading}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Enter password"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={disabled || loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export function AdminPage() {
  const [meta, setMeta] = useState<AdminMeta | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const [metaData, session] = await Promise.all([
      fetchAdminMeta(),
      fetchAdminSession(),
    ]);
    setMeta(metaData);
    setAuthenticated(session.authenticated);
  }, []);

  useEffect(() => {
    void refreshSession()
      .catch(() => {
        setMeta({ enabled: false, loginEnabled: false, keys: [] });
        setAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, [refreshSession]);

  const logout = async () => {
    await adminLogout();
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading admin…
      </div>
    );
  }

  if (!meta?.enabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md space-y-2 text-center">
          <h1 className="text-lg font-semibold">Admin disabled</h1>
          <p className="text-sm text-muted-foreground">
            Set <code className="text-foreground">ADMIN_PASSWORD</code> in
            server env to enable.
          </p>
          <a
            href="/"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            ← Back to portfolio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Portfolio admin</h1>
            <p className="text-xs text-muted-foreground">
              Structured forms for each section · JSON mode available
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              View site
            </a>
            {authenticated && (
              <Button variant="outline" size="sm" onClick={() => void logout()}>
                Log out
              </Button>
            )}
          </div>
        </div>
      </header>

      {!meta.loginEnabled ? (
        <main className="mx-auto max-w-4xl px-6 py-8">
          <p className="text-sm text-muted-foreground">
            Login is disabled. Use Bearer token with{" "}
            <code className="text-foreground">ADMIN_API_KEY</code> for CLI
            updates.
          </p>
        </main>
      ) : authenticated ? (
        <AdminContentPanel keys={meta.keys} />
      ) : (
        <main className="mx-auto max-w-md px-6 py-12">
          <div className="space-y-6 rounded-xl border border-border bg-card p-6">
            <div>
              <h2 className="text-base font-semibold">Sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Edit profile, experience, projects, and more. Only you can save
                changes.
              </p>
            </div>
            <AdminLogin onSuccess={() => void refreshSession()} />
          </div>
        </main>
      )}
    </div>
  );
}
