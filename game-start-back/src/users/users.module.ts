import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { AbilityModule } from 'src/ability/ability.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[
    TypeOrmModule.forFeature([User]),
    forwardRef(()=>AuthModule),
    AbilityModule
  ],
  exports:[
    UsersService
  ]
})
export class UsersModule {}
