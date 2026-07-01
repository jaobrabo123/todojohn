import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
    USUARIO_REPOSITORY,
    UsuarioSaveObject,
    type UsuarioRepository,
} from "./usuario.repository";
import { RequestUser } from "../auth/entities/custom-request.entity";

@Injectable()
export class UsuarioService {
    constructor(
        @Inject(USUARIO_REPOSITORY) private readonly usuarioRepository: UsuarioRepository,
    ) {}

    private assertUsuarioExists<T>(usuario: T): asserts usuario is NonNullable<T> {
        if (!usuario) throw new NotFoundException("Usuário não encontrado.");
    }

    async findMe(user: RequestUser) {
        const usuario = await this.usuarioRepository.get(user.sub);
        this.assertUsuarioExists(usuario);
        return {
            id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
            dataCriacao: usuario.dataCricao,
        };
    }

    async removeMe(user: RequestUser) {
        const usuario = await this.usuarioRepository.get(user.sub);
        this.assertUsuarioExists(usuario);
        await this.usuarioRepository.remove(usuario.id);
    }

    async save(data: UsuarioSaveObject) {
        return this.usuarioRepository.save(data);
    }

    async findOneByEmail(email: string) {
        return this.usuarioRepository.findOneByEmail(email);
    }

    async existsByEmail(email: string) {
        return this.usuarioRepository.existsByEmail(email);
    }
}
