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
      const [{ createGame }, { setLaunchOptions }] = await Promise.all([
        import("@/game"),
        import("@/game/launch"),
      ]);
      if (cancelled || !hostRef.current) return;
      setLaunchOptions({
        mode: params.get("mode") === "continue" ? "continue" : "new",
        playerName: params.get("name") ?? "Player",
      });
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
