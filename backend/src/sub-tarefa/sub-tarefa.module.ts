import { Module } from "@nestjs/common";
import { SubTarefaService } from "./sub-tarefa.service";
import { DatabaseModule } from "../database/database.module";
import { SubTarefaRepositoryProvider } from "./sub-tarefa.repository";

@Module({
    imports: [DatabaseModule],
    providers: [SubTarefaService, SubTarefaRepositoryProvider],
    exports: [SubTarefaService],
})
export class SubTarefaModule {}
