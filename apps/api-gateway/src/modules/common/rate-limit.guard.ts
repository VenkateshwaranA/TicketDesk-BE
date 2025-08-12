import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Rate limit key per authenticated user; fallback to IP
    const userId = req?.user?.sub;
    if (userId) return `user:${userId}`;
    return (req.ip ?? req.headers['x-forwarded-for'] ?? 'anonymous') as string;
  }

  protected getRequestResponse(context: ExecutionContext) {
    const http = context.switchToHttp();
    console.log('getRequestResponse',);
    return { req: http.getRequest(), res: http.getResponse() } as any;
  }
}


