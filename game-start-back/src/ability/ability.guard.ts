import { ForbiddenError } from "@casl/ability";
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RequiredRule, CHECK_ABILITY } from "./ability.decorator";
import { AbilityFactory } from "./ability.factory/ability.factory";
import { User } from "src/users/entities/users.entity";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AbilitiesGuard implements CanActivate{
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: AbilityFactory,
        private authService: AuthService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const rules =
        this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler());


                            //      ERROR
                            //       ||
                            //       \/
                            
        const req:Request = context.switchToHttp().getRequest();
        const ctx = await this.authService.valideteAccessToken(req.headers.authorization.split(" ")[1]);
        if(!ctx){
            console.log(await this.authService.valideteAccessToken(req.headers.authorization.split(" ")[1]))

            throw new ForbiddenException("User not found");
        }
        const user = ctx
        const ability = this.caslAbilityFactory.defineAbility(user);

        try {
            rules.forEach((rule) =>
            ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
            );
            return true;
            // return rules.every((rule) => ability.can(rule.action, rule.subject)); //NO SPECIFIC MESSAGE
        } catch (error){
            if(error instanceof ForbiddenError){
                throw new ForbiddenException(error.message);
            }
        }
    }
}