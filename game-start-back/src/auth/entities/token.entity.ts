import { User } from "src/users/entities/users.entity"
import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm"
import { BaseEntity } from "utils/BaseEntity"

interface TokenCreation{
    refreshToken:string
}

@Entity()
export class Token extends BaseEntity implements TokenCreation{
    @Column({
        nullable:false,
    })
    refreshToken:string
    
    @OneToOne(type=>User,user=>user.token)
    @JoinColumn()
    user:User
}