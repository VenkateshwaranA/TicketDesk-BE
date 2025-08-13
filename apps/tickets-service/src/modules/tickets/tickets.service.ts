import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>) {}

  async list(ownerId?: string) {
    const filter = ownerId ? { ownerId } : {};
    const items = await this.ticketModel.find(filter).limit(50);
    return { items };
  }

  async create(body: Partial<Ticket>) {
    try {
      const doc = await this.ticketModel.create(body);
      return { id: String(doc._id) };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: string, body: Partial<Ticket>) {
    await this.ticketModel.updateOne({ _id: id }, body);
    return { id };
  }

  // async assign(id: string, userId: string) {
  //   await this.ticketModel.updateOne({ _id: id }, { assignedTo: userId });
  //   return { id, assignedTo: userId };
  // }

  // async unassign(id: string) {
  //   await this.ticketModel.updateOne({ _id: id }, { assignedTo: null });
  //   return { id, assignedTo: null };
  // }

  async remove(id: string) {
    await this.ticketModel.deleteOne({ _id: id });
    return { id };
  }
}


