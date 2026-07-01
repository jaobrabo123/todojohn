"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, register } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Brand } from "@/components/Brand";

export default function RegistrarPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await register({ nome, email, senha });
      signIn(response.accessToken, response.user);
      router.push("/tarefas");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar sua conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Brand className="text-2xl" />
          <p className="mt-2 font-mono text-xs text-bone-dim">abra seu livro-caixa</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-hairline bg-panel p-6"
        >
          <div className="space-y-4">
            <Field label="Nome">
              <input
                type="text"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input-field"
                placeholder="João Pedro"
              />
            </Field>

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
                autoComplete="new-password"
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
            {isSubmitting ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-bone-dim">
          Já tem conta?{" "}
          <Link href="/login" className="text-stamp hover:underline">
            Entrar
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
