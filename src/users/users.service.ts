
import {
  Inject,
  Injectable,
} from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB, type DatabaseClient } from "../db/db.provider";
import { users } from "../db/schema";

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB) private readonly db: DatabaseClient,
  ) {}

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    return user ?? null;
  }

  async findById(id: number) {
    const [user] = await this.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }
}
