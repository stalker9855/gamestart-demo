import { User } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "utils/BaseEntity";


interface TodoCreation{
    title:string
    content:string
}
@Entity()
export class Todo extends BaseEntity implements TodoCreation {
    @Column({
        nullable:false,
    })
    title:string

    @Column({
        nullable:false,
    })
    content:string
    @ManyToOne(type=>User,user=>user.todos)
    user:User
}
