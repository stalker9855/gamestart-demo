import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class ApiTokenCheckMiddleware implements NestMiddleware{
    constructor(
        private readonly authService:AuthService,
    ){}
    async use(req: Request, res: Response, next:NextFunction) {
        try {
            const authHeader = req.headers.authorization
            if(!authHeader){
                return next(new HttpException(`User is unauthorized`,HttpStatus.UNAUTHORIZED))
            }
            const accessToken = authHeader.split(' ')[1]
            if(!accessToken){
                return next(new HttpException(`User is unauthorized`,HttpStatus.UNAUTHORIZED))
            }
            const userDara = await this.authService.valideteAccessToken(accessToken)
            if(!userDara){
                return next(new HttpException(`User is unauthorized`,HttpStatus.UNAUTHORIZED))
            }
            req.body=userDara
            next()
        } catch (error) {
            return next(new HttpException(`User is unauthorized`,HttpStatus.UNAUTHORIZED))
        }
    }
}