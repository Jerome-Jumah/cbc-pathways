import rateLimit from "express-rate-limit";
import { env } from "../config/env.mjs";

export const rateLimiterMiddleware = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many requests from this IP, please try again later.",
    },
  },
});
