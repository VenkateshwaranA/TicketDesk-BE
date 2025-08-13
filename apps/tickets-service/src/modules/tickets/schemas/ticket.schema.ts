import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  assignedTo?: string | null;

  @Prop({
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'DONE'],
    default: 'OPEN',
  })
  status!: 'OPEN' | 'IN_PROGRESS' | 'DONE';

  @Prop({
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM',
  })
  priority!: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);


