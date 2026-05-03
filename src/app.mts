import express, { json, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ZodError } from "zod";

import { routes } from "./routes/index.mjs";
import { HttpErrorHandler, STATUS_CODES } from "./constants/index.mjs";
import logger from "./constants/logger.mjs";
import { rateLimiterMiddleware } from "./middleware/rate-limiter.mjs";
import { env, isProduction } from "./config/env.mjs";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", isProduction ? 1 : false);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      hsts: isProduction,
    }),
  );
  app.use(
    morgan(isProduction ? "combined" : "dev", {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
      skip: (req: Request) => req.path === "/health",
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!isProduction) {
          callback(null, true);
          return;
        }

        if (!origin || env.ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new HttpErrorHandler("Origin is not allowed by CORS policy", STATUS_CODES.FORBIDDEN));
      },
      credentials: false,
      optionsSuccessStatus: STATUS_CODES.NO_CONTENT,
    }),
  );

  app.use(json({ limit: env.JSON_BODY_LIMIT }));

  app.get("/health", (_req, res) => {
    res.status(STATUS_CODES.SUCCESS).json({
      status: "ok",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", rateLimiterMiddleware);
  app.use("/api", routes);

  app.use("/api", (req, res) => {
    res.status(STATUS_CODES.NOT_FOUND).json({
      error: {
        message: `API route not found: ${req.method} ${req.originalUrl}`,
      },
    });
  });

  app.use((req, res) => {
    res.status(STATUS_CODES.NOT_FOUND).json({
      error: {
        message: `Route not found: ${req.method} ${req.originalUrl}`,
      },
    });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
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
    } else if (err instanceof Error && !isProduction) {
      message = err.message;
    }

    const logMessage = err instanceof Error ? err.message : String(err);
    if (statusCode >= STATUS_CODES.INTERNAL_SERVER_ERROR) {
      logger.error(logMessage, { error: err });
    } else {
      logger.warn(logMessage);
    }

    res.status(statusCode).json({ error: { message, issues } });
  });

  return app;
}

export const app = createApp();
