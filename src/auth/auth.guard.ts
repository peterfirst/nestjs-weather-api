import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_ROUTE_KEY } from '../decorator/public-route.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from './graphql-context.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_ROUTE_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    let token: string | undefined;
    let payload: JwtPayload | undefined;

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    if (request) {
      token = this.extractTokenFromHeader(request);
      if (token) {
        payload = await this.verifyToken(token);
        request['user'] = payload;
      }
    } else {
      const gqlCtx = GqlExecutionContext.create(context);
      const { req } = gqlCtx.getContext<GraphQLContext>();
      token = this.extractTokenFromHeader(req as unknown as Request);
      if (token) {
        payload = await this.verifyToken(token);
        gqlCtx.getContext<GraphQLContext>().req['user'] = payload;
      }
    }

    if (!token || !payload) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return undefined;
  }

  private async verifyToken(token: string): Promise<JwtPayload | undefined> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET', ''),
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      return undefined;
    }
  }
}
