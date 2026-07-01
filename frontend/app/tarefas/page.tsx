"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ApiError, listTarefas } from "@/lib/api";
import type { Tarefa } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";
import { EmptyState } from "@/components/EmptyState";

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTarefas = useCallback(async (nome?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listTarefas(nome || undefined);
      setTarefas(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar as tarefas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial da listagem
    fetchTarefas();
  }, [fetchTarefas]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchTarefas(busca), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca]);

  function handleTaskChange(updated: Tarefa) {
    setTarefas((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  const pendentes = tarefas.filter((t) => !t.dataConclusao);
  const concluidas = tarefas.filter((t) => t.dataConclusao);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-bone">Suas tarefas</h1>
          <p className="mt-1 font-mono text-xs text-bone-dim">
            {pendentes.length} pendente{pendentes.length !== 1 && "s"} · {concluidas.length}{" "}
            concluída{concluidas.length !== 1 && "s"}
          </p>
        </div>
        <Link href="/tarefas/nova" className="btn-primary">
          <Plus size={15} />
          Nova tarefa
        </Link>
      </div>

      <div className="relative mb-6">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bone-faint"
        />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar pelo nome da tarefa…"
          className="input-field pl-9"
        />
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-stamp-dim bg-stamp-dim/20 px-3 py-2 text-sm text-stamp">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="font-mono text-sm text-bone-dim">carregando…</p>
      ) : tarefas.length === 0 ? (
        <EmptyState
          title={busca ? "Nenhuma tarefa encontrada" : "Seu livro-caixa está vazio"}
          description={
            busca
              ? "Tente buscar por outro termo."
              : "Comece registrando a primeira tarefa do seu dia."
          }
        />
      ) : (
        <div className="space-y-6">
          {pendentes.length > 0 && (
            <ul className="ledger-spine space-y-1">
              {pendentes.map((tarefa) => (
                <TaskCard key={tarefa.id} tarefa={tarefa} onChange={handleTaskChange} />
              ))}
            </ul>
          )}

          {concluidas.length > 0 && (
            <div>
              <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-wide text-bone-faint">
                Concluídas
              </p>
              <ul className="ledger-spine space-y-1 opacity-70">
                {concluidas.map((tarefa) => (
                  <TaskCard key={tarefa.id} tarefa={tarefa} onChange={handleTaskChange} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
