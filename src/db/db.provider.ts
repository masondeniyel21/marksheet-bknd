
import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import * as schema from "./schema";

const filename = resolve(
  process.env.DATABASE_URL ?? "./data/school.db",
);

mkdirSync(dirname(filename), { recursive: true });

const sqlite = new Database(filename);

// SQLite settings for safer and more predictable operation.
sqlite.pragma("foreign_keys = ON");
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("busy_timeout = 5000");

export const DB = Symbol("DB");

export const db = drizzle(sqlite, { schema });
export type DatabaseClient = typeof db;
