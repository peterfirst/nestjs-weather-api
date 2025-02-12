import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request: Request & { user?: JwtPayload } = ctx
      .switchToHttp()
      .getRequest();
    return request.user as JwtPayload;
  },
);
