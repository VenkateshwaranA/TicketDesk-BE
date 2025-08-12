import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { RequirePermissions } from '@common/rbac/rbac.decorator';

@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}


  @Get()
  // @RequirePermissions('manage_users')
  async list() {
    return this.users.list();
  }

  @Post()
  // @RequirePermissions('manage_users')
  async create(@Body() body: any) {
    return this.users.create(body);
  }

  @Patch(':id')
  // @RequirePermissions('manage_users')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.users.update(id, body);
  }

  @Delete(':id')
  @RequirePermissions('manage_users')
  async remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}


