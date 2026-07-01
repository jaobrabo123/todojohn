/*
  Warnings:

  - You are about to drop the column `concluida` on the `sub_tarefa` table. All the data in the column will be lost.
  - You are about to drop the column `concluida` on the `tarefa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sub_tarefa" DROP COLUMN "concluida",
ADD COLUMN     "data_conclusao" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "tarefa" DROP COLUMN "concluida",
ADD COLUMN     "data_conclusao" TIMESTAMPTZ(6),
ADD COLUMN     "meta_conclusao" TIMESTAMPTZ(6);
