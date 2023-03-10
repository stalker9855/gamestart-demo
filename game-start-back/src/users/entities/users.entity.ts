import { ApiProperty } from "@nestjs/swagger";
import { Token } from "src/auth/entities/token.entity";
import { Todo } from "src/todos/todo.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "utils/BaseEntity";

interface UserCreation{
    email:string
    password:string
}

@Entity()
export class User extends BaseEntity implements UserCreation{
    @ApiProperty({example:'example@gmail.com',description:"User's email"})
    @Column({
        nullable:false,
        unique:true
    })
    email:string
    @ApiProperty({example:'12345678',description:"User's password"})
    @Column({
       nullable:true
    })
    password:string
    @Column({
        default:false
    })
    isActivated:boolean
    @Column({
        nullable:true
    })
    activationLink:string
    @ApiProperty({example:false,description:"Banned status of the user"})
    @Column({
        default:false
    })
    isBanned:boolean
    @ApiProperty({example:'Hacking',description:"Reason of ban"})
    @Column({
        nullable:true
    })
    banReason:string

    @ApiProperty({example:false, description:"admin"})
    @Column({
        default: false,
    })
    isAdmin: boolean 

    @OneToMany(type=>Todo,todo=>todo.user)
    todos:Todo[]

    @OneToOne(type=>Token,token=>token.user)
    token:Token
}