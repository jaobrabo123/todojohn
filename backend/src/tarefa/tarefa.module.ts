import { Module } from "@nestjs/common";
import { TarefaService } from "./tarefa.service";
import { TarefaController } from "./tarefa.controller";
import { DatabaseModule } from "../database/database.module";
import { TarefaRepositoryProvider } from "./tarefa.repository";

@Module({
    imports: [DatabaseModule],
    controllers: [TarefaController],
    providers: [TarefaService, TarefaRepositoryProvider],
})
export class TarefaModule {}
