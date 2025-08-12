import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID') ?? 'placeholder',
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET') ?? 'placeholder',
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL') ?? 'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    return { provider: 'google', profile };
  }
}


