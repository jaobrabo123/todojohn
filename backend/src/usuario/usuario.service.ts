import { Inject, Injectable } from "@nestjs/common";
import {
    USUARIO_REPOSITORY,
    UsuarioSaveObject,
    type UsuarioRepository,
} from "./usuario.repository";

@Injectable()
export class UsuarioService {
    constructor(
        @Inject(USUARIO_REPOSITORY) private readonly usuarioRepository: UsuarioRepository,
    ) {}

    async save(data: UsuarioSaveObject) {
        return this.usuarioRepository.save(data);
    }

    async findByEmail(email: string) {
        return this.usuarioRepository.findByEmail(email);
    }

    async existsByEmail(email: string) {
        return this.usuarioRepository.existsByEmail(email);
    }
}
