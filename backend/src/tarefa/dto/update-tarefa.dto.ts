import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateTarefaDTO } from "./create-tarefa.dto";
import { ArrayMaxSize, IsArray, IsDate, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UpdateSubTarefaDTO } from "../../sub-tarefa/dto/update-sub-tarefa.dto";

export class UpdateTarefaDTO extends PartialType(
    OmitType(CreateTarefaDTO, ["subTarefas"] as const),
) {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dataConclusao?: Date;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMaxSize(50)
    @Type(() => UpdateSubTarefaDTO)
    subTarefas?: UpdateSubTarefaDTO[];
}
