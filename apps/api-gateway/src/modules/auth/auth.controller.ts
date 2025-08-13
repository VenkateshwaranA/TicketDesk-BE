import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly config: ConfigService) { }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    console.log('login', dto);
    return this.authService.loginWithPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    // Proxy to Auth Service for fresh roles/permissions from DB
    return this.authService.fetchFreshProfile(req.headers?.authorization);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken } = await this.authService.loginFromOAuthProfile(req.user);
    const frontendUrl = this.config.get<string>('FRONTEND_REDIRECT_URL') ?? 'http://localhost:5173/';
    return res.redirect(`${frontendUrl}#token=${encodeURIComponent(accessToken)}`);
  }


}


