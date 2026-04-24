import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss' }), // Adds timestamp to logs
    winston.format.json(), // Simple, human-readable format
  ),
  
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Adds colors to console logs
        winston.format.simple(), // Simple, human-readable format
      ),
    }),
    new winston.transports.File({
      filename: "app.log",
      format: winston.format.json(), // JSON format for file logs
    }),
  ],
});

export default logger;