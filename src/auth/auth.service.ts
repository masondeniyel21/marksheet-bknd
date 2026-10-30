
import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const validPassword = await argon2.verify(
      user.passwordHash,
      password,
    );

    if (!validPassword || !user.isActive) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: "15m",
        // expiresIn: "1h",
        // expiresIn: "7d",        
      },
    );

    // Never return the password hash or JWT in the JSON response.
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}