"use client";

import Link from "next/link";
import { useState } from "react";
import { StampCheckbox } from "./StampCheckbox";
import { cx, formatDate, isOverdue, tarefaToPutPayload } from "@/lib/utils";
import { updateTarefa } from "@/lib/api";
import type { Tarefa } from "@/lib/types";

interface TaskCardProps {
  tarefa: Tarefa;
  onChange: (updated: Tarefa) => void;
}

export function TaskCard({ tarefa, onChange }: TaskCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const isDone = Boolean(tarefa.dataConclusao);
  const overdue = isOverdue(tarefa.metaConclusao, tarefa.dataConclusao);
  const subtarefasConcluidas = tarefa.subTarefas.filter((s) => s.dataConclusao).length;
  const totalSubtarefas = tarefa.subTarefas.length;

  async function handleToggle() {
    setIsToggling(true);
    try {
      const updated = await updateTarefa(
        tarefa.id,
        tarefaToPutPayload(tarefa, {
          dataConclusao: isDone ? null : new Date().toISOString(),
        }),
      );
      onChange(updated);
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <li className="relative pl-8">
      <div
        className={cx(
          "flex items-start gap-3 rounded-lg border border-transparent px-3 py-3 transition-colors hover:border-hairline hover:bg-panel",
        )}
      >
        <div className="pt-0.5" onClick={(e) => e.preventDefault()}>
          <StampCheckbox
            checked={isDone}
            onToggle={handleToggle}
            label={isDone ? "Marcar tarefa como pendente" : "Marcar tarefa como concluída"}
          />
        </div>

        <Link href={`/tarefas/${tarefa.id}`} className="min-w-0 flex-1">
          <p
            className={cx(
              "strike-text font-medium text-bone",
              isDone && "is-struck text-bone-dim",
              isToggling && "opacity-60",
            )}
          >
            {tarefa.nome}
          </p>
          <p className="mt-0.5 line-clamp-1 text-sm text-bone-dim">{tarefa.descricao}</p>
        </Link>

        <div className="flex flex-shrink-0 flex-col items-end gap-1.5 pt-0.5 font-mono text-[11px]">
          {totalSubtarefas > 0 && (
            <span className="text-bone-faint">
              {subtarefasConcluidas}/{totalSubtarefas}
            </span>
          )}
          {tarefa.metaConclusao && !isDone && (
            <span className={overdue ? "text-stamp" : "text-amber"}>
              {formatDate(tarefa.metaConclusao)}
            </span>
          )}
          {isDone && <span className="text-ledger-teal">concluída</span>}
        </div>
      </div>
    </li>
  );
}
