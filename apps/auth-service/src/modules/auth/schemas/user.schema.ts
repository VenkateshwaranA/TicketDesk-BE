import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ select: false })
  passwordHash?: string;

  @Prop({ type: [String], default: ['user'] })
  roles!: string[];

  @Prop({ type: [String], default: [] })
  permissions!: string[];

  @Prop({ type: String, enum: ['google', 'local'], default: 'local' })
  provider!: 'google' | 'local';
}

export const UserSchema = SchemaFactory.createForClass(User);


