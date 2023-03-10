import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) 
    private readonly userRepository:Repository<User>,
    ){}
    async createUser(data:CreateUserDto){
        const user= this.userRepository.create(data)
        return await this.userRepository.save(user)
    }
    
    async activateUser(id:number){
        const user = await this.getUserById(id)
        user.isActivated=true
        return await this.userRepository.save(user)
    }

    async getAllUsers(){
        
        const users=await this.userRepository.find({relations:['todos','token']})
        return users
    }
    
    async getUserByActivasionLink(activationLink:string){
        const user=await this.userRepository.findOne({where:{activationLink},relations:['token']})
        console.log(user)
        return user
    }

    async getUserById(id:number){
        const user=await this.userRepository.findOne({where:{id},relations:['todos','token']})
        return user
    }

    async getUserByEmail(email:string){
        const user=await this.userRepository.findOne({where:{email}})
        return user
    }
}