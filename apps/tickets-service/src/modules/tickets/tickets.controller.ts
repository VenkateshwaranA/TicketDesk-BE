import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  @Get()
  async list(@Query('ownerId') ownerId?: string) {
    return this.tickets.list(ownerId);
  }

  @Post()
  async create(@Body() body: any) {
    return this.tickets.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.tickets.update(id, body);
  }

  @Patch(':id/assign/:userId')
  async assign(@Param('id') id: string, @Param('userId') userId: string) {
    return this.tickets.assign(id, userId);
  }

  @Patch(':id/unassign')
  async unassign(@Param('id') id: string) {
    return this.tickets.unassign(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tickets.remove(id);
  }
}


