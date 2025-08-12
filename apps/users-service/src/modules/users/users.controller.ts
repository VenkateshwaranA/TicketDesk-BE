import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  async list() {
    return this.users.list();
  }

  @Post()
  async create(@Body() body: any) {
    return this.users.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.users.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}


