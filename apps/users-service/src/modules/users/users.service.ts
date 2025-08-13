import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  async list() {
    const items = await this.userModel.find().limit(50);
    console.log(items, "items")
    return { items };
  }

  async create(body: Partial<User>) {
    const existingUser = await this.userModel.findOne({ email: body.email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.userModel.create(body);
  }

  async update(id: string, body: Partial<User>) {
    await this.userModel.updateOne({ _id: id }, body);
    return { id };
  }

  async remove(id: string) {
    await this.userModel.deleteOne({ _id: id });
    return { id };
  }
}


