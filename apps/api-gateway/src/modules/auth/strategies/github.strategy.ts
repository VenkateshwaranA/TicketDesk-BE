import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('process.env.GITHUB_CLIENT_ID') ?? 'placeholder',
      clientSecret: config.get<string>('process.env.GITHUB_CLIENT_SECRET') ?? 'placeholder',
      callbackURL: config.get<string>('process.env.GITHUB_CALLBACK_URL') ?? 'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    return { provider: 'github', profile };
  }
}


