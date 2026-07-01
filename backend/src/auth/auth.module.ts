import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Argon2Provider } from "./providers/argon2.provider";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow("JWT_SECRET"),
                signOptions: { expiresIn: "15m" },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, Argon2Provider],
})
export class AuthModule {}
