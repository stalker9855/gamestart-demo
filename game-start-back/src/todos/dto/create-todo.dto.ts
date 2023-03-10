import { IsString } from "class-validator"

export class CreateTodoDto {
    @IsString({message:"title should be a string"})
    readonly title:string

    @IsString({message:"content should be a string"})
    readonly content:string
}
