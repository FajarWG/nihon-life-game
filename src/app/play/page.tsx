"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

/** Mounts the Phaser game full-screen. All gameplay UI lives inside Phaser. */
function GameHost() {
  const hostRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();

  useEffect(() => {
    let game: import("phaser").Game | undefined;
    let cancelled = false;

    (async () => {
      // auth gate: logged in → play; 401 → title; 503 (no DB) → error
      try {
        const res = await fetch("/api/auth");
        if (res.status === 401) {
          window.location.replace("/");
          return;
        }
        if (res.status === 503) {
          // DB not configured — show error, can't play
          window.location.replace("/");
          return;
        }
      } catch {
        // offline — can't verify, redirect to title
        window.location.replace("/");
        return;
      }

      const [{ createGame }, { initializeRun }] = await Promise.all([
        import("@/game"),
        import("@/game/launch"),
      ]);
      // prepare the shared game state before Phaser boots
      await initializeRun({
        mode: params.get("mode") === "continue" ? "continue" : "new",
        playerName: params.get("name") ?? "Player",
      });
      if (cancelled || !hostRef.current) return;
      game = createGame(hostRef.current);
    })();

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, [params]);

  return <div ref={hostRef} className="w-screen h-screen" />;
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen grid place-items-center">Loading…</div>}>
      <GameHost />
    </Suspense>
  );
}
