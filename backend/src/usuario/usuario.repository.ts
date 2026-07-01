import { Provider } from "@nestjs/common";
import { Usuario } from "../../generated/prisma/client";
import { RepositoryOf, SaveObject, setupVSRepo } from "../../generated/vsrepo";
import { PrismaService } from "../database/prisma.service";
import { UsuarioCreateInput } from "../../generated/prisma/models";

const usuarioVSRepo = setupVSRepo<Usuario, "Usuario">()({
    tableName: "usuario",
    pkName: "id",
    methods: {
        findByEmail: { map: true },
        existsByEmail: { map: true },
    },
});

export type UsuarioRepository = RepositoryOf<typeof usuarioVSRepo>;
export type UsuarioSaveObject = SaveObject<UsuarioCreateInput, typeof usuarioVSRepo>;

export const USUARIO_REPOSITORY = Symbol("USUARIO_REPOSITORY");

export const UsuarioRepositoryProvider: Provider = {
    provide: USUARIO_REPOSITORY,
    inject: [PrismaService],
    useFactory: (prisma: PrismaService) => {
        return usuarioVSRepo.build(prisma);
    },
};
