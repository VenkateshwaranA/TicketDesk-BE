import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TicketsService } from './tickets.service';
import { RequirePermissions } from '@common/rbac/rbac.decorator';
import { IsOptional, IsString } from 'class-validator';

class CreateTicketDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  ownerId!: string;

  @IsOptional()
  @IsString()
  assignedTo?: string | null;

  @IsOptional()
  @IsString()
  status?: string | null;

  @IsOptional()
  @IsString()
  priority?: string | null;
}

class UpdateTicketDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string | null;

  @IsOptional()
  @IsString()
  status?: string | null;

  @IsOptional()
  @IsString()
  priority?: string | null;
}

@Controller('tickets')
// @UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly tickets: TicketsService) { }
  @Get()
  async list(@Query('ownerId') ownerId?: string) {
    return this.tickets.list(ownerId);
  }

  @Post()
  // @RequirePermissions('manage_tickets')
  async create(@Body() body: CreateTicketDto) {
    return this.tickets.create(body);
  }

  @Patch(':id')
  // @RequirePermissions('manage_tickets')
  async update(@Param('id') id: string, @Body() body: UpdateTicketDto) {
    return this.tickets.update(id, body);
  }

  @Patch(':id/assign/:userId')
  // @RequirePermissions('manage_tickets')
  async assign(@Param('id') id: string, @Param('userId') userId: string) {
    return this.tickets.assign(id, userId);
  }

  @Patch(':id/unassign')
  // @RequirePermissions('manage_tickets')
  async unassign(@Param('id') id: string) {
    return this.tickets.unassign(id);
  }

  @Delete(':id')
  // @RequirePermissions('manage_tickets')
  async remove(@Param('id') id: string) {
    return this.tickets.remove(id);
  }
}


