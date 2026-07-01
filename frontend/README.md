# ToDo, John. — Frontend

Frontend em Next.js (App Router) para o backend NestJS do projeto `todojohn`.
Todas as telas e ações refletem exatamente os endpoints, DTOs e regras do
backend — nenhum arquivo do backend foi alterado.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Autenticação via JWT (Bearer token), guardado em `localStorage`
- `next/font/google`: Space Grotesk, IBM Plex Sans, IBM Plex Mono

## Como rodar

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

O app sobe em `http://localhost:5173`.

### ⚠️ Sobre a porta 5173

O backend (`config/cors.config.ts`) só aceita, em desenvolvimento, requisições
vindas de `http://localhost:5173`, `2923`, `3000` ou `5500`. Como o próprio
backend normalmente roda em `3000`, configurei o script `dev` para subir o
frontend em `5173` (uma das origens já liberadas), evitando qualquer alteração
no backend. Se preferir outra porta da lista, é só trocar o `-p` no
`package.json`.

### Variável de ambiente

`NEXT_PUBLIC_API_URL` — URL base do backend (padrão: `http://localhost:3000`).

## Endpoints consumidos

| Ação | Método | Rota |
|---|---|---|
| Registrar | `POST` | `/auth/register` |
| Login | `POST` | `/auth/login` |
| Login com Google | `GET` | `/auth/google` |
| Usuário logado | `GET` | `/usuarios/me` |
| Excluir minha conta | `DELETE` | `/usuarios/me` |
| Listar tarefas (com busca opcional por nome) | `GET` | `/tarefas?nome=` |
| Detalhe da tarefa | `GET` | `/tarefas/:id` |
| Criar tarefa (com subtarefas) | `POST` | `/tarefas` |
| Atualizar tarefa / concluir / gerenciar subtarefas | `PUT` | `/tarefas/:id` |
| Excluir tarefa | `DELETE` | `/tarefas/:id` |

O backend usa **PUT** (não PATCH) para atualizar tarefas: o corpo precisa ir
completo (`nome`, `descricao`, `metaConclusao`, `dataConclusao`, `subTarefas`),
não só os campos alterados. O helper `tarefaToPutPayload` (em `lib/utils.ts`)
centraliza isso — ele parte do estado atual da tarefa e só sobrescreve o que
realmente mudou, então toda ação (concluir tarefa, concluir subtarefa,
renomear, adicionar, remover) sempre reenvia o objeto inteiro como o backend
exige.

Subtarefas não têm endpoints próprios no backend — elas são sempre
criadas/atualizadas/removidas através do mesmo `PUT /tarefas/:id`, enviando o
array `subTarefas` completo (cada item com `id` quando já existe, `nome` e
`dataConclusao`). Itens sem `id` são criados; ids omitidos da lista são
removidos.

## Login com Google

O fluxo completo já está funcionando: `GET /auth/google` → tela do Google →
`GET /auth/google/callback` no backend redireciona para
`{FRONTEND_URL}/auth/google/callback?token=...`, e a página
`app/auth/google/callback` deste projeto captura o token, busca os dados do
usuário (`GET /usuarios/me`) e leva para `/tarefas`. Se algo falhar no
backend (ex.: Google não devolve e-mail), o redirecionamento cai em
`/login?error=google`, que exibe o aviso na tela.

Isso exigiu um pequeno ajuste no `auth.controller.ts` do backend (antes ele
devolvia o JSON puro no callback em vez de redirecionar) e a criação de
`src/config/frontend-url.config.ts`. Nenhum outro arquivo do backend foi
alterado. Lembre-se de configurar `FRONTEND_URL` no `.env` do backend
(padrão em dev: `http://localhost:5173`, já usado por este frontend).

## Estrutura

```
app/
  login/            página de login (trata também erro de login com Google)
  registrar/        página de registro
  auth/google/callback/  recebe o token do redirect do backend
  tarefas/
    page.tsx         listagem + busca
    nova/            criar tarefa (com subtarefas)
    [id]/            detalhe, edição, subtarefas, exclusão
    conta/           dados da conta + excluir conta permanentemente
lib/
  api.ts            cliente HTTP central (fetch + Bearer token)
  auth-context.tsx  contexto de autenticação
  types.ts          tipos espelhando os DTOs/entidades do backend
  utils.ts          formatação de datas etc.
components/
  StampCheckbox.tsx  checkbox estilo "carimbo" (concluir tarefa/subtarefa)
  TaskCard.tsx        card de tarefa na listagem
  Navbar.tsx, Brand.tsx, EmptyState.tsx
```
