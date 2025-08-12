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
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);


