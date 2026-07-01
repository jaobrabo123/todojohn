"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(isAuthenticated ? "/tarefas" : "/login");
  }, [isAuthenticated, isLoading, router]);

  return (
    <main className="grid min-h-screen place-items-center bg-ink">
      <p className="font-mono text-sm text-bone-dim">carregando…</p>
    </main>
  );
}
