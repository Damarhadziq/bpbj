import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../config/db";
import * as schema from "../db/schema";
import dotenv from 'dotenv';

dotenv.config();

const trustedOrigins = (process.env.FRONTEND_URL || "http://localhost:5175,http://127.0.0.1:5175")
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  trustedOrigins,
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        defaultValue: "admin"
      }
    }
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  emailAndPassword: {
    enabled: true
  }
});
