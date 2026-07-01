// Tipos espelhando exatamente as entidades e DTOs do backend (NestJS + Prisma)

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  dataCriacao: string;
}

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface SubTarefa {
  id: string;
  nome: string;
  dataConclusao: string | null;
  dataCricao: string;
  dataAtualizacao: string;
}

export interface Tarefa {
  id: string;
  nome: string;
  descricao: string;
  usuarioId: string;
  dataConclusao: string | null;
  metaConclusao: string | null;
  dataCricao: string;
  dataAtualizacao: string;
  subTarefas: SubTarefa[];
}

// ---- Payloads de requisição (refletem os DTOs do backend) ----

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface CreateSubTarefaPayload {
  nome: string;
}

export interface CreateTarefaPayload {
  nome: string;
  descricao: string;
  metaConclusao?: string;
  subTarefas?: CreateSubTarefaPayload[];
}

export interface UpdateSubTarefaPayload {
  id?: string;
  nome?: string;
  dataConclusao?: string | null;
}

export interface UpdateTarefaPayload {
  nome?: string;
  descricao?: string;
  metaConclusao?: string | null;
  dataConclusao?: string | null;
  subTarefas?: UpdateSubTarefaPayload[];
}

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}
