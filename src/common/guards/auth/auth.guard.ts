import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public/public.decorator';
import { UserPayload } from 'src/common/types/types';

/**
 * The AuthGuard class implements the CanActivate interface
 * to control access to routes based on authentication status.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Initializes the AuthGuard with required services.
   * @param jwtService - The JWT service for token verification.
   * @param reflector - The reflector for accessing metadata.
   * @param configService - The config service for retrieving environment variables.
   */
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  /**
   * Determines whether the request is allowed to proceed.
   * @param context - The execution context of the request.
   * @returns A boolean indicating whether access is granted.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, allow access without authentication
    if (isPublic) return true;

    // Extract the JWT token from the request header
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // If no token is provided, deny access and throw UnauthorizedException
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Verify the JWT token
      const payload: UserPayload = await this.jwtService.verifyAsync(token);

      // Attach the user payload to the request for further processing
      request['user'] = payload;
    } catch {
      // If token verification fails, deny access and throw UnauthorizedException
      throw new UnauthorizedException();
    }

    // If all checks pass, allow access
    return true;
  }

  /**
   * Extracts the JWT token from the Authorization header of the request.
   * @param request - The HTTP request object.
   * @returns The JWT token extracted from the header.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
