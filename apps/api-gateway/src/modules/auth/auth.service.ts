import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly http: HttpService,
    private readonly config: ConfigService
  ) {}

  async loginWithPassword(dto: LoginDto) {
    const port = this.config.get<string>('AUTH_PORT') ?? '3011';
    const url = `http://localhost:${port}/auth/login`;
    try {
      const res = await firstValueFrom(this.http.post(url, dto));
      return res.data;
    } catch (_err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async loginFromOAuthProfile(oauth: any) {
    const email = oauth?.profile?.emails?.[0]?.value;
    const provider = oauth?.provider;
    const providerId = oauth?.profile?.id;
    const displayName = oauth?.profile?.displayName;
    const port = this.config.get<string>('AUTH_PORT') ?? '3011';
    const url = `http://localhost:${port}/auth/oauth`;
    const body = { email, provider, providerId, displayName };
    const res = await firstValueFrom(this.http.post(url, body));
    return res.data;
  }

  async fetchFreshProfile(authHeader?: string) {
    const port = this.config.get<string>('AUTH_PORT') ?? '3011';
    const url = `http://localhost:${port}/auth/me`;
    const res = await firstValueFrom(
      this.http.get(url, { headers: authHeader ? { Authorization: authHeader } : {} })
    );
    console.log('fetchFreshProfile', res.data);
    return res.data;
  }
}


