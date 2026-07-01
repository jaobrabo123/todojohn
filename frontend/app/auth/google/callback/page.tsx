"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brand } from "@/components/Brand";
import { useAuth } from "@/lib/auth-context";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GoogleCallbackHandler />
    </Suspense>
  );
}

function GoogleCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signInWithToken } = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login?error=google");
      return;
    }

    signInWithToken(token)
      .then(() => router.replace("/tarefas"))
      .catch(() => {
        setError(true);
        router.replace("/login?error=google");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <Brand className="text-2xl" />
        <p className="mt-3 font-mono text-xs text-bone-dim">
          {error ? "não foi possível concluir o login…" : "concluindo login com Google…"}
        </p>
      </div>
    </main>
  );
}
