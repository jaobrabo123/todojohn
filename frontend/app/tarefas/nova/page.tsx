"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import { ApiError, createTarefa } from "@/lib/api";

interface DraftSubtarefa {
  key: string;
  nome: string;
}

export default function NovaTarefaPage() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [metaConclusao, setMetaConclusao] = useState("");
  const [subtarefas, setSubtarefas] = useState<DraftSubtarefa[]>([]);
  const [novaSubtarefa, setNovaSubtarefa] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  function adicionarSubtarefa() {
    const texto = novaSubtarefa.trim();
    if (!texto) return;
    setSubtarefas((prev) => [...prev, { key: crypto.randomUUID(), nome: texto }]);
    setNovaSubtarefa("");
  }

  function removerSubtarefa(key: string) {
    setSubtarefas((prev) => prev.filter((s) => s.key !== key));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const tarefa = await createTarefa({
        nome,
        descricao,
        metaConclusao: metaConclusao ? new Date(metaConclusao).toISOString() : undefined,
        subTarefas: subtarefas.map((s) => ({ nome: s.nome })),
      });
      router.push(`/tarefas/${tarefa.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar a tarefa.");
    } finally {
      setIsSubmitting(false);
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

      <h1 className="mb-6 font-display text-2xl text-bone">Nova tarefa</h1>

      <form onSubmit={handleSubmit} className="rounded-lg border border-hairline bg-panel p-6">
        <div className="space-y-4">
          <Field label="Nome">
            <input
              type="text"
              required
              maxLength={100}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-field"
              placeholder="Ex.: Preparar apresentação"
            />
          </Field>

          <Field label="Descrição">
            <textarea
              required
              maxLength={3000}
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="input-field resize-none"
              placeholder="Detalhe o que precisa ser feito…"
            />
          </Field>

          <Field label="Prazo (opcional)">
            <input
              type="date"
              value={metaConclusao}
              onChange={(e) => setMetaConclusao(e.target.value)}
              className="input-field"
            />
          </Field>

          <Field label="Subtarefas (opcional)">
            <div className="space-y-2">
              {subtarefas.map((sub) => (
                <div
                  key={sub.key}
                  className="flex items-center justify-between rounded-md border border-hairline bg-panel-raised px-3 py-2 text-sm"
                >
                  <span className="text-bone">{sub.nome}</span>
                  <button
                    type="button"
                    onClick={() => removerSubtarefa(sub.key)}
                    className="text-bone-faint hover:text-stamp"
                    aria-label="Remover subtarefa"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={100}
                  value={novaSubtarefa}
                  onChange={(e) => setNovaSubtarefa(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionarSubtarefa();
                    }
                  }}
                  className="input-field"
                  placeholder="Adicionar subtarefa e pressionar Enter"
                />
                <button
                  type="button"
                  onClick={adicionarSubtarefa}
                  className="btn-secondary flex-shrink-0 px-3"
                  aria-label="Adicionar subtarefa"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </Field>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-stamp-dim bg-stamp-dim/20 px-3 py-2 text-sm text-stamp">
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full">
          {isSubmitting ? "Criando…" : "Criar tarefa"}
        </button>
      </form>
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
