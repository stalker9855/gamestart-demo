import { Body, Controller, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckAbilities, ReadUserAbility } from 'src/ability/ability.decorator';
import { Action } from 'src/ability/ability.factory/ability.factory';
import { AbilitiesGuard } from 'src/ability/ability.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@ApiTags("Users")
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService:UsersService,
        ){}
    // @ApiOperation({summary:'Create a new user'})
    // @ApiResponse({status:200,type:User})
    // @Post()
    // createUser(@Body() data:CreateUserDto){
    //     return this.usersService.createUser(data)
    // }

    @ApiOperation({summary:'Find all users'})
    @ApiResponse({status:200,type:[User]})
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new ReadUserAbility())
    @Get()
    getAll(){
   
        return this.usersService.getAllUsers()
    }

    @Get("/:id")
    getUserById(id: number)
    {

        return this.usersService.getUserById(id);
    }
}
