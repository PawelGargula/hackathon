import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load Next.js–style env files so `npx prisma` picks up values from .env.local.
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Supabase: use the direct (non-pooled, port 5432) URL for migrations.
    url: env("DIRECT_URL"),
  },
});
