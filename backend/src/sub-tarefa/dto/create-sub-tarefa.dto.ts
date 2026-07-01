import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateSubTarefaDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nome!: string;
}
