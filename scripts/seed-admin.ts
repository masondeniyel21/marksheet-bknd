
import "dotenv/config";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { db } from "../src/db/db.provider";
import { users } from "../src/db/schema";

async function seedAdmin() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password || password.length < 4) {
    throw new Error(
      "Set ADMIN_NAME, ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.",
    );
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error(
      "An account with this email already exists. No changes made.",
    );
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  await db.insert(users).values({
    name,
    email,
    passwordHash,
    role: "admin",
    isActive: true,
  });

  console.log(`Administrator created: ${email}`);
}

seedAdmin().catch((error: unknown) => {
  console.error("Admin seeding failed:", error);
  process.exitCode = 1;
});