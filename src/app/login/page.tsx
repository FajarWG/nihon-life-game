"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Redirect to title — login is now inline on the title screen. */
export default function LoginPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/"); }, [router]);
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-[#a89e8c]">Redirecting to title…</p>
    </main>
  );
}
