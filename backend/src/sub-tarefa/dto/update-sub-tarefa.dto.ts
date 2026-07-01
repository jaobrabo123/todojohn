import { PartialType } from "@nestjs/swagger";
import { CreateSubTarefaDTO } from "./create-sub-tarefa.dto";
import { IsDate, IsOptional, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export class UpdateSubTarefaDTO extends PartialType(CreateSubTarefaDTO) {
    @IsOptional()
    @IsUUID(4)
    id?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dataConclusao?: Date;
}
