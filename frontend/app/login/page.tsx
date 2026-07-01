"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, googleLoginUrl, login } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Brand } from "@/components/Brand";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleError = searchParams.get("error") === "google";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({ email, senha });
      signIn(response.accessToken, response.user);
      router.push("/tarefas");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Brand className="text-2xl" />
          <p className="mt-2 font-mono text-xs text-bone-dim">
            entre para abrir seu livro-caixa
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-hairline bg-panel p-6"
        >
          <div className="space-y-4">
            {googleError && !error && (
              <p className="rounded-md border border-stamp-dim bg-stamp-dim/20 px-3 py-2 text-sm text-stamp">
                Não foi possível entrar com o Google. Tente novamente ou use e-mail e senha.
              </p>
            )}

            <Field label="E-mail">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="joao@exemplo.com"
              />
            </Field>

            <Field label="Senha">
              <input
                type="password"
                required
                minLength={8}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-field"
                placeholder="mínimo 8 caracteres"
              />
            </Field>
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-stamp-dim bg-stamp-dim/20 px-3 py-2 text-sm text-stamp">
              {error}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full">
            {isSubmitting ? "Entrando…" : "Entrar"}
          </button>

          <div className="my-5 flex items-center gap-3 text-[11px] text-bone-faint">
            <span className="h-px flex-1 bg-hairline" />
            ou
            <span className="h-px flex-1 bg-hairline" />
          </div>

          <a href={googleLoginUrl()} className="btn-secondary w-full">
            Entrar com Google
          </a>
        </form>

        <p className="mt-6 text-center text-sm text-bone-dim">
          Ainda não tem conta?{" "}
          <Link href="/registrar" className="text-stamp hover:underline">
            Registre-se
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-bone-dim">{label}</span>
      {children}
    </label>
  );
}
