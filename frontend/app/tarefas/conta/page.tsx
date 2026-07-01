"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { ApiError, deleteAccount } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function ContaPage() {
  const { user, signOut } = useAuth();
  const [confirmando, setConfirmando] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExcluirConta() {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAccount();
      signOut();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível excluir sua conta.");
      setIsDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/tarefas"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-bone-dim hover:text-bone"
      >
        <ArrowLeft size={14} />
        Voltar
      </Link>

      <h1 className="mb-6 font-display text-2xl text-bone">Minha conta</h1>

      <section className="rounded-lg border border-hairline bg-panel p-6">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-bone-faint">
          Dados
        </p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-bone-dim">Nome</dt>
            <dd className="text-bone">{user?.nome}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-bone-dim">E-mail</dt>
            <dd className="text-bone">{user?.email}</dd>
          </div>
        </dl>
      </section>

      {error && (
        <p className="mt-6 rounded-md border border-stamp-dim bg-stamp-dim/20 px-3 py-2 text-sm text-stamp">
          {error}
        </p>
      )}

      <section className="mt-6 flex items-center justify-between rounded-lg border border-hairline bg-panel p-6">
        <div>
          <p className="text-sm text-bone">Excluir minha conta</p>
          <p className="text-xs text-bone-faint">
            Remove permanentemente sua conta e todas as suas tarefas. Não pode ser desfeito.
          </p>
        </div>

        {confirmando ? (
          <div className="flex flex-shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleExcluirConta}
              disabled={isDeleting}
              className="btn-primary !bg-stamp"
            >
              {isDeleting ? "Excluindo…" : "Confirmar exclusão"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="btn-ghost-danger flex-shrink-0"
          >
            <Trash2 size={14} />
            Excluir conta
          </button>
        )}
      </section>
    </main>
  );
}
