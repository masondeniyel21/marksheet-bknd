
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { loginSchema } from "./auth.schema";
import { CurrentUser } from "./current-user.decorator";
import {
  JwtAuthGuard,
  type AuthenticatedUser,
} from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException({
        message: "Invalid login details.",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const result = await this.authService.login(
      parsed.data.email,
      parsed.data.password,
    );

    response.cookie("school_access", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    return { user: result.user };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Production deployments should also enforce a trusted Origin
    // and CSRF protection for this state-changing endpoint.
    response.clearCookie("school_access", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return { message: "Signed out successfully." };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const profile = await this.usersService.findById(user.sub);

    if (!profile || !profile.isActive) {
      // A deleted or disabled account must not retain access.
      throw new (await import("@nestjs/common")).UnauthorizedException(
        "Account is unavailable.",
      );
    }

    return { user: profile };
  }
}