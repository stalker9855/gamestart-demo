import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { Token } from "./entities/token.entity";
import { MailsService } from "../mails/mails.service";
import { AuthService } from "./auth.service";
import { MailsModule } from "src/mails/mails.module";
import { User } from "src/users/entities/users.entity";
import { APP_GUARD } from "@nestjs/core";
import { AbilitiesGuard } from "src/ability/ability.guard";
import { AbilityModule } from "src/ability/ability.module";
import { AppModule } from "src/app.module";


@Module({
  controllers: [AuthController],
  providers: [AuthService, 
  ],
  imports:[
    TypeOrmModule.forFeature([Token]),
    JwtModule.register({
      secret:process.env.PRIVATE_KEY || "CRINGE",
      signOptions: {
        expiresIn:'30m'
      }
    }),
    forwardRef(()=>UsersModule),
    MailsModule,
    forwardRef(() => AbilityModule)
  ],
  exports:[
    AuthService
  ]
})
export class AuthModule {}
