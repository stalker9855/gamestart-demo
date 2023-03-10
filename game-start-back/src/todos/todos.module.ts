import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { Todo } from './todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports:[
    TypeOrmModule.forFeature([Todo]),
    UsersModule,
  ],
  exports:[
    TodosService
  ]
})
export class TodosModule {}
