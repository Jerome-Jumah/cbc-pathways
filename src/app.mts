import express, { json, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ZodError } from "zod";

import { routes } from "./routes/index.mjs";
import { HttpErrorHandler, STATUS_CODES } from "./constants/index.mjs";
import logger from "./constants/logger.mjs";
import { rateLimiterMiddleware } from "./middleware/rate-limiter.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];
  app.use(
    cors({
      origin: process.env.NODE_ENV === "production" ? allowedOrigins : "*",
    }),
  );

  app.use(json());

  app.get("/health", (_req, res) => {
    res.status(STATUS_CODES.SUCCESS).json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", routes);

  app.use((req, res, next) => {
    if (req.path.includes("/static")) return next();
    return rateLimiterMiddleware(req, res, next);
  });

  app.use((req, res) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.sendFile(join(__dirname, "public", "index.html"));
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err instanceof Error ? err.message : String(err), { error: err });

    let message = "Internal server error";
    let issues: unknown;
    let statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR;

    if (err instanceof ZodError) {
      message = "Validation failed";
      issues = err.issues;
      statusCode = STATUS_CODES.BAD_REQUEST;
    } else if (err instanceof HttpErrorHandler) {
      message = err.message;
      statusCode = err.status;
    } else if (err instanceof Error && process.env.NODE_ENV !== "production") {
      message = err.message;
    }

    res.status(statusCode).json({ error: { message, issues } });
  });

  return app;
}

export const app = createApp();
