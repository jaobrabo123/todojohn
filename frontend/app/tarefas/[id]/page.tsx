"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { ApiError, deleteTarefa, getTarefa, updateTarefa } from "@/lib/api";
import type { CreateSubTarefaPayload, SubTarefa, Tarefa } from "@/lib/types";
import { StampCheckbox } from "@/components/StampCheckbox";
import { cx, formatDateTime, tarefaToPutPayload, toDateInputValue } from "@/lib/utils";

export default function TarefaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [metaConclusao, setMetaConclusao] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  const [novaSubtarefa, setNovaSubtarefa] = useState("");

  const carregarTarefa = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTarefa(params.id);
      setTarefa(data);
      setNome(data.nome);
      setDescricao(data.descricao);
      setMetaConclusao(toDateInputValue(data.metaConclusao));
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setNotFound(true);
      } else {
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar a tarefa.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial da tarefa
    carregarTarefa();
  }, [carregarTarefa]);

  async function handleSalvarDetalhes() {
    if (!tarefa) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateTarefa(
        tarefa.id,
        tarefaToPutPayload(tarefa, {
          nome,
          descricao,
          metaConclusao: metaConclusao ? new Date(metaConclusao).toISOString() : null,
        }),
      );
      setTarefa(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleTarefa() {
    if (!tarefa) return;
    const updated = await updateTarefa(
      tarefa.id,
      tarefaToPutPayload(tarefa, {
        dataConclusao: tarefa.dataConclusao ? null : new Date().toISOString(),
      }),
    );
    setTarefa(updated);
  }

  async function salvarSubtarefas(subTarefas: CreateSubTarefaPayload[]) {
    if (!tarefa) return;
    const updated = await updateTarefa(tarefa.id, tarefaToPutPayload(tarefa, { subTarefas }));
    setTarefa(updated);
  }

  function handleToggleSubtarefa(sub: SubTarefa) {
    if (!tarefa) return;
    const subTarefas: CreateSubTarefaPayload[] = tarefa.subTarefas.map((s) => ({
      id: s.id,
      nome: s.nome,
      dataConclusao: s.id === sub.id ? (s.dataConclusao ? null : new Date().toISOString()) : s.dataConclusao,
    }));
    salvarSubtarefas(subTarefas);
  }

  function handleAdicionarSubtarefa() {
    if (!tarefa) return;
    const texto = novaSubtarefa.trim();
    if (!texto) return;

    const subTarefas: CreateSubTarefaPayload[] = [
      ...tarefa.subTarefas.map((s) => ({ id: s.id, nome: s.nome, dataConclusao: s.dataConclusao })),
      { nome: texto, dataConclusao: null },
    ];
    salvarSubtarefas(subTarefas);
    setNovaSubtarefa("");
  }

  function handleRemoverSubtarefa(sub: SubTarefa) {
    if (!tarefa) return;
    const subTarefas: CreateSubTarefaPayload[] = tarefa.subTarefas
      .filter((s) => s.id !== sub.id)
      .map((s) => ({ id: s.id, nome: s.nome, dataConclusao: s.dataConclusao }));
    salvarSubtarefas(subTarefas);
  }

  async function handleExcluirTarefa() {
    if (!tarefa) return;
    setIsDeleting(true);
    try {
      await deleteTarefa(tarefa.id);
      router.push("/tarefas");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível excluir a tarefa.");
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="font-mono text-sm text-bone-dim">carregando…</p>
      </main>
    );
  }

  if (notFound || !tarefa) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10 text-center">
        <p className="font-display text-lg text-bone">Tarefa não encontrada</p>
        <p className="mt-1.5 text-sm text-bone-dim">
          Ela pode ter sido removida ou pertence a outra conta.
        </p>
        <Link href="/tarefas" className="btn-secondary mt-6 inline-flex">
          <ArrowLeft size={14} />
          Voltar para as tarefas
        </Link>
      </main>
    );
  }

  const isDone = Boolean(tarefa.dataConclusao);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/tarefas"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-bone-dim hover:text-bone"
      >
        <ArrowLeft size={14} />
        Voltar
      </Link>

      <div className="mb-6 flex items-start gap-3">
        <div className="pt-1.5">
          <StampCheckbox
            checked={isDone}
            onToggle={handleToggleTarefa}
            label={isDone ? "Marcar como pendente" : "Marcar como concluída"}
          />
        </div>
        <div>
          <h1
            className={cx(
              "strike-text font-display text-2xl text-bone",
              isDone && "is-struck text-bone-dim",
            )}
          >
            {tarefa.nome}
          </h1>
          <p className="mt-1 font-mono text-[11px] text-bone-faint">
            criada em {formatDateTime(tarefa.dataCricao)}
            {isDone && ` · concluída em ${formatDateTime(tarefa.dataConclusao)}`}
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-stamp-dim bg-stamp-dim/20 px-3 py-2 text-sm text-stamp">
          {error}
        </p>
      )}

      <section className="rounded-lg border border-hairline bg-panel p-6">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-bone-faint">
          Detalhes
        </p>

        <div className="space-y-4">
          <Field label="Nome">
            <input
              type="text"
              maxLength={100}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-field"
            />
          </Field>

          <Field label="Descrição">
            <textarea
              rows={4}
              maxLength={3000}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="input-field resize-none"
            />
          </Field>

          <Field label="Prazo">
            <input
              type="date"
              value={metaConclusao}
              onChange={(e) => setMetaConclusao(e.target.value)}
              className="input-field"
            />
          </Field>
        </div>

        <button
          type="button"
          onClick={handleSalvarDetalhes}
          disabled={isSaving}
          className="btn-primary mt-5"
        >
          {isSaving ? "Salvando…" : "Salvar alterações"}
        </button>
      </section>

      <section className="mt-6 rounded-lg border border-hairline bg-panel p-6">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-bone-faint">
          Subtarefas
        </p>

        <div className="space-y-1.5">
          {tarefa.subTarefas.map((sub) => (
            <div key={sub.id} className="group flex items-center gap-3 rounded-md px-2 py-1.5">
              <StampCheckbox
                checked={Boolean(sub.dataConclusao)}
                onToggle={() => handleToggleSubtarefa(sub)}
                label={sub.dataConclusao ? "Marcar subtarefa como pendente" : "Marcar subtarefa como concluída"}
                size="sm"
              />
              <span
                className={cx(
                  "strike-text flex-1 text-sm text-bone",
                  sub.dataConclusao && "is-struck text-bone-dim",
                )}
              >
                {sub.nome}
              </span>
              <button
                type="button"
                onClick={() => handleRemoverSubtarefa(sub)}
                className="text-bone-faint opacity-0 transition-opacity group-hover:opacity-100 hover:text-stamp"
                aria-label="Remover subtarefa"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {tarefa.subTarefas.length === 0 && (
            <p className="px-2 py-1 text-sm text-bone-faint">Nenhuma subtarefa ainda.</p>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            maxLength={100}
            value={novaSubtarefa}
            onChange={(e) => setNovaSubtarefa(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdicionarSubtarefa();
              }
            }}
            placeholder="Adicionar subtarefa e pressionar Enter"
            className="input-field"
          />
          <button
            type="button"
            onClick={handleAdicionarSubtarefa}
            className="btn-secondary flex-shrink-0 px-3"
            aria-label="Adicionar subtarefa"
          >
            <Plus size={15} />
          </button>
        </div>
      </section>

      <section className="mt-6 flex items-center justify-between rounded-lg border border-hairline bg-panel p-6">
        <div>
          <p className="text-sm text-bone">Excluir esta tarefa</p>
          <p className="text-xs text-bone-faint">Essa ação não pode ser desfeita.</p>
        </div>

        {confirmandoExclusao ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmandoExclusao(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleExcluirTarefa}
              disabled={isDeleting}
              className="btn-primary !bg-stamp"
            >
              {isDeleting ? "Excluindo…" : "Confirmar exclusão"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmandoExclusao(true)}
            className="btn-ghost-danger"
          >
            <Trash2 size={14} />
            Excluir
          </button>
        )}
      </section>
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
