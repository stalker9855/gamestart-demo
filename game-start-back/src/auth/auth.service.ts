import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import * as uuid from 'uuid'
import { RegistrationDto } from './dto/registration.dto';
import { MailsService } from 'src/mails/mails.service';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService:UsersService,
        private readonly mailsService:MailsService,
        private readonly jwtService:JwtService,
        @InjectRepository(Token) 
        private readonly tokenRepository:Repository<Token>,
    ){}
    
    async generateTokens(payload:Object){
        const accessToken= await this.jwtService.signAsync(payload, {expiresIn:'30m',secret:process.env.JWT_ACCESS || "CRINGE"})//ToDo move Cringe to .env
        const refreshToken= await this.jwtService.signAsync(payload, {expiresIn:'30d',secret:process.env.JWT_REFRESH || "CRINGE"})
        return  {refreshToken,accessToken}
    }

    async saveToken(userId:number,refreshToken:string){
        const user = await this.usersService.getUserById(userId)
        if(user.token){
            user.token.refreshToken=refreshToken
            return await this.tokenRepository.save(user.token)
        }
        const token = this.tokenRepository.create({refreshToken})
        token.user=user
        await this.tokenRepository.save(token)
        return token
    }
    async registrateUser(data:RegistrationDto){
        const candidate=await this.usersService.getUserByEmail(data.email)
        if(candidate){
            throw new HttpException(`User with email: ${data.email} already exists`,HttpStatus.BAD_REQUEST)
        }
        const hashedPassword = await bcrypt.hash(data.password,5)
        const activationUUID = await uuid.v4();
        const activationLink =`${process.env.API_URL}/auth/activate/${activationUUID}`
        await this.mailsService.sendActivationMail(data.email,activationLink)
        const user = await this.usersService.createUser({...data, password:hashedPassword, activationLink,isActivated:false})
        const tokens = await this.generateTokens({...user, password:hashedPassword})
        await this.saveToken(user.id,tokens.refreshToken)
        return{
            ...tokens,
            user
        }
    }

    async loginUser(data:RegistrationDto){
        const user=await this.usersService.getUserByEmail(data.email)
        if(!user){
            throw new HttpException(`User with email: ${data.email} is not registrated`,HttpStatus.UNAUTHORIZED)
        }
        if(!user.isActivated){
            throw new HttpException(`User's email: ${data.email} is not activated`,HttpStatus.UNAUTHORIZED)
        }
        const isPasswordEquals=await bcrypt.compare(data.password,user.password)
        if(!isPasswordEquals){
            throw new HttpException(`Wrong password for user: ${data.email}`,HttpStatus.BAD_REQUEST)
        }
        const tokens = await this.generateTokens({...user, password:user.password})
        await this.saveToken(user.id,tokens.refreshToken)
        return{
            ...tokens,
            user
        }
    }

    async activateUser(activationUUID:string){
        const user = await this.usersService.getUserByActivasionLink(activationUUID)
        if(!user){
            throw new HttpException("No such user found",HttpStatus.BAD_REQUEST)
        }
        return await this.usersService.activateUser(user.id)
    }

    async valideteAccessToken(token: string) {
        try {
            const userData: User = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_ACCESS })

            if (!userData.isActivated) {
                throw new HttpException(`User is unauthorized`, HttpStatus.UNAUTHORIZED)
            }
            return userData
        } catch (error) {
            return null
        }
    }

    async valideteRefreshToken(token){
        try {
           const userData:User=await this.jwtService.verifyAsync(token, {secret:process.env.JWT_REFRESH})
           if(!userData.isActivated){
            throw new HttpException(`User is unauthorized`,HttpStatus.UNAUTHORIZED)
           }
           return userData
        } catch (error) {
            return null
        }
    }

    async refreshToken(refreshToken:string){
        if(!refreshToken){
            throw new HttpException(`User is unauthorized`,HttpStatus.UNAUTHORIZED)
        }
        const userData:User = await this.valideteRefreshToken(refreshToken)
        const tokenFromDb = await this.findTokenData(refreshToken)
        if(!userData||!tokenFromDb){
            throw new HttpException(`You are already logout`,HttpStatus.UNAUTHORIZED)
        }
        const user = await this.usersService.getUserById(userData.id)
        const tokens = await this.generateTokens({...user, password:"CRINGE"})
        await this.saveToken(user.id,tokens.refreshToken)
        return{
            ...tokens,
            user
        }
    }

    async findTokenData(refreshToken:string){
        const tokenData = await this.tokenRepository.findOne({where:{refreshToken}})
        return tokenData
    }

    async logoutUser(refreshToken:string){
        const token = await this.tokenRepository.findOne({where:{refreshToken}})
        if(!token){
            throw new HttpException(`You are already logout`,HttpStatus.BAD_REQUEST)
        }
        await this.removeToken(token.id)
        return token
    }

    async removeToken(id:number){
        const token = await this.tokenRepository.delete({id})
        return token
    }

}