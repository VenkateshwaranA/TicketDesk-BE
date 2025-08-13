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
  ) { }

  async loginWithPassword(dto: LoginDto) {
    const port = this.config.get<string>('AUTH_PORT') ?? '3011';
    const url = `${this.config.get<string>('BACKEND_URL')}:${port}/auth/login`;
    try {
      const res = await firstValueFrom(this.http.post(url, dto));
      return res.data;
    } catch (_err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async loginFromOAuthProfile(oauth: any) {
    try {
      const email = oauth?.profile?.emails?.[0]?.value;
      const provider = oauth?.provider;
      const providerId = oauth?.profile?.id;
      const displayName = oauth?.profile?.displayName;
      const port = this.config.get<string>('AUTH_PORT') ?? '3011';
      const url = `${this.config.get<string>('BACKEND_URL')}:${port}/auth/oauth`;
      const body = { email, provider, providerId, displayName };
      const res = await firstValueFrom(this.http.post(url, body));
      return res.data;
    } catch (err) {
      console.error('Error in loginFromOAuthProfile:', err);
      throw new UnauthorizedException('OAuth login failed');
    }
  }

  async fetchFreshProfile(authHeader?: string) {
    try {
      const port = this.config.get<string>('AUTH_PORT') ?? '3011';
      const url = `${this.config.get<string>('BACKEND_URL')}:${port}/auth/me`;
      const res = await firstValueFrom(
        this.http.get(url, { headers: authHeader ? { Authorization: authHeader } : {} })
      );
      console.log('fetchFreshProfile', res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching fresh profile:', error);
      throw new UnauthorizedException('Failed to fetch profile');

    }
  }
}


