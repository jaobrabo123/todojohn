import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsuarioService } from "../usuario/usuario.service";
import { Argon2Provider } from "./providers/argon2.provider";
import { RegisterWithPasswordDto } from "./dto/register-with-password.dto";
import { LoginWithPasswordDto } from "./dto/login-with-password.dto";
import { Usuario } from "../../generated/prisma/client";

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly argon2Provider: Argon2Provider,
        private readonly jwtService: JwtService,
    ) {}

    async registerWithPassword(dto: RegisterWithPasswordDto) {
        const alreadyExists = await this.usuarioService.existsByEmail(dto.email);

        if (alreadyExists) {
            throw new ConflictException("E-mail ja cadastrado.");
        }

        const senhaHash = await this.argon2Provider.hash(dto.senha);
        const user = await this.usuarioService.save({
            email: dto.email,
            nome: dto.nome,
            senha: senhaHash,
        });

        return this.createAuthResponse(user);
    }

    async loginWithPassword(dto: LoginWithPasswordDto) {
        const user = await this.usuarioService.findOneByEmail(dto.email);

        if (!user?.senha) {
            throw new UnauthorizedException("Credenciais invalidas.");
        }

        const isValidPassword = await this.argon2Provider.compare(user.senha, dto.senha);

        if (!isValidPassword) {
            throw new UnauthorizedException("Credenciais invalidas.");
        }

        return this.createAuthResponse(user);
    }

    async loginWithGoogle(profile: { email?: string; nome?: string }) {
        if (!profile.email) {
            throw new UnauthorizedException("Google nao retornou email.");
        }

        const existingUser = await this.usuarioService.findOneByEmail(profile.email);

        if (existingUser) {
            return this.createAuthResponse(existingUser);
        }

        const newUser = await this.usuarioService.save({
            email: profile.email,
            nome: profile.nome ?? profile.email.split("@")[0] ?? "Usuario Google",
            senha: null,
        });

        return this.createAuthResponse(newUser);
    }

    private async createAuthResponse(user: Usuario) {
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        return {
            accessToken,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
            },
        };
    }
}
