import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Argon2Provider } from "./providers/argon2.provider";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsuarioModule } from "../usuario/usuario.module";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
    imports: [
        UsuarioModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow("JWT_SECRET"),
                signOptions: { expiresIn: "1d" },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, Argon2Provider, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
