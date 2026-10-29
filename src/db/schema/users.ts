
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    name: text("name").notNull(),

    email: text("email").notNull(),

    passwordHash: text("password_hash").notNull(),

    role: text("role", {
      enum: ["admin", "teacher"],
    })
      .notNull()
      .default("teacher"),

    isActive: integer("is_active", {
      mode: "boolean",
    })
      .notNull()
      .default(true),

    createdAt: integer("created_at", {
      mode: "timestamp_ms",
    })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
