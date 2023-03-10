import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from "./auth/auth.module";
import { ApiTokenCheckMiddleware } from "./middlewares/auth.middleware";
import { UsersController } from "./users/users.controller";
import { AbilityModule } from "./ability/ability.module";
import { APP_GUARD } from "@nestjs/core";
import { AbilitiesGuard } from "./ability/ability.guard";

@Module({
    controllers:[],
    providers:[
    ], 
    imports:[
        ConfigModule.forRoot({
            envFilePath:`.${process.env.NODE_ENV}.env`
        }),
        TypeOrmModule.forRoot(
            {
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: parseInt(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                autoLoadEntities: true,
                synchronize: true,
              }
        ),
        UsersModule,
        TodosModule,
        AuthModule,
        AbilityModule,
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(ApiTokenCheckMiddleware)
        .forRoutes(UsersController);
    }
    
}