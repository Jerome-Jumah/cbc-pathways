import winston from "winston";
import { env, isProduction } from "../config/env.mjs";

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isProduction ? winston.format.json() : winston.format.combine(winston.format.colorize(), winston.format.simple()),
  }),
];

if (env.LOG_FILE && !isProduction) {
  transports.push(
    new winston.transports.File({
      filename: env.LOG_FILE,
      format: winston.format.json(),
    }),
  );
}

const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: !isProduction }),
    winston.format.json(),
  ),
  transports,
});

export default logger;
