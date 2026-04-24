import express, { json, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { dirname, join } from "node:path";

import { routes } from "./routes/index.mjs";
import { fileURLToPath } from "node:url";
import { HttpErrorHandler, STATUS_CODES } from './constants/index.mjs';
import logger from './constants/logger.mjs';
import { rateLimiterMiddleware } from './middleware/rate-limiter.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? allowedOrigins : "*"
}));

app.use(json());

app.use(routes);

//request rate limiting per ip
app.use((req, res, next) => {
  //Excluding paths that serves static files from rate limiting
  if (req.path.includes("/static")) return next();
  return rateLimiterMiddleware(req, res, next);
});

app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  res.sendFile(join(__dirname, "public", "index.html"));
});

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err, "error in error handler");
  let message = "";
  let issues: any;
  let statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR;
  //   if (err instanceof ZodError) {
  //     message = "Validation failed";
  //     issues = err.errors;
  //     statusCode = STATUS_CODES.BAD_REQUEST;
  //   }

  if (err instanceof HttpErrorHandler) {
    message = err.message;
    statusCode = err.status;
  } else if (err instanceof Error) {
    message = err.message;
    statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  res.status(statusCode).json({ error: { message, issues } });
});
async function start() {
  app.listen(process.env.PORT || 8080, async () => {
    logger.info("Server is up and running on port " + (process.env.PORT || 8080));
  });
}

start();