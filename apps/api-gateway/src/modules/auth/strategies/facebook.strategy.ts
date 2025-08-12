import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('process.env.FACEBOOK_CLIENT_ID') ?? 'placeholder',
      clientSecret: config.get<string>('process.env.FACEBOOK_CLIENT_SECRET') ?? 'placeholder',
      callbackURL: config.get<string>('process.env.FACEBOOK_CALLBACK_URL') ?? 'http://localhost:3000/api/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    return { provider: 'facebook', profile };
  }
}


