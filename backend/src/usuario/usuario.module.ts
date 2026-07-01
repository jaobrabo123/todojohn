import { Module } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { UsuarioController } from "./usuario.controller";
import { DatabaseModule } from "../database/database.module";
import { UsuarioRepositoryProvider } from "./usuario.repository";

@Module({
    imports: [DatabaseModule],
    controllers: [UsuarioController],
    providers: [UsuarioService, UsuarioRepositoryProvider],
    exports: [UsuarioService],
})
export class UsuarioModule {}
