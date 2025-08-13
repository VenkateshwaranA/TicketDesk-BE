import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IsEmail, IsOptional, IsString } from 'class-validator';

class OAuthDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  provider!: 'google';

  @IsString()
  providerId!: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    const sub = req.user?.sub;
    const fresh = sub ? await this.authService.getProfileById(sub) : null;
    return fresh ?? req.user;
  }
  @Post('oauth')
  async oauth(@Body() body: OAuthDto) {
    return this.authService.loginFromOAuth(body);
  }

  // Internal profile fetch by id (used by API Gateway to sync roles)
  @Get('profile/:id')
  async profile(@Req() req: any) {
    const id = req.params?.id as string;
    return this.authService.getProfileById(id);
  }
}


