import { Body, Controller, Get, Param, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationDto } from './dto/registration.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';


@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService:AuthService,
        ){}

    @Post("registration")
    async registration(@Res() response: Response,@Body() data:RegistrationDto){
        const userData= await this.authService.registrateUser(data)
        response.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
        return response.status(200).send(userData)
    }  
        
    @Post("login")
    async login(@Body() data:RegistrationDto, @Res() response: Response){
        const userData = await this.authService.loginUser(data)
        response.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
        return response.status(200).send(userData)
        //redirect
    }

    
    @Post("logout")
    async logout(@Req() request:Request,@Res() response: Response){
        const {refreshToken}=await request.cookies
        const token = await this.authService.logoutUser(refreshToken)
        response.clearCookie('refreshToken')
        return response.status(200).send(token)
    }

    @Get("activate/:link")
    async activate(@Param("link")link:string,@Res() response: Response){
        await this.authService.activateUser(link)
        return response.redirect(process.env.CLIENT_URL)
    }


    @Get('refresh')
    async refreshToken(@Req() request,@Res() response: Response){
        const {refreshToken}=await request.cookies
        const userData = await this.authService.refreshToken(refreshToken)
        response.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
        return response.status(200).send(userData)
    }

}
