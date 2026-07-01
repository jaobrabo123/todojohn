import { Type } from "class-transformer";
import {
    IsDate,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    ValidateIf,
} from "class-validator";

export class CreateSubTarefaDTO {
    @IsOptional()
    @IsUUID(4)
    id?: string;

    @IsDate()
    @Type(() => Date)
    @ValidateIf((_, value) => value !== null)
    dataConclusao!: Date | null;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nome!: string;
}
