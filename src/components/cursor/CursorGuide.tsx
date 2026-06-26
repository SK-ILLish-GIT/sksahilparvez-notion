import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface CursorGuideContextValue {
  enabled: boolean;
}

const CursorGuideContext = createContext<CursorGuideContextValue>({
  enabled: false,
});

export function useCursorGuide() {
  return useContext(CursorGuideContext);
}

function resolveHint(target: Element | null): string | null {
  if (!target || !(target instanceof Element)) return null;

  const hinted = target.closest("[data-cursor-hint]") as HTMLElement | null;
  if (hinted?.dataset.cursorHint) return hinted.dataset.cursorHint;

  const link = target.closest("a[href]") as HTMLAnchorElement | null;
  if (link) return "Open link";

  const button = target.closest("button:not(:disabled), [role='button']");
  if (button) return "Click";

  return null;
}

function getTargetUnderPointer(x: number, y: number): Element | null {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.closest("[data-cursor-root]")) continue;
    return el;
  }
  return null;
}

export function CursorGuideProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [interactive, setInteractive] = useState(false);
  const [visible, setVisible] = useState(false);

  const layerRef = useRef<HTMLDivElement>(null);
  const lastHintRef = useRef<string | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    const activate = () => {
      const on = finePointer.matches;
      setEnabled(on);
      document.body.classList.toggle("cursor-guide-active", on);
    };

    activate();
    finePointer.addEventListener("change", activate);

    return () => {
      document.body.classList.remove("cursor-guide-active");
      finePointer.removeEventListener("change", activate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;

    const applyHint = (next: string | null) => {
      if (next === lastHintRef.current) return;
      lastHintRef.current = next;
      setHint(next);
      setInteractive(!!next);
    };

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (layerRef.current) {
          layerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }

        setVisible(true);
        const target = getTargetUnderPointer(e.clientX, e.clientY);
        applyHint(resolveHint(target));
      });
    };

    const onOver = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      applyHint(resolveHint(e.target));
    };

    const onLeave = () => {
      setVisible(false);
      applyHint(null);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) {
    return (
      <CursorGuideContext.Provider value={{ enabled: false }}>
        {children}
      </CursorGuideContext.Provider>
    );
  }

  return (
    <CursorGuideContext.Provider value={{ enabled }}>
      {children}
      <div
        ref={layerRef}
        data-cursor-root
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <div
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary transition-[width,height,opacity] duration-150",
            interactive ? "h-10 w-10 opacity-50" : "h-6 w-6 opacity-30",
          )}
        />
        <div className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-sm" />

        {hint && visible && (
          <div className="absolute left-4 top-4 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-lg">
            <span className="mr-1.5 text-primary">→</span>
            {hint}
          </div>
        )}
      </div>
    </CursorGuideContext.Provider>
  );
}
