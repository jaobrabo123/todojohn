import { Controller, Get } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { RequestUser } from "../auth/entities/custom-request.entity";

@Controller("usuarios")
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get("me")
    async findMe(@CurrentUser() user: RequestUser) {
        return this.usuarioService.findMe(user);
    }
}
