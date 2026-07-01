import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(value: string | null | undefined) {
  if (!value) return null;
  return format(new Date(value), "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return null;
  return format(new Date(value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function toDateInputValue(value: string | null | undefined) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function isOverdue(metaConclusao: string | null, dataConclusao: string | null) {
  if (!metaConclusao || dataConclusao) return false;
  return isPast(new Date(metaConclusao));
}

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
