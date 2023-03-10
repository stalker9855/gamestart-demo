import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Length } from "class-validator"

export class RegistrationDto{

    @ApiProperty({example:'example@gmail.com',description:"User's email"})
    @IsString({message:"email should be a string"})
    @IsEmail({},{message:"email is incorrect"})
    readonly email:string

    @ApiProperty({example:'12345678',description:"User's password"})
    @IsString({message:"password should be a string"})
    @Length(8,30,{message:"password should more than 8 and less than 30 character"})
    readonly password:string
}