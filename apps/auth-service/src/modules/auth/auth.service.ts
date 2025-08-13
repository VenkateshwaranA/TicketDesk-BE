import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly http: HttpService,
    private readonly config: ConfigService
  ) { }

  async login(dto: LoginDto) {
    const adminEmails = (this.config.get<string>('ADMIN_EMAILS') ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    let user = await this.userModel.findOne({ email: dto.email }).select('+passwordHash');
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = user.passwordHash ? await bcrypt.compare(dto.password, user.passwordHash) : false;
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    // Upgrade role to admin if email is in ADMIN_EMAILS
    if (adminEmails.includes(user.email.toLowerCase()) && !user.roles.includes('admin')) {
      user.roles = Array.from(new Set([...(user.roles ?? []), 'admin']));
      await user.save();
    }
    // Mirror user to users-service for admin listing/updates
    try {
      const usersPort = this.config.get<string>('USERS_PORT') ?? '3012';
      await firstValueFrom(
        this.http.post(`${this.config.get<string>("BACKEND_URL")}:${usersPort}/users`, {
          email: user.email,
          roles: user.roles,
          permissions: user.permissions,
        })
      );
    } catch {
      // Ignore if already exists or service unavailable
    }
    const payload = { sub: String(user._id), email: user.email, roles: user.roles, permissions: user.permissions };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async loginFromOAuth(input: { email?: string; provider: 'google'; providerId: string; displayName?: string }) {
    const adminEmails = (this.config.get<string>('ADMIN_EMAILS') ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    let user = await this.userModel.findOne({ email: input.email ?? undefined });
    
    if (!user && input.email) {
      const isAdmin = input.email ? adminEmails.includes(input.email.toLowerCase()) : false;
      user = await this.userModel.create({
        email: input.email,
        roles: isAdmin ? ['admin'] : ['user'],
        permissions: [],
        provider: input.provider
      } as Partial<User>);
    }

    if (!user) {
      user = await this.userModel.create({
        email: `${input.provider}-${input.providerId}@example.local`,
        roles: ['user'],
        permissions: [],
        provider: input.provider
      } as Partial<User>);
    }
    if (input.email && adminEmails.includes(input.email.toLowerCase()) && !user.roles.includes('admin')) {
      user.roles = Array.from(new Set([...(user.roles ?? []), 'admin']));
      await user.save();
    }
    // Mirror user to users-service for admin listing/updates
    try {
      const usersPort = this.config.get<string>('USERS_PORT') ?? '3012';
      await firstValueFrom(this.http.post(`${this.config.get<string>("BACKEND_URL")}:${usersPort}/users`, { email: user.email, roles: user.roles, permissions: user.permissions }));
    } catch {
      // Ignore if already exists or service unavailable
    }
    const payload = { sub: String(user._id), email: user.email, roles: user.roles, permissions: user.permissions };
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async getProfileById(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;
    return {
      id: String(user._id),
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
    };
  }
}


