import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsuarioModule } from "./usuario/usuario.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { seconds, ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TarefaModule } from "./tarefa/tarefa.module";
import { SubTarefaModule } from "./sub-tarefa/sub-tarefa.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([
            {
                name: "short",
                ttl: seconds(1),
                limit: 3,
            },
            {
                name: "long",
                ttl: seconds(60),
                limit: 100,
            },
        ]),
        AuthModule,
        UsuarioModule,
        DatabaseModule,
        TarefaModule,
        SubTarefaModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
