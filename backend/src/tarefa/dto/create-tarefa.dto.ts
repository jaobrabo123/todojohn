import {
    ArrayMaxSize,
    IsArray,
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
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

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    metaConclusao?: Date;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMaxSize(50)
    @Type(() => CreateSubTarefaDTO)
    subTarefas?: CreateSubTarefaDTO[];
}
