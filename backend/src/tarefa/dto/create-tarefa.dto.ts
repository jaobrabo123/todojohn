import {
    ArrayMaxSize,
    IsArray,
    IsDate,
    IsNotEmpty,
    IsString,
    MaxLength,
    ValidateIf,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateSubTarefaDTO } from "../../sub-tarefa/dto/create-sub-tarefa.dto";

export class CreateTarefaDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nome!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(3000)
    descricao!: string;

    @IsDate()
    @Type(() => Date)
    @ValidateIf((_, value) => value !== null)
    metaConclusao!: Date | null;

    @IsDate()
    @Type(() => Date)
    @ValidateIf((_, value) => value !== null)
    dataConclusao!: Date | null;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMaxSize(50)
    @Type(() => CreateSubTarefaDTO)
    subTarefas!: CreateSubTarefaDTO[];
}
