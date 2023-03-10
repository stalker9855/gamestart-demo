import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) 
    private readonly todoRepository:Repository<Todo>,
    private readonly usersService: UsersService
    )
    {}

  async createToDo(data: CreateTodoDto, id:number) {
    const user = await this.usersService.getUserById(id)
    const todo = this.todoRepository.create(data)
    todo.user=user
    await this.todoRepository.save(todo)
    return todo
  }

  async getAllTodosOfUser(id:number) {
    const user= await this.usersService.getUserById(id)
    const todos= user.todos
    return todos
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} todo`;
  // }

  // update(id: number, updateTodoDto: UpdateTodoDto) {
  //   return `This action updates a #${id} todo`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} todo`;
  // }
}
