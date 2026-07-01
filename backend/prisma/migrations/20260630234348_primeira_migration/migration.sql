-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(254) NOT NULL,
    "senha" VARCHAR(255),
    "nome" VARCHAR(100) NOT NULL,
    "data_criacao" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefa" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(3000) NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "usuario_id" UUID NOT NULL,
    "data_criacao" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tarefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_tarefa" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" VARCHAR(100) NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "tarefa_id" UUID NOT NULL,
    "data_criacao" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sub_tarefa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_tarefa" ADD CONSTRAINT "sub_tarefa_tarefa_id_fkey" FOREIGN KEY ("tarefa_id") REFERENCES "tarefa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
