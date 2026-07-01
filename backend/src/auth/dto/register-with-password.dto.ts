import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterWithPasswordDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    nome!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    senha!: string;
}
