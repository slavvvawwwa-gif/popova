"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

export interface PreviewPayload {
  label: string;
  src?: string;
}

type Mode = "follow" | "static";

interface CursorPreviewContextValue {
  /** "follow" on hover-capable desktops with motion; "static" on touch / reduced-motion */
  mode: Mode;
  show: (payload: PreviewPayload) => void;
  hide: () => void;
}

const CursorPreviewContext = createContext<CursorPreviewContextValue | null>(null);

export function useCursorPreview(): CursorPreviewContextValue {
  const ctx = useContext(CursorPreviewContext);
  if (!ctx) {
    // Safe no-op fallback if used outside the provider
    return { mode: "static", show: () => {}, hide: () => {} };
  }
  return ctx;
}

const LERP = 0.18;

export function CursorPreviewProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("static");
  const [payload, setPayload] = useState<PreviewPayload | null>(null);
  const [visible, setVisible] = useState(false);

  const layerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const primed = useRef(false);

  // Decide mode after mount (avoids SSR/hydration mismatch)
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    setMode(reduced || touch ? "static" : "follow");
  }, []);

  const show = useCallback(
    (p: PreviewPayload) => {
      if (mode !== "follow") return; // static handled inline by consumer
      setPayload(p);
      setVisible(true);
    },
    [mode]
  );

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  // Track the pointer and run the lerp loop continuously while in follow mode.
  // The card's *visibility* is controlled purely by `visible` (opacity), so the
  // loop never freezes mid-fade and the preview can't get "stuck" to the cursor.
  useEffect(() => {
    if (mode !== "follow") return;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!primed.current) {
        current.current.x = e.clientX;
        current.current.y = e.clientY;
        primed.current = true;
      }
    };
    // Safety: if the pointer leaves the window or the page scrolls, hide.
    const onLeave = () => setVisible(false);
    const onScroll = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * LERP;
      current.current.y += (target.current.y - current.current.y) * LERP;
      if (layerRef.current) {
        layerRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [mode]);

  return (
    <CursorPreviewContext.Provider value={{ mode, show, hide }}>
      {children}

      {/* Floating follower — only rendered in follow mode */}
      {mode === "follow" && (
        <div ref={layerRef} className="cp-layer" aria-hidden="true">
          {payload && (
            <div
              className={`cp-card ${visible ? "is-visible" : ""}`}
              style={{
                width: "220px",
                height: "280px",
                backgroundColor: "var(--bg-surface)",
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                position: "relative",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
            >
              {payload.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={payload.src}
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.5rem",
                    fontWeight: 300,
                    color: "rgba(237,237,237,0.12)",
                  }}
                >
                  {payload.label}
                </span>
              )}
              {/* Accent marker */}
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "2px",
                  height: "100%",
                  backgroundColor: "var(--accent)",
                }}
              />
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "1rem",
                  fontSize: "0.6rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  backgroundColor: "rgba(10,10,10,0.55)",
                  width: "100%",
                }}
              >
                {payload.label}
              </span>
            </div>
          )}
        </div>
      )}
    </CursorPreviewContext.Provider>
  );
}
