import "dotenv/config";
import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(8080),
    DATABASE_URL: z.url("DATABASE_URL must be a valid PostgreSQL connection URL"),
    ALLOWED_ORIGINS: z
      .string()
      .optional()
      .transform(
        value =>
          value
            ?.split(",")
            .map(origin => origin.trim())
            .filter(Boolean) ?? [],
      ),
    ENABLE_DEBUG_ROUTES: z
      .string()
      .optional()
      .transform(value => value === "true"),
    JSON_BODY_LIMIT: z.string().default("1mb"),
    RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
    SESSION_SECRET: z.string().optional(),
    SESSION_COOKIE_SAME_SITE: z.preprocess(value => (value === "" ? undefined : value), z.enum(["lax", "none", "strict"]).optional()),
    TURNSTILE_SECRET_KEY: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    LOG_FILE: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV === "production" && (!value.SESSION_SECRET || value.SESSION_SECRET.length < 32)) {
      ctx.addIssue({
        code: "custom",
        path: ["SESSION_SECRET"],
        message: "SESSION_SECRET must be set to at least 32 characters in production",
      });
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; ");
  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = parsedEnv.data;
export const isProduction = env.NODE_ENV === "production";
export const isDebugRoutesEnabled = !isProduction || env.ENABLE_DEBUG_ROUTES;
