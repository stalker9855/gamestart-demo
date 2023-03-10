import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('users/:id/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() data: CreateTodoDto, @Param("id") id:string) {
    return this.todosService.createToDo(data,+id);
  }

  // @Get()
  // findAll() {
  //   return this.todosService.findAll();
  // }

  @Get()
  findUserTodos(@Param('id') id: string) {
    return this.todosService.getAllTodosOfUser(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
  //   return this.todosService.update(+id, updateTodoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.todosService.remove(+id);
  // }
}
