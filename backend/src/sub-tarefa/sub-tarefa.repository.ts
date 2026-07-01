import { Provider } from "@nestjs/common";
import { SubTarefa } from "../../generated/prisma/client";
import { RepositoryOf, setupVSRepo } from "../../generated/vsrepo";
import { PrismaService } from "../database/prisma.service";

const subTarefaVSRepo = setupVSRepo<SubTarefa, "SubTarefa">()({
    tableName: "subTarefa",
    pkName: "id",
    selectModels: {
        public: {
            id: true,
            dataAtualizacao: true,
            dataConclusao: true,
            dataCricao: true,
            nome: true,
            tarefaId: true,
        },
    },
    defaultSelectModel: "public",
});

export type SubTarefaRepository = RepositoryOf<typeof subTarefaVSRepo>;

export const SUB_TAREFA_REPOSITORY = Symbol("SUB_TAREFA_REPOSITORY");

export const SubTarefaRepositoryProvider: Provider = {
    provide: SUB_TAREFA_REPOSITORY,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
        return subTarefaVSRepo.build(prisma);
    },
};
