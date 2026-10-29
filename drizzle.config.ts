// import type { Config } from 'drizzle-kit';
// import * as dotenv from 'dotenv';
// dotenv.config();

// export default {
//   schema: './src/modules/drizzle/schema.ts',
//   out: './migration',
//   driver: 'pg',
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL,
//   },
// } satisfies Config;


import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",  
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "./data/school.db",
  },
});


// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   out: './migration',
//   schema: './src/modules/drizzle/schema.ts',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DRIZZLE_DATABASE_URL ?? '',
//   },
//   verbose: true,
//   strict: true,
//   // breakpoints: true,
// });

