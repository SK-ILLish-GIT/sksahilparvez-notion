import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { portfolio } from "@/data";
import { cn } from "@/lib/utils";

const MIN_VISIBLE_MS = 650;
const MAX_WAIT_MS = 3200;

function waitForReady(): Promise<void> {
  return new Promise((resolve) => {
    const done = () => resolve();

    if (document.readyState === "complete") {
      void document.fonts.ready.then(done);
      return;
    }

    window.addEventListener(
      "load",
      () => {
        void document.fonts.ready.then(done);
      },
      { once: true },
    );
  });
}

export function useInitialLoad() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let finished = false;
    const started = performance.now();
    let raf = 0;

    const tick = () => {
      if (cancelled || finished) return;
      const elapsed = performance.now() - started;
      const eased = Math.min(92, 12 + (1 - Math.exp(-elapsed / 900)) * 80);
      setProgress((prev) => Math.max(prev, eased));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      setProgress(100);

      const elapsed = performance.now() - started;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

      window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, remaining);
    };

    const maxTimer = window.setTimeout(finish, MAX_WAIT_MS);

    void waitForReady().then(() => {
      window.clearTimeout(maxTimer);
      finish();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(maxTimer);
    };
  }, []);

  return { ready, progress };
}

function LoaderProgressBar({
  progress,
  reduceMotion,
  className,
}: {
  progress: number;
  reduceMotion: boolean | null;
  className?: string;
}) {
  const value = Math.round(Math.min(100, Math.max(0, progress)));

  return (
    <div
      className={cn(
        "h-0.5 w-full overflow-hidden rounded-full bg-border/50",
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading progress"
    >
      <div
        className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
        style={{
          width: `${value}%`,
          transition: reduceMotion ? "none" : "width 180ms ease-out",
        }}
      />
    </div>
  );
}

export function NotionLoader({
  exiting,
  progress,
  onDismiss,
}: {
  exiting: boolean;
  progress: number;
  onDismiss?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const { profile, site } = portfolio;
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    onDismiss?.();
  };

  useEffect(() => {
    if (exiting && reduceMotion) dismiss();
  }, [exiting, reduceMotion]);

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col bg-background",
        exiting ? "pointer-events-none" : "pointer-events-auto",
      )}
      initial={false}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (exiting) dismiss();
      }}
      aria-hidden={exiting}
      aria-busy={!exiting}
      aria-label="Loading workspace"
    >
      <LoaderProgressBar
        progress={progress}
        reduceMotion={reduceMotion}
        className="h-0.5 rounded-none bg-border/40"
      />

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex w-full max-w-[160px] flex-col items-center gap-3 text-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-base shadow-sm">
            {profile.pageIcon}
          </span>
          <p className="truncate text-xs font-medium text-foreground">
            {site.workspaceName}
          </p>
          <LoaderProgressBar progress={progress} reduceMotion={reduceMotion} />
          <p className="text-[11px] tabular-nums text-muted-foreground">
            Loading… {Math.round(progress)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}
