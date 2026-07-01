import { Provider } from "@nestjs/common";
import { TarefaGetPayload } from "../../generated/prisma/models";
import { RepositoryOf, setupVSRepo } from "../../generated/vsrepo";
import { PrismaService } from "../database/prisma.service";

type Tarefa = TarefaGetPayload<{
    include: {
        subTarefas: true;
    };
}>;

const tarefaVSRepo = setupVSRepo<Tarefa, "Tarefa">()({
    tableName: "tarefa",
    pkName: "id",
    defaultOrdenation: [{ dataCricao: "desc" }],
    relations: {
        subTarefas: {
            mode: "otm",
            pk: "id",
            restriction: "set",
        },
    },
    selectModels: {
        public: {
            id: true,
            nome: true,
            usuarioId: true,
            dataAtualizacao: true,
            dataConclusao: true,
            dataCricao: true,
            descricao: true,
            metaConclusao: true,
            subTarefas: {
                take: 50,
                select: {
                    id: true,
                    dataAtualizacao: true,
                    dataConclusao: true,
                    dataCricao: true,
                    nome: true,
                },
            },
        },
    },
    defaultSelectModel: "public",
    methods: {
        findByUsuarioIdAndNomeContainsInsensitiveOptional: { map: true },
        findOneByIdAndUsuarioId: { map: true },
    },
});

export type TarefaRepository = RepositoryOf<typeof tarefaVSRepo>;

export const TAREFA_REPOSITORY = Symbol("TAREFA_REPOSITORY");

export const TarefaRepositoryProvider: Provider = {
    provide: TAREFA_REPOSITORY,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
        return tarefaVSRepo.build(prisma);
    },
};
