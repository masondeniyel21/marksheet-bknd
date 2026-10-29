
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

export interface AuthenticatedUser {
  sub: number;
  email: string;
  role: "admin" | "teacher";
}

type RequestWithUser = Request & {
  user: AuthenticatedUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      RequestWithUser
    >();

    const token = request.cookies?.school_access;

    if (!token) {
      throw new UnauthorizedException("Please sign in.");
    }

    try {
      request.user =
        await this.jwtService.verifyAsync<AuthenticatedUser>(token);

      return true;
    } catch {
      throw new UnauthorizedException("Session expired or invalid.");
    }
  }
}
